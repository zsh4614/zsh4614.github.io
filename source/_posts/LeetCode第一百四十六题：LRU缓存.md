---
title: LeetCode第一百四十六题：LRU缓存
notshow: false
tags:
  - 链表
  - 双向链表
  - 哈希
  - list
  - 缓存
categories:
  - LeetCode
abbrlink: c8e0ab74
date: 2022-01-24 23:24:38
---

引言：本文主要介绍LeetCode第一百四十六题，设计一个LRU缓存，并给出c++实现

<!--more-->

### 题目
请你设计并实现一个满足`LRU (最近最少使用) 缓存`约束的数据结构。
实现 LRUCache 类：

- LRUCache(int capacity) 以 正整数 作为容量 capacity 初始化 LRU 缓存
- int get(int key) 如果关键字 key 存在于缓存中，则返回关键字的值，否则返回 -1 。
- void put(int key, int value) 如果关键字 key 已经存在，则变更其数据值 value ；如果不存在，则向缓存中插入该组 key-value 。如果插入操作导致关键字数量超过 capacity ，则应该 逐出 最久未使用的关键字。
- 函数 get 和 put 必须以 O(1) 的平均时间复杂度运行。

**示例**

```
输入
["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
输出
[null, null, null, 1, null, -1, null, -1, 3, 4]

解释
LRUCache lRUCache = new LRUCache(2);
lRUCache.put(1, 1); // 缓存是 {1=1}
lRUCache.put(2, 2); // 缓存是 {1=1, 2=2}
lRUCache.get(1);    // 返回 1
lRUCache.put(3, 3); // 该操作会使得关键字 2 作废，缓存是 {1=1, 3=3}
lRUCache.get(2);    // 返回 -1 (未找到)
lRUCache.put(4, 4); // 该操作会使得关键字 1 作废，缓存是 {4=4, 3=3}
lRUCache.get(1);    // 返回 -1 (未找到)
lRUCache.get(3);    // 返回 3
lRUCache.get(4);    // 返回 4
```

提示：

- 1 <= capacity <= 3000
- 0 <= key <= 10000
- 0 <= value <= 105
- 最多调用 2 * 105 次 get 和 put

### 分析
LRU缓存用哈希表+双向链表实现，双向链表一般都会用到虚拟的头结点和尾结点，用来防止处理边界，在c++中，unordered_map是用哈希表实现的，list是用双向链表实现的，所以如果不用自己实现底层的话，直接用这两个容器就行，双向链表的实现比较简单，而哈希映射的实现就复杂了，所以这里只给出双向链表自己实现的写法。

### 实现

**双向链表+哈希**

```c++
class DoubleLinkedListNode {
public:
    DoubleLinkedListNode() : key(0), val(0), pre(nullptr), next(nullptr) {}
    DoubleLinkedListNode(int key_, int val_) : key(key_), val(val_), pre(nullptr), next(nullptr) {}
    DoubleLinkedListNode(int key_, int val_, DoubleLinkedListNode* pre_, DoubleLinkedListNode* next_) : key(key_), val(val_), pre(pre_), next(next_) {}
    int key;
    int val;
    DoubleLinkedListNode* pre;
    DoubleLinkedListNode* next;
};

class LRUCache {
public:
    LRUCache(int capacity) : m_capacity(capacity), m_size(0) {
        head = new DoubleLinkedListNode();
        tail = new DoubleLinkedListNode();
        head->next = tail;
        tail->pre = head;
    }

    int get(int key) {
        if (hashmap.find(key) == hashmap.end()) {
            return -1;
        } else {
            // 将查找到的结点放到第一个位置
            hashmap[key]->pre->next = hashmap[key]->next;
            hashmap[key]->next->pre = hashmap[key]->pre;
            hashmap[key]->pre = head;
            hashmap[key]->next = head->next;
            head->next->pre = hashmap[key];
            head->next = hashmap[key];
            return hashmap[key]->val;
        }
    }

    void put(int key, int value) {
        if (hashmap.find(key) == hashmap.end()) {
            // 不存在，则添加到双链表的第一个位置
            hashmap[key] = new DoubleLinkedListNode(key, value);
            hashmap[key]->pre = head;
            hashmap[key]->next = head->next;
            head->next->pre = hashmap[key];
            head->next = hashmap[key];
            // 如果超过长度，则删除最后一个节点，同时删除哈希表中的值
            if ((++m_size) > m_capacity) {
                DoubleLinkedListNode* last = tail->pre;
                tail->pre->pre->next = tail;
                tail->pre = tail->pre->pre;
                m_size--;
                hashmap.erase(last->key);
                delete last;
            }
        } else {
            // 存在, 更新值，并移动到第一个位置
            hashmap[key]->val = value;
            hashmap[key]->pre->next = hashmap[key]->next;
            hashmap[key]->next->pre = hashmap[key]->pre;
            hashmap[key]->pre = head;
            hashmap[key]->next = head->next;
            head->next->pre = hashmap[key];
            head->next = hashmap[key];
        }
    }

    int m_size;
    int m_capacity;
    std::unordered_map<int, DoubleLinkedListNode*> hashmap;
    DoubleLinkedListNode* head;
    DoubleLinkedListNode* tail;
};
```
注意：删除某个结点的时候，一定要同步删除哈希表中对应的元素，而这个元素，也就是键，必须通过双向链表中要删除的结点获取，所以双向链表中不能只存储值。

