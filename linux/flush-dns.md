---
index: 2
title:  Ubuntu 中 刷新 DNS 缓存
# icon: config
category:
  - linux
tag:
  - dns
---

## 使用 systemd-resolve 刷新 DNS-Cache

```shell
$ sudo systemd-resolve --flush-caches
# 检查统计信息以确保您的缓存大小现在为零，从而被清除。 运行以下命令以查看统计信息：
$ sudo systemd-resolve --statistics
DNSSEC supported by current servers: no

Transactions              
Current Transactions: 0   
  Total Transactions: 1200
                          
Cache                     
  Current Cache Size: 0   
          Cache Hits: 439 
        Cache Misses: 827 
                          
DNSSEC Verdicts           
              Secure: 0   
            Insecure: 0   
               Bogus: 0   
       Indeterminate: 0   

```

## 使用 dns-clean 刷新 DNS-Cache

```shell
sudo /etc/init.d/dns-clean start

```

