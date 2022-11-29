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

# 1. 禁用副本分配

> 停止外部写入，停止副本分配

```
PUT _cluster/settings
{
  "persistent": {
    "cluster.routing.allocation.enable": "none",
    "cluster.routing.rebalance.enable": "none",
    "cluster.routing.allocation.allow_rebalance": "indices_primaries_active"
  }
}

```

# 2. 执行同步刷新

```
POST _flush/synced
```

# 3. 停止服务

> 停止 目标节点上的es服务

```shell
sudo systemctl stop elasticsearch.service
# sudo service elasticsearch stop
```

# 4. 恢复主分片

```
PUT _cluster/settings
{
  "persistent": {
    "cluster.routing.allocation.enable": "primaries",
    "cluster.routing.rebalance.enable": "primaries",
    "cluster.routing.allocation.allow_rebalance": "indices_primaries_active"
  }
}

```

# 5. 还原配置
> 等主分片恢复后，还原配置

```
PUT _cluster/settings
{
  "persistent": {
    "cluster.routing.rebalance.enable": "all",
    "cluster.routing.allocation.enable": "all",
    "cluster.routing.allocation.allow_rebalance": "indices_all_active"
  }
}
```









### 手动分配分片到节点

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

