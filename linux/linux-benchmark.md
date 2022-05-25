---
id: benchmark
title: linux 性能基准测试
date: 2022-05-16
keywords:
  - linux
---



# 测试工具

- sysbench
  
  >  `sysbench`是一款开源的多线程性能测试工具，可以执行CPU/内存/线程/IO/数据库等方面的性能测试。

- fio
  
  > IO 测试工具

# 安装

```shell
apt install sysbench fio
```

```shell
# sysbench --help
Usage:
  sysbench [options]... [testname] [command]

Commands implemented by most tests: prepare run cleanup help

General options:
  --threads=N                     number of threads to use [1]
  --events=N                      limit for total number of events [0]
  --time=N                        limit for total execution time in seconds [10]
  --forced-shutdown=STRING        number of seconds to wait after the --time limit before forcing shutdown, or 'off' to disable [off]
  --thread-stack-size=SIZE        size of stack per thread [64K]
  --rate=N                        average transactions rate. 0 for unlimited rate [0]
  --report-interval=N             periodically report intermediate statistics with a specified interval in seconds. 0 disables intermediate reports [0]
  --report-checkpoints=[LIST,...] dump full statistics and reset all counters at specified points in time. The argument is a list of comma-separated values representing the amount of time in seconds elapsed from start of test when report checkpoint(s) must be performed. Report checkpoints are off by default. []
  --debug[=on|off]                print more debugging info [off]
  --validate[=on|off]             perform validation checks where possible [off]
  --help[=on|off]                 print help and exit [off]
  --version[=on|off]              print version and exit [off]
  --config-file=FILENAME          File containing command line options
  --tx-rate=N                     deprecated alias for --rate [0]
  --max-requests=N                deprecated alias for --events [0]
  --max-time=N                    deprecated alias for --time [0]
  --num-threads=N                 deprecated alias for --threads [1]

Pseudo-Random Numbers Generator options:
  --rand-type=STRING random numbers distribution {uniform,gaussian,special,pareto} [special]
  --rand-spec-iter=N number of iterations used for numbers generation [12]
  --rand-spec-pct=N  percentage of values to be treated as 'special' (for special distribution) [1]
  --rand-spec-res=N  percentage of 'special' values to use (for special distribution) [75]
  --rand-seed=N      seed for random number generator. When 0, the current time is used as a RNG seed. [0]
  --rand-pareto-h=N  parameter h for pareto distribution [0.2]

Log options:
  --verbosity=N verbosity level {5 - debug, 0 - only critical messages} [3]

  --percentile=N       percentile to calculate in latency statistics (1-100). Use the special value of 0 to disable percentile calculations [95]
  --histogram[=on|off] print latency histogram in report [off]

General database options:

  --db-driver=STRING  specifies database driver to use ('help' to get list of available drivers)
  --db-ps-mode=STRING prepared statements usage mode {auto, disable} [auto]
  --db-debug[=on|off] print database-specific debug information [off]


Compiled-in database drivers:
  mysql - MySQL driver
  pgsql - PostgreSQL driver

mysql options:
  --mysql-host=[LIST,...]          MySQL server host [localhost]
  --mysql-port=[LIST,...]          MySQL server port [3306]
  --mysql-socket=[LIST,...]        MySQL socket
  --mysql-user=STRING              MySQL user [sbtest]
  --mysql-password=STRING          MySQL password []
  --mysql-db=STRING                MySQL database name [sbtest]
  --mysql-ssl[=on|off]             use SSL connections, if available in the client library [off]
  --mysql-ssl-cipher=STRING        use specific cipher for SSL connections []
  --mysql-compression[=on|off]     use compression, if available in the client library [off]
  --mysql-debug[=on|off]           trace all client library calls [off]
  --mysql-ignore-errors=[LIST,...] list of errors to ignore, or "all" [1213,1020,1205]
  --mysql-dry-run[=on|off]         Dry run, pretend that all MySQL client API calls are successful without executing them [off]

pgsql options:
  --pgsql-host=STRING     PostgreSQL server host [localhost]
  --pgsql-port=N          PostgreSQL server port [5432]
  --pgsql-user=STRING     PostgreSQL user [sbtest]
  --pgsql-password=STRING PostgreSQL password []
  --pgsql-db=STRING       PostgreSQL database name [sbtest]

Compiled-in tests:
  fileio - File I/O test
  cpu - CPU performance test
  memory - Memory functions speed test
  threads - Threads subsystem performance test
  mutex - Mutex performance test

See 'sysbench <testname> help' for a list of options for each test.
```

