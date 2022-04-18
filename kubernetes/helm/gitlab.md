

```shell
helm repo add gitlab https://charts.gitlab.io/
helm repo update
```

```shell
helm install gitlab gitlab/gitlab --namespace gitlab --wait --version  5.9.3 \
  --set certmanager.install=false \
  --set gitlab-runner.install=false \
  --set nginx-ingress.enabled=false \  
  --set registry.enabled=false \
  --set global.edition=ce \
  --set global.hosts.domain=${MY_DOMAIN} \
  --set global.ingress.configureCertmanager=false \
  --set global.ingress.enabled=false \  
```

## 创建 postgres 数据库和密码

```psql
create user "fsgitlab" with password 'Fas123_';
create database "fs-gitlab" owner "fsgitlab";
GRANT ALL PRIVILEGES ON DATABASE "fs-gitlab" TO fsgitlab;
```

 ```shell
 kubectl create secret generic postgresql-password \
     --from-literal=postgresql-password=$(head -c 512 /dev/urandom | LC_CTYPE=C tr -cd 'a-zA-Z0-9' | head -c 64) \
     --from-literal=postgresql-postgres-password=Fas123_ -n gitlab
 secret/postgresql-password created    
 ```

> 增加 postgres 配置
>
> ```shell
>   --set postgresql.install=false \
>   --set global.psql.host=anxinyun-pg \
>   --set global.psql.password.secret=gitlab-postgresql-password \
>   --set global.psql.password.key=postgresql-postgres-password \
>   --set global.psql.database=fs-gitlab \
>   --set global.psql.username=fsgitlab \
> ```

## Redis 配置

```yaml
kind: Deployment
apiVersion: apps/v1
metadata:
  name: gitlab-redis
  namespace: gitlab
  labels:
    app: gitlab-redis
spec:
  replicas: 1
  selector:
    matchLabels:
      app: gitlab-redis
  template:
    metadata:
      labels:
        app: gitlab-redis
    spec:
      containers:
        - name: gitlab-redis
          image: 'redis:6-alpine'
          ports:
            - name: tcp-6379
              containerPort: 6379
              protocol: TCP
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: app.type
                    operator: In
                    values:
                      - compu
---
kind: Service
apiVersion: v1
metadata:
  name: gitlab-redis
  namespace: gitlab
  labels:
    app: gitlab-redis
spec:
  ports:
    - name: tcp-6379
      protocol: TCP
      port: 6379
      targetPort: 6379
  selector:
    app: gitlab-redis
  clusterIP: None
  type: ClusterIP


```

> 增加 redis 配置
>
> ```shell
>   --set redis.install=false \
>   --set global.redis.host=gitlab-redis \
>   --set global.redis.password.enabled=false \  
> ```

## 创建 gitlab 初始化 root 密码

```shell
$ PASSWD=$(head -c 512 /dev/urandom | LC_CTYPE=C tr -cd 'a-zA-Z0-9' | head -c 32)
$ kubectl create secret generic gitlab-initial-root-password --from-literal=password=$PASSWD -n gitlab
secret/gitlab-initial-root-password created
$ echo $PASSWD
jP2zkf1ZHdDCPZR3YaNP57wt2Tiaw0ev
```

> 配置 initialRootPassword:
> ```shell
      --set global.initialRootPassword.secret=gitlab-initial-root-password \
> ```
> 



