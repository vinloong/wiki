---
title : "没有zookeeper如何部署kafka"
description: "在没有zookeeper的情况下如何部署kafka"
lead: ""
date: 2022-03-25
lastmod: 2022-03-28
draft: false
images: []
weight: 10
toc: true
---

# 前置条件

- jdk-8 +



# 单节点

生成集群ID

```shell
$ ./bin/kafka-storage.sh random-uuid
1KcrtdC-SleGQN9kT7Rs1Q
```

格式化存储

```shell
./bin/kafka-storage.sh format -t <uuid> -c <server_config_location>
```

后台启动

```shell
./bin/kafka-server-start.sh -daemon ./config/kraft/server.properties
```



# 集群模式

注意几个重要的配置属性：

```
# 集群中的节点ID
node.id=1
# 一个节点可以充当代理 或 控制器 或 两者兼备， 控制器是指 kraft控制节点
process.roles=broker,controller
# 这是所有可以用于选举的节点，是具有controller角色的节点
controller.quorum.voters=1@node1:9093,2@node2:9093,3@node3:9093

listeners=PLAINTEXT://:9092,CONTROLLER://:9093

inter.broker.listener.name=PLAINTEXT

controller.listener.names=CONTROLLER

# 这是kafka 存储数据的目录
log.dirs=/tmp/kafka/kraft-combined-logs

listener.security.protocol.map=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT,SSL:SSL,SASL_PLAINTEXT:SASL_PLAINTEXT,SASL_SSL:SASL_SSL
```

首先 在启动服务之前先创建 kafka 集群ID

```shell
$ ./bin/kafka-storage.sh random-uuid
1KcrtdC-SleGQN9kT7Rs1Q
```

然后格式化每个节点的数据存储目录：

```shell
./bin/kafka-storage.sh format -t ${uuid} -c ${server_config_location}
```

> 上面 ${uuid} 用上一步生成的 `uuid` 替换, ${server_config_location} 是每个节点的日志存储目录

启动 kafka

在每个节点运行

```shell
# 设置 堆大小
export KAFKA_HEAP_OPTS="-Xmx200M –Xms100M"
./bin/kafka-server-start.sh -daemon ./config/kraft/server.properties
```



# 在k8s 中运行











































## 测试

```shell
kubectl run -it --image="registry.cn-hangzhou.aliyuncs.com/gcr_k8s_containers/k8s_kafka:1.0-10.2.1" kafka-consume --restart=Never --rm -- kafka-console-consumer.sh --topic test -bootstrap-server kafka-0.kafka-hs.ops.svc.cluster.local:9093

```



```shell
kubectl run -it --image="registry.cn-hangzhou.aliyuncs.com/gcr_k8s_containers/k8s_kafka:1.0-10.2.1" kafka-produce --restart=Never --rm -- kafka-console-producer.sh --topic test -broker-list kafka-0.kafka-hs.ops.svc.cluster.local:9093,kafka-1.kafka-hs.ops.svc.cluster.local:9093,kafka-2.kafka-hs.ops.svc.cluster.local:9093
```





[Set-up Kafka Cluster using Kubernetes Statefulset - Knoldus Blogs](https://blog.knoldus.com/set-up-kafka-cluster-using-kubernetes-statefulset/#:~:text=Kafka on K8s StatefulSet StatefulSet is the workload,about the ordering and uniqueness of these Pods.?msclkid=584d31f1abd411ecb83887f5596a6c01)

[kow3ns/kubernetes-zookeeper: This project contains tools to facilitate the deployment of Apache ZooKeeper on Kubernetes. (github.com)](https://github.com/kow3ns/kubernetes-zookeeper)
