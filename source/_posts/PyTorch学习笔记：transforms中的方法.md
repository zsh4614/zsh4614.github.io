---
title: PyTorch学习笔记：transforms中的方法
tags:
  - torchvision.transforms
  - 图像预处理函数
categories:
  - PyTorch
abbrlink: 7f4fd48b
date: 2021-04-19 00:04:56
---

引言 ：torchvision.transforms是pytorch中的图像预处理包，包含了很多种对图像数据进行变换的函数，这些都是在我们进行图像数据读入步骤中必不可少的。

<!--more-->

### 1.综述

transforms中的方法可以归纳为四大类：

- 裁剪：

  中心裁剪：`transforms.CenterCrop`
  随机裁剪：`transforms.RandomCrop`
  随机长宽比裁剪：`transforms.RandomResizedCrop`
  上下左右中心裁剪：`transforms.FiveCrop`
  上下左右中心裁剪后翻转：`transforms.TenCrop`

- 翻转和旋转：

  依概率p水平翻转：`transforms.RandomHorizontalFlip`
  依概率p垂直翻转：`transforms.RandomVerticalFlip`
  随机翻转：`transforms.RandomRotation`

- 图像变换：

  resize：`transforms.Resize`
  标准化：`transforms.Normalize`
  转tensor并归一化：`transforms.ToTensor`
  填充：`transforms.Pad`
  修改亮度、对比度、饱和度：`transforms.ColorTitter`
  转灰度图：`transforms.Grayscale`
  线性变换：`transforms.LinearTransformation`
  仿射变换：`transforms.RandomAffine`
  依概率p转为灰度图：`transforms.RandomGrayscale`
  将数据转换为PILImage：`transforms.ToPILImage`
  依自定义的lambda函数变换：`transforms.Lambda`

- 对transforms操作，使数据增强更灵活：

  选择一个transforms进行操作：`transforms.RandomChoice(transforms)`
  给一个transforms加上概率，依概率进行操作：`transforms.RandomApply(transforms,p=0.5)`
  将transforms中的操作随机打乱：`transforms.RandomOrder`

### 2.裁剪

**1.中心裁剪**

```python
torchvision.transforms.CenterCrop(size) 
```

`size`：为sequence或者int，若为sequence，则为(h，w)，若为int，则进行正方形裁剪

**2.随机裁剪**

```python
torchvision.transforms.RandomCrop(size，padding = None，pad_if_needed = False，fill = 0，padding_mode ='constant')
```

`size`：为sequence或者int，若为sequence，则为(h，w)，若为int，则进行正方形裁剪

`padding`：为sequence或者int，可选的，图像每个边上的填充，默认为None，即不填充。如果提供长度为4的序列，则它用于分别填充左，上，右，下边界。如果提供长度为2的序列，则分别用于填充左/右，上/下边界

`pad_if_needed`：bool类型，如果小于所需大小，它将填充图像以避免引发异常

`fill`：恒定填充的像素填充值。默认值为0.如果长度为3的元组，则分别用于填充R，G，B通道。仅当padding_mode为constant时才使用此值

`padding_mode`：填充类型，可选：constant，edge，reflect，symmetric。constant是填充指定像素值，edge是填充边缘像素值，reflect是反射填充，比如用2个元素填充[1,2,3,4]为[3,2,1,2,3,4,3,2]，symmetric是对称填充，比如用2个像素填充[1,2,3,4]为[2,1,1,2,3,4,4,3]

**3.随机长宽比裁剪**

```python
torchvision.transforms.RandomResizedCrop(size, scale=(0.08, 1.0), ratio=(0.75, 1.3333333333333333), interpolation=2)
```

将给定的PIL图像随机大小和宽高比裁剪，最后resize到指定大小

`size`：输出大小

`scale`：裁剪的原始尺寸的大小范围

`ratio`：裁剪的原始宽高比的宽高比范围

`interpolation`：resize的插值方式，默认为BILINEAR

