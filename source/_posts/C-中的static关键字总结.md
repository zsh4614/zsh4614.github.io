---
title: C++中的static关键字总结
tags:
  - static关键字
  - 全局变量
  - 局部变量
  - 静态全局变量
  - 静态局部变量
  - 静态成员函数
  - 静态数据成员
  - 作用域
  - 生存期
categories:
  - C++
abbrlink: d19705e7
date: 2021-04-18 23:55:34
---

引言：C++的static有两种用法，面向过程程序设计中的static和面向对象程序设计中的static。前者应用于普通变量和函数，不涉及类；后者主要说明static在类中的作用。

<!--more-->

### 1.面向过程设计中的static

#### 1.1静态全局变量

在全局变量前，加上关键字static，该变量就被定义成为一个静态全局变量，我们先举一个静态全局变量的例子，如下：

```c++
static int n;
void fn() {
	n++;
    std::cout << n << std::endl;
}
void main() {
    n = 20;
    std::cout << n << std::endl;
    fn();
}
```

静态全局变量有以下特点：

- 该变量在全局数据区分配内存；
- 未经初始化的静态全局变量会被程序自动初始化为0（自动变量的值是随机的，除非它被显式初始化）；
- 静态全局变量在声明它的整个文件都是可见的，而**在文件之外是不可见**的；

静态变量都在**全局数据区**分配内存，包括后面将要提到的静态局部变量。

一般程序的由new产生的动态数据存放在**堆区**，函数内部的自动变量存放在**栈区**。自动变量一般会随着函数的退出而释放空间，静态数据（即使是函数内部的静态局部变量）也存放在**全局数据区**。全局数据区的数据并不会因为函数的退出而释放空间。细心的读者可能会发现，上面的代码中将`static int n;`改为`int n; `。程序照样正常运行。的确，定义全局变量就可以实现变量在文件中的共享，但定义静态全局变量还有以下好处：

- 静态全局变量不能被其它文件所用；
- 其它文件中可以定义相同名字的变量，不会发生冲突；

将上述示例代码改为如下：

```c++
// File1
void fn();
static int n;
void main() {
 　　n=20;
 　　std::cout << n << endl;
 　　fn();
}
```

```c++
// File2
extern int n;
void fn() {
　　 n++;
 　　std::cout << n << std::endl;
}
```

编译并运行，会发现上述代码可以分别通过编译，但运行时出现错误。将`static int n;`改为`int n;`，再次编译运行程序，就会明白全局变量和静态全局变量的区别。

#### 1.2静态局部变量

在局部变量前，加上关键字static，该变量就被定义成为一个静态局部变量。 我们先举一个静态局部变量的例子，如下：

```c++
void fn() {
 　　static n=10;
 　　std::cout << n << std::endl;
　　 n++;
}
void main() {
 　　fn();
 　　fn();
 　　fn();
}
```

通常，在函数体内定义了一个变量，每当程序运行到该语句时，都会给该局部变量分配栈区内存。但随着程序退出函数体，系统就会收回栈内存，局部变量也相应失效。但有时候我们需要在两次调用之间对变量的值进行保存。通常的想法是定义一个全局变量来实现。但这样一来，变量已经不再属于函数本身了，不再仅受函数的控制，给程序的维护带来不便。静态局部变量正好可以解决这个问题。静态局部变量保存在全局数据区，而不是保存在栈中，每次的值保持到下一次调用，直到下次赋新值。

静态局部变量有以下特点：

- 该变量在全局数据区分配内存；
- 静态局部变量在程序执行到该对象的声明处时被首次初始化，即以后的函数调用不再进行初始化；
- 静态局部变量一般在声明处初始化，如果没有显式初始化，会被程序自动初始化为0；
- 它始终驻留在全局数据区，直到程序运行结束。但其作用域为局部作用域，当定义它的函数或语句块结束时，其作用域随之结束。

#### 1.3静态函数

在函数的返回类型前加上static关键字,函数即被定义为静态函数。静态函数与普通函数不同，它只能在声明它的文件当中可见，不能被其它文件使用。

```c++
static void fn();		//声明静态函数
void main() {
 　　fn();
}
void fn() {			//定义静态函数
 　　int n=10;
 　　std::cout << n << std::endl;
}
```

定义静态函数的好处：

- 静态函数不能被其它文件所用；
- 其它文件中可以定义相同名字的函数，不会发生冲突。

### 2.面向对象的static关键字

#### 2.1静态数据成员

在类内的数据成员的声明前加上关键字static，该数据成员就是类内的静态成员函数，先举一个静态数据成员的例子。

```c++
class Myclass {
public:
 　　Myclass(int a,int b,int c);
 　　void GetSum();
private:
 　　int a,b,c;
 　　static int Sum;//声明静态数据成员
};
int Myclass::Sum=0;//定义并初始化静态数据成员

Myclass::Myclass(int a,int b,int c) {
 　　this->a=a;
 　　this->b=b;
 　　this->c=c;
 　　Sum+=a+b+c;
}

void Myclass::GetSum() {
 　　cout<<"Sum="<<Sum<<endl;
}

void main() {
 　　Myclass M(1,2,3);
 　　M.GetSum();
　　 Myclass N(4,5,6);
 　　N.GetSum();
 　　M.GetSum();
}
```

静态数据成员有以下特点：

