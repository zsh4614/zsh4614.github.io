---
title: C++之STL关联式容器map
notshow: false
tags:
  - STL
  - map
categories:
  - C++
abbrlink: 20ce2cad
date: 2022-01-11 23:09:31
---
引言：本文主要介绍c++的STL中的关联式容器map，包括其接口，用法和注意事项。

<!--more-->
### pair
关联式容器存储的是“键值对”形式的数据，考虑到“键值对”并不是普通类型数据，C++ STL 标准库提供了 pair 类模板，其专门用来将 2 个普通元素 first 和 second（可以是 C++ 基本数据类型、结构体、类自定的类型）创建成一个新元素<first, second>。通过其构成的元素格式不难看出，使用 pair 类模板来创建“键值对”形式的元素，再合适不过。

注意，pair 类模板定义在<utility>头文件中，所以在使用该类模板之前，需引入此头文件。另外值得一提的是，在 C++ 11 标准之前，pair 类模板中提供了以下 3 种构造函数：

```c++
#1) 默认构造函数，即创建空的 pair 对象
pair();
#2) 直接使用 2 个元素初始化成 pair 对象
pair (const first_type& a, const second_type& b);
#3) 拷贝（复制）构造函数，即借助另一个 pair 对象，创建新的 pair 对象
template<class U, class V> pair (const pair<U,V>& pr);
```

在 C++ 11 标准中，在引入右值引用的基础上，pair 类模板中又增添了如下 2 个构造函数：

```c++
#4) 移动构造函数
template<class U, class V> pair (pair<U,V>&& pr);
#5) 使用右值引用参数，创建 pair 对象
template<class U, class V> pair (U&& a, V&& b);
```

下面程序演示了以上几种创建 pair 对象的方法：

```c++
#include <iostream>
#include <utility>      // pair
#include <string>       // string
using namespace std;
int main() {
    // 调用构造函数 1，也就是默认构造函数
    pair <string, double> pair1;
    // 调用第 2 种构造函数
    pair <string, string> pair2("STL教程","http://c.biancheng.net/stl/");  
    // 调用拷贝构造函数
    pair <string, string> pair3(pair2);
    //调用移动构造函数
    pair <string, string> pair4(make_pair("C++教程", "http://c.biancheng.net/cplus/"));
    // 调用第 5 种构造函数
    pair <string, string> pair5(string("Python教程"), string("http://c.biancheng.net/python/"));  
   
    cout << "pair1: " << pair1.first << " " << pair1.second << endl;
    cout << "pair2: "<< pair2.first << " " << pair2.second << endl;
    cout << "pair3: " << pair3.first << " " << pair3.second << endl;
    cout << "pair4: " << pair4.first << " " << pair4.second << endl;
    cout << "pair5: " << pair5.first << " " << pair5.second << endl;
    return 0;
}
```

上面程序在创建 pair4 对象时，调用了 make\_pair() 函数，它也是 <utility> 头文件提供的，其功能是生成一个 pair 对象。因此，当我们将 make\_pair() 函数的返回值（**是一个临时对象**）作为参数传递给 pair() 构造函数时，**其调用的是移动构造函数，而不是拷贝构造函数。**

在上面程序的基础上，C++ 11 还允许我们手动为 pair1 对象赋值，比如：

```
pair1.first = "Java教程";
pair1.second = "http://c.biancheng.net/java/";
cout << "new pair1: " << pair1.first << " " << pair1.second << endl;
```

同时，上面程序中 pair4 对象的创建过程，还可以写入如下形式，它们是完全等价的：

```
pair <string, string> pair4 = make_pair("C++教程", "http://c.biancheng.net/cplus/");
cout << "pair4: " << pair4.first << " " << pair4.second << endl;
```

<utility>头文件中除了提供创建 pair 对象的方法之外，还为 pair 对象重载了 <、<=、>、>=、==、!= 这 6 的运算符，其运算规则是：**对于进行比较的 2 个 pair 对象，先比较 pair.first 元素的大小，如果相等则继续比较 pair.second 元素的大小。**

举个例子：

```c++
#include <iostream>
#include <utility>      // pair
#include <string>       // string
using namespace std;
int main() {
    pair <string, int> pair1("STL教程", 20);
    pair <string, int> pair2("C++教程", 20);
    pair <string, int> pair3("C++教程", 30);
    //pair1和pair2的key不同，value相同
    if (pair1 != pair2) {
        cout << "pair != pair2" << endl;
    }
    //pair2和pair3的key相同，value不同
    if (pair2 != pair3) {
        cout << "pair2 != pair3" << endl;
    }
    return 0;
}
```

程序执行结果为：

```
pair != pair2
pair2 != pair3
```

最后需要指出的是，pair类模板还提供有一个 swap() 成员函数，能够互换 2 个 pair 对象的键值对，**其操作成功的前提是这 2 个 pair 对象的键和值的类型要相同**。例如：

