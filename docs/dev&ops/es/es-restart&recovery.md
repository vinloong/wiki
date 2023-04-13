---
index: false
icon: devops
title: es 数据恢复操作步骤
date: 2022-04-01
category:
  - dev&ops
tag:
  - es
---

import BrowserWindow from '@site/src/components/BrowserWindow';

## 1. 推迟分片分配

> 默认情况，集群会等待一分钟来查看节点是否会重新加入，如果这个节点在此期间重新加入，重新加入的节点会保持其现有的分片数据，不会触发新的分片分配。
> 通过修改参数 `delayed_timeout` ，默认等待时间可以全局设置也可以在索引级别进行修改:

```mdx-code-block
<BrowserWindow>
```
```console
PUT _all/_settings 
{
  "settings": {
    "index.unassigned.node_left.delayed_timeout": "5m" 
  }
}
```
```mdx-code-block
</BrowserWindow>
```

## 2. 禁用副本分配

> 停止外部写入，停止副本分配

```mdx-code-block
<BrowserWindow>
```
```console
PUT _cluster/settings
{
  "persistent": {
    "cluster.routing.allocation.enable": "none"
  }
}


#    "cluster.routing.rebalance.enable": "none",
#    "cluster.routing.allocation.allow_rebalance": "indices_primaries_active"
```
```mdx-code-block
</BrowserWindow>
```

## 3. 执行同步刷新

```mdx-code-block
<BrowserWindow>
```
```console
POST _flush/synced
```
```mdx-code-block
</BrowserWindow>
```

## 4. 停止服务

> 停止 目标节点上的es服务

```mdx-code-block
<BrowserWindow>
```
```shell
sudo systemctl stop elasticsearch.service
# sudo service elasticsearch stop
```
```mdx-code-block
</BrowserWindow>
```


## 5. 还原配置

> 等主分片恢复后，还原配置

```mdx-code-block
<BrowserWindow>
```
```console

# 可省略
PUT _cluster/settings
{
  "persistent": {
    "cluster.routing.allocation.enable": "primaries"
  }
}
#    "cluster.routing.rebalance.enable": "primaries",
#    "cluster.routing.allocation.allow_rebalance": "indices_primaries_active"



PUT _cluster/settings
{
  "persistent": {
    "cluster.routing.rebalance.enable": "all"
  }
}
#    "cluster.routing.allocation.enable": "all",
#    "cluster.routing.allocation.allow_rebalance": "indices_all_active"
```
```mdx-code-block
</BrowserWindow>
```




## 其他

### 手动分配分片到节点

```mdx-code-block
<BrowserWindow>
```
```
POST _cluster/reroute
{
  "commands":[
    {
      "allocate_stale_primary":{
        "index": "anxinyun_aggregation",
        "shard": 1,
        "node": "es-n4",
        "accept_data_loss" : true 
      }
    }
    ]
}

```
```mdx-code-block
</BrowserWindow>
```

