



##  sudo 免密

```shell
sudo visudo

# 在文件中增加一行 ${username} ALL=(ALL) NOPASSWD : ALL
cloud   ALL=(ALL) NOPASSWD : ALL
```



## ssh 免密

```shell
mkdir -p .ssh
vi .ssh/authorized_keys 
# add m1 m2 m3 id_rsa.pub
```



```shell
修改 /etc/ssh/sshd_config:
AuthorizedKeysFile      %h/.ssh/authorized_keys %h/.ssh/authorized_keys2 (公钥文件路径)
PasswordAuthentication no

```



## 修改镜像源

```shell
cp /etc/apt/sources.list /etc/apt/sources.list.bak

sudo sed -i "s/*archive.ubuntu.com/mirrors.ustc.edu.cn/g" /etc/apt/sources.list
sudo sed -i "s/*security.ubuntu.com/mirrors.ustc.edu.cn/g" /etc/apt/sources.list
```



## 静态IP

> 略

## 关闭防火墙

```shell
sudo systemctl stop ufw

sudo ufw disable

sudo systemctl disable ufw

```

## 禁用 swap

```shell
sudo swapoff -a

sudo vi /etc/fstab
# 注释 swap 那一行
```



## install containerd

```shell
# wget https://gh.api.99988866.xyz/https://github.com/containerd/nerdctl/releases/download/v1.0.0/nerdctl-full-1.0.0-linux-amd64.tar.gz
wget https://github.91chi.fun/https://github.com/containerd/nerdctl/releases/download/v1.0.0/nerdctl-full-1.0.0-linux-amd64.tar.gz

sudo tar Cxzvvf /usr/local nerdctl-full-1.0.0-linux-amd64.tar.gz

sudo systemctl enable --now containerd
```



## install kubeadm kubelet kubectl

```shell
apt-get update && apt-get install -y apt-transport-https

curl https://mirrors.aliyun.com/kubernetes/apt/doc/apt-key.gpg | apt-key add - 

cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
deb https://mirrors.aliyun.com/kubernetes/apt/ kubernetes-xenial main
EOF


apt-get update

# 安装最新版本
apt-get install -y kubelet kubeadm kubectl

# 安装指定版本
version=1.18.20-00
apt-get install -y kubelet=$version kubeadm=$version kubectl=$version
```

