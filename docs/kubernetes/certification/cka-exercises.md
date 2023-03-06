---
title: CKA 练习
date: 2023-03-05
sidebar_position: 1
tags: [kubernetes, k8s, cka ]
keywords: [kubernetes, k8s, cka, rbac]
---


## 1. 基于角色的访问控制 - RBAC

### 参考

> https://kubernetes.io/zh-cn/docs/reference/access-authn-authz/rbac/#command-line-utilities


### 题目

#### Context
> You have been asked to create a new `ClusterRole` for a deployment pipeline and bind it to a specific `ServiceAccount` scoped to a specific namespace.
>
> 为部署流水线创建一个新的 `ClusterRole` 并将其绑定到范围为特定的 `namespce` 的 特定 `ServiceAccount`.

#### Task

> Create a new `ClusterRole` named `deployment-clusterrole`, which only allows to create the following resource types: 
>
> - `Deployment`
> - `StatefulSet`
> - `DaemonSet`
>
> Create a new `ServiceAccount` named `cicd-token` in the existing namespace `app-team1`.
>
> Bind the new ClusterRole `deployment-clusterrole` to the new ServiceAccount `cicd-token`, limited to the namespace `app-team1`.


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



## 2. 设置节点不可用 - cordon && drain

### 参考
 
> - [标记一个 Node 为不可调度](https://kubernetes.io/zh-cn/docs/concepts/architecture/nodes/#manual-node-administration)
>
> - [清空一个节点](https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/safely-drain-node/#use-kubectl-drain-to-remove-a-node-from-service)

### 题目

#### Context

> Set configuration context:
>
> ```shell
> kubectl config use-context ek8s
> ```

#### Task

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


