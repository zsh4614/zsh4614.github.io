---
title: LeetCode第十九题：删除链表的倒数第 N 个结点
notshow: false
date: 2022-01-23 00:42:00
tags:
- 链表
- stack
- 双指针
categories:
- LeetCode
---

引言：本文主要介绍LeetCode第十九题，删除链表的倒数第N个结点，并给出c++实现。
<!--more-->

###  题目
给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。

**示例1**

![image.png](https://s2.loli.net/2022/01/24/Nyuo2cVLTt3iQ8z.png)

```
输入：head = [1,2,3,4,5], n = 2
输出：[1,2,3,5]
```

**示例2**

```
输入：head = [1], n = 1
输出：[]
```

**示例3**

```
输入：head = [1,2], n = 1
输出：[1]
```

**提示：**

- 链表中结点的数目为 sz
- 1 <= sz <= 30
- 0 <= Node.val <= 100
- 1 <= n <= sz

### 分析
因为只有遍历才能求链表的长度，所以最常想到的方法就是遍历链表求长度l，删除倒数第n个结点，也就知道了删除正数第几个结点，这种方法效率较低，这里就不实现了；第二种方法就是用双指针，让第一个指针始终领先第二个指针n个结点，这样当第一个结点在链表尾结点上时，第二个结点正好在倒数第n个结点的前一个结点；第三种方法是使用stack实现。

### 实现

**双指针**

```c++
ListNode* removeNthFromEnd(ListNode* head, int n) {
	ListNode* dummy = new ListNode(0, head);
      ListNode* first = head;
      ListNode* second = dummy;
    	for (int i = 0; i < n; ++i) {
      		first = first->next;
	}
	while (first) {
	    first = first->next;
	    second = second->next;
	}
	second->next = second->next->next;
	ListNode* ans = dummy->next;
	delete dummy;
	return ans;	
}
```
注意：用到node->next  一定要保证node不为空结点，避免为空的一个好方法是使用哨兵结点。

**stack**

```c++
ListNode* removeNthFromEnd(ListNode* head, int n) {
	ListNode* work = head;
	ListNode* dummy = new ListNode(0, head);
	std::stack<ListNode*> stack;
	stack.push(dummy);
	while (work) {
	    stack.push(work);
	    work = work->next;
	}
	for (int i = 0; i < n; ++i) {
	    stack.pop();
	}
	stack.top()->next = stack.top()->next->next;
	ListNode* res = dummy->next;
	delete dummy;
	return res;
}
```