```c++
#include <iostream>
#include <utility>      // pair
#include <string>       // string
using namespace std;
int main() {
    pair <string, int> pair1("pair", 10);                   
    pair <string, int> pair2("pair2", 20);
    //交换 pair1 和 pair2 的键值对
    pair1.swap(pair2);
    cout << "pair1: " << pair1.first << " " << pair1.second << endl;
    cout << "pair2: " << pair2.first << " " << pair2.second << endl;
    return 0;
}
```

### 创建map容器

作为关联式容器的一种，map 容器存储的都是 pair 对象，也就是用 pair 类模板创建的键值对。其中，各个键值对的键和值可以是任意数据类型，包括 C++ 基本数据类型（int、double 等）、使用结构体或类自定义的类型。

与此同时，在使用 map 容器存储多个键值对时，该容器会自动根据各键值对的键的大小，按照既定的规则进行排序。默认情况下，map 容器选用std::less<T>排序规则（其中 T 表示键的数据类型），其会根据键的大小对所有键值对做升序排序。当然，根据实际情况的需要，我们可以手动指定 map 容器的排序规则，既可以选用 STL 标准库中提供的其它排序规则（比如std::greater<T>），也可以自定义排序规则。

另外需要注意的是，使用 map 容器存储的各个键值对，**键的值既不能重复也不能被修改。**换句话说，map 容器中存储的各个键值对不仅键的值独一无二，键的类型也会用 const 修饰，这意味着**只要键值对被存储到 map 容器中，其键的值将不能再做任何修改。**前面提到，map 容器存储的都是 pair 类型的键值对元素，更确切的说，该容器存储的都是 **pair<const K, T>** 类型（其中 K 和 T 分别表示键和值的数据类型）的键值对元素。

map 容器的模板定义如下：

```c++
template < class Key,                                     // 指定键（key）的类型
           class T,                                       // 指定值（value）的类型
           class Compare = less<Key>,                     // 指定排序规则
           class Alloc = allocator<pair<const Key,T> >    // 指定分配器对象的类型
           > class map;
```
可以看到，map 容器模板有 4 个参数，其中后 2 个参数都设有默认值。大多数场景中，我们只需要设定前 2 个参数的值，有些场景可能会用到第 3 个参数，但最后一个参数几乎不会用到。

map 容器的模板类中包含多种构造函数，因此创建 map 容器的方式也有多种，下面就几种常用的创建 map 容器的方法，做一一讲解。

1) 通过调用 map 容器类的默认构造函数，可以创建出一个空的 map 容器，比如：

```c++
std::map<std::string, int>myMap;
```

通过此方式创建出的 myMap 容器，初始状态下是空的，即没有存储任何键值对。鉴于空 map 容器可以根据需要随时添加新的键值对，因此**创建空 map 容器是比较常用的。**

2) 当然在创建 map 容器的同时，也可以进行初始化，比如：

```c++
std::map<std::string, int>myMap{ {"C语言教程",10},{"STL教程",20} };
```

由此，myMap 容器在初始状态下，就包含有 2 个键值对。

再次强调，map 容器中存储的键值对，其本质都是 pair 类模板创建的 pair 对象。因此，下面程序也可以创建出一模一样的 myMap 容器：

```c++
std::map<std::string, int>myMap{std::make_pair("C语言教程",10),std::make_pair("STL教程",20)};
```

3) 除此之外，在某些场景中，可以利用先前已创建好的 map 容器，再创建一个新的 map 容器。例如：

```c++
std::map<std::string, int>newMap(myMap);
```

由此，通过调用 map 容器的**拷贝（复制）构造函数**，即可成功创建一个和 myMap 完全一样的 newMap 容器。

C++ 11 标准中，还为 map 容器增添了移动构造函数。**当有临时的 map 对象作为参数，传递给要初始化的 map 容器时，此时就会调用移动构造函数**。举个例子：

```c++
#创建一个会返回临时 map 对象的函数
std::map<std::string,int> disMap() {
    std::map<std::string, int>tempMap{ {"C语言教程",10},{"STL教程",20} };
    return tempMap;
}
//调用 map 类模板的移动构造函数创建 newMap 容器
std::map<std::string, int>newMap(disMap());
```

注意，无论是调用复制构造函数还是调用拷贝构造函数，都必须保证这 2 个容器的类型完全一致。

4) **map 类模板还支持取已建 map 容器中指定区域内的键值对，创建并初始化新的 map 容器。例如：**

```c++
std::map<std::string, int>myMap{ {"C语言教程",10},{"STL教程",20} };
std::map<std::string, int>newMap(++myMap.begin(), myMap.end());
```

这里，通过调用 map 容器的双向迭代器，实现了在创建 newMap 容器的同时，将其初始化为包含一个 {"STL教程",20} 键值对的容器。