> 测试项：
> 
> - fileio : 文件IO测试
> - CPU  ： CPU 性能测试
> - memory ： 内存速度测试
> - threads ： 线程子系统性能测试
> - mutex ： 互斥性能测试
>   选项 [options]
>   `-- threads`=n : 线程数，默认 1

```shell
# fio --help
fio-3.1
fio [options] [job options] <job file(s)>
  --debug=options    Enable debug logging. May be one/more of:
            process,file,io,mem,blktrace,verify,random,parse,
            diskutil,job,mutex,profile,time,net,rate,compress,
            steadystate,helperthread
  --parse-only        Parse options only, don't start any IO
  --output        Write output to file
  --bandwidth-log    Generate aggregate bandwidth logs
  --minimal        Minimal (terse) output
  --output-format=type    Output format (terse,json,json+,normal)
  --terse-version=type    Set terse version output format (default 3, or 2 or 4)
  --version        Print version info and exit
  --help        Print this page
  --cpuclock-test    Perform test/validation of CPU clock
  --crctest=[type]    Test speed of checksum functions
  --cmdhelp=cmd        Print command help, "all" for all of them
  --enghelp=engine    Print ioengine help, or list available ioengines
  --enghelp=engine,cmd    Print help for an ioengine cmd
  --showcmd        Turn a job file into command line options
  --eta=when        When ETA estimate should be printed
                    May be "always", "never" or "auto"
  --eta-newline=time    Force a new line for every 'time' period passed
  --status-interval=t    Force full status dump every 't' period passed
  --readonly        Turn on safety read-only checks, preventing writes
  --section=name    Only run specified section in job file, multiple sections can be specified
  --alloc-size=kb    Set smalloc pool to this size in kb (def 16384)
  --warnings-fatal    Fio parser warnings are fatal
  --max-jobs=nr        Maximum number of threads/processes to support
  --server=args        Start a backend fio server
  --daemonize=pidfile    Background fio server, write pid to file
  --client=hostname    Talk to remote backend(s) fio server at hostname
  --remote-config=file    Tell fio server to load this local job file
  --idle-prof=option    Report cpu idleness on a system or percpu basis
            (option=system,percpu) or run unit work
            calibration only (option=calibrate)
  --inflate-log=log    Inflate and output compressed log
  --trigger-file=file    Execute trigger cmd when file exists
  --trigger-timeout=t    Execute trigger at this time
  --trigger=cmd        Set this command as local trigger
  --trigger-remote=cmd    Set this command as remote trigger
  --aux-path=path    Use this path for fio state generated files

Fio was written by Jens Axboe <jens.axboe@oracle.com>
                   Jens Axboe <jaxboe@fusionio.com>
                   Jens Axboe <axboe@fb.com>
```

# 测试

## CPU

sysbench的cpu测试是在指定时间内，循环进行素数计算

```
素数（也叫质数）就是从1开始的自然数中，无法被整除的数，比如2、3、5、7、11、13、17等。编程公式：对正整数n，如果用2到根号n之间的所有整数去除，均无法整除，则n为素数。
```

```shell
sysbench --test=cpu --cpu-max-prime=20000  --num-threads=32 run
sysbench cpu --cpu-max-prime=20000  --threads=32 run
```

> `--cpu-max-prime` : 产生质数的上限，默认值为10000
> `-num-threads` : 需要的线程数，默认1 （弃用）
>
> `-–threads` ：线程数
>
> `—time` : 运行时长 单位： 秒
>
> `–-events` :  event上限次数 。 默认值为0，则表示不限event次数；若设置为100，则表示当完成100次event后，即使时间还有剩，也停止运行；相同event次数，比较的是谁用时更少。
>
> 


