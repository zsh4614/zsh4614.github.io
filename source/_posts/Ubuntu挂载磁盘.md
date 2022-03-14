---
title: Ubuntu挂载磁盘
notshow: false
tags:
  - 基础环境
  - 磁盘挂载
categories:
  - Deploy
abbrlink: f28f0262
date: 2021-11-03 16:28:21
---

引言：本文主要介绍ubuntu系统（包含desktop和server版本）挂载磁盘的方法，包括临时挂载和永久挂载。

<!--more-->

### 格式化磁盘

```shell
sudo mkfs -t ext4 /dev/sdb
```

-t ext4是将硬盘格式化为ext4文件系统类型。

### 临时挂载

一般情况下,我们想挂载一个分区的办法就是用mount命令,如我想把/dev/sda3挂载到/data下，使用以下命令即可：

```shell
sudo mount /dev/sda3 /data
```

但这种方法有个不好的都方是机器**重启后变又得手工重新挂载。**

### 永久挂载

永久性挂载分区的办法是修改分区文件/etc/fstab

常用磁盘命令：

```
1.查看所有的磁盘：
sudo fdisk -l
2.查看某个磁盘的UUID和类型：
sudo blkid /dev/sda3
```

`vim /etc/fstab`文件如下

```shell
UUID=cec82a6a-c594-4bbd-b07a-af079cc670f2 /sdb ext4 defaults 0 0
UUID=79abd6b3-c462-4fb3-9fc2-6b71eb0a8659 /sdc ext4 defaults 0 0
UUID=bc28f3b0-bdbd-448f-b0d0-50cc499302d1 /sdd ext4 defaults 0 0
UUID=63259855-0d99-4475-8b9d-6f19f93872b5 /sdf ext4 defaults 0 0
```

各个字段含义如下：

```Shell
UUID 	挂载点 	文件系统类型 		挂载参数 	是否备份 	是否检测
```

保存后，需要重启或者执行：

```shell
sudo mount -a
```

才能生效。