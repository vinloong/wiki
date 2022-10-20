## 哨兵模式

```
helm repo add bitnami https://charts.bitnami.com/bitnami

https://raw.githubusercontent.com/bitnami/charts/main/bitnami/redis/values.yaml

helm install -n redis redis-sentinel bitnami/redis -f values.yaml




```





## 集群模式

### helm 安装

```shell
wget https://raw.githubusercontent.com/bitnami/charts/main/bitnami/redis-cluster/values.yaml
helm install -n redis redis-cluster -f values.yaml bitnami/redis-cluster
```

### 手动安装

```yaml
kind: Secret
apiVersion: v1
metadata:
  name: redis-cluster
  namespace: redis
  labels:
    app.kubernetes.io/instance: redis-cluster
    app.kubernetes.io/name: redis-cluster
  annotations:
    meta.helm.sh/release-name: redis-cluster
    meta.helm.sh/release-namespace: redis
data:
  redis-password: RmFzXzEyMw==
type: Opaque
```



```yaml
kind: ConfigMap
apiVersion: v1
metadata:
  name: redis-cluster-scripts
  namespace: redis
  labels:
    app.kubernetes.io/instance: redis-cluster
    app.kubernetes.io/name: redis-cluster
  annotations:
    meta.helm.sh/release-name: redis-cluster
    meta.helm.sh/release-namespace: redis
data:
  ping_liveness_local.sh: >-
    #!/bin/sh

    set -e

    if [ ! -z "$REDIS_PASSWORD" ]; then export REDISCLI_AUTH=$REDIS_PASSWORD;
    fi;

    response=$(
      timeout -s 3 $1 \
      redis-cli \
        -h localhost \
        -p $REDIS_PORT \
        ping
    )

    if [ "$?" -eq "124" ]; then
      echo "Timed out"
      exit 1
    fi

    responseFirstWord=$(echo $response | head -n1 | awk '{print $1;}')

    if [ "$response" != "PONG" ] && [ "$responseFirstWord" != "LOADING" ] && [
    "$responseFirstWord" != "MASTERDOWN" ]; then
      echo "$response"
      exit 1
    fi
  ping_readiness_local.sh: >-
    #!/bin/sh

    set -e


    REDIS_STATUS_FILE=/tmp/.redis_cluster_check

    if [ ! -z "$REDIS_PASSWORD" ]; then export REDISCLI_AUTH=$REDIS_PASSWORD;
    fi;

    response=$(
      timeout -s 3 $1 \
      redis-cli \
        -h localhost \
        -p $REDIS_PORT \
        ping
    )

    if [ "$?" -eq "124" ]; then
      echo "Timed out"
      exit 1
    fi

    if [ "$response" != "PONG" ]; then
      echo "$response"
      exit 1
    fi

    if [ ! -f "$REDIS_STATUS_FILE" ]; then
      response=$(
        timeout -s 3 $1 \
        redis-cli \
          -h localhost \
          -p $REDIS_PORT \
          CLUSTER INFO | grep cluster_state | tr -d '[:space:]'
      )
      if [ "$?" -eq "124" ]; then
        echo "Timed out"
        exit 1
      fi
      if [ "$response" != "cluster_state:ok" ]; then
        echo "$response"
        exit 1
      else
        touch "$REDIS_STATUS_FILE"
      fi
    fi
```



