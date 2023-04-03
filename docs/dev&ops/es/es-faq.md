
## 配置优化

### 系统配置

1. ES使用root用户启动，之后不能再启动的原因之ERROR Unable to locate appender “rolling“ for logger config “root“
    > es 默认不能使用 `root` 用户启动。当你使用 `root` 用户启动时 es 初始化相关目录。而这些目录是由 `root` 用户创建，elasticsearch 用户没有权限访问或修改。
  ```shell
  
  chown -R elasticsearch /var/log/elasticsearch
 # uuju 
 chgrp -R elasticsearch /var/lib/elasticsearch
 
  
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