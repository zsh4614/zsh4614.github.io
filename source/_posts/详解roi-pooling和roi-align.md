---
title: 详解roi-pooling和roi-align
notshow: false
tags:
  - roi-pooling
  - roi-align
categories:
  - 机器学习
abbrlink: 68201bc4
date: 2021-05-12 21:12:53
---

引言：roi pooling和roi align是二阶段方法中常用的操作，本文总结二者的具体操作和不同。

<!--more-->

### 概述

这两个都是用在rpn之后的。具体来说，从feature map上经过RPN得到一系列的proposals，大概2k个，这些bbox大小不等，如何将这些bbox的特征进行统一表示就变成了一个问题。即需要找一个办法从大小不等的框中提取特征使输出结果是等长的。最开始目标检测模型Faster RCNN中用了一个简单粗暴的办法，叫ROI Pooling。该方式在语义分割这种精细程度高的任务中，不够精准，由此发展来了ROI Align。今天就总结下两者的思想。

### ROI Pooling

![v2-d59199c554ac7ccfbd2038317aef74f2_720w.jpg](https://i.loli.net/2021/04/29/NDle8s1MuZ3PLoy.jpg)

假如现在有一个8x8的feature map，现在希望得到2x2的输出，有一个bbox坐标为[0,3,7,8]。这个bbox的w=7，h=5，如果要等分成四块是做不到的，因此在ROI Pooling中会进行取整。就有了上图看到的h被分割为2,3，w被分割成3,4。这样之后在每一块(称为bin)中做max pooling，可以得到下图的结果。

![v2-7b39628bb13db683b6de701f5b4169f8_720w.jpg](https://i.loli.net/2021/04/29/4GFZSEMVO7Uq1ot.jpg)

这样就可以将任意大小bbox转成2x2表示的feature。ROI Pooling需要取整，这样的取整操作进行了两次，一次是得到bbox在feature map上的坐标时。例如：原图上的bbox大小为665x665，经backbone后，spatial scale=1/32。因此bbox也相应应该缩小为665/32=20.78，但是这并不是一个真实的pixel所在的位置，因此这一步会取为20。0.78的差距反馈到原图就是0.78x32=25个像素的差距。如果是大目标这25的差距可能看不出来，但对于小目标而言差距就比较巨大了。

![v2-6f3dc5f450e6c936869595eaf66a0f4d_720w.jpg](https://i.loli.net/2021/04/29/HoVqSw6Y1EvWysp.jpg)

### ROI Align

因此有人提出不需要进行取整操作，如果计算得到小数，也就是没有落到真实的pixel上，那么就用最近的pixel对这一点虚拟pixel进行双线性插值，得到这个“pixel”的值。具体做法如下图所示：

![v2-03d820b27ffca39854f0febf0ef9e37b_r.jpg](https://i.loli.net/2021/04/29/gQnhUMLuG3ZVr28.jpg)

1. 将bbox区域按输出要求的size进行等分，很可能等分后各顶点落不到真实的像素点上
2. 没关系，在每个bin中再取固定的4个点(作者实验后发现取4效果较好)，也就是图二右侧的蓝色点
3. 针对每一个蓝点，距离它最近的4个真实像素点的值加权(双线性插值)，求得这个蓝点的值
4. 一个bin内会算出4个新值，在这些新值中取max，作为这个bin的输出值
5. 最后就能得到2x2的输出

> 本文转载自：https://zhuanlan.zhihu.com/p/73138740