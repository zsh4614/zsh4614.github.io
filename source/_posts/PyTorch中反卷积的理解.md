---
title: PyTorch中反卷积的理解
notshow: false
tags:
  - 反卷积
  - 转置卷积
categories:
  - PyTorch
abbrlink: e994a47e
date: 2021-05-12 22:24:41
---

引言：本文主要介绍PyTorch中反卷积的参数意义

<!--more-->

### 卷积

```python
class torch.nn.Conv2d(in_channels, out_channels, kernel_size, stride=1, padding=0, groups=1, bias=True)
```

蓝色为输入，蓝色上的阴影为卷积核(kernel)，绿色为输出，蓝色边缘的白色框为padding

![20201008164239753.png](https://i.loli.net/2021/05/12/V1Z63CdmKkYBlMe.png)

### 反卷积

```python
class torch.nn.ConvTranspose2d(in_channels, out_channels, kernel_size, stride=1, padding=0, output_padding=0, bias=True)
```

卷积和反卷积函数中的in_channels与out_channels以及kernel_size的含义相同。

需要注意的是padding和stride和conv2d不同，padding不是蓝色的留白,是kernel像图像中心移动的单位。如下当padding=0时，卷积核刚好和输入边缘相交一个单位。因此pandding可以理解为卷积核向中心移动的步数。 同时stride也不再是kernel移动的步数，变为输入单元彼此散开的步数。
即：
**padding=0时，卷积核的起始位置和输入层相交一个像素，当padding=1时，卷积核的起始位置和输入层相交2个像素，依此类推；
stride=1时，输入层元素之间没有间隔，当stride=2时，输入层元素之间间隔为1，stride=3时，输入层元素之间间隔为2，以此类推。**

示意图如下图所示：

padding=0,kernel_size=3,stride=1
output_padding是对反卷积后的特征图进行边缘填补0.
output_padding=0表示不进行填补，output_padding=1表示进行填补一圈0，等于2表示进行填补2圈0.

![20201008165335118.png](https://i.loli.net/2021/05/12/uXN6tYkZJU4El7C.png)

padding=2,kernel_size=4,stride=1

![20201008165432987.png](https://i.loli.net/2021/05/12/RX34ZnjP1lpxHBk.png)

padding=2,kernel_size=3,stride=1

![20201008165450382.png](https://i.loli.net/2021/05/12/PdsEA1wf2QymZiR.png)

padding=0,kernel_size=3,stride=2

![20201008165511740.png](https://i.loli.net/2021/05/12/3xfmNu8jWM59rOS.png)

padding=1,kernel_size=3,stride=2

![20201008165531435.png](https://i.loli.net/2021/05/12/G32P46qh9LxRIan.png)