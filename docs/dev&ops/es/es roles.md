---
title: ES 优化
date: 2023-04-06
sidebar_position: 3
tags: [ elasticsearch ]
keywords: [ elasticsearch ]
---


## 1.  Master 节点

Master 节点主要负责集群管理和节点的发现，因此需要选取具备较高可靠性和稳定性的物理节点或虚拟机作为 Master 节点。建议将 Master 节点分配到单独的节点或虚拟机上，避免与其他角色的节点共用，以提高集群的可用性和稳定性。

## 2.  Data 节点

Data 节点主要负责存储索引数据，因此需要选取具备较高存储容量和读写性能的物理节点或虚拟机作为 Data 节点。建议将 Data 节点分配到单独的节点或虚拟机上，以提高存储性能和避免与其他角色的节点共用造成的性能问题。

## 3.  Ingest 节点

Ingest 节点主要负责数据的预处理和转换，因此需要选取具备较高的 CPU 和内存性能的物理节点或虚拟机作为 Ingest 节点。建议将 Ingest 节点分配到单独的节点或虚拟机上，以提高预处理和转换性能。

## 4.  Coordinating 节点

Coordinating 节点主要负责请求的路由和负载均衡，因此需要选取具备较高网络带宽和稳定性的物理节点或虚拟机作为 Coordinating 节点。建议将 Coordinating 节点分配到单独的节点或虚拟机上，以提高请求的路由和负载均衡性能。