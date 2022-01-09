---
title: LeetCode第二十一题：合并两个有序链表
notshow: false
date: 2022-01-09 23:12:40
tags:
- 链表
- 递归
categories:
- LeetCode
---

引言：本文主要分析LeetCode第二十一题，合并两个有序链表，用迭代和递归两种方法实现。
<!--more-->
### 题目
将两个升序链表合并为一个新的 升序 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。 

### 示例
![image.png](https://s2.loli.net/2022/01/09/L8AQHIcVbtk1ZUe.png)

示例1

```
输入：l1 = [1,2,4], l2 = [1,3,4]
输出：[1,1,2,3,4,4]
```

**示例2**

```
输入：l1 = [], l2 = []
输出：[]
```

**示例3**

```
输入：l1 = [], l2 = [0]
输出：[0]
```

**提示：**

- 0 <= s.length <= 5 * 104
- s由英文字母、数字、符号和空格组成

### 分析
该题目常规思路就是迭代两个链表的结点，比较大小，小的往后面移动一个结点，然后再比较大小，如此迭代下去，直到一个链表指针域为空，然后把另一个链表接上即可；另一种思路是递归，这种方法比较巧妙

![image.png](https://s2.loli.net/2022/01/09/BrE9Dsg1YaKXQvc.png)

但是需要考虑其中一个为空的情况，作为迭代的出口。

### 实现

#### 方法一(迭代)

```c++
ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
	ListNode *work = new ListNode(0);
	ListNode *dummy = work;
	while(list1 != nullptr && list2 != nullptr) {
		ListNode* &tmp = list1->val < list2->val ? list1 : list2;
		work->next = tmp;
		work = work->next;
		tmp = tmp->next;
	}
	work->next = (list1 == nullptr) ? list2 : list1;
	return dummy->next;
}
```

#### 方法二(递归)

```c++
ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
	if (list1 == nullptr) {
		return list2;
	}
	if (list2 == nullptr) {
		return list1;
	}
	if (list1->val < list2->val) {
		list1->next = mergeTwoLists(list1->next, list2);
		return list1;
	} else {
		list2->next = mergeTwoLists(list1, list2->next);
		return list2;
	}
}
```
#### 总结

链表中常用到dummy结点，用来解决头结点问题，这样可以使得头结点和一般结点没有什么区别，注意灵活应用。