**4.上下左右中心裁剪**

```python
torchvision.transforms.FiveCrop(size)
```

对图片进行上下左右以及中心裁剪，获得5张图片，返回一个4D-tensor

`size`： sequence或者int，若为sequence,则为(h,w)，若为int，则为正方形

**5.上下左右中心裁剪后翻转**

```python
torchvision.transforms.TenCrop(size, vertical_flip=False) 
```

对图片进行上下左右以及中心裁剪，返回裁剪得到的5张图像加上5张翻转图像共10张图像（默认水平翻转）

`size`：sequence或者int，若为sequence,则为(h,w)，若为int，则为正方形

`vertical_flip`：bool类型，使用垂直翻转而不是水平翻转

### 3.翻转和旋转

**6.依概率p水平翻转**

```python
torchvision.transforms.RandomHorizontalFlip(p=0.5)
```

以给定的概率随机水平翻转给定的PIL图像

`p`：图像被翻转的概率，默认为0.5

**7.依概率p垂直翻转**

```python
torchvision.transforms.RandomVerticalFlip(p=0.5)
```

以给定的概率随机垂直翻转给定的PIL图像

`p`：图像被翻转的概率，默认为0.5

**8.随机旋转**

```python
torchvision.transforms.RandomRotation(degrees, resample=False, expand=False, center=None)
```

按角度旋转图像

`degrees`：sequence 或float或int，要选择的度数范围。如果degrees是一个数字而不是像（min，max）这样的序列，则度数范围将是（-degrees，+ degrees）

`resample`：插值方式

`expand`：可选的扩展标志。如果为true，则展开输出以使其足够大以容纳整个旋转图像。如果为false或省略，则使输出图像与输入图像的大小相同。

`center`：2元tuple，可选的旋转中心。原点是左上角。默认值是图像的中心。

### 4.图像变换

**9.resize**

```python
torchvision.transforms.Resize(size, interpolation=2)
```

将输入PIL图像的大小调整为给定大小。

`size`：sequence 或int，所需的输出大小。如果size是类似（h，w）的序列，则输出大小将与此匹配。如果size是int，则**图像的较小边缘将与此数字匹配。即，如果高度>宽度，则图像将重新缩放为（尺寸*高度/宽度，尺寸）**

`interpolation`：插值方式，默认为BILINEAR

**10.标准化**

```python
torchvision.transforms.Normalize(mean, std)
```

用平均值和标准差归一化张量图像。给定mean：(M1,…,Mn)和std：(S1,…,Sn)对于n通道，此变换将标准化输入的每个通道

`mean`：sequence，每个通道的均值序列

`std`：sequence，每个通道的标准差序列

**11.转tensor并归一化**

```python
torchvision.transforms.ToTensor
```

将PIL Image或者 ndarray 转换为tensor，并且归一化至[0-1]。**若自己的ndarray数据尺度有变化，则需要自行修改。**

**12.填充**

```python
torchvision.transforms.Pad(padding, fill=0, padding_mode='constant')
```

`padding`：为sequence或者int，可选的，图像每个边上的填充，默认为None，即不填充。如果提供长度为4的序列，则它用于分别填充左，上，右，下边界。如果提供长度为2的序列，则分别用于填充左/右，上/下边界

`fill`：恒定填充的像素填充值。默认值为0.如果长度为3的元组，则分别用于填充R，G，B通道。仅当padding_mode为constant时才使用此值

`padding_mode`：填充类型，可选：constant，edge，reflect，symmetric。constant是填充指定像素值，edge是填充边缘像素值，reflect是反射填充，比如用2个元素填充[1,2,3,4]为[3,2,1,2,3,4,3,2]，symmetric是对称填充，比如用2个像素填充[1,2,3,4]为[2,1,1,2,3,4,4,3]

**13.修改亮度、对比度和饱和度**

```python
torchvision.transforms.ColorJitter(brightness=0, contrast=0, saturation=0, hue=0)
```