5) 当然，在以上几种创建 map 容器的基础上，我们都可以手动修改 map 容器的排序规则。**默认情况下，map 容器调用 std::less<T> 规则，根据容器内各键值对的键的大小，对所有键值对做升序排序。**

因此，如下 2 行创建 map 容器的方式，其实是等价的：

```c++
std::map<std::string, int>myMap{ {"C语言教程",10},{"STL教程",20} };
std::map<std::string, int, std::less<std::string> >myMap{ {"C语言教程",10},{"STL教程",20} };
```

下面程序手动修改了 myMap 容器的排序规则，令其作降序排序：

```c++
std::map<std::string, int, std::greater<std::string> >myMap{ {"C语言教程",10},{"STL教程",20} };
```

### 成员方法
下表列出了 map 容器提供的常用成员方法以及各自的功能。
![image.png](https://s2.loli.net/2022/01/11/TzhsVNtg2ewymAX.png)

C++ STL 标准库为 map 容器配备的是双向迭代器（bidirectional iterator）。这意味着，map 容器迭代器只能进行 ++p、p++、--p、p--、*p 操作，并且迭代器之间只能使用 == 或者 != 运算符进行比较。

下面程序以 begin()/end() 组合为例，演示了如何遍历 map 容器：

```
#include <iostream>
#include <map>      // pair
#include <string>       // string
using namespace std;
int main() {
    //创建并初始化 map 容器
    std::map<std::string, std::string>myMap{ {"STL教程","http://c.biancheng.net/stl/"},{"C语言教程","http://c.biancheng.net/c/"} };
    //调用 begin()/end() 组合，遍历 map 容器
    for (auto iter = myMap.begin(); iter != myMap.end(); ++iter) {
        cout << iter->first << " " << iter->second << endl;
    }
    return 0;
}
```

除此之外，map 类模板中还提供了 find() 成员方法，它能帮我们查找指定 key 值的键值对，如果成功找到，则返回一个指向该键值对的双向**迭代器**；反之，其功能和 end() 方法相同。**因为返回的是迭代器，因此最常用的是判断容器中有没有这个键值对：if (iter != map.end()){}**

同时，map 类模板中还提供有 lower_bound(key) 和 upper_bound(key) 成员方法，它们的功能是类似的，唯一的区别在于：

- lower_bound(key) 返回的是指向第一个键不小于 key 的键值对的迭代器；
- upper_bound(key) 返回的是指向第一个键大于 key 的键值对的迭代器；

下面程序演示了它们的功能：

```c++
#include <iostream>
#include <map>      // pair
#include <string>       // string
using namespace std;
int main() {
    //创建并初始化 map 容器
    std::map<std::string, std::string>myMap{ {"STL教程","http://c.biancheng.net/stl/"},
                                             {"C语言教程","http://c.biancheng.net/c/"},
                                             {"Java教程","http://c.biancheng.net/java/"} };
    //找到第一个键的值不小于 "Java教程" 的键值对
    auto iter = myMap.lower_bound("Java教程");
    cout << "lower：" << iter->first << " " << iter->second << endl;
   
    //找到第一个键的值大于 "Java教程" 的键值对
    iter = myMap.upper_bound("Java教程");
    cout <<"upper：" << iter->first << " " << iter->second << endl;
    return 0;
}
```

lower_bound(key) 和 upper_bound(key) 更多用于 multimap 容器，在 map 容器中很少用到。

equal_range(key) 成员方法可以看做是 lower_bound(key) 和 upper_bound(key) 的结合体，该方法会返回一个 pair 对象，其中的 2 个元素都是迭代器类型，其中 pair.first 实际上就是 lower_bound(key) 的返回值，而 pair.second 则等同于 upper_bound(key) 的返回值。

显然，equal_range(key) 成员方法表示的一个范围，位于此范围中的键值对，其键的值都为 key。举个例子：

```c++
#include <iostream>
#include <utility>  //pair
#include <map>      // map
#include <string>       // string
using namespace std;
int main() {
    //创建并初始化 map 容器
    std::map<string, string>myMap{ {"STL教程","http://c.biancheng.net/stl/"},
                                   {"C语言教程","http://c.biancheng.net/c/"},
                                   {"Java教程","http://c.biancheng.net/java/"} };
    //创建一个 pair 对象，来接收 equal_range() 的返回值
    pair <std::map<string, string>::iterator, std::map<string, string>::iterator> myPair = myMap.equal_range("C语言教程");
    //通过遍历，输出 myPair 指定范围内的键值对
    for (auto iter = myPair.first; iter != myPair.second; ++iter) {
        cout << iter->first << " " << iter->second << endl;
    }
    return 0;
}
```

和 lower_bound(key)、upper_bound(key) 一样，该方法也更常用于 multimap 容器，因为 map 容器中各键值对的键的值都是唯一的，因此通过 map 容器调用此方法，**其返回的范围内最多也只有 1 个键值对。**

### 获取键对应值

我们知道，map 容器中存储的都是 pair 类型的键值对，但几乎在所有使用 map 容器的场景中，经常要做的不是找到指定的 pair 对象（键值对），而是从该容器中找到某个键对应的值。

注意，**使用 map 容器存储的各个键值对，其键的值都是唯一的，因此指定键对应的值最多有 1 个。**

庆幸的是，map 容器的类模板中提供了以下 2 种方法，可直接获取 map 容器指定键对应的值。

1) map 类模板中对[ ]运算符进行了重载，这意味着，类似于借助数组下标可以直接访问数组中元素，通过指定的键，我们可以轻松获取 map 容器中该键对应的值。

