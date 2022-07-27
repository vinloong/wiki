容器在主机的内核上运行，并获得时钟，但时区不是来自内核，而是来自用户空间。在大多数情况下，默认使用协调世界时 (UTC)。

时区的不一致，会带来很多困扰。即使代码与时区无关，但容器日志与系统日志时间相关联排查问题也会让人头疼。一些应用程序使用机器的时区作为默认时区，并希望用户设置时区。当集群中容器的时区不一致时，会出现问题。



## 在 `Dockerfile` 中配置

通过编写 Dockerfile,构建自己的 Docker 镜像，可以永久解决时区问题。

### 1. Alpine

```dockerfile
ENV TZ Asia/Shanghai

RUN apk add tzdata && cp /usr/share/zoneinfo/${TZ} /etc/localtime \
    && echo ${TZ} > /etc/timezone \
    && apk del tzdata
```

### 2. Debian
Debian 基础镜像 中已经安装了 tzdata 包，我们可以将以下代码添加到 Dockerfile 中：
```dockerfile
ENV TZ=Asia/Shanghai \
    DEBIAN_FRONTEND=noninteractive

RUN ln -fs /usr/share/zoneinfo/${TZ} /etc/localtime \
    && echo ${TZ} > /etc/timezone \
    && dpkg-reconfigure --frontend noninteractive tzdata \
    && rm -rf /var/lib/apt/lists/*
```

### 3. Ubuntu
Ubuntu 基础镜像中没有安装了 tzdata 包，因此我们需要先安装 tzdata 包。
我们可以将以下代码添加到 Dockerfile 中。

```dockerfile
ENV TZ=Asia/Shanghai \
    DEBIAN_FRONTEND=noninteractive

RUN apt update \
    && apt install -y tzdata \
    && ln -fs /usr/share/zoneinfo/${TZ} /etc/localtime \
    && echo ${TZ} > /etc/timezone \
    && dpkg-reconfigure --frontend noninteractive tzdata \
    && rm -rf /var/lib/apt/lists/*
```

### 4. CentOS
CentOS 基础镜像 中已经安装了 tzdata 包，我们可以将以下代码添加到 Dockerfile 中。
```dockerfile
ENV TZ Asia/Shanghai

RUN ln -fs /usr/share/zoneinfo/${TZ} /etc/localtime \
    && echo ${TZ} > /etc/timezone
```



## 在 `pod` 或 `Deployment` 中配置

```yaml
      containers:
      - name: test
        image: ubuntu:20.04
        volumeMounts:
        - name: localtime
          mountPath: /etc/localtime
      volumes:
      - name: localtime
        hostPath:
          path: /etc/localtime
```



## 使用 `k8tz`  设置

k8tz是一个 Kubernetes 准入控制器和一个将时区注入 Pod 的 CLI 工具。
可以用作手动工具来自动转换 Deployment 和 Pod
可以作为准入控制器安装并使用注释来完全自动化创建 Pod 的过程。

`k8tz `可以使用 `hostPath`的方式，或者将 `emptyDir `注入 `initContainer`并用 `TZif`（时区信息格式) 文件填充卷。然后将 `emptyDir`挂载到 `Pod `每个容器的 `/etc/localtime`和 `/usr/share/zoneinfo`。为了确保所需的时区有效，它向所有容器添加了 `TZ`环境变量。

### install

使用 `helm` 安装

```bash
helm repo add k8tz https://k8tz.github.io/k8tz/
helm install k8tz k8tz/k8tz --set timezone=Asia/Shanghai
```

> 查看 Pod 状态、Mutatingwebhookconfigurations、Service 等资源是否正常：

```shell
# kubectl get mutatingwebhookconfigurations.admissionregistration.k8s.io  k8tz
NAME   WEBHOOKS   AGE
k8tz   1          7h5m

# kubectl get svc -n  k8tz
NAME   TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE
k8tz   ClusterIP   10.98.114.250   <none>        443/TCP   7h5m


# kubectl get pod -n  k8tz
NAME                    READY   STATUS    RESTARTS   AGE
k8tz-649f85c78d-9lxrq   1/1     Running   0          16m

```

### 测试

```shell
kubectl run -i -t ubuntu --image=ubuntu:22.04 --restart=OnFailure --rm=true --command date
Defaulted container "ubuntu" out of: ubuntu, k8tz (init)
Wed Jul 27 17:35:06 CST 2022
pod "ubuntu" deleted
```

### 使用

#### 









