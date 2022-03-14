---
title: LeetCode第二题：两数相加
notshow: false
tags:
  - 链表
categories:
  - LeetCode
abbrlink: '22719e96'
date: 2021-05-18 23:19:13
---

引言：本文主要分析LeetCode第二题，Python和C++实现；并对链表做了简单说明。

<!--more-->

### 题目

给你两个 非空 的链表，表示两个非负的整数。它们每位数字都是按照 逆序 的方式存储的，并且每个节点只能存储 一位 数字。

请你将两个数相加，并以相同形式返回一个表示和的链表。

你可以假设除了数字 0 之外，这两个数都不会以 0 开头。

### 示例

**示例1：**

![addtwonumber1.jpg](https://i.loli.net/2021/05/18/7lnuBY3hgVbz5PN.jpg)

```
输入：l1 = [2,4,3], l2 = [5,6,4]
输出：[7,0,8]
解释：342 + 465 = 807.
```

**示例2：**

```
输入：l1 = [0], l2 = [0]
输出：[0]
```

**示例3：**

```
输入：l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
输出：[8,9,9,9,0,0,0,1]
```

**提示：**

- 每个链表中的节点数在范围 `[1, 100]` 内
- `0 <= Node.val <= 9`
- 题目数据保证列表表示的数字不含前导零

### 分析

1.注意链表是一种数据结构，不同于python中的list

2.注意最后的进位不要忘记

3.本题的精髓在于这个while循环，可以不用补齐使得两个链表长度相等

### 实现

#### python

```python
def addTwoNumbers(l1: ListNode, l2: ListNode) -> ListNode:
    head = result = ListNode()
    carry = False
    while l1 or l2:
        val = 0
        if l1:
            val += l1.val
            l1 = l1.next
        if l2:
            val += l2.val
            l2 = l2.next
        if carry:
            val+=1	#注意在python中没有自增和自减运算符！
        carry = (val >= 10)
        val = val % 10;
        result.next = ListNode(val)
        result = result.next
    if carry:
        result.next = ListNode(1)
    return head.next
```

#### c++

```c++
ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
    ListNode *head = new ListNode(0);
    ListNode *result = head;
    bool carry = false;
    while(l1 != nullptr || l2 != nullptr || carry) {
        int sum = 0;
        if(l1 != nullptr) {
            sum += l1->val;
            l1 = l1->next;
        }
        if(l2 != nullptr) {
            sum += l2->val;
            l2 = l2->next;
        }
        if(carry) {
            sum++;
        }
        int res = sum % 10;
        // result->next->val = res;    // 错误，事先不存在，注意开辟空间，而不是赋值
        result->next = new ListNode(res);
        result = result->next;
        carry = (sum >= 10) ? true : false; 
    }
    return head->next;
}
```

### 拓展

数据结构：[链表](http://zsh4614.cn/2021/05/18/%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E5%8F%8A%E5%AE%9E%E7%8E%B0%EF%BC%9A%E6%95%B0%E7%BB%84%E5%92%8C%E9%93%BE%E8%A1%A8/)