```shell
sysbench 1.0.11 (using system LuaJIT 2.1.0-beta3)

Running the test with following options:
Number of threads: 1
Initializing random number generator from current time


Prime numbers limit: 20000

Initializing worker threads...

Threads started!

CPU speed:
    events per second:   356.34

General statistics:
    total time:                          10.0026s
    total number of events:              3566

Latency (ms):
         min:                                  2.65
         avg:                                  2.80
         max:                                  6.71
         95th percentile:                      3.02
         sum:                              10000.32

Threads fairness:
    events (avg/stddev):           3566.0000/0.00
    execution time (avg/stddev):   10.0003/0.00
    
```

结果分析：

> events per second:  所有线程每秒完成了650.74次event
>
> total time:  共耗时10.0026秒
>
> total number of events:  所有线程一共完成了3566次event
>
> min:                      2.65             完成1次event的最少耗时 2.65 毫秒
> avg:                       2.80             所有event的平均耗时 2.8 毫秒
> max:                     6.71             完成1次event的最大耗时 6.71 毫秒
> 95th percentile:  3.02             95%的event在 3.02 毫秒内完成
> sum:                     10000.32     每个线程耗时10秒
>
> events (avg/stddev):   平均每个线程完成 3566 次event，标准差为0
>
> execution time (avg/stddev):   每个线程平均耗时10秒，标准差为0

## 内存

```shell
# sysbench --test=memory --memory-block-size=4K     --memory-total-size=10Gi --memory-oper=write --num-threads=32 run
sysbench memory --memory-block-size=4K     --memory-total-size=10Gi --memory-oper=write --threads=32 run
```

> `--memory-block-size`: 内存块大小
> `--memory-total-size` : 需要内存总大小
> `--memory-oper`: 内存操作 ：read 、write
> `--num-threads`: 线程数 (弃用)
> `--test` 测试项（弃用）

```shell
WARNING: the --test option is deprecated. You can pass a script name or path on the command line without any options.
WARNING: --num-threads is deprecated, use --threads instead
sysbench 1.0.11 (using system LuaJIT 2.1.0-beta3)

Running the test with following options:
Number of threads: 32
Initializing random number generator from current time


Running memory speed test with the following options:
  block size: 4KiB
  total size: 10240MiB
  operation: write
  scope: global

Initializing worker threads...

Threads started!

Total operations: 2621440 (2096569.03 per second)

10240.00 MiB transferred (8189.72 MiB/sec)


General statistics:
    total time:                          1.2457s
    total number of events:              2621440

Latency (ms):
         min:                                  0.00
         avg:                                  0.01
         max:                                 28.02
         95th percentile:                      0.02
         sum:                              37142.60

Threads fairness:
    events (avg/stddev):           81920.0000/0.00
    execution time (avg/stddev):   1.1607/0.05
```

## 磁盘IO

```shell
fio -direct=1 -iodepth=128 -rw=rw -ioengine=libaio -bs=4k -size=1G -numjobs=1 -runtime=1000 -group_reporting -filename=iotest -name=randrw_test
```

> `-direct`：是否使用io缓存，不使用缓存: direct=1
> `-iodepth`: 队列深度,如果有多个线程测试，意味着每个线程都是此处定义的队列深度。fio总的IO并发数=iodepth * numjobs
> `-bs` ：定义 块大小 单位 : k、K、m、M. 
> `-size`: 定义IO测试的数据量
> `-numjobs` : 并发线程数
> `-rw` : 测试时的读写策略： read(顺序读)、write(顺序写)、randread(随机读)、randwrite(随机写)、rw/readwrite(混合顺序读写)、randrw(混合随机读写)