举个例子：

```c++
#include <iostream>
#include <map>      // map
#include <string>   // string
using namespace std;
int main() {
    //创建并初始化 map 容器
    std::map<std::string, std::string>myMap{ {"STL教程","http://c.biancheng.net/stl/"},
                                             {"C语言教程","http://c.biancheng.net/c/"},
                                             {"Java教程","http://c.biancheng.net/java/"} };
    string cValue = myMap["C语言教程"];
    cout << cValue << endl;
    return 0;
}
```

可以看到，在第 11 行代码中，通过指定键的值为 "C语言教程"，借助重载的 [ ] 运算符，就可以在 myMap 容器中直接找到该键对应的值。

**注意，只有当 map 容器中确实存有包含该指定键的键值对，借助重载的 [ ] 运算符才能成功获取该键对应的值；反之，若当前 map 容器中没有包含该指定键的键值对，则此时使用 [ ] 运算符将不再是访问容器中的元素，而变成了向该 map 容器中增添一个键值对。其中，该键值对的键用 [ ] 运算符中指定的键，其对应的值取决于 map 容器规定键值对中值的数据类型，如果是基本数据类型，则值为 0；如果是 string 类型，其值为 ""，即空字符串（即使用该类型的默认值作为键值对的值）。**

举个例子：

```c++
#include <iostream>
#include <map>      // map
#include <string>   // string
using namespace std;
int main() {
    //创建空 map 容器
    std::map<std::string, int>myMap;
    int cValue = myMap["C语言教程"];
    for (auto i = myMap.begin(); i != myMap.end(); ++i) {
        cout << i->first << " "<< i->second << endl;
    }
    return 0;
}
```

显然，对于空的 myMap 容器来说，其内部没有以 "C语言教程" 为键的键值对，这种情况下如果使用 [ ] 运算符获取该键对应的值，其功能就转变成了向该 myMap 容器中添加一个<"C语言教程",0>键值对（由于 myMap 容器规定各个键值对的值的类型为 int，该类型的默认值为 0）

实际上，[ ] 运算符确实有“为 map 容器添加新键值对”的功能，但前提是要保证新添加键值对的键和当前 map 容器中已存储的键值对的键都不一样。例如：

```c++
#include <iostream>
#include <map>      // map
#include <string>   // string
using namespace std;
int main() {
    //创建空 map 容器
    std::map<string, string>myMap;
    myMap["STL教程"]="http://c.biancheng.net/java/";
    myMap["Python教程"] = "http://c.biancheng.net/python/";
    myMap["STL教程"] = "http://c.biancheng.net/stl/";
    for (auto i = myMap.begin(); i != myMap.end(); ++i) {
        cout << i->first << " " << i->second << endl;
    }
    return 0;
}
```

**注意，程序中第 9 行代码已经为 map 容器添加了一个以 "STL教程" 作为键的键值对，则第 11 行代码的作用就变成了修改该键对应的值，而不再是为 map 容器添加新键值对。**


2) 除了借助 [ ] 运算符获取 map 容器中指定键对应的值，还可以使用 at() 成员方法。和前一种方法相比，at() 成员方法也需要根据指定的键，才能从容器中找到该键对应的值；不**同之处在于，如果在当前容器中查找失败，该方法不会向容器中添加新的键值对，而是直接抛出 out_of_range 异常。**

举个例子：

```
#include <iostream>
#include <map>      // map
#include <string>   // string
using namespace std;
int main() {
    //创建并初始化 map 容器
    std::map<std::string, std::string>myMap{ {"STL教程","http://c.biancheng.net/stl/"},
                                             {"C语言教程","http://c.biancheng.net/c/"},
                                             {"Java教程","http://c.biancheng.net/java/"} };
    cout << myMap.at("C语言教程") << endl;
    //下面一行代码会引发 out_of_range 异常
    //cout << myMap.at("Python教程") << endl;
    return 0;
}
```

程序第 12 行代码处，通过 myMap 容器调用  at() 成员方法，可以成功找到键为 "C语言教程" 的键值对，并返回该键对应的值；而第 14 行代码，由于当前 myMap 容器中没有以 "Python教程" 为键的键值对，会导致 at() 成员方法查找失败，并抛出 out_of_range 异常。