```yaml
kind: ConfigMap
apiVersion: v1
metadata:
  name: redis-cluster-default
  namespace: redis
  labels:
    app.kubernetes.io/instance: redis-cluster
    app.kubernetes.io/name: redis-cluster
  annotations:
    meta.helm.sh/release-name: redis-cluster
    meta.helm.sh/release-namespace: redis
data:
  redis-default.conf: |
    bind 0.0.0.0
    protected-mode yes
    port 6379
    tcp-backlog 511
    timeout 0
    tcp-keepalive 300
    daemonize no
    pidfile /opt/bitnami/redis/tmp/redis_6379.pid
    loglevel notice
    logfile ""
    databases 16
    always-show-logo yes
    set-proc-title yes
    proc-title-template "{title} {listen-addr} {server-mode}"
    save 900 1
    save 300 10
    save 60 10000
    stop-writes-on-bgsave-error yes
    rdbcompression yes
    rdbchecksum yes
    dbfilename dump.rdb
    rdb-del-sync-files no
    dir /bitnami/redis/data
    replica-serve-stale-data yes
    replica-read-only yes
    repl-diskless-sync no
    repl-diskless-sync-delay 5
    repl-diskless-sync-max-replicas 0
    repl-diskless-load disabled
    repl-disable-tcp-nodelay no
    replica-priority 100
    acllog-max-len 128
    lazyfree-lazy-eviction no
    lazyfree-lazy-expire no
    lazyfree-lazy-server-del no
    replica-lazy-flush no
    lazyfree-lazy-user-del no
    lazyfree-lazy-user-flush no
    oom-score-adj no
    oom-score-adj-values 0 200 800
    disable-thp yes
    appendonly yes
    appendfilename "appendonly.aof"
    appenddirname "appendonlydir"
    appendfsync everysec
    no-appendfsync-on-rewrite no
    auto-aof-rewrite-percentage 100
    auto-aof-rewrite-min-size 64mb
    aof-load-truncated yes
    aof-use-rdb-preamble yes
    aof-timestamp-enabled no
    ua-time-limit 5000
    cluster-enabled yes
    cluster-config-file /bitnami/redis/data/nodes.conf
    slowlog-log-slower-than 10000
    slowlog-max-len 128
    latency-monitor-threshold 0
    notify-keyspace-events ""
    hash-max-listpack-entries 512
    hash-max-listpack-value 64
    list-max-listpack-size -2
    list-compress-depth 0
    set-max-intset-entries 512
    zset-max-listpack-entries 128
    zset-max-listpack-value 64
    hll-sparse-max-bytes 3000
    stream-node-max-bytes 4096
    stream-node-max-entries 100
    activerehashing yes
    client-output-buffer-limit normal 0 0 0
    client-output-buffer-limit replica 256mb 64mb 60
    client-output-buffer-limit pubsub 32mb 8mb 60
    hz 10
    dynamic-hz yes
    aof-rewrite-incremental-fsync yes
    rdb-save-incremental-fsync yes
    jemalloc-bg-thread yes

```