`brightness`： float或者元组，从该范围内随机选择brightness_factor

`contrast`：float或者元组，从该范围内随机选择contrast_factor

`saturation`：float或者元组，从该范围内随机选择saturation_factor

`hue`：float或者元组，从该范围内随机选择hue_factor

**14.转灰度图**

```python
torchvision.transforms.Grayscale(num_output_channels=1)
```

`num_output_channels`：当为1时，正常的灰度图，当为3时，r == g == b的图像

**15.线性变换**

```python
torchvision.transforms.LinearTransformation(transformation_matrix) 
```

用一个转换矩阵和一个离线计算出的均值向量将图片进行转换。给定转换矩阵transformation_matrix后,会将torch.*Tensor平铺并按位减mean_vector之后与转换矩阵做点积（dot product）运算，最后将shape转换成原始尺寸

**16.仿射变换**

图像保持中心不变的随机仿射变换。

```python
torchvision.transforms.RandomAffine(degrees, translate=None, scale=None, shear=None, resample=False, fillcolor=0) 
```

`degrees`：sequence或float或int，要选择的度数范围。如果degrees是一个数字而不是像（min，max）这样的序列，则度数范围将是（-degrees，+degrees）。设置为0可停用旋转

`translate`：元组，可选。水平和垂直平移的最大绝对分数元组。例如translate =（a，b），然后在范围-img_width * a <dx <img_width * a中随机采样水平移位，并且在-img_height * b <dy <img_height * b范围内随机采样垂直移位。默认情况下不会平移

`scale`：元组，可选。缩放因子间隔，例如（a，b），然后从范围a <= scale <= b中随机采样缩放。默认情况下会保持原始比例

`shear`：sequence 或float或int，可选，错切角度范围， 如果degrees是一个数字而不是像（min，max）这样的序列，则度数范围将是（-degrees，+ degrees）。默认情况下不会应用错切

`resample`：插值方式，默认为BILINEAR

`fillcolor`：输出图像中变换外部区域的可选填充颜色

**17.依概率p转为灰度图**

```python
torchvision.transforms.RandomGrayscale(p=0.1)
```

依概率p将图片转换为灰度图，若通道数为3，则输出r == g == b的图像

**18.将数据转换为PILImage**

```python
torchvision.transforms.ToPILImage()
```

将tensor 或者 ndarray的数据转换为 PIL Image 类型数据

```
注：对于一个Tensor的转化过程是
1.将张量的每个元素乘上255
2.将张量的数据类型由FloatTensor转化成Uint8
3.将张量转化成numpy的ndarray类型
4.对ndarray对象做permute (1, 2, 0)的操作
5.利用Image下的fromarray函数，将ndarray对象转化成PILImage形式
6.输出PILImage
```

**19.依自定义的lambda函数变换**

```python
torchvision.transforms.Lambda（lambda）
```

将用户定义的lambda应用为变换。

`lambda`：用于转换的Lambda函数

### 5.对transforms操作，使数据增强更灵活

**20.选择一个transforms进行操作**

```python
torchvision.transforms.RandomChoice(transforms)
```

从给定的一系列transforms中选一个进行操作

**21.给一个transform加上概率，以一定的概率执行该操作**

```python
torchvision.transforms.RandomApply(transforms, p=0.5)
```

`transforms`：列表或元组，要操作的transforms列表

`p`：概率

**22.将transforms中的操作随机打乱**

```python
torchvision.transforms.RandomOrder(transforms)
```

`transforms`：列表或元组，要操作的transforms列表

### 6.Compose操作

将一系列操作组合在一起，按顺序执行

```python
torchvision.transforms.Compose(transforms)
```

`transforms`：要组合的transforms列表

例如：

```python
transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize(mean = (0.5, 0.5, 0.5), std = (0.5, 0.5, 0.5))
])
```

### 7.总结

上面所述transforms方法中，只有少部分是经常用到的，熟练掌握经常用到的即可。