- 对于非静态数据成员，每个类对象都有自己的拷贝。而静态数据成员被当作是类的成员。无论这个类的对象被定义了多少个，静态数据成员在程序中也**只有一份拷贝**，由该类型的所有对象共享访问。也就是说，静态数据成员是该类的所有对象所共有的。对该类的多个对象来说，静态数据成员只分配一次内存，供所有对象共用。所以，静态数据成员的值对每个对象都是一样的，它的值可以更新；
- **静态数据成员存储在全局数据区**。静态数据成员**定义时要分配空间，所以不能在类声明中定义**。在上述程序中，语句`int Myclass::Sum=0;`是定义静态数据成员；
- 静态数据成员和普通数据成员一样遵从public,protected,private访问规则；
- 因为静态数据成员在全局数据区分配内存，属于本类的所有对象共享，所以，它不属于特定的类对象，在没有产生类对象时其作用域就可见，即在没有产生类的实例时，我们就可以操作它；
- 静态数据成员初始化与一般数据成员初始化不同。静态数据成员初始化的格式为：`＜数据类型＞＜类名＞::＜静态数据成员名＞=＜值＞`
- 类的静态数据成员有两种访问形式：`＜类对象名＞.＜静态数据成员名＞ 或 ＜类类型名＞::＜静态数据成员名＞`
- 静态数据成员主要用在各个对象都有相同的某项属性的时候。比如对于一个存款类，每个实例的利息都是相同的。所以，应该把利息设为存款类的静态数据成员。这有两个好处，第一，不管定义多少个存款类对象，利息数据成员都共享分配在全局数据区的内存，所以**节省存储空间**。第二，一旦利息需要改变时，只要改变一次，则所有存款类对象的利息全改变过来了；
- 同全局变量相比，使用静态数据成员有两个优势：
  - 静态数据成员没有进入程序的全局名字空间，因此不存在与程序中其它全局名字冲突的可能性；
  - 可以实现信息隐藏。静态数据成员可以是private成员，而全局变量不能；

#### 2.2静态成员函数

与静态数据成员一样，我们也可以创建一个静态成员函数，它为类的全部服务而不是为某一个类的具体对象服务。静态成员函数与静态数据成员一样，都是类的内部实现，属于类定义的一部分。**普通的成员函数一般都隐含了一个this指针，this指针指向类的对象本身**，因为普通成员函数总是具体的属于某个类的具体对象的。通常情况下，this是缺省的。如函数fn()实际上是this->fn()。但是与普通函数相比，静态成员函数由于不是与任何的对象相联系，因此它**不具有this指针**。从这个意义上讲，它**无法访问属于类对象的非静态数据成员，也无法访问非静态成员函数，它只能调用其余的静态成员函数**。下面举个静态成员函数的例子。

```c++
class Myclass
{
public:
 　　Myclass(int a,int b,int c);
 　　static void GetSum();/声明静态成员函数
private:
 　　int a,b,c;
　　 static int Sum;//声明静态数据成员
};
int Myclass::Sum=0;//定义并初始化静态数据成员

Myclass::Myclass(int a,int b,int c)
{
 　　this->a=a;
 　　this->b=b;
 　　this->c=c;
 　　Sum+=a+b+c; //非静态成员函数可以访问静态数据成员
}

void Myclass::GetSum() //静态成员函数的实现
{
　　// cout<<a<<endl; //错误代码，a是非静态数据成员
 　　cout<<"Sum="<<Sum<<endl;
}

void main()
{
 　　Myclass M(1,2,3);
 　　M.GetSum();
 　　Myclass N(4,5,6);
 　　N.GetSum();
 　　Myclass::GetSum();
}
```

关于静态成员函数，可以总结为以下几点：

- 出现在类体外的函数**定义不能指定关键字static**；
- 静态成员之间可以相互访问，包括静态成员函数访问静态数据成员和访问静态成员函数；
- 非静态成员函数可以任意地访问静态成员函数和静态数据成员；
- 静态成员函数不能访问非静态成员函数和非静态数据成员；
- 由于没有this指针的额外开销，因此静态成员函数与类的全局函数相比速度上会有少许的增长；
- 调用静态成员函数，可以用成员访问操作符(.)和(->)为一个类的对象或指向类对象的指针调用静态成员函数，也可以直接使用如下格式调用类的静态成员函数：`＜类名＞::＜静态成员函数名＞（＜参数表＞）`。

### 3.总结

**从作用域看**，全局变量具有全局作用域，全局变量只需在一个源文件中定义，就可以作用于所有的源文件。当然，其他不包含全局变量定义的源文件需要用`extern` 关键字再次声明这个全局变量。局部变量也只有局部作用域，它是自动对象（auto），它在程序运行期间不是一直存在，而是只在函数执行期间存在，函数的一次调用执行结束后，变量被撤销，其所占用的内存也被收回。静态局部变量具有局部作用域，它只被初始化一次，自从第一次被初始化直到程序运行结束都一直存在，它和全局变量的区别在于全局变量对所有的函数都是可见的，而静态局部变量只对定义自己的函数体始终可见。静态全局变量也具有全局作用域，它与全局变量的区别在于如果程序包含多个文件的话，它作用于定义它的文件里，不能作用到其它文件里，即被static关键字修饰过的变量具有文件作用域。这样即使两个不同的源文件都定义了相同名字的静态全局变量，它们也是不同的变量。

**从分配内存空间来看**，**全局变量，静态局部变量，静态全局变量都在静态存储区分配空间，而局部变量在栈里分配空间。**

**综上，把局部变量改变为静态变量后是改变了它的存储方式即改变了它的生存期，并没有改变它的作用域，即作用域还是在函数内部。把全局变量改变为静态变量后是改变了它的作用域，限制了它的使用范围。**