除了可以直接获取指定键对应的值之外，还可以借助 find() 成员方法间接实现此目的。和以上 2 种方式不同的是，该方法返回的是一个迭代器，即如果查找成功，该迭代器指向查找到的键值对；反之，则指向 map 容器最后一个键值对之后的位置（和 end() 成功方法返回的迭代器一样）。

举个例子：

```c++
#include <iostream>
#include <map>      // map
#include <string>   // string
using namespace std;
int main() {
    //创建并初始化 map 容器
    std::map<std::string, std::string>myMap{ {"STL教程","http://c.biancheng.net/stl/"},
                                             {"C语言教程","http://c.biancheng.net/c/"},
                                             {"Java教程","http://c.biancheng.net/java/"} };
    map< std::string, std::string >::iterator myIter = myMap.find("C语言教程");
    cout << myIter->first << " " << myIter->second << endl;
    return 0;
}
```

注意，此程序中如果 find() 查找失败，会导致第 13 行代码运行出错。因为当 find() 方法查找失败时，其返回的迭代器指向的是容器中最后一个键值对之后的位置，即不指向任何有意义的键值对，也就没有所谓的 first 和 second 成员了。

如果以上方法都不适用，我们还可以遍历整个 map 容器，找到包含指定键的键值对，进而获取该键对应的值。

本节所介绍的几种方法中，仅从“在 map 容器存储的键值对中，获取指定键对应的值”的角度出发，**更推荐使用 at() 成员方法，因为该方法既简单又安全。**

### insert()方法

map 类模板中提供有 insert() 成员方法，该方法专门用来向 map 容器中插入新的键值对。

注意，这里所谓的“插入”，指的是 insert() 方法可以将新的键值对插入到 map 容器中的指定位置，但这与 map 容器会自动对存储的键值对进行排序并不冲突。当使用 insert() 方法向 map 容器的指定位置插入新键值对时，其底层会先将新键值对插入到容器的指定位置，**如果其破坏了 map 容器的有序性，该容器会对新键值对的位置进行调整。**

自 C++ 11 标准后，insert() 成员方法的用法大致有以下 4 种。

1) 无需指定插入位置，直接将键值对添加到 map 容器中。insert() 方法的语法格式有以下 2 种：

```c++
//1、引用传递一个键值对
pair<iterator,bool> insert (const value_type& val);
//2、以右值引用的方式传递键值对
template <class P>
    pair<iterator,bool> insert (P&& val);
```

其中，val 参数表示键值对变量，同时该方法会返回一个 pair 对象，其中 pair.first 表示一个迭代器，pair.second 为一个 bool 类型变量：

- 如果成功插入 val，则该迭代器指向新插入的 val，bool 值为 true；
- 如果插入 val 失败，则表明当前 map 容器中存有和 val 的键相同的键值对（用 p 表示），此时返回的迭代器指向 p，bool 值为 false。

以上 2 种语法格式的区别在于传递参数的方式不同，即无论是局部定义的键值对变量还是全局定义的键值对变量，都采用普通引用传递的方式；而对于临时的键值对变量，则以右值引用的方式传参。

举个例子：

```c++
#include <iostream>
#include <map>  //map
#include <string> //string
using namespace std;
int main()
{
    //创建一个空 map 容器
    std::map<string, string> mymap;
   
    //创建一个真实存在的键值对变量
    std::pair<string, string> STL = { "STL教程","http://c.biancheng.net/stl/" };
   
    //创建一个接收 insert() 方法返回值的 pair 对象
    std::pair<std::map<string, string>::iterator, bool> ret;
   
    //插入 STL，由于 STL 并不是临时变量，因此会以第一种方式传参
    ret = mymap.insert(STL);
    cout << "ret.iter = <{" << ret.first->first << ", " << ret.first->second << "}, " << ret.second << ">" << endl;
    //以右值引用的方式传递临时的键值对变量
    ret = mymap.insert({ "C语言教程","http://c.biancheng.net/c/" });
    cout << "ret.iter = <{" << ret.first->first << ", " << ret.first->second << "}, " << ret.second << ">" << endl;
    //插入失败样例
    ret = mymap.insert({ "STL教程","http://c.biancheng.net/java/" });
    cout << "ret.iter = <{" << ret.first->first << ", " << ret.first->second << "}, " << ret.second << ">" << endl;
    return 0;
}
```

程序执行结果为：

```
ret.iter = <{STL教程, http://c.biancheng.net/stl/}, 1>
ret.iter = <{C语言教程, http://c.biancheng.net/c/}, 1>
ret.iter = <{STL教程, http://c.biancheng.net/stl/}, 0>
```

从执行结果中不难看出，程序中共执行了 3 次插入操作，其中成功了 2 次，失败了 1 次：

