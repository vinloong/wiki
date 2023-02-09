# Git使用手册



```
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

```
git config --global user.name "Your Name"
git config --global user.email "email@example.com"
```

多个 git 账户使用不同的ssh key

在 `.ssh` 目录下增加 `config`文件

```
# Read more about SSH config files: https://linux.die.net/man/5/ssh_config
Host node37
    HostName 10.8.30.37
    User anxin
Host github.com
    Hostname ssh.github.com
    Port 443
    IdentityFile ~/.ssh/github_id_rsa
Host gitea.free-sun.vip
    Hostname gitea.free-sun.vip
    Port 2022
    IdentityFile ~/.ssh/fs_id_rsa
#    User dragon
```

## 常用命令

```shell
mkdir <仓库name> 

cd <仓库name>

git init

# 添加指定文件或文件夹到缓存区，文件需添加后缀
git add <文件或文件夹name>                   # 单个文件

git add <文件或文件夹name> <文件或文件夹name>  # 多个文件

# 或 全部文件同时添加到缓存区
git add .

# 把文件从缓存区提交至仓库
git commit -m "提交描述"

# 显示 新增/删除/被改动等 的文件
git status

# 查看版本记录
git log   # 显示版本号、提交时间等信息


# 回退到上一个版本
git reset --hard HEAD^

# 跳转到指定版本
git reset --hard <版本号前几位>

# 关联远程仓库，仓库名一般使用origin
git remote add <仓库名> <远程仓库地址>

# 示例
git remote add origin git@github.com:xxx/test.git

# 把文件推送到远程仓库
git push -u <仓库名> <分支名>


# 示例
git push -u origin master

# 查看远程仓库
git remote -v

# 删除远程仓库
git remote rm <仓库名>


# 从远程库克隆项目
git clone <仓库地址>


# 克隆指定分支
git clone -b <分支名> <仓库地址>

# 创建分支
git checkout -b <分支名>


# 查看分支
git branch

# 切换分支
git checkout <分支名>

# 合并本地的分支
git merge <分支名>

# 合并远程的分支
git merge <远程仓库名>/<分支名>

# 删除分支
git branch -d <分支名>

# 修改分支名
git branch -m <原分支名> <新分支名>
```



```shell
$ git help
使用：git [--version] [--help] [-C <path>] [-c <name>=<value>]
           [--exec-path[=<path>]] [--html-path] [--man-path] [--info-path]
           [-p | --paginate | -P | --no-pager] [--no-replace-objects] [--bare]
           [--git-dir=<path>] [--work-tree=<path>] [--namespace=<name>]
           <command> [<args>]

这些是在各种情况下使用的通用Git命令：

start a working area (参见命令: git help tutorial)
   clone      将存储库克隆到新目录中
   init       创建一个空的Git存储库或重新初始化一个现有的存储库

work on the current change (参见命令: git help everyday)
   add        将文件内容添加到索引中
   mv         移动或重命名文件、目录或符号链接
   reset      将当前磁头重置为指定状态
   rm         从工作树和索引中删除文件

examine the history and state (参见命令: git help revisions)
   bisect     使用二分查找查找引入错误的提交
   grep       打印与模式匹配的行
   log        显示提交日志
   show       显示各种类型的对象
   status     显示工作树状态

grow, mark and tweak your common history
   branch     列出、创建或删除分支
   checkout   切换分支或还原工作树文件
   commit     记录对存储库的更改
   diff       显示提交、提交和工作树等之间的更改
   merge      将两个或多个开发历史连接在一起
   rebase     在另一个基本提示之上重新应用提交
   tag        创建、列表、删除或验证用GPG签名的标记对象

collaborate (参见命令: git help workflows)
   fetch      从另一个存储库下载对象和引用
   pull       从另一个存储库或本地分支获取并与之集成
   push       更新远程引用和相关对象

'git help -a' 和 'git help -g' 列出可用的子命令和一些概念指导。
命令'git help <command>' 或 'git help <concept>' 查看特定子命令或概念.
```

