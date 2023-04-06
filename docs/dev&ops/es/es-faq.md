---
title: ES 优化
date: 2023-04-06
sidebar_position: 2
tags: [ elasticsearch ]
keywords: [ elasticsearch ]
---

import BrowserWindow from '@site/src/components/BrowserWindow';

## 配置优化

### 系统配置

1. ES使用root用户启动，之后不能再启动的原因之ERROR Unable to locate appender “rolling“ for logger config “root“
    > es 默认不能使用 `root` 用户启动。当你使用 `root` 用户启动时 es 初始化相关目录。而这些目录是由 `root` 用户创建，elasticsearch 用户没有权限访问或修改。

```shell
chown -R elasticsearch /var/log/elasticsearch
# uuju 
chgrp -R elasticsearch /var/lib/elasticsearch
  
```


> 使用 .zip 或 .tar.gz 软件包安装时，可以通过以下方式配置系统设置：  
> - 通过 ulimit 命令进行临时配置
> - 在 /etc/security/limits.conf 中永久配置
> 使用 RPM 或 Debian 软件包安装时，大多数系统设置将在系统配置文件中设置。但是，使用 systemd 的系统需要在 systemd 配置文件中指定系统限制

在Linux系统中，可以使用 `ulimit` 命令临时更改资源限制。通常在切换到运行Elasticsearch的用户之前，需要以root身份设置限制。
例如，要将打开的文件句柄数量（ulimit -n）设置为65,536，可以执行以下操作：

```mdx-code-block
<BrowserWindow>
```
```shell
# 切换 root 用户
sudo su
# 修改打开最大文件数字
ulimit -n 65535
ulimit -u 4096

# 切换回 elasticsearch 用户
su elasticsearch
```
```mdx-code-block
</BrowserWindow>
```

> 新配置仅适用于当前会话。 
> 您可以使用 `ulimit -a` 查看所有当前应用的限制。 

> 在Linux系统中，可以通过编辑 `/etc/security/limits.conf` 文件为特定用户设置持久限制。
> 例如，要将`elasticsearch`用户的最大打开文件数设置为 `65535`，可以将以下行添加到`limits.conf`文件中：

```mdx-code-block
<BrowserWindow>
```
```shell
elasticsearch  -  nofile  65535
elasticsearch  -  nproc   4096 
```
```mdx-code-block
</BrowserWindow>
```

> 此更改只有在下一次`elasticsearch`用户打开新会话时才会生效。

:::note
Ubuntu 忽略由`init.d`启动的进程的`limits.conf`文件。
要启用`limits.conf`文件，请编辑 `/etc/pam.d/su` 文件并取消注释以下行：
```shell
# session    required   pam_limits.so
```
:::

> 使用RPM或Debian软件包安装时，可以在系统配置文件中指定系统设置和环境变量。该文件位于以下位置：
> - **RPM** :  `/etc/sysconfig/elasticsearch`
> - **Debian** :  `/etc/default/elasticsearch`

然而，在使用`systemd`的系统中，系统限制需要通过`systemd`来指定。

`systemd`服务文件（`/usr/lib/systemd/system/elasticsearch.service`）包含默认应用的限制。

> 要覆盖它们，请添加一个名为 `/etc/systemd/system/elasticsearch.service.d/override.conf` 的文件（或者您可以运行`sudo systemctl edit elasticsearch`，它会自动在默认编辑器中打开该文件）。
> 在此文件中设置任何更改，例如：

```mdx-code-block
<BrowserWindow>
```
```shell
[Service]
LimitMEMLOCK=infinity
```
```mdx-code-block
</BrowserWindow>
```

> 完成后，请运行以下命令重新加载配置：

```mdx-code-block
<BrowserWindow>
```
```shell
sudo systemctl daemon-reload
```
```mdx-code-block
</BrowserWindow>
```

```mdx-code-block
<BrowserWindow>
```
```shell
# 禁用 swapping
$ sudo swapoff -a

# 永久禁用交换，您需要编辑 `/etc/fstab` 文件并注释掉任何包含单词 `swap` 的行。
$ vi /etc/fstab 
...
#/dev/mapper/centos-swap swap                    swap    defaults        0 0


# 配置 `swappiness` `max_map_count`
$ vi /etc/sysctl.conf
...
vm.swappiness=1
vm.max_map_count=262144


# 启用 `bootstrap.memory_lock`
# 在 es 配置文件中 `elasticsearch.yml` 增加一行
$ vi elasticsearch.yml
bootstrap.memory_lock: true

```
```mdx-code-block
</BrowserWindow>
```




```bash
ulimit -a

ulimit -n 65535
ulimit -u 4096


vi /etc/security/limits.conf
elasticsearch  -  nofile  65535
elasticsearch  -  nproc   4096 


swapoff -a

sysctl -w vm.max_map_count=262144

vi /etc/sysctl.conf
vm.swappiness=1
vm.max_map_count=262144




vi elasticsearch.yml
bootstrap.memory_lock: true
cluster.routing.allocation.same_shard.host: true
```



### es 配置


## 索引优化

### 导出数据

```shell
export ES_INDEX=anxinyun_raws; 

echo "${ES_INDEX}-2019: START time ================= [ `date` ] " >> time.txt; 

elasticdump --input=http://10.8.40.11:9200/${ES_INDEX} \
  --searchBody='{"query": { "bool": { "must": [{ "range": { "collect_time": { "gte": "2019-01-01T00:00:00.000+08", "lt": "2020-01-01T00:00:00.000+08" } } }] } }, "sort": [{ "collect_time": { "order": "asc" } }] }' \
  --limit=2000 --output=/tmp/${ES_INDEX}-2019.json --type=data ; 

echo "${ES_INDEX}-2019:  END  time ================= [ `date` ] " >> time.txt; 
```

```bash
nohup bin/export-2019.sh > logs/export-2019.log 2>&1 &
```

### 导入数据

```shell
export ES_INPUT_INDEX=anxinyun_raws;
export DATA_YEAR=2019;
export ES_OUTPUT_INDEX=anxincloud_raws;

echo "IMPORT ${ES_INPUT_INDEX}-${DATA_YEAR} TO ${ES_OUTPUT_INDEX}-${DATA_YEAR} : START time ================= [ `date` ] " >> logs/time.txt;

elasticdump --input="/tmp/${ES_INPUT_INDEX}-${DATA_YEAR}.json" \
--limit=5000 \
--output="http://10.8.40.12:9200/${ES_OUTPUT_INDEX}-${DATA_YEAR}" \
--type=data ;

echo "IMPORT ${ES_INPUT_INDEX}-${DATA_YEAR} TO ${ES_OUTPUT_INDEX}-${DATA_YEAR} :  END  time ================= [ `date` ] " >> logs/time.txt;
```

```bash
nohup bin/import-2019.sh > logs/import-2019.log 2>&1 &
```