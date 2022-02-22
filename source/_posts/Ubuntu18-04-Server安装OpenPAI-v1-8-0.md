---
title: Ubuntu18.04 Server安装OpenPAI v1.8.0
notshow: false
date: 2021-11-04 10:25:57
tags:
- OpenPAI
categories:
- Deploy
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

#### 常见问题解答

1.中途部署出现问题，想要清空所有节点上已经部署的环境和配置文件，可以执行如下操作，修改后重新部署。

```
cd cd ~/pai-deploy/kubespray
ansible-playbook -i inventory/pai/hosts.yml reset.yml --become --become-user=root -e "@inventory/pai/openpai.yml"
```

2.注意不要在`/etc/docker/daemon.json`中写入多余的参数，否则在部署过程中可能出现冲突。



