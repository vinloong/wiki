---
title : "ceph 优化"
description: "ceph 优化"
lead: ""
date: 2022-04-05
lastmod: 2022-04-05
draft: false
images: []
weight: 10
toc: true
---





# 硬件


> 略 ... ...


# 软件



## 系统

- 1. kernel pid max

     ```shell
     echo 4194303 > /proc/sys/kernel/pid_max
     ```

- 2.  read_ahead

     > 通过数据预读并且记载到随机访问内存方式提高磁盘读操作

     ```shell
     # 读取默认值
     $ cat /sys/block/sd[a,b]/queue/read_ahead_kb
     
     # 根据一些Ceph的公开分享，8192是比较理想的值
     $ echo "8192" > /sys/block/sd[a,b]/queue/read_ahead_kb
     ```

- 3.  swappiness 

     > 使用swap 会影响性能

     ```shell
     echo "vm.swappiness = 0" | tee -a /etc/sysctl.conf
     ```

- 4.  I/O Scheduler

     > SSD要用noop，SATA/SAS使用deadline

     ```shell
     echo "deadline" > /sys/block/sd[a,b]/queue/scheduler
     echo "noop" > /sys/block/sd[a,b]/queue/scheduler
     ```

## ceph 参数

- 1.  PG Number

     > PG和PGP数量一定要根据OSD的数量进行调整，计算公式如下，但是最后算出的结果一定要接近或者等于一个2的指数

     `Total_pgs = (total_number_of_osd * 100)/max_replication_count`

     > 例如： 我们 5个OSD, 副本数是3， 根据公式计算结果是 166，  最接近 128，所以需要设定 pool(volumes) 的pg_num和pgp_num 都为128

     ```shell
     ceph osd pool set {pool_name} pg_num 128
     ceph osd pool set {pool_name} pgp_num 128
     ```

     