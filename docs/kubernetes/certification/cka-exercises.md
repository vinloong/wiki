---
title: CKA 练习
date: 2023-03-05
sidebar_position: 1
tags: [kubernetes, k8s, cka ]
keywords: [kubernetes, k8s, cka, rbac]
---


## 配置环境

> 解答每个题目前，都要按要求(命令)设置(选择/切换)集群环境，

```shell
kubectl config use-context ek8s
```

## 1. 基于角色的访问控制 - RBAC

### 参考

> https://kubernetes.io/zh-cn/docs/reference/access-authn-authz/rbac/#command-line-utilities

### 题目

> You have been asked to create a new `ClusterRole` for a deployment pipeline and bind it to a specific `ServiceAccount` scoped to a specific namespace.
>
> 为部署流水线创建一个新的 `ClusterRole` 并将其绑定到范围为特定的 `namespce` 的 特定 `ServiceAccount`.
> 
> Create a new `ClusterRole` named `deployment-clusterrole`, which only allows to create the following resource types: 
>
> - `Deployment`
> - `StatefulSet`
> - `DaemonSet`
>
> Create a new `ServiceAccount` named `cicd-token` in the existing namespace `app-team1`.
>
> Bind the new ClusterRole `deployment-clusterrole` to the new ServiceAccount `cicd-token`, limited to the namespace `app-team1`.
> 
> 创建一个名为 `deployment-clusterrole` 的 `clusterrole`, 该 `clusterrole` 只允许对 `Deployment`、`Daemonset` 、`Statefulset` 具有 create 权限，
>
> 在现有的 namespace `app-team1`中创建一个名为 `cicd-token` 的 新 ServiceAccount.
>
> 限于 namespace `app-team1` 中，将新的 ClusterRole `deployment-clusterrole` 绑定到新的 ServiceAccount `cicd-token`.

### 解答：

```shell
kubectl config use-context k8s
 
kubectl create clusterrole deployment-clusterrole --verb=create --resource=deployment,daemonset,statefulset

kubectl create sa cicd-token -n app-team1

kubectl create rolebinding deployment-clusterrole-cicd-token-binding -n app-team1 --clusterrole=deployment-clusterrole --serviceaccount=app-team1:cicd-token

```

## 2. 设置指定节点不可用 - cordon && drain

### 参考
 
