## 命令

```powershell
wsl --install

# 安装特定的 Linux 发行版
wsl --install --distribution <Distribution Name>
wsl -d <Distribution Name>

# 列出可用的 Linux 发行版
wsl --list --online
wsl -l -o

# 列出已安装的 Linux 发行版
# --all（列出所有发行版）、--running（仅列出当前正在运行的发行版）或 --quiet（仅显示发行版名称)
wsl --list --verbose
wsl -l -v

# 将 WSL 版本设置为 1 或 2
wsl --set-version <distribution name> <versionNumber>

# 设置默认 WSL 版本
wsl --set-default-version <Version>

# 设置默认 Linux 发行版
wsl --set-default <Distribution Name>

# 将目录更改为主页
wsl ~

# 通过 PowerShell 或 CMD 运行特定的 Linux 发行版
wsl --distribution <Distribution Name> --user <User Name>

# 更新 WSL
wsl --update

# 检查 WSL 状态
wsl --status

# Help 命令
wsl --help

# 以特定用户的身份运行
wsl -u <Username>`, `wsl --user <Username>

# 关闭
wsl --shutdown

# Terminate
wsl --terminate <Distribution Name>

# 注销或卸载 Linux 发行版
wsl --unregister <DistributionName>
```

## 配置

### ` .wslconfig`

> - 存储在目录中 `%UserProfile%` 
> - 用于 WSL 2 版本运行的所有已安装 Linux 分发版全局配置设置

```ini
# Settings apply across all Linux distros running on WSL 2
[wsl2]

# Limits VM memory to use no more than 4 GB, this can be set as whole numbers using GB or MB
memory=4GB 

# Sets the VM to use two virtual processors
processors=2

# Specify a custom Linux kernel to use with your installed distros. The default kernel used can be found at https://github.com/microsoft/WSL2-Linux-Kernel
kernel=C:\\temp\\myCustomKernel

# Sets additional kernel parameters, in this case enabling older Linux base images such as Centos 6
kernelCommandLine = vsyscall=emulate

# Sets amount of swap storage space to 8GB, default is 25% of available RAM
swap=8GB

# Sets swapfile path location, default is %USERPROFILE%\AppData\Local\Temp\swap.vhdx
swapfile=C:\\temp\\wsl-swap.vhdx

# Disable page reporting so WSL retains all allocated memory claimed from Windows and releases none back when free
pageReporting=false

# Turn off default connection to bind WSL 2 localhost to Windows localhost
localhostforwarding=true

# Disables nested virtualization
nestedVirtualization=false

# Turns on output console showing contents of dmesg when opening a WSL 2 distro for debugging
debugConsole=true
```



### ```wsl.conf```

> - 以 `/etc` unix 文件的形式存储在分发目录中
> - 可用于版本、WSL 1 或 WSL 2 运行的分发版

```ini
# Automatically mount Windows drive when the distribution is launched
[automount]

# Set to true will automount fixed drives (C:/ or D:/) with DrvFs under the root directory set above. Set to false means drives won't be mounted automatically, but need to be mounted manually or with fstab.
enabled = true

# Sets the directory where fixed drives will be automatically mounted. This example changes the mount location, so your C-drive would be /c, rather than the default /mnt/c. 
root = /

# DrvFs-specific options can be specified.  
options = "metadata,uid=1003,gid=1003,umask=077,fmask=11,case=off"

# Sets the `/etc/fstab` file to be processed when a WSL distribution is launched.
mountFsTab = true

# Network host settings that enable the DNS server used by WSL 2. This example changes the hostname, sets generateHosts to false, preventing WSL from the default behavior of auto-generating /etc/hosts, and sets generateResolvConf to false, preventing WSL from auto-generating /etc/resolv.conf, so that you can create your own (ie. nameserver 1.1.1.1).
[network]
hostname = DemoHost
generateHosts = false
generateResolvConf = false

# Set whether WSL supports interop process like launching Windows apps and adding path variables. Setting these to false will block the launch of Windows processes and block adding $PATH environment variables.
[interop]
enabled = false
appendWindowsPath = false

# Set the user when launching a distribution with WSL.
[user]
default = DemoUser

# Set a command to run when a new WSL instance launches. This example starts the Docker container service.
[boot]
command = service docker start
```

