---
title: Ubuntu安装nvidia显卡驱动
notshow: false
tags:
  - 基础环境
  - 显卡驱动
categories:
  - Deploy
abbrlink: e65aa483
date: 2021-11-03 17:34:19
---

引言：本文主要介绍在ubuntu系统上安装nvidia显卡驱动的方法，并优化驱动。

<!--more-->

### 安装显卡驱动

#### 方法一：ppa源

1.安装PPA源，根据提示按Enter执行安装

```shell
sudo add-apt-repository ppa:graphics-drivers/ppa
```

2.更新源

```shell
sudo apt-get update 
```

3.安装显卡驱动工具

```shell
sudo apt install ubuntu-drivers-common
```

4.查看可以安装的显卡驱动

```shell
ubuntu-drivers devices 
```

5.选择推荐的驱动进行安装

```shell
sudo apt-get install nvidia-driver-470
```

6.重启生效

```shell
sudo reboot
```

### 开启持久模式

`-pm --persistence-mode`

启用持久性模式后，即使没有活动的客户端 (such as X11 or nvidia-smi)，NVIDIA 驱动程序也会保持加载状态。这样可以最大程度地减少与运行依赖的应用程序 (例如 CUDA 程序) 相关的驱动程序加载延迟。适用于所有支持 CUDA 的产品。**persistence mode 持久模式默认关闭。persistence mode 能够让 GPU 更快响应任务，待机功耗增加。关闭 persistence mode 同样能够启动任务。开机默认为关闭。**开启后可解决GPU初始化缓慢、无任务运行但是利用率居高不下、偶尔丢卡等问题。（不担心功耗的情况下尽量开启）

在**18.04**上设置开机默认开启的方法：

1.`/lib/systemd/system/rc-local.service`文件新增以下内容：

```shell
[Install]
WantedBy=multi-user.target
Alias=rc-local.service
```

2.设置rc-local开机自启：

```shell
sudo systemctl enable rc-local
```

3.在`/etc/rc.local`中填入以下内容：

```shell
#!/bin/bash
nvidia-smi -pm 1
exit 0
```

4.赋予可执行权限：

```shell
sudo chmod +x /etc/rc.local
```

5.测试是否成功：

```
重启之后nvidia-smi看Persistence-M的状态为On，则配置成功。
```

