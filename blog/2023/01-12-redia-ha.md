---
title: redia-ha
authors: loong
tags: [k8s, redis]
---


```bash
redis-ha-haproxy.redis-ha.svc
redis-sentinel.redis-ha.svc
redis-cluster.redis-ha.svc
```

```bash
helm fetch bitnami/redis --untar [--untardir ./]
helm install redis-sentinel . -n redis-ha
```
Redis can be accessed via port 6379 and Sentinel can be accessed via port 26379 on the following DNS name from within your cluster:
`redis-ha.redis-ha.svc.cluster.local`

To connect to your Redis server:
1. To retrieve the redis password:
```bash
   echo $(kubectl get secret redis-ha -o "jsonpath={.data['auth']}" | base64 --decode)
```
2. Connect to the Redis master pod that you can use as a client. By default the redis-ha-server-0 pod is configured as the master:
```bash
   kubectl exec -it redis-ha-server-0 sh -n redis-ha
```

3. Connect using the Redis CLI (inside container):
```bash
   redis-cli -a <REDIS-PASS-FROM-SECRET>
```




** Please be patient while the chart is being deployed **

Redis&reg; can be accessed via port 6379 on the following DNS name from within your cluster:

    `redis-sentinel.redis-ha.svc.cluster.local` for read only operations

For read/write operations, first access the Redis&reg; Sentinel cluster, which is available in port 26379 using the same domain name above.



To get your password run:

```bash
    export REDIS_PASSWORD=$(kubectl get secret --namespace redis-ha redis-ha-passwd -o jsonpath="{.data.redis-password}" | base64 -d)
```

To connect to your Redis&reg; server:

1. Run a Redis&reg; pod that you can use as a client:

```bash
   kubectl run --namespace redis-ha redis-client --restart='Never'  --env REDIS_PASSWORD=$REDIS_PASSWORD  --image docker.io/bitnami/redis:7.0.7-debian-11-r9 --command -- sleep infinity

   Use the following command to attach to the pod:

   kubectl exec --tty -i redis-client \
   --namespace redis-ha -- bash
```

2. Connect using the Redis&reg; CLI:

```bash
   REDISCLI_AUTH="$REDIS_PASSWORD" redis-cli -h redis-sentinel -p 6379 # Read only operations
   REDISCLI_AUTH="$REDIS_PASSWORD" redis-cli -h redis-sentinel -p 26379 # Sentinel access
```

To connect to your database from outside the cluster execute the following commands:

```bash
    kubectl port-forward --namespace redis-ha svc/redis-sentinel 6379:6379 &
    REDISCLI_AUTH="$REDIS_PASSWORD" redis-cli -h 127.0.0.1 -p 6379
```
