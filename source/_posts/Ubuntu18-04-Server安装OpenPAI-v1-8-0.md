---
title: Ubuntu18.04 Server安装OpenPAI v1.8.0
notshow: false
tags:
  - OpenPAI
categories:
  - Deploy
abbrlink: 66d9ef5
date: 2021-11-04 10:25:57
---

引言：本文主要介绍如何在Ubuntu18.04上安装OpenPAI v1.8.0。

<!--more-->

### 环境要求

OpenPAI的部署要求您至少有2台独立的机器：一台dev-box机器、一台master机器和一台worker机器。master，worker必须为物理机器，dev-box可以是硬盘空间不少于40GB的虚拟机（但是不能是docker容器，资源充足的情况下，最好使用独立的物理机器），~~毕竟他只有安装和维护系统的时候才用到，用物理机器太浪费了~~。

#### 硬件要求

**master：**

- 至少40GB内存。
- 必须有**固定的局域网 IP 地址（LAN IP address）**，且可以和其他所有机器通信。
- 可以访问Internet。尤其是可以访问Docker Hub。部署过程会从Docker Hub拉取Docker镜像。

**worker：**

- 至少16GB内存。
- 必须有**固定的局域网 IP 地址（LAN IP address）**，且可以和其他所有机器通信。
- 可以访问Internet。尤其是可以访问Docker Hub。部署过程会从Docker Hub拉取Docker镜像。
- 必须有Nvidia的gpu。

#### 软件要求

**master：**

- Ubuntu 18.04 (16.04、20.04应该可用)
- SSH服务已开启。
- 和所有worker机器有同样的SSH用户名和密码，且该SSH用户有sudo权限。
- Docker已被正确安装。
- NTP已被成功开启。 您可以用命令`apt install ntp`来检查。
- 它是OpenPAI的专用服务器。OpenPAI管理它的所有资源（如CPU、内存、GPU等）。如果有其他工作负载，则可能由于资源不足而导致未知问题。

**worker：**

- Ubuntu 16.04 (18.04、20.04应该可用，但没有经过完整测试)
- SSH服务已开启。
- 所有master和worker机器有同样的SSH用户名和密码，且该SSH用户有sudo权限。
- Docker已被正确安装。
- 它是OpenPAI的专用服务器。OpenPAI管理它的所有资源（如CPU、内存、GPU等）。如果有其他工作负载，则可能由于资源不足而导致未知问题。

- nvidia驱动已被正确安装
- nvidia-container-runtime已被正确安装，并且被设置为Docker的默认runtime。

### 依赖安装

1.master和所有worker安装Ubuntu18.04系统。

