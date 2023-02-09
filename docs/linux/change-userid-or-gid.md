---
index: false
icon: linux
title: change-userid-or-gid
date: 2022-04-18
category:
  - linux
tag:
  - usermod
---
# 修改用户ID和用户组ID

假定原用户和用户组id如下：
```
用户 someone 500
组   someone 500
```
要修改成用户和组id如下：
```
用户 someone 1001
组   someone 1001
```
修改用户ID
```shell
usermod -u 1001 someone
```
修改组ID
```shell
groupmod -g 1001 someone
```
修改文件权限
```shell
find / -user 500 -exec chown -h someone {} \;
find / -group 500 -exec chgrp -h someone {} \;
```

设置新增用户 `sudo` 权限
```bash
usermod -aG sudo username

一种是修改/etc/sudoers文件，增加一行
username ALL=(ALL) ALL

一种是修改/etc/passwd 找到自己的用户一行吧里面的用户id改成0
```

