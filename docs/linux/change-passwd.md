---
title: 忘记 Linux root 密码
date: 2020-05-26
category: 
    - linux
tag: [passwd]
---



> 使用 linux  过程中，偶尔会遇到忘记密码或者电脑被黑密码被修改了，自己无法登录系统，这时怎么办，本篇文章告诉你应该怎么做。

## 1. 重启系统

```
# 根据提示在系统启动菜单，选择系统，然后根据提示 按 `e` 修改启动参数
Use the ↑ and ↓ keys to changed the selection.
Press 'e' to edit the selected item. or 'c' for ... ...
```
<!--more-->
## 2. 修改参数

向下滚动光标，找到  `...root=/dev/Mapper/centos-root ro rd.lvm.lv=...` 主要时找 **ro**
把 ro 更改为 `rw init=/sysroot/bin/sh`
修改完成，根据提示 按 `Ctrl-x`

## 3. 修改密码

```bash
passwd root # 不只是root,任何你想修改的可登录用户名
# 下面根据系统提示输入新密码并确认密码
```

## 4. 重启系统

> 使用新创建的密码登录

