---
title: Ubuntu server基础环境搭建
notshow: false
tags:
  - ubuntu基础环境
categories:
  - Deploy
abbrlink: 86b50057
date: 2021-11-01 17:40:02
---

引言：本文主要介绍如何在ubuntu电脑上制作ubuntu server 18.04的启动盘，并安装系统和基础环境。

<!--more-->

### 制作ubuntu18.04 server的系统盘

首先，在[官网](https://ubuntu.com/download/server)或者[镜像网站](https://ubuntu.mirror.garr.it/ubuntu-releases/18.04.6/)下载.iso镜像，这里选择稳定版server 18.04.6。

在ubuntu系统上推荐两种方法制作系统盘，一种是ubuntu自带的Startup Disk Creator，方法比较简单，直接选择镜像文件和启动盘，一键制作即可完成。另一种是一款免费的第三方启动盘制作工具Etcher，安装和使用方法如下：

1.在[官网](https://www.balena.io/etcher/)找到下载链接，找到自己对应系统的AppImage下载；

2.unzip解压下载的zip文件；

3.运行`./xxxxx.AppImage`即可启动；

4.选择镜像，选择U盘，等待完成即可。

