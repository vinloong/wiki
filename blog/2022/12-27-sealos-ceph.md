---
slug: sealos ceph
title: sealos start && ceph clean
authors: loong
tags: [sealos, k8s, ceph]
---

```bash
wget https://github.91chi.fun/https://github.com/labring/sealos/releases/download/v4.1.3/sealos_4.1.3_linux_amd64.tar.gz
tar -zxvf sealos_4.1.3_linux_amd64.tar.gz sealos
chmod +x sealos
mv sealos /usr/bin
sealos version
sealos apply -f Clusterfile

sealos reset --cluster fs-cloud  --masters 10.8.40.125,10.8.40.126,10.8.40.129 --nodes 10.8.40.134,10.8.40.133,10.8.40.128,10.8.40.124 -p Freesun_123

sealos --cluster fs-cloud add --nodes 10.8.40.124


```


```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```


```bash
kubectl exec -it -n rook-ceph rook-ceph-tools-5679b7d8f-8fpqj -- bash
$ ceph status
  cluster:
    id:     b3282dee-82f6-4e2f-b89e-48c01077662b
    health: HEALTH_OK
 
  services:
    mon: 3 daemons, quorum a,b,d (age 31s)
    mgr: b(active, since 76s), standbys: a
    osd: 3 osds: 3 up (since 76s), 3 in (since 103s)
 
  data:
    pools:   1 pools, 1 pgs
    objects: 2 objects, 577 KiB
    usage:   67 MiB used, 3.3 TiB / 3.3 TiB avail
    pgs:     1 active+clean


$ ceph osd status
ID  HOST      USED  AVAIL  WR OPS  WR DATA  RD OPS  RD DATA  STATE      
 0  node-01  22.1M  1117G      0        0       0        0   exists,up  
 1  node-03  22.2M  1117G      0        0       0        0   exists,up  
 2  node-02  22.1M  1117G      0        0       0        0   exists,up


$ ceph osd pool ls detail
pool 1 '.mgr' replicated size 3 min_size 2 crush_rule 0 object_hash rjenkins pg_num 1 pgp_num 1 autoscale_mode on last_change 18 flags hashpspool stripe_width 0 pg_num_max 32 pg_num_min 1 application mgr


$ rados df
POOL_NAME     USED  OBJECTS  CLONES  COPIES  MISSING_ON_PRIMARY  UNFOUND  DEGRADED  RD_OPS       RD  WR_OPS       WR  USED COMPR  UNDER COMPR
.mgr       1.7 MiB        2       0       6                   0        0         0     126  109 KiB     181  2.9 MiB         0 B          0 B

total_objects    2
total_used       67 MiB
total_avail      3.3 TiB
total_space      3.3 TiB




重新安装 rook-ceph 重置磁盘状态

DISK="/dev/sdX"

sgdisk --zap-all $DISK

dd if=/dev/zero of="$DISK" bs=1M count=100 oflag=direct,dsync

# 如果是固态盘使用下面命令 替换上面 `dd` 命令
blkdiscard $DISK

```