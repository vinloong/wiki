

## 简介

Secret 是一种包含少量敏感信息例如密码、令牌或密钥的对象。 这样的信息可能会被放在 [Pod](https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/) 规约中或者镜像中。 使用 Secret 意味着你不需要在应用程序代码中包含机密数据。

由于创建 Secret 可以独立于使用它们的 Pod， 因此在创建、查看和编辑 Pod 的工作流程中暴露 Secret（及其数据）的风险较小。 Kubernetes 和在集群中运行的应用程序也可以对 Secret 采取额外的预防措施， 例如避免将机密数据写入非易失性存储。

Secret 类似于 ConfigMap 但专门用于保存机密数据。



## Secret 类型

| 内置类型                              | 用法                                     |
| ------------------------------------- | ---------------------------------------- |
| `Opaque`                              | 用户定义的任意数据 (默认)                |
| `kubernetes.io/service-account-token` | 服务账号令牌                             |
| `kubernetes.io/dockercfg`             | `~/.dockercfg` 文件的序列化形式          |
| `kubernetes.io/dockerconfigjson`      | `~/.docker/config.json` 文件的序列化形式 |
| `kubernetes.io/basic-auth`            | 用于基本身份认证的凭据                   |
| `kubernetes.io/ssh-auth`              | 用于 SSH 身份认证的凭据                  |
| `kubernetes.io/tls`                   | 用于 TLS 客户端或者服务器端的数据        |
| `bootstrap.kubernetes.io/token`       | 启动引导令牌数据                         |



## Secret 的使用

### 创建 Secret

#### 通过 kubelet 创建

```shell
echo -n 'admin' > ./username.txt
echo -n '1f2d1e2e67df' > ./password.txt

kubectl create secret generic db-user-pass \
  --from-file=./username.txt \
  --from-file=./password.txt


kubectl create secret generic db-user-pass \
  --from-literal=username=devuser \
  --from-literal=password='S!B\*d$zDsb='
```

#### 通过配置文件创建

```shell
$ echo -n 'admin' | base64
YWRtaW4=

$ echo -n '1f2d1e2e67df' | base64
MWYyZDFlMmU2N2Rm

```

`secret.yaml`

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  username: YWRtaW4=
  password: MWYyZDFlMmU2N2Rm
```



```shell
kubectl apply -f secret.yaml
```



```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  username: YWRtaW4=
stringData:
  username: administrator
```



### 查看 

 ```shell
 kubectl get secrets [-n <namespace>]
 
 kubectl describe secrets <secret-name>
 
 kubectl get secret <secret-name> -o jsonpath='{.data}'
 
 echo '<base64 code>' | base64 --decode
 
 kubectl get secret <secret-name> -o jsonpath='{.data.password}' | base64 --decode
 ```

```bash
$ kubectl get secret -n ops
NAME                  TYPE                                  DATA   AGE
default-token-dnpgn   kubernetes.io/service-account-token   3      41d
secret-db             Opaque                                1      47h

$ kubectl describe secret -n ops secret-db
Name:         secret-db
Namespace:    ops
Labels:       <none>
Annotations:  kubesphere.io/creator: admin

Type:  Opaque

Data
====
passwd:  13 bytes

$ kubectl get secret secret-db -n ops -o jsonpath='{.data}'
{"passwd":"c21hcnRzaXRlMTIzXw=="}

$ echo 'c21hcnRzaXRlMTIzXw==' | base64 --decode
smartsite123_

$ kubectl get secret secret-db -n ops -o jsonpath='{.data.passwd}' | base64 --decode
smartsite123_

```

### 使用

#### 作为 环境变量

```yaml
kind: Deployment
apiVersion: apps/v1
metadata:
  name: test
  namespace: ops
  labels:
    app: test
spec:
  replicas: 1
  selector:
    matchLabels:
      app: test
  template:
    metadata:
      labels:
        app: test
    spec:
      containers:
        - name: test
          image: 'ubuntu:20.04'
          command:
            - /bin/bash
            - '-c'
            - while true; do sleep 1000; done
          envFrom:
            - configMapRef:
                name: cm-test
            - secretRef:
                name: secret-db
          env:
            - name: DB_SMARTSITE_CC
              value: postgres://smartsiteadmin:$(DB_SMARTSITE_PASSWD)@10.8.30.156:5432/SmartSite

```

#### 作为 容器中的文件

```yaml
kind: Deployment
apiVersion: apps/v1
metadata:
  name: test
  namespace: ops
  labels:
    app: test
spec:
  replicas: 1
  selector:
    matchLabels:
      app: test
  template:
    metadata:
      labels:
        app: test
    spec:
      volumes:
        - name: secret-volume
          secret:
            secretName: secret-db
      containers:
        - name: test
          image: 'ubuntu:20.04'
          command:
            - /bin/bash
            - '-c'
            - while true; do sleep 1000; done
          volumeMounts:
            - name: secret-volume
              mountPath: /secret

```



