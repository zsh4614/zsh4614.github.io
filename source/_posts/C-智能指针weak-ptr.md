---
title: C++智能指针weak_ptr
notshow: false
date: 2022-03-10 10:58:03
tags:
- C++11
categories:
- C++
---

引言：本文主要介绍C++11的智能指针weak_ptr。

<!--more-->

### 介绍

和 shared_ptr、unique_ptr 类型指针一样，weak_ptr 智能指针也是以模板类的方式实现的。weak_ptr<T>（ T 为指针所指数据的类型）定义在`<memory>`头文件，并位于 std 命名空间中。C++11标准虽然将 weak_ptr 定位为智能指针的一种，但该类型指针通常不单独使用（没有实际用处），**只能和 shared_ptr 类型指针搭配使用**。甚至于，我们可以将 weak_ptr 类型指针视为 shared_ptr 指针的一种辅助工具，借助 weak_ptr 类型指针， 我们可以获取 shared_ptr 指针的一些状态信息，比如**有多少指向相同的 shared_ptr 指针、shared_ptr 指针指向的堆内存是否已经被释放**等等。

**当 weak_ptr 类型指针的指向和某一 shared_ptr 指针相同时，weak_ptr 指针并不会使所指堆内存的引用计数加 1；同样，当 weak_ptr 指针被释放时，之前所指堆内存的引用计数也不会因此而减 1。也就是说，weak_ptr 类型指针并不会影响所指堆内存空间的引用计数。**

weak_ptr\<T> 模板类中**没有重载 * 和 -> 运算符**，这也就意味着，weak_ptr 类型指针**只能访问**所指的堆内存，而无法修改它。

### 创建

三种方式

```c++
std::weak_ptr<int> wp1;
std::weak_ptr<int> wp2 (wp1);  //凭借已有的 weak_ptr 指针，可以创建一个新的 weak_ptr 指针
std::shared_ptr<int> sp (new int);
std::weak_ptr<int> wp3 (sp); // weak_ptr 指针更常用于指向某一 shared_ptr 指针拥有的堆内存，因为在构建 weak_ptr 指针对象时，可以利用已有的 shared_ptr 指针为其初始化
```

### 成员方法

![image.png](https://s2.loli.net/2022/03/10/qoOWVLPHs7udBgy.png)

### 用法

```C++
#include <iostream>
#include <memory>
using namespace std;
int main()
{
    std::shared_ptr<int> sp1(new int(10));
    std::shared_ptr<int> sp2(sp1);
    std::weak_ptr<int> wp(sp2);
    //输出和 wp 同指向的 shared_ptr 类型指针的数量
    cout << wp.use_count() << endl;
    //释放 sp2
    sp2.reset();
    cout << wp.use_count() << endl;
    //借助 lock() 函数，返回一个和 wp 同指向的 shared_ptr 类型指针，获取其存储的数据
    cout << *(wp.lock()) << endl;
    return 0;
}
```

输出：

```
2
1
10
```

