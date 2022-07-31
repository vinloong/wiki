---
title : "快速入门"
lead: ""
date: 
lastmod: 
draft: false
images: []
weight: 10
toc: true
---



# 前置条件

- 一个可用的kubernetes 集群



# 安装

## 二进制安装



1. 到[helm release 页面](https://github.com/helm/helm/releases)下载需要的版本, 这里使用 [3.8.1版本](https://get.helm.sh/helm-v3.8.1-linux-amd64.tar.gz)

   ```shell
   wget https://get.helm.sh/helm-v3.8.1-linux-amd64.tar.gz
   ```

   

2. 解压

   ```shell
   tar -zxvf helm-v3.8.1-linux-amd64.tar.gz
   ```

   

3.  然后 在 解压的目录中找到 `helm` 程序，移动到`/usr/local/bin/`目录中

   ```shell
   mv linux-amd64/helm /usr/local/bin/helm
   ```

   

## 使用脚本安装

获取安装脚本,并执行

```shell
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
chmod +x get-helm.sh
./get-helm.sh
```

## 通过包管理器安装

### 使用Apt

```shell
curl https://baltocdn.com/helm/signing.asc | sudo apt-key add -
sudo apt-get install apt-transport-https --yes
echo "deb https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

### 使用 Snap

```shell
sudo snap install helm --classic
```

# 使用

