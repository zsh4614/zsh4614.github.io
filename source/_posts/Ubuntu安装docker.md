---
title: Ubuntu安装docker
notshow: false
date: 2021-11-03 17:46:14
tags:
- 基础环境
- docker
categories:
- Deploy
---

引言：本文主要介绍在ubuntu上安装docker的方法。

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

