---
index: false
icon: devops
title: nginx 限制IP访问
date: 2022-04-01
category:
  - devops
tag:
  - nginx
---

## 背景

前几天被通知说我们的服务器有个域名没有备案被电信多次通告。。。，电信找我们让我们自己处理 。。。 。。。，
不然就把我们ip端口给封了，关键是这个域名TMD不是我们的啊

**域名恶意解析**: 外部未知的域名持有者，将域名解析到非其所持有的服务器公网IP上，间接或直接造成损害他人利益的行为。

域名的恶意解析，可以用于借刀杀人。
这个手段很骚，轻则可以将对手的SEO排名拉低，重则可以让工信部封杀其站点。


### 具体实现条件如下：

- 未备案的域名或已被接入工信部黑名单的域名
- 获取要攻击的站点，其源服务器使用的公网IP
- 确认要攻击的网站80端口和443端口可以直接用IP直接访问
- 将黑域名解析到该公网IP


## 解决方案

> 拒绝无效域名的HTTP请求

 `defalult server` 做如下配置：

```properties

server{
    listen 80 default_server;
    listen 443 ssl default_server;
#    listen 443 ssl http2 default_server;
#    listen [::]:80 default_server;
#    listen [::]:443 ssl http2 default_server;

    server_name _;

    ssl_certificate   /etc/nginx/certs/root.pem;
    ssl_certificate_key  /etc/nginx/certs/root.key;

    access_log off;

    return 444;
}

```


经过上面配置，在使用IP就无法访问80和443端口了。

