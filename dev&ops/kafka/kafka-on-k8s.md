---
title : "在k8s中部署kafka"
description: "在k8s中部署kafka"
lead: ""
date: 2022-03-25
lastmod: 2022-03-28
draft: false
images: []
weight: 10
toc: true
---





## 测试

```shell
kubectl run -it --image="registry.cn-hangzhou.aliyuncs.com/gcr_k8s_containers/k8s_kafka:1.0-10.2.1" kafka-consume --restart=Never --rm -- kafka-console-consumer.sh --topic test -bootstrap-server kafka-0.kafka-hs.ops.svc.cluster.local:9093

```



```shell
kubectl run -it --image="registry.cn-hangzhou.aliyuncs.com/gcr_k8s_containers/k8s_kafka:1.0-10.2.1" kafka-produce --restart=Never --rm -- kafka-console-producer.sh --topic test -broker-list kafka-0.kafka-hs.ops.svc.cluster.local:9093,kafka-1.kafka-hs.ops.svc.cluster.local:9093,kafka-2.kafka-hs.ops.svc.cluster.local:9093
```





[参考1]([Set-up Kafka Cluster using Kubernetes Statefulset - Knoldus Blogs](https://blog.knoldus.com/set-up-kafka-cluster-using-kubernetes-statefulset/#:~:text=Kafka on K8s StatefulSet StatefulSet is the workload,about the ordering and uniqueness of these Pods.?msclkid=584d31f1abd411ecb83887f5596a6c01))

[]([kow3ns/kubernetes-zookeeper: This project contains tools to facilitate the deployment of Apache ZooKeeper on Kubernetes. (github.com)](https://github.com/kow3ns/kubernetes-zookeeper))