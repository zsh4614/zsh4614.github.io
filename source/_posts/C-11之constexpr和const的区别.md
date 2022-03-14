---
title: C++11之constexpr和const的区别
notshow: false
tags:
  - C++11
  - const
  - constexpr
categories:
  - C++
abbrlink: de47c1bd
date: 2022-01-26 23:12:06
---

引言：本文主要介绍C++11的新关键字constexpr和const的区别。
<!--more-->


### 背景
我们知道，constexpr 是 C++ 11 标准新添加的关键字，在此之前（C++ 98/03标准）只有 const 关键字，其在实际使用中经常会表现出两种不同的语义。举个例子：

```c++
#include <iostream>
#include <array>
using namespace std;
void dis_1(const int x){
    //错误，x是只读的变量
    array <int,x> myarr{1,2,3,4,5};
    cout << myarr[1] << endl;
}
void dis_2(){
    const int x = 5;
    array <int,x> myarr{1,2,3,4,5};
    cout << myarr[1] << endl;
}
int main()
{
   dis_1(5);
   dis_2();
}
```

可以看到，dis\_1() 和 dis\_2() 函数中都包含一个 const int x，但 dis\_1() 函数中的 x 无法完成初始化 array 容器的任务，而 dis_2() 函数中的 x 却可以。

这是因为，dis\_1() 函数中的“const int x”只是想强调 x 是一个只读的变量，其本质仍为变量，无法用来初始化 array 容器；而 dis\_2() 函数中的“const int x”，表明 x 是一个只读变量的同时，x 还是一个值为 5 的常量，所以可以用来初始化 array 容器。

### 区别

C++ 11标准中，为了解决 const 关键字的双重语义问题，保留了 const 表示“只读”的语义，而将“常量”的语义划分给了新添加的 constexpr 关键字。因此 C++11 标准中，建议将 const 和 constexpr 的功能区分开，即**凡是表达“只读”语义的场景都使用 const，表达“常量”语义的场景都使用 constexpr。**

有读者可能会问，“只读”不就意味着其不能被修改吗？答案是否定的，“只读”和“不允许被修改”之间并没有必然的联系，举个例子：

```c++
#include <iostream>
using namespace std;
int main()
{
    int a = 10;
    const int & con_b = a;
    cout << con_b << endl;
    a = 20;
    cout << con_b << endl;
}
```

程序执行结果为：

```
10
20
```

可以看到，程序中用 const 修饰了 con_b 变量，表示该变量“只读”，即无法通过变量自身去修改自己的值。但这并不意味着 con_b 的值不能借助其它变量间接改变，通过改变 a 的值就可以使 con_b 的值发生变化。

在大部分实际场景中，const 和 constexpr 是可以混用的，例如：

```c++
const int a = 5 + 4;
constexpr int a = 5 + 4;
```

它们是完全等价的，都可以在程序的编译阶段计算出结果。但在某些场景中，必须明确使用 constexpr，例如：

```c++
#include <iostream>
#include <array>
using namespace std;
constexpr int sqr1(int arg){
    return arg*arg;
}
const int sqr2(int arg){
    return arg*arg;
}
int main()
{
    array<int,sqr1(10)> mylist1;//可以，因为sqr1时constexpr函数
    array<int,sqr2(10)> mylist1;//不可以，因为sqr2不是constexpr函数
    return 0;
}
```

其中，因为 sqr2() 函数的返回值仅有 const 修饰，而没有用更明确的 constexpr 修饰，导致其无法用于初始化 array 容器（只有常量才能初始化 array 容器）。

总的来说在 C++ 11 标准中，const 用于为修饰的变量添加“只读”属性；而 constexpr 关键字则用于指明其后是一个常量（或者常量表达式），编译器在编译程序时可以顺带将其结果计算出来，而无需等到程序运行阶段，这样的优化极大地提高了程序的执行效率。

> 转载自：http://c.biancheng.net/view/7807.html