- 对于插入成功的 insert() 方法，其返回的 pair 对象中包含一个指向新插入键值对的迭代器和值为 1 的 bool 变量
- 对于插入失败的 insert() 方法，同样会返回一个 pair 对象，其中包含一个指向 map 容器中键为 "STL教程" 的键值对和值为 0 的 bool 变量。

另外，在程序中的第 21 行代码，**还可以使用如下 2 种方式创建临时的键值对变量，它们是等价的**：

```c++
//调用 pair 类模板的构造函数
ret = mymap.insert(pair<string,string>{ "C语言教程","http://c.biancheng.net/c/" });
//调用 make_pair() 函数
ret = mymap.insert(make_pair("C语言教程", "http://c.biancheng.net/c/"));
```

2) 除此之外，insert() 方法还支持向 map 容器的指定位置插入新键值对，该方法的语法格式如下：

```c++
//以普通引用的方式传递 val 参数
iterator insert (const_iterator position, const value_type& val);
//以右值引用的方式传递 val 键值对参数
template <class P>
    iterator insert (const_iterator position, P&& val);
```

其中 val 为要插入的键值对变量。注意，和第 1 种方式的语法格式不同，这里 insert() 方法返回的是迭代器，而不再是 pair 对象：

- 如果插入成功，insert() 方法会返回一个指向 map 容器中已插入键值对的迭代器；
- 如果插入失败，insert() 方法同样会返回一个迭代器，该迭代器指向 map 容器中和 val 具有相同键的那个键值对。

举个例子：

```c++
#include <iostream>
#include <map>  //map
#include <string> //string
using namespace std;
int main()
{
    //创建一个空 map 容器
    std::map<string, string> mymap;
   
    //创建一个真实存在的键值对变量
    std::pair<string, string> STL = { "STL教程","http://c.biancheng.net/stl/" };
    //指定要插入的位置
    std::map<string, string>::iterator it = mymap.begin();
    //向 it 位置以普通引用的方式插入 STL
    auto iter1 = mymap.insert(it, STL);
    cout << iter1->first << " " << iter1->second << endl;
    //向 it 位置以右值引用的方式插入临时键值对
    auto iter2 = mymap.insert(it, std::pair<string, string>("C语言教程", "http://c.biancheng.net/c/"));
    cout << iter2->first << " " << iter2->second << endl;
    //插入失败样例
    auto iter3 = mymap.insert(it, std::pair<string, string>("STL教程", "http://c.biancheng.net/java/"));
    cout << iter3->first << " " << iter3->second << endl;
    return 0;
}
```

**再次强调，即便指定了新键值对的插入位置，map 容器仍会对存储的键值对进行排序。也可以说，决定新插入键值对位于 map 容器中位置的，不是 insert() 方法中传入的迭代器，而是新键值对中键的值。**

3) insert() 方法还支持向当前 map 容器中插入其它 map 容器指定区域内的所有键值对，该方法的语法格式如下：

```c++
template <class InputIterator>
  void insert (InputIterator first, InputIterator last);
```

其中 first 和 last 都是迭代器，它们的组合<first,last>可以表示某 map 容器中的指定区域。

举个例子：

```c++
#include <iostream>
#include <map>  //map
#include <string> //string
using namespace std;
int main()
{
    //创建并初始化 map 容器
    std::map<std::string, std::string>mymap{ {"STL教程","http://c.biancheng.net/stl/"},
                                                {"C语言教程","http://c.biancheng.net/c/"},
                                                {"Java教程","http://c.biancheng.net/java/"} };
    //创建一个空 map 容器
    std::map<std::string, std::string>copymap;
    //指定插入区域
    std::map<string, string>::iterator first = ++mymap.begin();
    std::map<string, string>::iterator last = mymap.end();
    //将<first,last>区域内的键值对插入到 copymap 中
    copymap.insert(first, last);
    //遍历输出 copymap 容器中的键值对
    for (auto iter = copymap.begin(); iter != copymap.end(); ++iter) {
        cout << iter->first << " " << iter->second << endl;
    }
    return 0;
}
```

4) 除了以上一种格式外，insert() 方法还允许一次向 map 容器中插入多个键值对，其语法格式为：

```c++
void insert ({val1, val2, ...});
```

其中，vali 都表示的是键值对变量。

举个例子：

```c++
#include <iostream>
#include <map>  //map
#include <string> //string
using namespace std;
int main()
{
    //创建空的 map 容器
    std::map<std::string, std::string>mymap;
    //向 mymap 容器中添加 3 个键值对
    mymap.insert({ {"STL教程", "http://c.biancheng.net/stl/"},
                   { "C语言教程","http://c.biancheng.net/c/" },
                   { "Java教程","http://c.biancheng.net/java/" } });
    for (auto iter = mymap.begin(); iter != mymap.end(); ++iter) {
        cout << iter->first << " " << iter->second << endl;
    }
    return 0;
}
```

