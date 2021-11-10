---
title: Ubuntu私有仓库UI服务部署
notshow: false
date: 2021-11-04 11:25:15
tags:
- docker
categories:
- Deploy
---

<!--more-->

引言：本文主要介绍利用第三方镜像部署docker私有仓库可视化界面服务的方法。

### 方法一

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

