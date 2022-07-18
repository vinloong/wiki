# 为系统守护进程预留计算资源

Kubernetes 的节点可以按照 `Capacity` 调度。默认情况下 pod 能够使用节点全部可用容量.

这就有一个隐患，系统自己也运行了一些服务和系统守护进程，如果pod 占用过多的资源，必然会影响到这些系统进程的正常运行。

`kubelet`  公开了一个 `Node Allocatable` 的特性，可以用来为系统预留计算资源。

## 前置条件

- 一个可用的 `k8s` 集群
- worker 节点数量 >= 2
- `k8s`  版本 >= 1.8



## 节点可分配资源

 ![](https://raw.githubusercontent.com/vinloong/imgchr/main/notes/202207051435367.png)



- `Node Allocatable` 用来为 Kube 组件和 System 进程预留资源，从而保证当节点出现满负荷时也能保证 Kube 和 System 进程有足够的资源
- 目前支持`cpu`, `memory`, `ephemeral-storage`三种资源预留
- `Node Capacity` 是 Node 的所有硬件资源：
  - `kube-reserved` 是给kube组件预留的资源
  - `system-reserved` 是给System进程预留的资源
  - `eviction-threshold` 是kubelet eviction的阈值设定
  - `allocatable` 才是真正 scheduler 调度 Pod 时的参考值, 保证 Node上所有 Pods 的`request resource`不超过`Allocatable`
- `Node Allocatable Resource` = `Node Capacity` - `Kube-reserved` - `system-reserved` - `eviction-threshold`

## 配置

### 一个完整的`kubelet`配置实例

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
authentication:
  anonymous:
    enabled: false
  webhook:
    cacheTTL: 0s
    enabled: true
  x509:
    clientCAFile: /etc/kubernetes/pki/ca.crt
authorization:
  mode: Webhook
  webhook:
    cacheAuthorizedTTL: 0s
    cacheUnauthorizedTTL: 0s
cgroupDriver: systemd
clusterDNS:
- 10.96.0.10
clusterDomain: cluster.local
cpuManagerReconcilePeriod: 0s
evictionPressureTransitionPeriod: 0s
fileCheckFrequency: 0s
healthzBindAddress: 127.0.0.1
healthzPort: 10248
httpCheckFrequency: 0s
imageMinimumGCAge: 0s
kind: KubeletConfiguration
logging: {}
memorySwap: {}
nodeStatusReportFrequency: 0s
nodeStatusUpdateFrequency: 0s
resolvConf: /run/systemd/resolve/resolv.conf
rotateCertificates: true
runtimeRequestTimeout: 0s
shutdownGracePeriod: 0s
shutdownGracePeriodCriticalPods: 0s
staticPodPath: /etc/kubernetes/manifests
streamingConnectionIdleTimeout: 0s
syncFrequency: 0s
volumeStatsAggPeriod: 0s
profiles:
  - schedulerName: default-scheduler
    pluginConfig:
      - name: PodTopologySpread
        args:
          defaultConstraints:
            - maxSkew: 2
              topologyKey: kubernetes.io/hostname
              whenUnsatisfiable: ScheduleAnyway
          defaultingType: List
# cgroupsPerQOS: true
# 选项有none、pods、system-reserved和 kube-reserved，默认：["pods"]
# 这个字段只有在 `cgroupsPerQOS` 被设置为 `true` 才被支持
# 如果列表中包含`system-reserved`，则必须设置 `systemReservedCgroup`
# 如果列表中包含 `kube-reserved`，则必须设置 `kubeReservedCgroup`
enforceNodeAllocatable:
  - pods
# /sys/fs/cgroup/${cgroupDriver}  
# systemReservedCgroup: /system.slice
# kubeReservedCgroup: /kube.slice
# /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
kubeReserved:
  cpu: 1
  memory: 2Gi
  ephemeral-storage: 1Gi
systemReserved:
  cpu: 1
  memory: 2Gi
  ephemeral-storage: 1Gi
evictionHard:
  memory.available:  "1Gi"
  nodefs.available:  "10%"
#  nodefs.inodesFree: "5%"
#  imagefs.available: "15%"
```

### 主要相关配置解析

- `cgroupsPerQOS`:  默认开启， 开启后，kubelet 会将管理所有 workload Pods 的 cgroups。
- `cgroupDriver `: 是 kubelet 用来操控宿主系统上控制组（CGroup） 的驱动程序（cgroupfs 或 systemd）。 默认值：`cgroupfs`
- `enforceNodeAllocatable`:  kubelet 需要执行的各类节点可分配资源约束, 选项有`none`、`pods`、`system-reserved`和 `kube-reserved`
  - `none`: 则字段值中不可以包含其他选项
  - 包含`system-reserved`，则必须设置`systemReservedCgroup`
  - 包含`kube-reserved`，则必须设置`kubeReservedCgroup`
  - 默认值：["pods"]
- `reservedSystemCPUs`:  为宿主级系统线程和 Kubernetes 相关线程所预留的 CPU 列表
- `systemReserved`: 是一组`资源名称=资源数量`对， 用来描述为非 Kubernetes 组件预留的资源
- `kubeReserved`: `kubeReserved`是一组`资源名称=资源数量`对， 用来描述为 Kubernetes 系统组件预留的资源
- `evictionHard`: 硬性驱逐阈值

#### `systemReservedCgroup` & `kubeReservedCgroup`

> `systemReservedCgroup`:  /system-reserved.slice
>
> `kubeReservedCgroup`:  /kube-reserved.slice



> 如果有上述配置： `kubelet` **不会** 自动创建上述目录

编辑  `/etc/systemd/system/kubelet.service.d/10-kubeadm.conf` 

```ini
# Note: This dropin only works with kubeadm and kubelet v1.11+
[Service]
Environment="KUBELET_KUBECONFIG_ARGS=--bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf --kubeconfig=/etc/kubernetes/kubelet.conf"
Environment="KUBELET_CONFIG_ARGS=--config=/var/lib/kubelet/config.yaml"
# This is a file that "kubeadm init" and "kubeadm join" generates at runtime, populating the KUBELET_KUBEADM_ARGS variable dynamically
EnvironmentFile=-/var/lib/kubelet/kubeadm-flags.env
# This is a file that the user can use for overrides of the kubelet args as a last resort. Preferably, the user should use
# the .NodeRegistration.KubeletExtraArgs object in the configuration files instead. KUBELET_EXTRA_ARGS should be sourced from this file.
EnvironmentFile=-/etc/default/kubelet
ExecStartPre=mkdir -p /sys/fs/cgroup/system-reserved.slice
ExecStartPre=mkdir -p /sys/fs/cgroup/kube-reserved.slice
ExecStart=/usr/bin/kubelet $KUBELET_KUBECONFIG_ARGS $KUBELET_CONFIG_ARGS $KUBELET_KUBEADM_ARGS $KUBELET_EXTRA_ARGS

```



> inode: 储存文件元信息的区域, 中文译名为"索引节点"

## 参考

- 1. [官方文档](https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/reserve-compute-resources/)
- 2. [节点压力驱逐](https://kubernetes.io/zh-cn/docs/concepts/scheduling-eviction/node-pressure-eviction/)
- 3. [KubeletConfiguration](https://kubernetes.io/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)
- 4. [kubectl](https://kubernetes.io/zh-cn/docs/reference/command-line-tools-reference/kubelet/)







