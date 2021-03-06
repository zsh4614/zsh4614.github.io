---
title: 详解C++拷贝构造函数和赋值运算符
tags:
  - 拷贝构造函数
  - 拷贝复制运算符
categories:
  - C++
abbrlink: 705d9ad4
date: 2021-04-13 01:33:07
---

引言：本文主要介绍了拷贝构造函数和赋值运算符的区别，以及在什么时候调用拷贝构造函数、什么情况下调用赋值运算符；同时较为详细的说明了拷贝构造函数必须以引用的方式传递参数。

<!--more-->

### 1.拷贝构造函数和拷贝赋值运算符

在默认情况下（用户没有定义，但是也没有显式的删除），编译器会自动的隐式生成一个拷贝构造函数和赋值运算符。但用户可以使用delete来指定不生成拷贝构造函数和赋值运算符，这样的对象就不能通过值传递，也不能进行赋值运算：

```c++
class Person {
public:
	Person(const Person& p) = delete;
	Person& operator=(const Person& p) = delete;
private:
	int age;
	string name;
};
```

上面的定义的类Person显式的删除了拷贝构造函数和赋值运算符，在需要调用拷贝构造函数或者赋值运算符的地方，会提示无法调用该函数，它是已删除的函数。

### 2.何时调用

拷贝构造函数和赋值运算符的行为比较相似，都是将一个对象的值复制给另一个对象；但是其结果却有些不同，拷贝构造函数使用传入对象的值**生成一个新的对象的实例**，而赋值运算符是将对象的值复制给一个**已经存在的实例**。这种区别从两者的名字也可以很轻易的分辨出来，拷贝构造函数也是一种构造函数，那么它的功能就是**创建一个新的对象实例**；赋值运算符是执行某种运算，将一个对象的值复制给另一个**已经存在的对象**。**调用的是拷贝构造函数还是赋值运算符，主要是看是否有新的对象实例产生。如果产生了新的对象实例，那调用的就是拷贝构造函数；如果没有，那就是对已有的对象赋值，调用的是赋值运算符。**

**调用拷贝构造函数主要有以下场景：**

- 对象作为函数的参数，以值传递的方式传给函数；　
- 对象作为函数的返回值，以值的方式从函数返回；
- 使用一个对象给另一个对象初始化

```c++
class Person {
public:
	Person() {};
    Person(const Person& p) {
		cout << "Copy Constructor" << endl;
	}
    Person& operator = (const Person& p) {
        cout << "Assign operator" << endl;
        return *this;
    }
    
private:
	int age;
	string name;
};

void do1(Person p)
{
	return;
}

Person do2() {
	Person p;
	return p;
}

int main() {
	Person p;
	Person p1 = p;			// 第一种情况
	Person p2;
	p2 = p; 				// 第二种情况
	do1(p2); 				// 第三种情况
	p2 = do2(); 			// 第四种情况
	Person p3 = do2();		// 第五种情况
	return 0;
}
```

上述代码定义了一个类Person，显式的定义了拷贝构造函数和赋值运算符。然后定义了两个函数：do1以值传递的方式将对象作为函数的参数传入函数；do2以值的方式返回Person对象。执行结果如下：

```
第一种情况： Copy Constructor
第二种情况： Assign operator
第三种情况： Copy Constructor
第四种情况： Copy Constructor
           Assign operator
第五种情况： Copy Constructor
```

分析如下：

第一种情况：使用已经存在的对象p创建新对象p1，产生了新对象，所以调用拷贝构造函数；

第二种情况：将对象p的值复制给已经存在的对象p2，为一个已经存在的对象赋值，所以调用赋值运算符；

第三种情况：以值传递的方式将对象p2传入函数内，所以是调用拷贝构造函数创建一个函数do1可用的实参；