```yaml
kind: StatefulSet
apiVersion: apps/v1
metadata:
  name: redis-cluster
  namespace: redis
  labels:
    app.kubernetes.io/instance: redis-cluster
    app.kubernetes.io/name: redis-cluster
  annotations:
    meta.helm.sh/release-name: redis-cluster
    meta.helm.sh/release-namespace: redis
spec:
  replicas: 6
  selector:
    matchLabels:
      app.kubernetes.io/instance: redis-cluster
      app.kubernetes.io/name: redis-cluster
  template:
    metadata:
      labels:
        app.kubernetes.io/instance: redis-cluster
        app.kubernetes.io/name: redis-cluster
    spec:
      volumes:
        - name: scripts
          configMap:
            name: redis-cluster-scripts
            defaultMode: 493
        - name: default-config
          configMap:
            name: redis-cluster-default
            defaultMode: 420
        - name: redis-tmp-conf
          emptyDir: {}
      containers:
        - name: redis-cluster
          image: 'docker.io/bitnami/redis-cluster:7.0.5-debian-11-r0'
          command:
            - /bin/bash
            - '-c'
          args:
            - >
              # Backwards compatibility change

              if ! [[ -f /opt/bitnami/redis/etc/redis.conf ]]; then
                  echo COPYING FILE
                  cp  /opt/bitnami/redis/etc/redis-default.conf /opt/bitnami/redis/etc/redis.conf
              fi

              pod_index=($(echo "$POD_NAME" | tr "-" "\n"))

              pod_index="${pod_index[-1]}"

              if [[ "$pod_index" == "0" ]]; then
                export REDIS_CLUSTER_CREATOR="yes"
                export REDIS_CLUSTER_REPLICAS="1"
              fi

              /opt/bitnami/scripts/redis-cluster/entrypoint.sh
              /opt/bitnami/scripts/redis-cluster/run.sh
          ports:
            - name: tcp-redis
              containerPort: 6379
              protocol: TCP
            - name: tcp-redis-bus
              containerPort: 16379
              protocol: TCP
          env:
            - name: POD_NAME
              valueFrom:
                fieldRef:
                  apiVersion: v1
                  fieldPath: metadata.name
            - name: REDIS_NODES
              value: >-
                redis-cluster-0.redis-cluster-headless
                redis-cluster-1.redis-cluster-headless
                redis-cluster-2.redis-cluster-headless
                redis-cluster-3.redis-cluster-headless
                redis-cluster-4.redis-cluster-headless
                redis-cluster-5.redis-cluster-headless 
            - name: REDISCLI_AUTH
              valueFrom:
                secretKeyRef:
                  name: redis-cluster
                  key: redis-password
            - name: REDIS_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: redis-cluster
                  key: redis-password
            - name: REDIS_AOF_ENABLED
              value: 'yes'
            - name: REDIS_TLS_ENABLED
              value: 'no'
            - name: REDIS_PORT
              value: '6379'
          resources: {}
          volumeMounts:
            - name: scripts
              mountPath: /scripts
            - name: redis-data
              mountPath: /bitnami/redis/data
            - name: default-config
              mountPath: /opt/bitnami/redis/etc/redis-default.conf
              subPath: redis-default.conf
            - name: redis-tmp-conf
              mountPath: /opt/bitnami/redis/etc/
          livenessProbe:
            exec:
              command:
                - sh
                - '-c'
                - /scripts/ping_liveness_local.sh 5
            initialDelaySeconds: 5
            timeoutSeconds: 6
            periodSeconds: 5
            successThreshold: 1
            failureThreshold: 5
          readinessProbe:
            exec:
              command:
                - sh
                - '-c'
                - /scripts/ping_readiness_local.sh 1
            initialDelaySeconds: 5
            timeoutSeconds: 2
            periodSeconds: 5
            successThreshold: 1
            failureThreshold: 5
          terminationMessagePath: /dev/termination-log
          terminationMessagePolicy: File
          imagePullPolicy: IfNotPresent
          securityContext:
            runAsUser: 1001
            runAsNonRoot: true
      restartPolicy: Always
      terminationGracePeriodSeconds: 30
      dnsPolicy: ClusterFirst
      serviceAccountName: default
      serviceAccount: default
      securityContext:
        runAsUser: 1001
        fsGroup: 1001
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: redis
                    operator: In
                    values:
                      - enabled
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            - labelSelector:
                matchExpressions:
                  - key: app.kubernetes.io/instance
                    operator: In
                    values:
                      - redis-cluster
              topologyKey: kubernetes.io/hostname
      schedulerName: default-scheduler
      enableServiceLinks: false
  volumeClaimTemplates:
    - kind: PersistentVolumeClaim
      apiVersion: v1
      metadata:
        name: redis-data
        labels:
          app.kubernetes.io/instance: redis-cluster
          app.kubernetes.io/name: redis-cluster
      spec:
        accessModes:
          - ReadWriteMany
        resources:
          requests:
            storage: 10Gi
        volumeMode: Filesystem
      status:
        phase: Pending
  serviceName: redis-cluster-headless
  podManagementPolicy: Parallel
  updateStrategy:
    type: RollingUpdate
    rollingUpdate:
      partition: 0
  revisionHistoryLimit: 10

```