> - [标记一个 Node 为不可调度](https://kubernetes.io/zh-cn/docs/concepts/architecture/nodes/#manual-node-administration)
>
> - [清空一个节点](https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/safely-drain-node/#use-kubectl-drain-to-remove-a-node-from-service)

### 题目

> set the node named `ek8s-node-1` as unavailable and reshedule all the pods running on it
>
> - 设置配置环境 kubectl config use-context ek8s 
> - 将名为 `ek8s-node-1` 的 node 设置为不可调度，并重新调度该 node 上所有运行的 pods

### 解答

```shell
kubectl config use-context ek8s

kubectl cordon ek8s-node-1

kubectl drain ek8s-node-1 --delete-emptydir-data --ignore-daemonsets --force

```

## 3. k8s 版本升级

### 参考

[升级 kubeadm 集群](https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)

### 题目

> 现有的 kubernetes 集群正在运行版本 1.23.1 ,仅将 master 节点上的所有 kubernetes 控制平面和节点组件升级到版本 1.23.2 
> 
> 确保在升级前 `drain master` 节点，并在升级后 `uncordon master` 节点。
> 
> 可以使用以下命令，通过 ssh 连接到 master 节点: `ssh master01`
> 
> 可以使用以下命令,  在 该 master 节点上获取更高权限: `sudo -i`
> 
> 另外，在主节点上升级 `kubelet` 和 `kubectl`
> 
> 请不要升级工作节点,  `etcd` 、`container` 管理器，CNI 插件，DNS 服务或任何其他插件 

### 解答

```shell

# 切换集群
[student@node-1] $ kubectl config use-context mk8s

[student@node-1] $ kubectl get nodes

# cordon 停止调度
[student@node-1] $ kubectl cordon master01
# drain 驱逐节点
[student@node-1] $ kubectl drain master01 --delete-emptydir-data --ignore-daemonsets --force


# ssh 到 master 节点，并切换到 root 下
[student@node-1] $ ssh master01
[student@master01] $ sudo -i

[root@master01] # apt-cache show kubeadm | grep 1.23.2

[root@master01] # apt-get update

[root@master01] # apt-get install kubeadm=1.23.2-00

# 验证升级计划
[root@master01] # kubeadm upgrade plan

# 排除 etcd，升级其他的，提示时，输入 y。
[root@master01] # kubeadm upgrade apply v1.23.2 --etcd-upgrade=false


# 升级 kubelet 
[root@master01] # apt-get install kubelet=1.23.2-00 
[root@master01] # kudbelet --version


# 升级 kubectl
[root@master01] # apt-get install kubectl=1.23.2-00 
[root@master01] # kubectl version

# 退出 root，退回到 student@master01 
[root@master01] # exit 

# 退出 master01，退回到 student@node-1 
[student@master01] $ exit

# 恢复 master01 调度 
[student@node-1] $ kubectl uncordon master01

# 检查 master01 是否为 Ready 
[student@node-1] $ kubectl get node

```

## 4. etcd 数据备份恢复

###  参考

[备份 etcd 集群](https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/configure-upgrade-etcd/#backing-up-an-etcd-cluster)

[恢复 etcd 集群](https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/configure-upgrade-etcd/#restoring-an-etcd-cluster)

### 题目

> First, create a snapshot of the existing etcd instance running at https://127.0.0.1:2379, saving the snapshot to `/srv/data/etcd-snapshot.db`
> 
> :::info  
> 
> Creating a snapshot of the given instance is expected to complete in seconds.
> 
> If the operation seems to hang,something's likely wrong with your command. Use `CTRL+C` to cancel the operation and try again.
> 
> :::
> 
> Next, restore an existing, previous snapshot located at `/var/lib/backup/etcd-snapshot-previous.db`.
> 
> :::info
> 
> The following TLS certificates/key are supplied for connecting to the server with etcdctl:
> 
> - CA certificate: /opt/KUIN00601/ca.crt
> - Client certificate: /opt/KUIN00601/etcd-client.crt
> - Client key: /opt/KUIN00601/etcd-client.key
>
> :::


> 为 运 行 在​ ​`https://127.0.0.1:2379`​​ 上 的 现 有 etcd 实 例 创 建 快 照 并 将 快 照 保 存 到 `/srv/data/etcd-snapshot.db`
> 为给定实例创建快照预计能在几秒钟内完成。如果该操作似乎挂起，则命令可能有问题。用 `ctrl+c` 来取消操作，然后重试。
> 然后还原位于`/srv/data/etcd-snapshot-previous.db` 的现有先前快照.

### 解答

```shell
# 备份： 
# 如果不使用 export ETCDCTL_API=3，而使用 ETCDCTL_API=3，则下面每条 etcdctl 命令前都要加 ETCDCTL_API=3。 
# 如果执行时，提示 permission denied，则是权限不够，命令最前面加 sudo 即可。

student@node-1:~$ export ETCDCTL_API=3 
student@node-1:~$ sudo ETCDCTL_API=3 etcdctl --endpoints="https://127.0.0.1:2379" --cacert=/opt/KUIN000601/ca.crt --cert=/opt/KUIN000601/etcd-client.crt --key=/opt/KUIN000601/etcdclient.key snapshot save /srv/data/etcd-snapshot.db


# 还原： 
student@node-1:~$ sudo export ETCDCTL_API=3 
student@node-1:~$ sudo etcdctl --endpoints="https://127.0.0.1:2379" --cacert=/opt/KUIN000601/ca.crt --cert=/opt/KUIN000601/etcd-client.crt --key=/opt/KUIN000601/etcdclient.key snapshot restore /var/lib/backup/etcd-snapshot-previous.db
```

#### 测试环境

```shell
# 备份
# 
controlplane $ export ETCD_CRT_PATH=/etc/kubernetes/pki/etcd
controlplane $ export ETCDCTL_API=3
controlplane $ etcdctl --endpoints="https://127.0.0.1:2379" --cacert=${ETCD_CRT_PATH}/ca.crt --cert=${ETCD_CRT_PATH}/peer.crt --key=${ETCD_CRT_PATH}/peer.key snapshot save /root/etcd-snapshot.db
{"level":"info","ts":1680159896.8340132,"caller":"snapshot/v3_snapshot.go:68","msg":"created temporary db file","path":"/root/etcd-snapshot.db.part"}
{"level":"info","ts":1680159896.8432605,"logger":"client","caller":"v3/maintenance.go:211","msg":"opened snapshot stream; downloading"}
{"level":"info","ts":1680159896.8434842,"caller":"snapshot/v3_snapshot.go:76","msg":"fetching snapshot","endpoint":"https://127.0.0.1:2379"}
{"level":"info","ts":1680159898.0095634,"logger":"client","caller":"v3/maintenance.go:219","msg":"completed snapshot read; closing"}
{"level":"info","ts":1680159898.016961,"caller":"snapshot/v3_snapshot.go:91","msg":"fetched snapshot","endpoint":"https://127.0.0.1:2379","size":"6.0 MB","took":"1 second ago"}
{"level":"info","ts":1680159898.0172522,"caller":"snapshot/v3_snapshot.go:100","msg":"saved","path":"/root/etcd-snapshot.db"}
Snapshot saved at /root/etcd-snapshot.db
controlplane $ ls
etcd-snapshot.db
controlplane $ etcdctl --write-out=table snapshot status /root/etcd-snapshot.db
Deprecated: Use `etcdutl snapshot status` instead.

+----------+----------+------------+------------+
|   HASH   | REVISION | TOTAL KEYS | TOTAL SIZE |
+----------+----------+------------+------------+
| a3673a87 |     3465 |       1034 |     6.0 MB |
+----------+----------+------------+------------+
controlplane $ 
```