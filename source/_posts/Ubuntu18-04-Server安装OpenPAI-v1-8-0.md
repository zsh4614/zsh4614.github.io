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

OpenPAI的部署要求您至少有2台独立的机器：一台dev-box机器、一台master机器和一台worker机器。master，worker必须为物理机器，dev-box可以是硬盘空间不少于40GB的虚拟机，毕竟他只有安装和维护系统的时候才用到，用物理机器太浪费了。

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

参考这里

2.master和所有worker进行磁盘挂载。

参考这里

3.所有worker安装nvidia显卡驱动，并设置持久模式。

参考这里

4.master和所有worker安装docker。

参考这里

5.所有worker安装nvidia-container-runtime。

参考这里

6.master开启ntp服务。

7.dev-box设置免密登录master和所有worker。

参考这里

8.master部署docker私有仓库和UI服务。

参考这里

9.master和所有worker都安装unzip

### K8s安装OpenPAI

该步骤的所有操作都在dev-box机器上。

#### 准备项目

```
git clone https://github.com/microsoft/pai.git
cd pai
git checkout v1.8.0
```

#### 准备离线相关文件

由于网络限制，部分镜像和服务需要离线下载安装。

1.下载离线文件并解压

```shell
git clone git@github.com:zsh4614/pai-offline.git
cd pai-offline
unzip pai-offline-deploy-distribute.zip
```

2.将`offline-deploy-files-distribute.yml`复制到`<pai-code-dir>/contrib/kubespray`。

```shell
cd pai-offline-deploy-distribute
cp offline-deploy-files-distribute.yml <pai-code-dir>/contrib/kubespray
```

3.将`roles/offline-deploy-files-distribute`复制到`<pai-code-dir>/contrib/kubespray/roles`。

```shell
cp -r roles/offline-deploy-files-distribute <pai-code-dir>/contrib/kubespray/roles
```

由[这一行](https://github.com/kubernetes-sigs/kubespray/blob/b0fcc1ad1d78a373a12c109491914b877fc2d56d/roles/download/defaults/main.yml#L2)可知，安装的时候下载的文件会存放在`/tmp/releases/`文件夹，故可提前下载好相关文件以避免网络问题。

由[这一行](https://github.com/kubernetes-sigs/kubespray/blob/daed3e5b6a085ac99e076b51d314fcf76e4127b4/roles/kubernetes/node/tasks/install.yml#L11)可知，如果使用了`skip_downloads: true`参数，kubeadm默认不会在master节点安装，所以手动安装kubeadm。

#### 修改安装脚本

1.在`/contrib/kubespray/quick-start-kubespray.sh`中添加如下一行，在安装过程中安装上述离线文件。

```shell
...
echo "Performing docker-cache config distribution..."
ansible-playbook -i ${HOME}/pai-deploy/cluster-cfg/hosts.yml docker-cache-config-distribute.yml -e "@${CLUSTER_CONFIG}" || exit $?

echo "Performing offline deploy file distribution..."
ansible-playbook -i ${HOME}/pai-deploy/cluster-cfg/hosts.yml offline-deploy-files-distribute.yml || exit $?

echo "Starting kubernetes..."
/bin/bash script/kubernetes-boot.sh || exit $?
```

2.将`/contrib/kubespray/docker-cache-config-distribute.yml`中的`docker_cache_host`的端口改成master节点的docker私有仓库端口。

```shell
docker_cache_host: "{{ hostvars[groups['kube-master'][0]]['ip'] }}:5000"
```

#### 编写参数文件

1.修改`/contrib/kubespray/config/config.yaml`文件

```shell
user: <your-ssh-username>
password: <your-ssh-password>
docker_image_tag: v1.8.0

enable_docker_cache: false
docker_cache_storage_backend: "filesystem"
docker_cache_fs_mount_path: "/sda/pai/registry"
enable_marketplace: "true"

docker_data_root: /sda/pai/data

openpai_kubespray_extra_var:
  download_container: false
  skip_downloads: true
```

2.修改`/contrib/kubespray/config/layout.yaml`文件

仿照官方用例即可

#### 安装K8s

```shell
cd contrib/kubespray
bash quick-start-kubespray.sh
```

#### 安装OpenPAI

```shell
bash quick-start-service.sh
```



