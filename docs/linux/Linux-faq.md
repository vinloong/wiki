---
title: Linux-FAQ
date: 2022-04-18
sidebar_position: 1
tags: [linux, faq]
keywords: [linux, route, fuser, lvextend]
---

import BrowserWindow from '@site/src/components/BrowserWindow';

## 无法连接网络

```mdx-code-block
<BrowserWindow>
```

```shell showLineNumbers
# 1. 查看网关
route -n

# 设置默认网关
route add default gw 10.8.30.1

# 2. 以上不行执行下面命令
dhclient eno1
```

```mdx-code-block
</BrowserWindow>
```

## 软件安装卸载总是报错

> dpkg: 处理软件包 redis-server (--configure)时出错： 子进程 已安装 post-installation 脚本 返回错误状态 1

```mdx-code-block
<BrowserWindow>
```

```shell
sudo rm /var/lib/dpkg/info/redis-server.*
```

```mdx-code-block
</BrowserWindow>
```

## linux 根目录空间不足，追加空间到根目录下

### 问题分析

 k8s pod 异常，无法启动

```mdx-code-block
<BrowserWindow>
```

```shell {6} showLineNumbers
kubectl get po -n kuboard -o wide
NAME                                     READY   STATUS      RESTARTS        AGE     IP                NODE        NOMINATED NODE   READINESS GATES
...
node-exporter-g2rmq                      2/2     Running     0               7d1h    10.8.40.128       node-03     <none>           <none>
node-exporter-j8kf2                      2/2     Running     0               7d1h    10.8.40.127       node-04     <none>           <none>
node-exporter-rg4sx                      0/2     Evicted     0               17s     <none>            node-05     <none>           <none>
prometheus-adapter-844ff4584c-dzsrg      1/1     Running     0               6d1h    100.160.227.47    node-04     <none>           <none>
...
...
```

```mdx-code-block
</BrowserWindow>
```

查看详细信息

```mdx-code-block
<BrowserWindow>
```

```shell {10} showLineNumbers
root@master-03:~# kubectl describe po -n kuboard node-exporter-rg4sx

...
...

Events:
  Type     Reason     Age   From               Message
  ----     ------     ----  ----               -------
  Normal   Scheduled  43s   default-scheduler  Successfully assigned kuboard/node-exporter-rg4sx to node-05
  Warning  Evicted    44s   kubelet            The node had condition: [DiskPressure].
```

```mdx-code-block
</BrowserWindow>
```

远程到指定的节点，查看磁盘

```mdx-code-block
<BrowserWindow>
```

```shell {6,11} showLineNumbers
root@master-03:~# ssh node-05
root@node-05:~# df -lh
Filesystem                   Size  Used Avail Use% Mounted on
udev                          32G     0   32G   0% /dev
tmpfs                        6.3G  3.7M  6.3G   1% /run
/dev/mapper/node17--vg-root   28G   24G  2.7G  90% /
tmpfs                         32G     0   32G   0% /dev/shm
tmpfs                        5.0M     0  5.0M   0% /run/lock
/dev/sdb2                    471M   87M  360M  20% /boot
/dev/sdb1                    511M  5.8M  506M   2% /boot/efi
/dev/mapper/node17--vg-home  3.6T   72K  3.4T   1% /home
tmpfs                         60G  8.0K   60G   1% /var/lib/kubelet/pods/6266bed1-51ab-4a89-a540-1fb3735edb73/volumes/kubernetes.io~secret/node-certs
tmpfs                         60G  8.0K   60G   1% /var/lib/kubelet/pods/51f33968-5bdd-4b11-a34f-df044082d4aa/volumes/kubernetes.io~projected/ceph-csi-configs
tmpfs                        6.3G     0  6.3G   0% /run/user/0
...
...

```

```mdx-code-block
</BrowserWindow>
```

可以看到，根目录下空间确实不足， `/home` 下空间超大，所以我们把 `/home` 下部分空间 分给 根目录

### 解决思路

1. 备份 `/home`
2. 删除 `/home`
3. 扩展 `/root`
4. 新建 `/home`
5. 恢复 `/home`

### 详细操作过程如下

```mdx-code-block
<BrowserWindow>
```

