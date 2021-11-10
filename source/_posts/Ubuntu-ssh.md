---
title: Ubuntu ssh
notshow: false
date: 2021-11-04 10:56:44
tags:
- ssh
categories:
- Deploy
---

引言：本文主要介绍Ubuntu的ssh相关服务。

<!--more-->

### 设置ssh免密登录

ssh-copy-id \<username>@<target_host_ip>

解决按照上述操作之后还不能免密登录的方法：将`/etc/ssh/sshd_config`中的`StrictModes yes`改成no。