值得一提的是，除了 insert() 方法，**map 类模板还提供 emplace() 和 emplace_hint() 方法，它们也可以完成向 map 容器中插入键值对的操作，且效率还会比insert() 方法高**。关于这 2 个方法，会在下一节做详细介绍。
### operator[]和insert()效率对比

map 容器模板类中提供有 operator[ ] 和 insert() 这 2 个成员方法，而值得一提的是，这 2 个方法具有相同的功能，它们既可以实现向 map 容器中添加新的键值对元素，也可以实现更新（修改）map 容器已存储键值对的值。

显然，map 模板类中 operator[ ] 和 insert() 的功能发生了重叠，这就产生了一个问题，谁的执行效率更高呢？

**结论：当实现“向 map 容器中添加新键值对元素”的操作时，insert() 成员方法的执行效率更高；而在实现“更新 map 容器指定键值对的值”的操作时，operator[ ] 的效率更高。**

首先解释一下，为什么实现向 map 容器中添加新键值对元素，insert() 方法的执行效率比 operator[ ] 更高？回顾程序一中，如下语句完成了向空 mymap 容器添加新的键值对元素：

```c++
mymap["STL教程"] = "http://c.biancheng.net/java/";
```

此行代码中，mymap["STL教程"] 实际上是 mymap.operator[ ](“STL教程”) 的缩写（底层调用的 operator[ ] 方法），该方法会返回一个指向 “STL教程” 对应的 value 值的引用。

但需要注意的是，由于此时 mymap 容器是空的，并没有 "STL教程" 对应的 value 值。这种情况下，operator[ ] 方法会默认构造一个 string 对象，并将其作为 "STL教程" 对应的 value 值，然后返回一个指向此 string 对象的引用。在此基础上，代码还会将 "http://c.biancheng.net.java/" 赋值给这个 string 对象。

也就是说，上面这行代码的执行流程，可以等效为如下程序：

```c++
typedef map<string, string> mstr;
//创建要添加的默认键值对元素
pair<mstr::iterator, bool>res = mymap.insert(mstr::value_type("STL教程", string()));
//将新键值对的值赋值为指定的值
res.first->second = "http://c.biancheng.net/java/";
```
可以看到，使用 operator[ ] 添加新键值对元素的流程是，先构造一个有默认值的键值对，然后再为其 value 赋值。

那么，为什么不直接构造一个要添加的键值对元素呢，比如：

```c++
mymap.insert(mstr::value_type("STL教程", "http://c.biancheng.net/java/"));
```

此行代码和上面程序的执行效果完全相同，但它省略了创建临时 string 对象的过程以及析构该对象的过程，同时还省略了调用 string 类重载的赋值运算符。由于可见，同样是完成向 map 容器添加新键值对，insert() 方法比 operator[ ] 的执行效率更高

仍以程序一中的代码为例，如下分别是 operator[ ] 和 insert() 实现更新 mymap 容器中指定键对应的值的代码：

```
//operator[]
mymap["STL教程"] = "http://c.biancheng.net/stl/";
//insert()
std::pair<string, string> STL = { "Java教程","http://c.biancheng.net/python/" };
mymap.insert(STL).first->second = "http://c.biancheng.net/java/";
```

仅仅从语法形式本身来考虑，或许已经促使很多读者选择 operator[ ] 了。接下来，我们再从执行效率的角度对比以上 2 种实现方式。

从上面代码可以看到，insert() 方法在进行更新操作之前，需要有一个 pair 类型（也就是 map::value_type 类型）元素做参数。这意味着，该方法要多构造一个 pair 对象（附带要构造 2 个 string 对象），并且事后还要析构此 pair 对象（附带 2 个 string 对象的析构）。

而和 insert() 方法相比，operator[ ] 就不需要使用 pair 对象，自然不需要构造（并析构）任何 pair 对象或者 string 对象。因此，对于更新已经存储在 map 容器中键值对的值，应优先使用 operator[ ] 方法。

### emplace()和emplace_hint()方法

和 insert() 方法相比，emplace() 和 emplace_hint() 方法的使用要简单很多，因为它们各自只有一种语法格式。其中，emplace() 方法的语法格式如下：

```c++
template <class... Args>
  pair<iterator,bool> emplace (Args&&... args);
```

参数 (Args&&... args) 指的是，这里只需要将创建新键值对所需的数据作为参数直接传入即可，此方法可以自行利用这些数据构建出指定的键值对。另外，该方法的返回值也是一个 pair 对象，其中 pair.first 为一个迭代器，pair.second 为一个 bool 类型变量：
当该方法将键值对成功插入到 map 容器中时，其返回的迭代器指向该新插入的键值对，同时 bool 变量的值为 true；
当插入失败时，则表明 map 容器中存在具有相同键的键值对，此时返回的迭代器指向此具有相同键的键值对，同时 bool 变量的值为 false。

下面程序演示 emplace() 方法的具体用法：

