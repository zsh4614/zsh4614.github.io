---
title: Ubuntu安装docker及相关服务
notshow: false
tags:
  - 基础环境
  - docker
categories:
  - Deploy
abbrlink: 1f09c4d8
date: 2021-11-03 17:46:14
---

引言：本文主要介绍在ubuntu上安装docker，nvidia-docker，以及如何部署私有仓库以及仓库的UI服务。

<!--more-->

### docker安装

1.（可选）更换国内镜像源，推荐清华源或中科大源

```shell
sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak
sudo sed -i 's/cn.archive.ubuntu.com/mirrors.ustc.edu.cn/g' /etc/apt/sources.list
sudo apt update
```

2.安装需要的依赖包

```shell
sudo apt install apt-transport-https ca-certificates software-properties-common curl
```

3.添加GPG密钥，需指定源（采用中科大源，采用默认的源下载速度慢，经常失败）

```shell
curl -fsSL https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu $(lsb_release -cs) stable"
```

4.更新软件包

```shell
sudo apt update
```

5.安装docker-ce

```shell
sudo apt install docker-ce
```

6.测试docker安装成功

```shell
sudo docker run hello-world
```

### nvidia-container-runtime安装

docker19.03之后建议使用nvidia-container-runtime取代nvidia-docker2。

1.添加GPG密钥

```
curl -s -L https://nvidia.github.io/nvidia-container-runtime/gpgkey | sudo apt-key add -
```

2.添加源

```shell
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-container-runtime/$distribution/nvidia-container-runtime.list | sudo tee /etc/apt/sources.list.d/nvidia-container-runtime.list
```

3.更新软件包

```shell
sudo apt-get update
```

4.安装nvidia-container-runtime

```shell
sudo apt-get install nvidia-container-runtime
```

5.设置默认运行时

```shell
在/etc/docker/daemon.json中写入以下内容:
{
"default-runtime": "nvidia",
    "runtimes": {
        "nvidia": {
            "path": "/usr/bin/nvidia-container-runtime",
            "runtimeArgs": []
        }
    }
}
```

6.重启docker服务

```shell
sudo systemctl restart docker
```

7.验证安装成功（出现显卡信息）

```shell
sudo docker run --rm nvidia/cuda:10.0-base nvidia-smi
```

### 部署私有仓库

1.拉取官方镜像

```shell
sudo docker pull registry:latest
```

2.启动一个容器

```shell
sudo docker run -d -p 5000:5000 -v 挂载目录:/var/lib/registry --privileged=true --restart=always -e REGISTRY_STORAGE_DELETE_ENABLED=true --name registry registry:latest
```

**挂载目录选择一个较大的空间，用于存放仓库中的所有镜像**

**`-e REGISTRY_STORAGE_DELETE_ENABLED=true`允许删除仓库中的镜像**

3.验证服务开启成功

访问http://10.10.8.185:5000/v2会出现一个{}

4.向私有仓库上传一个镜像

```shell
sudo docker pull busybox // 从官方仓库拉取一个测试镜像
sudo docker tag busybox:latest 10.10.8.185:5000/busybox:latest //打标签
sudo docker push 10.10.8.185:5000/busybox:latest //上传到私有registry
```

5.会出现上传失败

Get https://10.10.8.185:5000/v2/: http: server gave HTTP response to HTTPS client

这是因为Docker与Docker Registry交互默认使用https，然而此处搭建的Docker Registry只提供http服务，所以当和Registry私有仓库交互时会失败，为了解决这个问题需要在启动Docker时配置Registry不安全选项。

```shell
sudo vim /etc/docker/daemon.json
{
    "insecure-registries":["10.10.8.185:5000"]
}
```

6.重启docker服务（一定别忘记）

```
sudo systemctl restart docker
```

7.再次上传成功

### 部署仓库UI服务

1.从官方仓库拉取第三方镜像

```shell
sudo docker pull joxit/docker-registry-ui:2.0
```

2.启动UI服务

```shell
sudo docker run -itd -p 60022:80 --restart=always --name=docker-registry-ui -e SINGLE_REGISTRY=true -e REGISTRY_TITLE="xxxxxxxx registry" -e SHOW_CONTENT_DIGEST=true -e DELETE_IMAGES=true -e NGINX_PROXY_PASS_URL="http://10.10.8.185:5000" joxit/docker-registry-ui:2.0
```

**注意：这些环境变量一个也不能错**

3.访问http://10.10.8.185:60022可以登录UI界面。