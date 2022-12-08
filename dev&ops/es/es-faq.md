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