```c++
#include <iostream>
#include <map>  //map
#include <string> //string
using namespace std;
int main()
{
    //创建并初始化 map 容器
    std::map<string, string>mymap;
    //插入键值对
    pair<map<string, string>::iterator, bool> ret = mymap.emplace("STL教程", "http://c.biancheng.net/stl/");
    cout << "1、ret.iter = <{" << ret.first->first << ", " << ret.first->second << "}, " << ret.second << ">" << endl;
    //插入新键值对
    ret = mymap.emplace("C语言教程", "http://c.biancheng.net/c/");
    cout << "2、ret.iter = <{" << ret.first->first << ", " << ret.first->second << "}, " << ret.second << ">" << endl;
    //失败插入的样例
    ret = mymap.emplace("STL教程", "http://c.biancheng.net/java/");
    cout << "3、ret.iter = <{" << ret.first->first << ", " << ret.first->second << "}, " << ret.second << ">" << endl;
    return 0;
}
```

可以看到，程序中共执行了 3 次向 map 容器插入键值对的操作，其中前 2 次都成功了，第 3 次由于要插入的键值对的键和 map 容器中已存在的键值对的键相同，因此插入失败。

emplace_hint() 方法的功能和 emplace() 类似，其语法格式如下：

```c++
template <class... Args>
  iterator emplace_hint (const_iterator position, Args&&... args);
```

显然和 emplace() 语法格式相比，有以下 2 点不同：

- 该方法不仅要传入创建键值对所需要的数据，还需要传入一个迭代器作为第一个参数，指明要插入的位置（新键值对键会插入到该迭代器指向的键值对的前面）；
- 该方法的返回值是一个迭代器，而不再是 pair 对象。当成功插入新键值对时，返回的迭代器指向新插入的键值对；反之，如果插入失败，则表明 map 容器中存有相同键的键值对，返回的迭代器就指向这个键值对。

注意，和 insert() 方法一样，虽然 emplace_hint() 方法指定了插入键值对的位置，但 map 容器为了保持存储键值对的有序状态，可能会移动其位置。

### 插入效率

上一节在学习 C++STL map 容器的 emplace() 和 emplace_hint() 的基本用法时，还遗留了一个问题，即为什么 emplace() 和 emplace_hint() 的执行效率会比 insert() 高？

原因很简单，它们向 map 容器插入键值对时，底层的实现方式不同：

- 使用 insert() 向 map 容器中插入键值对的过程是，先创建该键值对，然后再将该键值对复制或者移动到 map 容器中的指定位置；
- 使用 emplace() 或 emplace_hint() 插入键值对的过程是，直接在 map 容器中的指定位置构造该键值对。

也就是说，向 map 容器中插入键值对时，emplace() 和 emplace_hint() 方法都省略了移动键值对的过程，因此执行效率更高。下面程序提供了有利的证明：

```c++
#include <iostream>
#include <map>  //map
#include <string> //string
using namespace std;

class testDemo
{
public:
    testDemo(int num) :num(num) {
        std::cout << "调用构造函数" << endl;
    }
    testDemo(const testDemo& other) :num(other.num) {
        std::cout << "调用拷贝构造函数" << endl;
    }
    testDemo(testDemo&& other) :num(other.num) {
        std::cout << "调用移动构造函数" << endl;
    }
private:
    int num;
};

int main()
{
    //创建空 map 容器
    std::map<std::string, testDemo>mymap;

    cout << "insert():" << endl;
    mymap.insert({ "http://c.biancheng.net/stl/", testDemo(1) });
   
    cout << "emplace():" << endl;
    mymap.emplace( "http://c.biancheng.net/stl/:", 1);

    cout << "emplace_hint():" << endl;
    mymap.emplace_hint(mymap.begin(), "http://c.biancheng.net/stl/", 1);
    return 0;
}
```

程序输出结果为：

```
insert():
调用构造函数
调用移动构造函数
调用移动构造函数
emplace():
调用构造函数
emplace_hint():
调用构造函数
```

分析一下这个程序。首先，我们创建了一个存储 <string,tempDemo> 类型键值对的空 map 容器，接下来分别用 insert()、emplace() 和 emplace_hint() 方法向该 map 容器中插入相同的键值对。

从输出结果可以看出，在使用 insert() 方法向 map 容器插入键值对时，整个插入过程调用了 1 次 tempDemo 类的构造函数，同时还调用了 2 次移动构造函数。实际上，程序第 28 行代码底层的执行过程，可以分解为以下 3 步：

```c++
//构造类对象
testDemo val = testDemo(1); //调用 1 次构造函数
//构造键值对
auto pai = make_pair("http://c.biancheng.net/stl/", val); //调用 1 次移动构造函数
//完成插入操作
mymap.insert(pai); //调用 1 次移动构造函数
```

而完成同样的插入操作，emplace() 和 emplace_hint() 方法都只调用了 1 次构造函数，这足以证明，这 2 个方法是在 map 容器内部直接构造的键值对。