## 通用基础知识

服务器的主板是存储电子电路的电路板。服务器内的其他所有组件都连接到主板上。

在主板上有几个最主要的服务器部件：**处理器（CPU）**、**芯片组**、**硬盘驱动器控制器**、**扩展插槽**、**内存**和**端口**，以支持使用**外部设备**，如键盘。

此外，主板可能包含**网络接口**、磁盘控制器和图形适配器。



### PCI-E 总线

**PCI Express**，简称**PCI-E**，官方简称**PCIe**，是计算机总线一个重要分支，它沿用既有的PCI编程概念及信号标准，并且构建了更加高速的串行通信系统标准。目前这一标准由 `PCI-SIG` 组织制定和维护。PCIe 仅应用于内部互连。由于PCIe是基于既有的PCI系统，所以只需修改物理层而无须修改软件就可将现有PCI系统转换为PCIe。

PCIe拥有更快的速率，所以几乎取代了以往所有的内部总线（包括AGP和PCI）。现在英特尔和AMD已采用单芯片组技术，取代原有的 南桥／北桥 方案。

除此之外，PCIe设备能够支持热拔插以及热交换特性，目前支持的三种电压分别为+3.3V、3.3Vaux以及+12V。

考虑到现在显卡功耗的日益增加，PCIe而后在规范中改善了直接从插槽中取电的功率限制，×16的最大提供功率一度达到了75W，相对于AGP 8X接口有了很大的提升。

PCIe保证了兼容性，支持PCI的操作系统无需进行任何更改即可支持PCIe总线。这也给用户的升级带来方便。由此可见，PCIe最大的意义在于它的通用性，不仅可以让它用于南桥和其他设备的连接，也可以延伸到芯片组间的连接，甚至也可以用于连接图形处理器，这样，整个I/O系统重新统一起来，将更进一步简化计算机系统，增加计算机的可移植性和模块化。



| PCI-E 版本 | 工作频率 | 单通道带宽 |     ×2     |     ×4     |     ×8     |     ×16     |
| :--------: | :------: | :--------: | :--------: | :--------: | :--------: | :---------: |
|    1.0     | 2.5 GHz  |  250 MB/s  | 0.50 GB/s  |  1.0 GB/s  |  2.0 GB/s  |  4.0 GB/s   |
|    2.0     | 5.0 GHz  |  500 MB/s  |  1.0 GB/s  |  2.0 GB/s  |  4.0 GB/s  |  8.0 GB/s   |
|    3.0     | 8.0 GHz  | 984.6 MB/s | 1.97 GB/s  | 3.94 GB/s  | 7.88 GB/s  |  15.8 GB/s  |
|    4.0     | 16.0 GHz | 1969 MB/s  | 3.94 GB/s  | 7.88 GB/s  | 15.75 GB/s |  31.5 GB/s  |
|    5.0     | 32.0 GHz | 3938 MB/s  | 7.88 GB/s  | 15.75 GB/s | 31.51 GB/s |  63.0 GB/s  |
|    6.0     | 64.0 GHz | 7877 MB/s  | 15.75 GB/s | 31.51 GB/s | 63.02 GB/s | 126.03 GB/s |

PCIe总线由不同通道连接，多个通道组合可提供更高的带宽,最高可16通道：`x2`, `x4`,`x8`,`x16`



### 服务器架构的演进





### 服务器常见分类



### 常见的服务器厂商



## CPU 

### 概念



### 分类







## 内存





## 硬盘

### 硬盘和接口种类

 ![](https://raw.githubusercontent.com/vinloong/imgchr/main/notes/2023/05/26/15-24-47-1b6aba.png)

当下机械硬盘(HDD)接口：SATA 、SAS 

|      |   1.0    |   2.0    |    3.0    | SATA-E/4.0 |
| :--: | :------: | :------: | :-------: | :--------: |
| SATA | 1.5Gb/s  |  3Gb/s   |   6Gb/s   |   16Gb/s   |
| SAS  | 3.0 Gb/s | 6.0 Gb/s | 12.0 Gb/s | 24.0 Gb/s  |



当前主流的固态盘(SSD)接口：M.2、U.2、PCIe、SATA、SATA Express、SAS 等，M.2 和 U.2 可选PCIe接口。NVMe 协议是目前最高效的PCIe SSD协议标准。



 ![](https://raw.githubusercontent.com/vinloong/imgchr/main/notes/2023/05/26/15-35-07-f85173.png)



### 硬盘选择

HDD 

企业级高性能硬盘 (转速一般为 10k, 15k) ： 性能高，可靠性好

企业级存储类硬盘 (转速一般是7.2k)：容量较大

SSD 

读密集型：适合读业务较频繁的业务，通常使用的是接口是 SATA

写密集型：适合高频写的业务场景

均衡型：适合读写均衡的场景，通常使用的接口有 SAS、SATA、PCI-E 

## 网卡



## GPU & AI 



## 操作系统





## 服务器基准测试