[参考这里](http://zsh4614.cn/Ubuntu%E5%9F%BA%E7%A1%80%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA/)

2.master和所有worker进行磁盘挂载。

[参考这里](http://zsh4614.cn/Ubuntu%E6%8C%82%E8%BD%BD%E7%A3%81%E7%9B%98/)

3.所有worker安装nvidia显卡驱动，并设置持久模式。

[参考这里](http://zsh4614.cn/Ubuntu%E5%AE%89%E8%A3%85nvidia%E6%98%BE%E5%8D%A1%E9%A9%B1%E5%8A%A8/)

4.master和所有worker安装docker。

[参考这里](http://zsh4614.cn/Ubuntu%E5%AE%89%E8%A3%85docker/#docker%E5%AE%89%E8%A3%85)

5.所有worker安装nvidia-container-runtime。

[参考这里](http://zsh4614.cn/Ubuntu%E5%AE%89%E8%A3%85docker/#nvidia-container-runtime%E5%AE%89%E8%A3%85)

6.master安装ntp。

7.dev-box设置免密登录master和所有worker。

[参考这里](http://zsh4614.cn/Ubuntu-ssh/)

8.master部署docker私有仓库。

[参考这里](http://zsh4614.cn/Ubuntu%E5%AE%89%E8%A3%85docker/#%E9%83%A8%E7%BD%B2%E7%A7%81%E6%9C%89%E4%BB%93%E5%BA%93)

9.master部署私有仓库的UI服务。

[参考这里](http://zsh4614.cn/Ubuntu%E5%AE%89%E8%A3%85docker/#%E9%83%A8%E7%BD%B2%E4%BB%93%E5%BA%93UI%E6%9C%8D%E5%8A%A1)

9.master和所有worker都安装unzip

### K8s安装OpenPAI

**该步骤的所有操作都在dev-box机器上进行。**

#### 准备项目

```
git clone https://github.com/microsoft/pai.git
cd pai
git checkout v1.8.0
```

#### 部署提供国外镜像的容器服务

由于GFW的存在，k8s部署过程中需要下载的部分国外镜像在下载时会出现网络问题，所以对于国内用户很不友好，也有许多人针对中国用户提供了不同的解决方案，这里采用一种我在部署过程中成功部署的方案，由[siaimes](https://blog.siaimes.me/)提供：

1.下载提供国外镜像的容器镜像。

```
sudo docker pull siaimes/k8s-share:v1.8.0
```

2.启动容器服务，假设dev-box的ip为10.10.10.10。

```
sudo docker run -itd -p 0.0.0.0:10000:80 --restart always --name k8s_share siaimes/k8s-share:v1.8.0
```

3.修改`/contrib/kubespray/config/config.yaml`文件。

```yaml
user: username
password: password
docker_image_tag: v1.8.0

openpai_kubespray_extra_var:
  kube_image_repo: "siaimes"
  gcr_image_repo: "siaimes"
  pod_infra_image_repo: "siaimes/pause-{{ image_arch }}"
  dnsautoscaler_image_repo: "siaimes/cluster-proportional-autoscaler-{{ image_arch }}"
  kubeadm_download_url: "http://10.10.10.10:10000/k8s-share/kubernetes-release/release/{{ kubeadm_version }}/bin/linux/{{ image_arch }}/kubeadm"
  hyperkube_download_url: "http://10.10.10.10:10000/k8s-share/kubernetes-release/release/{{ kube_version }}/bin/linux/{{ image_arch }}/hyperkube"
  cni_download_url: "http://10.10.10.10:10000/k8s-share/containernetworking/plugins/releases/download/{{ cni_version }}/cni-plugins-linux-{{ image_arch }}-{{ cni_version }}.tgz"
  calicoctl_download_url: "http://10.10.10.10:10000/k8s-share/projectcalico/calicoctl/releases/download/{{ calico_ctl_version }}/calicoctl-linux-{{ image_arch }}"
```

#### 修改安装脚本

1.将`/contrib/kubespray/docker-cache-config-distribute.yml`中的`docker_cache_host`的端口改成master节点的docker私有仓库端口。

```shell
docker_cache_host: "{{ hostvars[groups['kube-master'][0]]['ip'] }}:[master私有仓库端口]"
```

2.修改device-plugin service配置文件`src/device-plugin/deploy/start.sh.template`，否则这个服务启动很慢或者超时。

将

```
svn cat https://github.com/NVIDIA/k8s-device-plugin.git/tags/1.0.0-beta4/nvidia-device-plugin.yml \
```

修改为

```
curl "http://10.10.10.10:10000/k8s-share/NVIDIA/k8s-device-plugin/1.0.0-beta4/nvidia-device-plugin.yml" \
```

#### 编写参数文件

1.修改`/contrib/kubespray/config/config.yaml`文件如上

2.修改`/contrib/kubespray/config/layout.yaml`文件，仿照官方用例即可

#### 安装K8s

```shell
cd contrib/kubespray
bash quick-start-kubespray.sh
```

#### 安装OpenPAI

执行如下命令：

```shell
bash quick-start-service.sh
```

有些服务的启动过程时间特别长，请耐心等待。

#### 备份集群配置文件

部署完成后会在dev-box机器上自动生成集群配置文件，烈建议保留dev-box机器上的文件夹`~/pai-deploy`并进行备份，`~/pai deploy/kube/config`是K8s配置文件，`kubectl`使用它连接到k8s api服务器；而`~/pai-deploy/cluster-cfg`是一个包含所有机器信息、OpenPAI服务配置的文件夹，是管理服务的配置文件。有了`~/pai-deploy`文件夹，就可以在任何装有docker的机器上管理集群。

#### 常见问题解答

1.中途部署出现问题，想要清空所有节点上已经部署的环境和配置文件，可以执行如下操作，修改后重新部署。

```
cd cd ~/pai-deploy/kubespray
ansible-playbook -i inventory/pai/hosts.yml reset.yml --become --become-user=root -e "@inventory/pai/openpai.yml"
```

2.注意不要在`/etc/docker/daemon.json`中写入多余的参数，否则在部署过程中可能出现冲突。

3.服务器重启掉驱动。这是由于安装显卡驱动时的内核版本与当前的内核版本不一致造成的，可以用dkms（Dynamic Kernel Module Support）来安装适配当前内核的驱动相关模块。

```
sudo apt install dkms
sudo dkms install -m nvidia -v 418.87.00
```

注：输入whereis nvidia可以发现在/usr/src下有一个显卡驱动版本。

### 服务管理

1.所有的服务管理都尽量在容器中进行，避免环境冲突。

2.使用官方镜像启动一个dev-box容器（可以在dev-box机器上，也可以在master机器上，或者任意一台可以与集群通信的机器上），并将dev-box机器上备份的k8s的配置文件和服务配置文件（在安装时已经自动生成到~/pai-deploy路径下）挂载到容器中，另外，dev-box的部署代码也挂载到容器中，不要使用官方镜像自带的代码！

```
sudo docker run -itd \
        -e COLUMNS=$COLUMNS -e LINES=$LINES -e TERM=$TERM \
        -v /var/run/docker.sock:/var/run/docker.sock \
        -v ~/pai-deploy/cluster-cfg:/cluster-configuration  \
        -v ~/pai-deploy/kube:/root/.kube \
        -v 部署pai的代码:/mnt/pai \
        --pid=host \
        --privileged=true \
        --net=host \
        --name=dev-box \            
        openpai/dev-box:v1.8.0  
```

3.进入容器的/mnt/pai下，不要使用镜像自带的pai代码。

```
sudo docker exec -it dev-box bash
cd /mnt/pai
```

4.如果要更改某些服务的配置，请按照`服务停止`、`上传配置`、`服务启动`的步骤进行，比如要自定义Webportal，则应修改`services-configuration.yaml`中的`webportal`部分。 然后使用以下命令来上传配置并重新启动`Webportal`：

```
./paictl.py service stop -n webportal
./paictl.py config push -p /cluster-configuration -m service
./paictl.py service start -n webportal
```

5.也可以重启所有服务：

```
./paictl.py service stop
./paictl.py service start
```

### 存储设置

#### 集群添加存储

1.openpai v1.8.0采用pv和pvc的方式持久化存储，一种比较常用的方式是nfs pv，所以要先有一台nfs服务器，或者openpai提供了storage-manager服务，可以将集群中的任意一台worker节点当做nfs服务器。首先，要在每个节点上都安装`nfs-common`软件包。

```shell
sudo apt install nfs-common
```

2.所有存储设置都在dev-box容器中进行，避免环境冲突

3.获取当前集群id和配置

```shell
cd /mnt/pai
./paictl.py config get-id
./paictl.py config pull -o /cluster-configuration
```

4.选择集群中的一台机器作为存储服务器（必须是worker机器），打开`/cluster-configuration/layout.yaml`,选择一个worker机器，在其中添加一个`pai-storage: "true"`字段，如果想要初始化多台nfs服务器，可以在每个worker节点下添加该字段，如下：

```shell
......
- hostname: worker1
  nodename: worker1
  hostip: xx.xx.xx.xx
  machine-type: GENERIC-WORKER
  pai-worker: "true"
  pai-storage: "true"  # this line is newly added
......
```

5.在`/cluster-configuration/services-configuration.yaml`中找到`storage-manager`部分，取消注释

```shell
storage-manager:
  localpath: /share
#   security-type: AUTO
#   workgroup: WORKGROUP
#   smbuser: smbuser
#   smbpwd: smbpwd
```

`localpath`表示NFS存储服务器上要共享的目录的绝对路径，应该是一个较大的挂载物理盘

6.重新启动`cluster-configuration`和`storage-manager`服务，这样worker1就成为了一个nfs服务器。

```shell
./paictl.py service stop -n cluster-configuration storage-manager
./paictl.py config push -p /cluster-configuration -m service
./paictl.py service start -n cluster-configuration storage-manager
```

7.为存储创建PV和PVC，首先在dev-box容器中创建以下`nfs-storage.yaml`文件，然后运行`kubectl create -f nfs-storage.yaml`创建PV和PVC。

```yaml
# NFS Persistent Volume
apiVersion: v1
kind: PersistentVolume
metadata:
  name: nfs-storage-pv   ### 自定义
  labels:
    name: nfs-storage    ### 固定
spec:
  capacity:
    storage: 10000Gi
  volumeMode: Filesystem
  accessModes:
    - ReadWriteMany
  persistentVolumeReclaimPolicy: Retain
  mountOptions:
    - nfsvers=4.1
  nfs:
    path: /data         ### 自定义，将会在把/share/data目录创建为pv
    server: xx.xx.xx.xx   ### 自定义，nfs服务器ip
    readOnly: true        ### true为只读存储，即在集群中只读。
---
# NFS Persistent Volume Claim
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: nfs-storage    ### 自定义
# labels:
#   share: "false"
spec:
  accessModes:
    - ReadWriteMany
  volumeMode: Filesystem
  resources:
    requests:
      storage: 10000Gi
  selector:
    matchLabels:
      name: nfs-storage    ### 固定
```

8.将存储授权给用户组，使PV在openpai中可用。首先到个人资料界面复制一个token，在OpenPAI中，存储的访问权限是绑定到用户组的，所以将存储分配给用户组，例如如果要将`nfs-storage` PVC分配给`default`组，应执行以下命令获取Group name

```json
curl -X GET http://[master-ip]/rest-server/api/v2/groups/default -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InpoYWlzaGFvaHVhIiwiYXBwbGljYXRpb24iOmZhbHNlLCJqb2JTcGVjaWZpYyI6ZmFsc2UsImVuY29kZWRGcmFtZXdvcmtOYW1lIjoiIiwiaWF0IjoxNjI3OTA2NTk0LCJleHAiOjE2Mjg1MTEzOTR9.ZaqiJKytGR8jIhtT8Wf0oY07T7EQ3V5r3Wqi0mbVL3w"
```

将返回

```json
{
  "groupname": "default",
  "description": "group for default vc",
  "externalName": "",
  "extension": {
    "acls": {
      "storageConfigs": [],
      "admin": false,
      "virtualClusters": ["default"]
    }
  }
}
```

请求添加，使用Header `Authorization：Bearer <token>`进行授权

```json
curl -X PUT http://[master-ip]/rest-server/api/v2/groups -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InpoYWlzaGFvaHVhIiwiYXBwbGljYXRpb24iOmZhbHNlLCJqb2JTcGVjaWZpYyI6ZmFsc2UsImVuY29kZWRGcmFtZXdvcmtOYW1lIjoiIiwiaWF0IjoxNjI3OTA2NTk0LCJleHAiOjE2Mjg1MTEzOTR9.ZaqiJKytGR8jIhtT8Wf0oY07T7EQ3V5r3Wqi0mbVL3w" -H "content-type: application/json" -d '{"data": {"groupname": "default","extension": {"acls": {"storageConfigs": ["nfs-storage-1", "nfs-storage-2"], "admin": false, "virtualClusters": ["default"]}}},"patch": true}'
```

注意必须加上`-H "content-type: application/json"`，否则解析错误

9.这样，default用户组就可以在创建任务时使用nfs-storage存储。

#### 本地管理存储
本地挂载nfs服务器进行数据管理。由于在集群中存储是只读的，在本地挂在nfs服务器进行数据上传和修改等写操作更加安全

```shell
sudo apt-get update && sudo apt-get install -y nfs-common
sudo mkdir -p /mnt/nfsData
sudo mount xx.xx.xx.xx:/data /mnt/nfsData
cp -r <local_data_dir> /mnt/nfsData/<subPath>
```

#### 重新生成存储

有时需要删除pv/pvc或修改pv/pvc的属性，操作如下：

1.删除k8s中的记录

```shell
kubectl patch pvc nfs-storage-xx -p '{"metadata":{"finalizers":null}}'
kubectl patch pv nfs-storage-pv-xx -p '{"metadata":{"finalizers":null}}'
```

2.使用文件删除（也可kubectl delete pv xxx && kubectl delete pvc xxx）

```shell
kubectl delete -f nfs-storage-xx.yaml
```

不执行1的话直接删除会一直停留在terminating状态,且删除不掉

3.重新生成pv和pvc

```shell
kubectl create -f nfs-storage-xx.yaml
```

4.可以通过如下命令查看集群中所有pv和pvc的属性

```shell
kubectl get pv
kubectl get pvc
```

