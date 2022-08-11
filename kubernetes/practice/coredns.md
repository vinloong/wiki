---
title: CoreDNS 性能优化
date: 2022-08-11
category: k8s&container
tag: [coredns]
---

## 合理控制 CoreDNS 副本数

- 1. 根据集群规模预估 coredns 需要的副本数，直接调整 coredns deployment 的副本数:

     ```bash
     kubectl -n kube-system scale --replicas=5 deployment/coredns
     ```

  2.  为 coredns 定义 HPA 自动扩缩容

  3. 安装 [cluster-proportional-autoscaler](https://github.com/kubernetes-sigs/cluster-proportional-autoscaler) 以实现更精确的扩缩容(官方推荐)

     > [扩缩 CoreDNS 文档参考](https://github.com/coredns/deployment/blob/master/kubernetes/Scaling_CoreDNS.md)

### DNS 自动扩缩

```shell
# 在 kube-system 命名空间中列出集群中的 Deployments
-> kubectl get deploy -n kube-system
NAME             READY   UP-TO-DATE   AVAILABLE   AGE
coredns          2/2     2            2           248d
metrics-server   1/1     1            1           24d

# 在输出中寻找名称为 coredns 的 Deployment
# 确定 扩缩目标：Deployment/coredns

```

创建文件 `dns-horizontal-autoscaler.yaml`，内容如下所示

```yaml
kind: ServiceAccount
apiVersion: v1
metadata:
  name: kube-dns-autoscaler
  namespace: kube-system

---

kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: system:kube-dns-autoscaler
rules:
  - apiGroups: [""]
    resources: ["nodes"]
    verbs: ["list", "watch"]
  - apiGroups: [""]
    resources: ["replicationcontrollers/scale"]
    verbs: ["get", "update"]
  - apiGroups: ["apps"]
    resources: ["deployments/scale", "replicasets/scale"]
    verbs: ["get", "update"]
# 待以下 issue 修复后，请删除 Configmaps
# kubernetes-incubator/cluster-proportional-autoscaler#16
  - apiGroups: [""]
    resources: ["configmaps"]
    verbs: ["get", "create"]

---

kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: system:kube-dns-autoscaler
subjects:
  - kind: ServiceAccount
    name: kube-dns-autoscaler
    namespace: kube-system
roleRef:
  kind: ClusterRole
  name: system:kube-dns-autoscaler
  apiGroup: rbac.authorization.k8s.io

---

apiVersion: apps/v1
kind: Deployment
metadata:
  name: kube-dns-autoscaler
  namespace: kube-system
  labels:
    k8s-app: kube-dns-autoscaler
    kubernetes.io/cluster-service: "true"
spec:
  selector:
    matchLabels:
      k8s-app: kube-dns-autoscaler
  template:
    metadata:
      labels:
        k8s-app: kube-dns-autoscaler
    spec:
      priorityClassName: system-cluster-critical
      securityContext:
        seccompProfile:
          type: RuntimeDefault
        supplementalGroups: [ 65534 ]
        fsGroup: 65534
      nodeSelector:
        kubernetes.io/os: linux
      containers:
      - name: autoscaler
        image: k8s.gcr.io/cpa/cluster-proportional-autoscaler:1.8.5
        resources:
            requests:
                cpu: "20m"
                memory: "10Mi"
        command:
          - /cluster-proportional-autoscaler
          - --namespace=kube-system
          - --configmap=kube-dns-autoscaler
          # 应该保持目标与 cluster/addons/dns/kube-dns.yaml.base 同步
          - --target=Deployment/coredns
          #当集群使用大节点（有更多核）时，“coresPerReplica”应该占主导地位。
          #如果使用小节点，“nodesPerReplica“ 应该占主导地位。
          - --default-params={"linear":{"coresPerReplica":256,"nodesPerReplica":16,"preventSinglePointFailure":true,"includeUnschedulableNodes":true}}
          - --logtostderr=true
          - --v=2
      tolerations:
      - key: "CriticalAddonsOnly"
        operator: "Exists"
      serviceAccountName: kube-dns-autoscaler

```



```shell
$ kubectl apply -f dns-horizontal-autoscaler.yaml
serviceaccount/kube-dns-autoscaler created
clusterrole.rbac.authorization.k8s.io/system:kube-dns-autoscaler created
clusterrolebinding.rbac.authorization.k8s.io/system:kube-dns-autoscaler created
deployment.apps/kube-dns-autoscaler created
```



### 参数调优

> 伸缩策略主要有两种，一种是线性模型，一种是梯度模型。

```bash
replicas = max( ceil( cores * 1/coresPerReplica ) , ceil( nodes * 1/nodesPerReplica ) )
```



## 禁用 IPv6

如果 K8S 节点没有禁用 IPV6 的话，容器内进程请求 coredns 时的默认行为是同时发起 IPV4 和 IPV6 解析，而通常我们只需要用到 IPV4，当容器请求某个域名时，coredns 解析不到 IPV6 记录，就会 forward 到 upstream 去解析，如果到 upstream 需要经过较长时间(比如跨公网，跨机房专线)，就会拖慢整个解析流程的速度，业务层面就会感知 DNS 解析慢。

CoreDNS 有一个 [template](https://coredns.io/plugins/template/) 的插件，可以用它来禁用 IPV6 的解析，只需要给 CoreDNS 加上如下的配置:

```json
template ANY AAAA {
    rcode NXDOMAIN
}
```



## 优化 ndots

默认情况下，Kubernetes 集群中的域名解析往往需要经过多次请求才能解析到。

查看 pod 内 的 `/etc/resolv.conf` 可以知道 `ndots` 选项默认为 5:

```shell
$ cat /etc/resolv.conf
search default.svc.cluster.local svc.cluster.local cluster.local
nameserver 10.96.0.10
options ndots:5
```

> 意思是: 如果域名中 `.` 的数量小于 5，就依次遍历 `search` 中的后缀并拼接上进行 DNS 查询

举个例子，在 debug 命名空间查询 `kubernetes.default.svc.cluster.local` 这个 service:

> 1. 域名中有 4 个 `.`，小于 5，尝试拼接上第一个 search 进行查询，即 `kubernetes.default.svc.cluster.local.debug.svc.cluster.local`，查不到该域名。
> 2. 继续尝试 `kubernetes.default.svc.cluster.local.svc.cluster.local`，查不到该域名。
> 3. 继续尝试 `kubernetes.default.svc.cluster.local.cluster.local`，仍然查不到该域名。
> 4. 尝试不加后缀，即 `kubernetes.default.svc.cluster.local`，查询成功，返回响应的 ClusterIP。

可以看到一个简单的 service 域名解析需要经过 4 轮解析才能成功，集群中充斥着大量无用的 DNS 请求。

所以我们可以进行下优化，设置一个较小的 `ndots`,在 Pod 的 dnsConfig中设置：

```yaml
kind: Deployment
apiVersion: apps/v1
metadata:
  name: nginx
  namespace: test
  labels:
    app: nginx
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:latest
      dnsConfig:
        options:
          - name: ndots
            value: 2
```

然后  业务发送请求时，尽量使用 拼接完整的 service 名称，这样就不会经过 service 拼接造成大量多余的 DNS 请求。

不过这样搞会比较麻烦 。。。 。。。

## 启用 `autopath`

启用 CoreDNS 的 `autopath `插件可以避免每次域名解析经过多次请求才能解析到，原理是 CoreDNS 智能识别拼接过 search 的 DNS 解析，直接响应 CNAME 并附上相应的 ClusterIP，一步到位，可以极大减少集群内 DNS 请求数量。

修改 CoreDNS 配置:

```bash
kubectl -n kube-system edit configmap coredns
```

```yaml
kind: ConfigMap
apiVersion: v1
metadata:
  name: coredns
  namespace: kube-system
data:
  Corefile: |
    .:53 {
        errors
        health {
           lameduck 5s
        }
        hosts {
          ...
          ...
          fallthrough
        }
        ready
        kubernetes cluster.local in-addr.arpa ip6.arpa {
           # change pods insecure
           pods verified
           fallthrough in-addr.arpa ip6.arpa
           ttl 30
        }
        # add
        autopath @kubernetes
        prometheus :9153
        forward . /etc/resolv.conf
        cache 30
        loop
        reload
        loadbalance
    }

```

> 加上 `autopath @kubernetes`
> 
> 修改默认的 `pods insecure` ——> `pods verified`。

需要注意的是，启用 `autopath `后，由于 coredns 需要 watch 所有的 pod，会增加 coredns 的内存消耗，根据情况适当调节 coredns 的 memory request 和 limit