第四种情况：函数do2以值的方式返回一个对象，由于这是一个局部对象，声明周期在函数内，所以返回的是一个它的拷贝，具体就是在返回时调用拷贝构造函数创建一个临时对象作为返回值；返回后调用赋值运算符将该临时对象复制给已经存在的对象p2；所以先调用拷贝构造函数，再调用赋值运算符；

第五种情况：按理来说应该先调用一次拷贝构造函数创建临时对象，再调用拷贝构造函数用临时对象创建新对象p3，调用两次拷贝构造函数，但是这实际上只调用了一次拷贝构造函数，这是因为直接在函数返回时调用拷贝构造函数创建了对象p3，因为编译器认为返回临时对象这一步是多余的，直接把p3当做了“临时对象”。

### 3.拷贝构造函数必须以引用的方式传递参数

这一点要特别注意，即拷贝构造函数的形参必须是引用或者常引用：

```c++
Person(const Person& p)
```

而不能是值或者指针，下面分别对以值的方式传递参数和以指针的方式传递参数进行分析。

1.以值的方式传递参数

```c++
Person(const Person p)
```

看起来好像和传引用的方式相比只是减少了一次内存拷贝，其实实际上不是这样的。这种情况编译器会报错，原因是**在以值的方式传递参数的时候，会调用拷贝构造函数生成函数的实参，但是拷贝构造函数的参数是值的方式，将会继续调用拷贝构造函数，这样就会无限递归的调用下去，直到函数的栈溢出**，所以值的方式传递参数是编译器绝对不允许的。

上面这句话可能一下子不太容易理解，没关系，下面我们详细的进行分析。

在进行值传递参数的时候，会调用拷贝构造函数对实参(假设实参为p)进行一次拷贝，假设新生成的对象叫做tmp，即`Person tmp = p`，tmp是一个新对象，根据上面的分析，我们知道在进行这个操作的时候，也会调用拷贝构造函数，但是拷贝构造函数的参数是值啊，值传递参数又会调用拷贝构造函数进行拷贝，生成新对象又会调用拷贝构造函数...，这样就会无限循环下去。

2.以指针的方式传递参数

```c++
Person(const Person* p)
```

恩，这种方式的确不会报错，如下

```c++
class A {
public:
	A(int a) 
	{
		this->a = a;
		cout << "in constructor" << endl;
	}
	A(A* test) 
	{
		this->a = test->a;
		cout << "in copy constructor" << endl;
	}
	void printA()
    {
        cout << this->a << endl;
	}
    
private:
	int a;
};

int main() {
	A a(2);
	A b(&a);
	b.printA();
	return 0;
}
```

执行结果为：

```
in constructor
in copy constructor
2
```

确实是调用了拷贝构造函数，但是`A(A* test)`真的是拷贝构造函数吗？答案是否定的：

```C++
class A {
public:
A(int a) {
	this->a = a;
	cout << "in constructor" << endl;
}
A(A* test) {
	this->a = test->a;
	cout << "in copy constructor" << endl;
}	
void printA() {
	cout << this->a << endl;
}
private:
	int a;
};
int main() {
	A a(2);
	A b(&a);
	A c = a;
	b.printA();
	c.printA();
	return 0;
}
```

执行结果为：

```
in constructor
in copy constructor
2
2
```

发现`in copy constructor`只打印了一次，也就是说`A c = a;`并没有调用`A(A* test)`，那调用的拷贝构造函数是哪个呢？毫无疑问，是默认拷贝构造函数，默认拷贝构造函数还存在，说明`A(A* test)`并不是拷贝构造函数。

### 4.总结

1.区分调用拷贝构造函数还是拷贝赋值运算符的依据是看是否生成了新对象，生成，拷贝构造函数，不生成，赋值运算符；
2.调用拷贝构造函数的三种情况：值传递，值方式返回局部对象，使用一个已有对象初始化一个新对象；
3.拷贝构造函数必须以引用的方式传递参数，因为值方式会造成栈区溢出，编译器不允许；指针方式根本不是拷贝构造函数。