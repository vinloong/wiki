---
index: false
icon: devops
title: node faq
date: 2022-03-11
category:
  - dev&ops
tag:
  - nodejs
---



## 1. npm ERR! Unexpected token ’.’

```shell
npm install
npm ERR! Unexpected token '.'

npm ERR! A complete log of this run can be found in:
npm ERR!     C:\Users\xxx\AppData\Local\npm-cache\_logs\2022-03-28T00_39_58_215Z-debug-0.log
```

> 删除 `C:\Users\xxx\AppData\Roaming\npm-cache` 目录解决

## npm upgrade

```shell
# 运行 PowerShell as Administrator
Set-ExecutionPolicy Unrestricted -Scope CurrentUser -Force
npm install --global --production npm-windows-upgrade
npm-windows-upgrade
```