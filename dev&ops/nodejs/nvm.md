---
title: "使用 nvm 管理 nodejs 版本 "
linkTitle: "使用 nvm 管理 nodejs 版本 "
date: 2022-04-01
weight: 13
description: 
categories: ["dev"]
tags: ["nodejs", nvm] 
---


## 安装

```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash

wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
```

## 配置

```shell
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

### npm 配置

```shell
npm config set registry http://registry.npm.taobao.org

```


### 设置 nvm 软件源

linux:

```shell
echo "export NVM_NODEJS_ORG_MIRROR=https://npm.taobao.org/mirrors/node" >> $HOME/.profile
```


windows:

编辑 nvm 目录下 settings.txt 文件

```basic
node_mirror: https://npm.taobao.org/mirrors/node/
npm_mirror: https://npm.taobao.org/mirrors/npm/
```

```shell
 npm config set registry https://registry.npmjs.org
```


npm 使用淘宝镜像

```shell
npm config set registry https://registry.npm.taobao.org
```