```bash {1,3,10,29-32,35,40,45,52,55,70,73} showLineNumbers
root@node-05:~# tar cvf home.tar /home

root@node-05:~# apt-get update
Hit:1 http://mirrors.163.com/debian bullseye InRelease
Get:2 http://mirrors.163.com/debian bullseye-updates InRelease [44.1 kB]
Fetched 44.1 kB in 0s (114 kB/s)   
Reading package lists... Done

# 安装 `fuser` 命令
root@node-05:~# apt-get install psmisc
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
The following NEW packages will be installed:
  psmisc
0 upgraded, 1 newly installed, 0 to remove and 0 not upgraded.
Need to get 198 kB of archives.
After this operation, 812 kB of additional disk space will be used.
Get:1 http://mirrors.163.com/debian bullseye/main amd64 psmisc amd64 23.4-2 [198 kB]
Fetched 198 kB in 0s (708 kB/s)
Selecting previously unselected package psmisc.
(Reading database ... 34977 files and directories currently installed.)
Preparing to unpack .../psmisc_23.4-2_amd64.deb ...
Unpacking psmisc (23.4-2) ...
Setting up psmisc (23.4-2) ...
Processing triggers for man-db (2.9.4-2) ...

# 卸载 `/home` 目录
root@node-05:~# fuser -km /home/
root@node-05:~# lvextend -L +2T /dev/mapper/node17--vg-root
  Insufficient free space: 524288 extents needed, but only 0 available
root@node-05:~# umount /home

# 删除 `/home` 目录
root@node-05:~# lvremove /dev/mapper/node17--vg-home
Do you really want to remove active logical volume node17-vg/home? [y/n]: y
  Logical volume "home" successfully removed

# 扩展根目录
root@node-05:~# lvextend -L +2T /dev/mapper/node17--vg-root
  Size of logical volume node17-vg/root changed from <27.94 GiB (7152 extents) to <2.03 TiB (531440 extents).
  Logical volume node17-vg/root successfully resized.

# 重置 根目录大小
root@node-05:~# resize2fs /dev/mapper/node17--vg-root
resize2fs 1.46.2 (28-Feb-2021)
Filesystem at /dev/mapper/node17--vg-root is mounted on /; on-line resizing required
old_desc_blocks = 4, new_desc_blocks = 260
The filesystem on /dev/mapper/node17--vg-root is now 544194560 (4k) blocks long.

# 新建 `/home` 目录
root@node-05:~# lvcreate -L 1.6T -n  /dev/mapper/node17--vg-home
  Rounding up size to full physical extent 1.60 TiB
  Logical volume "home" created.
root@node-05:~# mkfs.ext4  /dev/mapper/node17--vg-home
mke2fs 1.46.2 (28-Feb-2021)
Creating filesystem with 429497344 4k blocks and 107380736 inodes
Filesystem UUID: 86d2b9b2-6bd3-4bf3-89d4-b8adbda382c4
Superblock backups stored on blocks: 
        32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632, 2654208, 
        4096000, 7962624, 11239424, 20480000, 23887872, 71663616, 78675968, 
        102400000, 214990848

Allocating group tables: done                            
Writing inode tables: done                            
Creating journal (262144 blocks): done
Writing superblocks and filesystem accounting information: done       

# 重新挂载 `/home` 目录
root@node-05:~# mount  /dev/mapper/node17--vg-home

# 恢复 `/home`
root@node-05:~# tar xvf home.tar -C /


```

```mdx-code-block
</BrowserWindow>
```

:::tip  
如果报错如下：  
lvextend command not found 
用下面命令安装下 `lvm2`
```bash
apt-get install lvm2
```  
:::


现在查看目录大小

```mdx-code-block
<BrowserWindow>
```

```shell {5,17} showLineNumbers
root@node-05:~# df -lh
Filesystem                   Size  Used Avail Use% Mounted on
udev                          32G     0   32G   0% /dev
tmpfs                        6.3G  3.7M  6.3G   1% /run
/dev/mapper/node17--vg-root  2.0T   24G  1.9T   2% /
tmpfs                         32G     0   32G   0% /dev/shm
tmpfs                        5.0M     0  5.0M   0% /run/lock
/dev/sdb2                    471M   87M  360M  20% /boot
/dev/sdb1                    511M  5.8M  506M   2% /boot/efi
overlay                      2.0T   24G  1.9T   2% /run/containerd/io.containerd.runtime.v2.task/k8s.io/d39eaef706d8a0f2374ca04ba6c60327443be63da1a5517808be7d63db52a6ab/rootfs
overlay                      2.0T   24G  1.9T   2% /run/containerd/io.containerd.runtime.v2.task/k8s.io/693bafb7d83ceddfe324d4bef33b633ed9ca253a82e0b8bfcac2c5cded5ba3ad/rootfs
overlay                      2.0T   24G  1.9T   2% /run/containerd/io.containerd.runtime.v2.task/k8s.io/e4d0d938bc975f28cb3982b9a4d44ce0d7ed2915c6d306d3cff5738f96b3b23d/rootfs
overlay                      2.0T   24G  1.9T   2% /run/containerd/io.containerd.runtime.v2.task/k8s.io/e30a7fd7779916efac0b3459af4329324c883c3707d9b2c80d57d89077d11afc/rootfs
tmpfs                         60G     0   60G   0% /var/lib/kubelet/pods/4a0ee2d6-e72d-43d4-a6d3-369291f6d557/volumes/kubernetes.io~empty-dir/keys-tmp-dir
tmpfs                         60G   12K   60G   1% /var/lib/kubelet/pods/4a0ee2d6-e72d-43d4-a6d3-369291f6d557/volumes/kubernetes.io~projected/kube-api-access-ljl4m
tmpfs                        6.3G     0  6.3G   0% /run/user/0
/dev/mapper/node17--vg-home  1.6T   72K  1.5T   1% /home
```

```mdx-code-block
</BrowserWindow>
```

最后删除 `/home` 备份文件

```mdx-code-block
<BrowserWindow>
```

```shell
root@node-05:~# rm home.tar 
```

```mdx-code-block
</BrowserWindow>
```

## ubuntu read-only file system

```mdx-code-block
<BrowserWindow>
```

```shell
fsck -f /dev/sda2
```

```mdx-code-block
</BrowserWindow>
```

