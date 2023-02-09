---
index: false
icon: devops
title: python faq
date: 2022-03-11
category:
  - devops
tag:
  - python
---

# `ERROR: launchpadlib 1.10.13 requires testresources, which is not installed.`

```shell
sudo apt install python3-testresources
```

# 让 pip 使用国内镜像源

- 临时使用
```python
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple pyspider

```

- Linux下
  > 修改 ~/.pip/pip.conf (没有就创建一个文件夹及文件。文件夹要加“.”，表示是隐藏文件夹)

```ini
[global]
index-url = https://pypi.tuna.tsinghua.edu.cn/simple
[install]
trusted-host=mirrors.aliyun.com
```

- windows 下
  > C:\Users\{username}\pip\pip.ini



