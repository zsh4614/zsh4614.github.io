---
title: LeetCode第一题：两数之和
notshow: false
tags:
  - 哈希
categories:
  - LeetCode
abbrlink: 67be5542
date: 2021-05-17 23:54:17
---

引言：本文主要分析LeetCode第一题，Python和C++实现；并对哈希做了简单说明。

<!--more-->

### 题目

给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 的那 两个 整数，并返回它们的数组下标。
你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。
你可以按任意顺序返回答案。

###  示例 
输入：nums = [2,7,11,15], target = 9
输出：[0,1]
解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。

### 分析

1.注意题目输出下标，同时注意条件约束：返回结果不能是同一个元素的下标，但是可以使两个相等的元素的下标。

2.最直观的想法是两层循环嵌套，时间复杂度O(n^2^)

3.耗时主要在查找上，由于哈希查找的时间复杂度为O(1)，所以采用哈希

### 实现

#### Python

```python
def twoSum(nums, target):
    hashmap = {}
    for i, num in enumerate(nums):
        if target - num in hashmap:
            return [i, hashmap.get(target - num)]
        hashmap[num] = i
        # 注意，hashmap[num] = i一定要写在if之后，否则不能返回两个元素相等的情况
```

- 小技巧：访问字典最好使用dict.get(key)而不是使用dict[key]，因为当key不存在时前者会返回None，而后者会抛出异常。

#### C++

```c++
vector<int> twoSum(vector<int>& nums, int target) {
    map<int, int> hashmap;
    vector<int> result(2, -1);	// 初始化存放结果的容器为{-1， -1}
    for(int i = 0; i < nums.size(); ++i) {
        if(hashmap.count(target - nums[i]) > 0) {
            result[0] = i;
            result[1] = hashmap[target - nums[i]];
            break;
        }
        hashmap[nums[i]] = i;
    }
    return result;
}
```

### 拓展

#### 什么是哈希表？

哈希表（Hash table，也叫散列表），是根据关键码值(Key value)而直接进行访问的数据结构。也就是说，它通过把关键码值映射到表中一个位置来访问记录，以加快查找的速度。这个映射函数叫做散列函数，存放记录的数组叫做散列表。

记录的存储位置=f(关键字)

这里的对应关系f称为散列函数，又称为哈希（Hash函数），采用散列技术将记录存储在一块连续的存储空间中，这块连续存储空间称为散列表或哈希表（Hash table）。

哈希表hashtable(key，value) 就是把Key通过一个固定的算法函数既所谓的哈希函数转换成一个整型数字，然后就将该数字对数组长度进行取余，取余结果就当作数组的下标，将value存储在以该数字为下标的数组空间里。（或者：把任意长度的输入（又叫做预映射， pre-image），通过散列算法，变换成固定长度的输出，该输出就是散列值。这种转换是一种压缩映射，也就是，散列值的空间通常远小于输入的空间，不同的输入可能会散列成相同的输出，而不可能从散列值来唯一的确定输入值。简单的说就是一种将任意长度的消息压缩到某一固定长度的消息摘要的函数。）
而当使用哈希表进行查询的时候，就是再次使用哈希函数将key转换为对应的数组下标，并定位到该空间获取value，如此一来，就可以充分利用到数组的定位性能进行数据定位。

#### Hash的应用

1、Hash主要用于信息安全领域中加密算法，它把一些不同长度的信息转化成杂乱的128位的编码,这些编码值叫做Hash值. 也可以说，Hash就是找到一种数据内容和数据存放地址之间的映射关系。

2、查找：哈希表，又称为散列，是一种更加快捷的查找技术。我们之前的查找，都是这样一种思路：集合中拿出来一个元素，看看是否与我们要找的相等，如果不等，缩小范围，继续查找。而哈希表是完全另外一种思路：当我知道key值以后，我就可以直接计算出这个元素在集合中的位置，根本不需要一次又一次的查找！

举一个例子，假如我的数组A中，第i个元素里面装的key就是i，那么数字3肯定是在第3个位置，数字10肯定是在第10个位置。哈希表就是利用利用这种基本的思想，建立一个从key到位置的函数，然后进行直接计算查找。

3、Hash表在海量数据处理中有着广泛应用。



