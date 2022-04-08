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




# ceph 读写测试

RADOS 性能测试：使用 Ceph 自带的`rados bench`工具

语法：

```shell
rados bench -p <pool_name> <seconds> <write|seq|rand> -b <block size> -t --no-cleanup
```

> 参数说明：
>
> `pool_name`：测试所针对的存储池
>  `seconds`：测试所持续的秒数
>  `<write|seq|rand>`：操作模式，write：写，seq：顺序读；rand：随机读
>  `-b`：block size，即块大小，默认为 4M
>  `-t`：读/写并行数，默认为 16
>  `--no-cleanup` 表示测试完成后不删除测试用数据



## 读写测试



```shell
# 写入测试
$ rados bench -p myfs-data0 10 write --no-cleanup
hints = 1
Maintaining 16 concurrent writes of 4194304 bytes to objects of size 4194304 for up to 10 seconds or 0 objects
Object prefix: benchmark_data_rook-ceph-tools-64bd84c8b5-rq_69203
  sec Cur ops   started  finished  avg MB/s  cur MB/s last lat(s)  avg lat(s)
    0       0         0         0         0         0           -           0
    1      16        34        18   71.9932        72    0.591918     0.58711
    2      16        62        46   91.9882       112    0.840758    0.584572
    3      16        87        71    94.653       100    0.431223    0.604528
    4      16       114        98   97.9853       108    0.341559    0.595973
    5      16       142       126   100.785       112    0.794463    0.602104
    6      16       168       152   101.318       104    0.347406    0.592001
    7      16       195       179    102.27       108    0.312605    0.600738
    8      16       221       205   102.484       104    0.378027     0.60132
    9      16       246       230   102.206       100    0.399448    0.595864
   10      16       275       259   103.584       116    0.316101    0.599753
Total time run:         10.5516
Total writes made:      275
Write size:             4194304
Object size:            4194304
Bandwidth (MB/sec):     104.249
Stddev Bandwidth:       12.2855
Max bandwidth (MB/sec): 116
Min bandwidth (MB/sec): 72
Average IOPS:           26
Stddev IOPS:            3.07137
Max IOPS:               29
Min IOPS:               18
Average Latency(s):     0.597843
Stddev Latency(s):      0.201114
Max latency(s):         1.32004
Min latency(s):         0.192275

# 顺序读
$ rados bench -p myfs-data0 10 seq
hints = 1
  sec Cur ops   started  finished  avg MB/s  cur MB/s last lat(s)  avg lat(s)
    0       0         0         0         0         0           -           0
    1      16        40        24   95.9743        96    0.459347    0.426068
    2      16        67        51   101.978       108    0.955426     0.50726
    3      16        94        78   103.979       108    0.684261    0.551388
    4      16       119       103    102.98       100    0.444902    0.561134
    5      16       148       132    105.58       116    0.236886    0.554344
    6      16       176       160   106.647       112    0.235661    0.556833
    7      16       201       185   105.695       100    0.946928    0.569635
    8      16       228       212   105.981       108    0.546374    0.568771
    9      16       255       239   106.203       108    0.346846    0.574118
   10       7       275       268   107.181       116     1.42381    0.567453
Total time run:       10.3294
Total reads made:     275
Read size:            4194304
Object size:          4194304
Bandwidth (MB/sec):   106.492
Average IOPS:         26
Stddev IOPS:          1.68655
Max IOPS:             29
Min IOPS:             24
Average Latency(s):   0.581478
Max latency(s):       1.56143
Min latency(s):       0.0813735


# 随机读
$ rados bench -p  myfs-data0 10 rand
hints = 1
  sec Cur ops   started  finished  avg MB/s  cur MB/s last lat(s)  avg lat(s)
    0       0         0         0         0         0           -           0
    1      16        39        23   91.9722        92     0.32398    0.375156
    2      16        67        51   101.976       112    0.112495    0.474886
    3      16        95        79   105.309       112    0.494923    0.512701
    4      16       121       105   104.977       104     1.43835     0.53186
    5      16       149       133   106.378       112    0.150013     0.54715
    6      16       176       160   106.645       108     1.34486    0.543604
    7      16       203       187   106.837       108    0.228958    0.561311
    8      16       230       214    106.98       108     1.41135    0.560095
    9      16       257       241   107.091       108    0.186098    0.566892
   10      16       284       268    107.18       108    0.926334    0.569814
Total time run:       10.5311
Total reads made:     284
Read size:            4194304
Object size:          4194304
Bandwidth (MB/sec):   107.87
Average IOPS:         26
Stddev IOPS:          1.47573
Max IOPS:             28
Min IOPS:             23
Average Latency(s):   0.577085
Max latency(s):       1.48504
Min latency(s):       0.0750272

# 清理测试数据
$ rados -p  myfs-data0 cleanup
Removed 275 objects
```

>  **rados bench 参数说明：**
>
> ```undefined
> cur 是current的缩写 
> cur MB/s 当前速度
> avg MB/s 平均速度
> Bandwidth (MB/sec): 吞吐量
> Average IOPS: 平均iops
> Stddev IOPS: 标准偏差
> Average Latency(s): 平均延迟
> ```
