---
title: Hexo在多台电脑上维护github个人主页
notshow: false
tags:
  - 个人主页
categories:
  - Deploy
abbrlink: 38e1bb3a
date: 2021-10-30 15:27:04
---

引言：本文主要介绍如何在两台（多台）电脑上维护自己的github pages博客。

<!--more-->

### 介绍

总体方法是利用git分支实现。hexo生成的静态博客文件默认放在master分支上，可以新建一个分支用来存放源文件，在其他电脑上只需要git clone这个分支即可进行更新和发布等操作。

### 环境

在操作之前，先在新电脑上安装好hexo需要的环境：

**安装npm和node.js:**

到[官网](https://nodejs.org/dist/latest/)下载最新的压缩包，解压后在bin目录下有npm和node的可执行文件，但是安装路径没有在系统环境变量中，所以添加到系统环境中，有多种方法，这里我进行了软链接：

```shell
sudo ln -s ~/software/node-v17.0.1-linux-x64/bin/node /usr/local/bin/node
sudo ln -s ~/software/node-v17.0.1-linux-x64/bin/npm /usr/local/bin/npm
```

**安装hexo：**

直接使用npm安装：

```shell
npm install -g hexo-cli
```

同样需要加到系统环境中：

```shell
sudo ln -s ~/software/node-v17.0.1-linux-x64/lib/node_modules/hexo-cli/bin/hexo /usr/local/bin/hexo
```

### 步骤

1.给github博客仓库新建一个hexo分支，设置为默认分支。

2.将当前电脑的ssh key添加到github上。

3.执行git clone命令将hexo克隆到本地，将除了.git的文件全部删除，然后add-commit-push更新到远程。

4.将原来博客根目录下（即包含themes、source等文件夹的那个目录）所有文件拷贝到本地hexo分支文件夹。

5.删除themes文件夹每个主题的.git文件夹和.gitignore文件。

6.执行add-commit-push更新到远程。

7.之后在任何配置好博客环境的电脑上都采用如下操作维护博客：

```
pull-add-commit-push
hexo clean
hexo g
hexo d
```



