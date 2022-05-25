# pod 生命周期

`pod`跟一个一个独立的应用一样，也是一个相对临时性的个体。

`pod`会被创建、调度、运行、终止等状态。

`pod`  自身不具有自愈能力。



## `Pod`

| 状态        |          | 描述                                                         |
| ----------- | -------- | ------------------------------------------------------------ |
| `Pending`   | `悬决`   | Pod 已被 Kubernetes 系统接受，但有一个或者多个容器尚未创建亦未运行。<br>此阶段包括等待 Pod 被调度的时间和通过网络下载镜像的时间。 |
| `Running`   | `运行中` | Pod 已经绑定到了某个节点，Pod 中所有的容器都已被创建。至少有一个容器仍在运行，或者正处于启动或重启状态。 |
| `Succeeded` | `成功`   | Pod 中的所有容器都已成功终止，并且不会再重启。               |
| `Failed`    | `失败`   | Pod 中的所有容器都已终止，并且至少有一个容器是因为失败终止。也就是说，容器以非 0 状态退出或者被系统终止。 |
| `Unknown`   | `未知`   | 因为某些原因无法取得 Pod 的状态。这种情况通常是因为与 Pod 所在主机通信失败 |



## `容器状态`

| 状态         |        | 描述                                                         |
| ------------ | ------ | ------------------------------------------------------------ |
| `Waiting`    | 等待   | 于 `Waiting` 状态的容器仍在运行它完成启动所需要的操作：<br>例如，从某个容器镜像 仓库拉取容器镜像，或者向容器应用 Secret 数据等等 |
| `Running`    | 运行中 | `Running` 状态表明容器正在执行状态并且没有问题发生           |
| `Terminated` | 已终止 | 处于 `Terminated` 状态的容器已经开始执行并且或者正常结束或者因为某些原因失败 |



# 配置存活、就绪和启动探测器



## Probe 配置

- `initialDelaySeconds`：容器启动后要等待多少秒后存活和就绪探测器才被初始化，默认是 0 秒，最小值是 0
- `periodSeconds`：执行探测的时间间隔（单位是秒）。默认是 10 秒。最小值是 1
- `timeoutSeconds`：探测的超时后等待多少秒。默认值是 1 秒。最小值是 1
- `successThreshold`：探测器在失败后，被视为成功的最小连续成功数。默认值是 1。 存活和启动探测的这个值必须是 1。最小值是 1
- `failureThreshold`：当探测失败时，Kubernetes 的重试次数。 存活探测情况下的放弃就意味着重新启动容器。 就绪探测情况下的放弃 Pod 会被打上未就绪的标签。默认值是 3。最小值是 1

```yaml
...
...
    readinessProbe:
      tcpSocket:
        port: 8080
      initialDelaySeconds: 5
      periodSeconds: 10
    livenessProbe:
      tcpSocket:
        port: 8080
      initialDelaySeconds: 15
      periodSeconds: 20      
...
...      
```

> 上面例子：
>
>   `kubelet` 会在容器启动 5 秒后，发送第一个就绪探测，尝试连接容器的 `8080` 端口，如果探测成功，这个 Pod 会被标记为就绪状态，kubelet 将继续每隔 10 秒运行一次检测。
>
>   除了就绪探测，这个配置包括了一个存活探测。 `kubelet `会在容器启动 15 秒后进行第一次存活探测。 就像就绪探测一样，会尝试连接 容器的 `8080` 端口。 如果存活探测失败，这个容器会被重新启动,20秒进行一次存活探测。



## HTTP Probes 配置

- `host`：连接使用的主机名，默认是 Pod 的 IP。也可以在 HTTP 头中设置 “Host” 来代替。
- `scheme` ：用于设置连接主机的方式（HTTP 还是 HTTPS）。默认是 HTTP。
- `path`：访问 HTTP 服务的路径。
- `httpHeaders`：请求中自定义的 HTTP 头。HTTP 头字段允许重复。
- `port`：访问容器的端口号或者端口名。如果数字必须在 1 ～ 65535 之间。



>  有时候，会有一些现有的应用程序在启动时需要较多的初始化时间。 要不影响对引起探测死锁的快速响应，这种情况下，设置存活探测参数是要技巧的。 技巧就是使用一个命令来设置启动探测，针对HTTP 或者 TCP 检测，可以通过设置 `failureThreshold * periodSeconds` 参数来保证有足够长的时间应对糟糕情况下的启动时间。

```yaml
ports:
- name: liveness-port
  containerPort: 8080
  hostPort: 8080

livenessProbe:
  httpGet:
    path: /healthz
    port: liveness-port
  failureThreshold: 1
  periodSeconds: 10

startupProbe:
  httpGet:
    path: /healthz
    port: liveness-port
  failureThreshold: 30
  periodSeconds: 10
```

> 上面例子：
>
> 应用程序将会有最多 5 分钟(30 * 10 = 300s) 的时间来完成它的启动，一旦启动探测成功一次，存活探测任务就会接管对容器的探测，对容器死锁可以快速响应。 如果启动探测一直没有成功，容器会在 300 秒后被杀死
