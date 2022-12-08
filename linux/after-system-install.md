



##  sudo 免密

```shell
sudo visudo

# 在文件中增加一行 ${username} ALL=(ALL) NOPASSWD : ALL
cloud   ALL=(ALL) NOPASSWD : ALL
```



## ssh 免密

```shell
mkdir -p .ssh
touch .ssh/authorized_keys
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

sudo sed -i "s/cn.archive.ubuntu.com/mirrors.ustc.edu.cn/g" /etc/apt/sources.list
sudo sed -i "s/cn.security.ubuntu.com/mirrors.ustc.edu.cn/g" /etc/apt/sources.list
```



## 修改时区和设置时间同步

```bash
timedatectl list-timezones

timedatectl set-timezone Asia/Shanghai


apt-get purge systemd-timesyncd -y

apt-get install chrony -y

vi /etc/chrony/chrony.conf

#pool ntp.ubuntu.com        iburst maxsources 4
#pool 0.ubuntu.pool.ntp.org iburst maxsources 1
#pool 1.ubuntu.pool.ntp.org iburst maxsources 1
#pool 2.ubuntu.pool.ntp.org iburst maxsources 2

pool ntp.ntsc.ac.cn        iburst maxsources 4
pool cn.ntp.org.cn         iburst maxsources 1
pool time.pool.aliyun.com  iburst maxsources 1
pool cn.pool.ntp.org       iburst maxsources 2
pool ntp.ubuntu.com        iburst maxsources 2


systemctl restart chrony

```





## 静态IP

> 略

## 关闭防火墙

```shell
sudo systemctl stop ufw

sudo ufw disable

sudo systemctl disable ufw

sudo apt-get purge ufw

```

## 禁用 swap

```shell
sudo swapoff -a

sudo vi /etc/fstab
# 注释 swap 那一行
```

## 转发 IPv4 

```shell
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter

# 设置所需的 sysctl 参数，参数在重新启动后保持不变
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF

# 应用 sysctl 参数而不重新启动
sudo sysctl --system

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
sudo apt-get update && sudo apt-get install -y apt-transport-https

curl https://mirrors.aliyun.com/kubernetes/apt/doc/apt-key.gpg | sudo apt-key add - 

cat <<EOF | sudo tee /etc/apt/sources.list.d/kubernetes.list
deb https://mirrors.aliyun.com/kubernetes/apt/ kubernetes-xenial main
EOF


sudo apt-get update

# 安装最新版本
sudo apt-get install -y kubelet kubeadm kubectl

# 安装指定版本
version=1.18.20-00
sudo apt-get install -y kubelet=$version kubeadm=$version kubectl=$version

sudo apt-mark hold kubelet kubeadm kubectl

```

