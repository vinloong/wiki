## 修改用户名



### 修改用户名

```shell

usermod -l newusername oldusername

# For example, to change the username of the user "lisi" to "zhangsan"
usermod -l zhangsan lisi



```



### 修改用户根目录

```shell
usermod -d /home/zhangsan -m zhangsan

```



### 修改用户ID

```shell

usermod -u uid username

```



### 修改用户的显示名称

```shell

# 使用 usermod 命令
# 
usermod -c "First Last" username

# For example, if you want to change the display name of the user zhangsan:
usermod -c "Zhang San" zhangsan

#
# 使用 chfn 命令
#
chfn -f "First Last" username

# For example, if you want to change the display name of the user zhangsan:
chfn -f "Zhang San" zhangsan

```



## 修改用户组

```shell
# 强行设置某个用户所在组
usermod -g 用户组 用户名

# 把某个用户改为 group(s) 
usermod -G 用户组 用户名

# 把用户添加进入某个组(s）
usermod -a -G 用户组 用户名

# 修改用户组名
groupmod -n 新组名 原组名
```



