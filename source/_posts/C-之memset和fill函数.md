---
title: C++之memset和fill函数
tags:
  - memset
  - fill
categories:
  - C++
abbrlink: 186e07c6
date: 2021-04-17 00:37:45
---

引言：memset和fill都能进行赋值操作，但是二者有所区别，使用场景和方法也不同。

<!--more-->

### 1.问题引出

当我们运行下面一段代码试图将数组中的所有数字全部设置为1的时候，会发生预期之外的结果：

```c++
#include <iostream>
int main {
    int a[5];
    memset(a, 1, sizeof(a));
    for (int i = 0; i < 10; i++) {
        std::cout << a[i] << " ";
    }
    return 0;
}
```

会发现输出以下的结果：

`16843009 16843009 16843009 16843009 16843009`

### 2.原因

为什么和我们的预期不符？这是因为`memset()`函数是**以字节为单位进行赋值**的，一个int型数据有4个字节，在上面的例子中我们赋的值是十六进制`0x01010101`，即二进制数`00000001 00000001 00000001 00000001`，换算成十进制就是16843009，所以会得出上面的结果。

所以如果想将int型数组置为想要的十进制数，**只能用`memset()`置为0或者-1**，因为0的二进制表示全为0， -1的二进制表示全为1，按字节为单位完成赋值的结果保持不变。

一般情况下，`memset()`只用来给char型数组赋值，或者对int型数组进行全0或者全1操作。

### 3.解决方法

`fill()`函数**按照单元进行赋值**，将一个区间的元素都赋予同一个值。如下：

```
#include <algorithm>
int main() {
	int a[5];
	fill(a, a+5, 1);
	return 0;
}
```

可以实现对数值中每个元素都赋值为1的目的，也可以对容器进行赋值，注意第一个参数和第二个参数是容器的迭代器。

### 4.总结

1.`memset()`和`fill()`都可以实现赋值操作；
2.`memset()`是以字节为单位进行，对int型数组赋值只能赋值为0或者-1，`fill()`以元素为单位进行。