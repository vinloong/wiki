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
# nginx 限制IP访问


## 背景

前几天别人把非法域名解析我们IP 了，电信找我们让我们自己处理 。。。 。。。

## 限制IP访问

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