```shell
randrw_test: (g=0): rw=randrw, bs=(R) 4096B-4096B, (W) 4096B-4096B, (T) 4096B-4096B, ioengine=libaio, iodepth=128
fio-3.1
Starting 1 process
randrw_test: Laying out IO file (1 file / 1024MiB)
Jobs: 1 (f=1): [m(1)][99.5%][r=3016KiB/s,w=3056KiB/s][r=754,w=764 IOPS][eta 00m:01s]  
randrw_test: (groupid=0, jobs=1): err= 0: pid=3261976: Tue May 17 16:13:41 2022
   read: IOPS=665, BW=2663KiB/s (2727kB/s)(512MiB/196819msec)
    slat (usec): min=2, max=251242, avg=59.67, stdev=1897.45
    clat (usec): min=3, max=1903.4k, avg=111082.11, stdev=120777.99
     lat (usec): min=30, max=1903.4k, avg=111142.18, stdev=120806.25
    clat percentiles (usec):
     |  1.00th=[     34],  5.00th=[   2835], 10.00th=[   9241],
     | 20.00th=[  26084], 30.00th=[  42730], 40.00th=[  60556],
     | 50.00th=[  79168], 60.00th=[ 101188], 70.00th=[ 130548],
     | 80.00th=[ 175113], 90.00th=[ 235930], 95.00th=[ 308282],
     | 99.00th=[ 574620], 99.50th=[ 750781], 99.90th=[1149240],
     | 99.95th=[1317012], 99.99th=[1652556]
   bw (  KiB/s): min=   16, max= 7560, per=99.90%, avg=2660.28, stdev=990.62, samples=393
   iops        : min=    4, max= 1890, avg=665.07, stdev=247.65, samples=393
  write: IOPS=666, BW=2664KiB/s (2728kB/s)(512MiB/196819msec)
    slat (usec): min=2, max=510782, avg=72.89, stdev=2858.63
    clat (usec): min=2, max=1643.0k, avg=80988.95, stdev=94180.11
     lat (usec): min=27, max=1644.0k, avg=81062.24, stdev=94262.58
    clat percentiles (usec):
     |  1.00th=[     28],  5.00th=[     38], 10.00th=[    988],
     | 20.00th=[  10028], 30.00th=[  26346], 40.00th=[  42206],
     | 50.00th=[  58983], 60.00th=[  76022], 70.00th=[  95945],
     | 80.00th=[ 127402], 90.00th=[ 189793], 95.00th=[ 235930],
     | 99.00th=[ 408945], 99.50th=[ 541066], 99.90th=[ 977273],
     | 99.95th=[1182794], 99.99th=[1417675]
   bw (  KiB/s): min=    8, max= 7880, per=99.91%, avg=2661.73, stdev=1028.39, samples=393
   iops        : min=    2, max= 1970, avg=665.43, stdev=257.10, samples=393
  lat (usec)   : 4=0.01%, 20=0.01%, 50=3.87%, 100=0.41%, 250=0.50%
  lat (usec)   : 500=0.57%, 750=0.52%, 1000=0.61%
  lat (msec)   : 2=1.56%, 4=1.80%, 10=5.40%, 20=6.01%, 50=18.16%
  lat (msec)   : 100=26.23%, 250=28.01%, 500=5.31%, 750=0.69%, 1000=0.22%
  lat (msec)   : 2000=0.13%
  cpu          : usr=0.95%, sys=3.01%, ctx=119939, majf=0, minf=501
  IO depths    : 1=0.1%, 2=0.1%, 4=0.1%, 8=0.1%, 16=0.1%, 32=0.1%, >=64=100.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.1%
     issued rwt: total=131040,131104,0, short=0,0,0, dropped=0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=128

Run status group 0 (all jobs):
   READ: bw=2663KiB/s (2727kB/s), 2663KiB/s-2663KiB/s (2727kB/s-2727kB/s), io=512MiB (537MB), run=196819-196819msec
  WRITE: bw=2664KiB/s (2728kB/s), 2664KiB/s-2664KiB/s (2728kB/s-2728kB/s), io=512MiB (537MB), run=196819-196819msec

Disk stats (read/write):
  sda: ios=129622/132008, merge=1403/5650, ticks=14267472/11267676, in_queue=25574756, util=100.00%
```

结果分析：

> IOPS: 每秒的输入输出量(或读写次数)，是衡量磁盘性能的主要指标之一；
> 
> ```shell
>  iops        : min=    4, max= 1890, avg=665.07, stdev=247.65, samples=393
> ```
> 
> Bw: 带宽；
> 
> ```shell
> bw (  KiB/s): min=    8, max= 7880, per=99.91%, avg=2661.73, stdev=1028.39, samples=393
> ```
> 
> IO延时：
> 
> ```shell
> slat (usec): min=2, max=510782, avg=72.89, stdev=2858.63
> clat (usec): min=2, max=1643.0k, avg=80988.95, stdev=94180.11
> lat (usec): min=27, max=1644.0k, avg=81062.24, stdev=94262.58
> ```
> 
> usec：微秒；msec：毫秒；1ms=1000us；