**list+unordered_map**

```c++
class LRUCache {
public:
    LRUCache(int capacity) : cap(capacity) {
    }

    int get(int key) {
        if (map.find(key) == map.end()) return -1;
        auto key_value = *map[key];
        cache.erase(map[key]);
        cache.push_front(key_value);
        map[key] = cache.begin();
        return key_value.second;
    }

    void put(int key, int value) {
        if (map.find(key) == map.end()) {
            if (map.size() == cap) {
                map.erase(cache.back().first);
                cache.pop_back();
            }
        }
        else {
            cache.erase(map[key]);
        }
        cache.push_front({key, value});
        map[key] = cache.begin();
    }
private:
    int cap;
    list<pair<int, int>> cache;
    unordered_map<int, list<pair<int, int>>::iterator> map;
};
```
注意：list容器有一个特别的地方就是它的size()接口的时间复杂度并不是像其他容器一样复杂度为1，而是O(n)，n是list的长度，这样设计有其他的考量，具体可以参考[这里](https://blog.csdn.net/zhwenx3/article/details/89163574)。

### 拓展

缓存是一种广义的概念，在计算机存储层次结构中，低一层的存储器都可以看做是高一层的缓存。比如Cache是内存的缓存，内存是硬盘的缓存，硬盘是网络的缓存等等。

缓存可以有效地解决存储器性能与容量的这对矛盾，但绝非看上去那么简单。如果缓存算法设计不当，非但不能提高访问速度，反而会使系统变得更慢。

从本质上来说，缓存之所以有效是因为程序和数据的局部性（locality）。程序会按固定的顺序执行，数据会存放在连续的内存空间并反复读写。这些特点使得我们可以缓存那些经常用到的数据，从而提高读写速度。

缓存的大小是固定的，它应该只保存最常被访问的那些数据。然而未来不可预知，我们只能从过去的访问序列做预测，于是就有了各种各样的缓存替换策略。

我们以内存访问为例解释缓存的工作原理。假设缓存的大小固定，初始状态为空。每发生一次读内存操作，首先查找待读取的数据是否存在于缓存中，若是，则缓存命中，返回数据；若否，则缓存未命中，从内存中读取数据，并把该数据添加到缓存中。向缓存添加数据时，如果缓存已满，则需要删除访问时间最早的那条数据，这种更新缓存的方法就叫做LRU。

实现LRU时，我们需要关注它的读性能和写性能，理想的LRU应该可以在O(1)的时间内读取一条数据或更新一条数据，也就是说读写的时间复杂度都是O(1)。

此时很容易想到使用HashMap，根据数据的键访问数据可以达到O(1)的速度。但是更新缓存的速度却无法达到O(1)，因为需要确定哪一条数据的访问时间最早，这需要遍历所有缓存才能找到。

因此，我们需要一种既按访问时间排序，又能在常数时间内随机访问的数据结构。

这可以通过HashMap+双向链表实现。HashMap保证通过key访问数据的时间为O(1)，双向链表则按照访问时间的顺序依次穿过每个数据。之所以选择双向链表而不是单链表，是为了可以从中间任意结点修改链表结构，而不必从头结点开始遍历。
