---
title: LeetCode第二百零六题：反转链表
notshow: false
tags:
  - 链表
  - 递归
  - stack
categories:
  - LeetCode
abbrlink: ccbd75e7
date: 2022-01-20 22:32:30
---
引言：本文主要介绍LeetCode第二百零六题，将一个链表进行反转。

<!--more-->
### 题目
给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。
**示例1**

![image.png](https://s2.loli.net/2022/01/20/h8WBedLgsJ6qRYw.png)

```
输入：head = [1,2,3,4,5]
输出：[5,4,3,2,1]
```

**示例2**

![image.png](https://s2.loli.net/2022/01/20/8IV4ybzfQXGHJxi.png)

```
输入：head = [1,2]
输出：[2,1]
```

**示例3**

```
输入：head = []
输出：[]
```

**提示**

- 链表中节点的数目范围是 [0, 5000]
- -5000 <= Node.val <= 5000

### 分析

**要深刻理解链表的结构，每个结点在存储上并不连续，他们之间的关系就是指针的指向，所以反转一个链表就是将每个结点的指针域由指向后一个结点变成指向前一个结点即可**；另一种思路是递归，这种思路比较好想到，但是实现起来需要一定的功底；工程中应尽量避免递归，基本上所有的递归都能改成用stack和dfs实现，这个也不例外，而且stack是先进后出，很适合这种反转操作。

### 实现

**迭代**

```c++
ListNode* reverseList(ListNode* head) {
    ListNode* pre = nullptr;
    ListNode* cur = head; 
    while (cur != nullptr) {
        ListNode* next = cur->next;
        cur->next = pre;
        pre = cur;
        cur = next;
    }
    return pre;
}
```
时间复杂度：O(n)

空间复杂度：O(1)


**递归**

```c++
ListNode* reverseList(ListNode* head) {
    if (head == nullptr) {
        return nullptr;
    } 
    if (head->next == nullptr) {
        return head;
    }
    ListNode* end = head->next;
    ListNode* new_head = reverseList(head->next);
    end->next = head;
    end->next->next = nullptr;
    return new_head;
}
```
时间复杂度：O(n)

空间复杂度：O(n)

注意：在递归的写法中，前面两个判断条件可以写成同一个，都返回head；另外`head == nullptr`可以写成`!head`；需要注意递归方法的时间复杂度。

**stack**

```c++
ListNode* reverseList(ListNode* head) {
    if (!head) {
        return nullptr;
    }
    std::stack<ListNode*> stack;
    while (head != nullptr) {
        stack.push(head);
        head = head->next;
    }
    ListNode* res = stack.top();
    while (!stack.empty()) {
        ListNode* top = stack.top();
        stack.pop();
        if (!stack.empty()) {
            top->next = stack.top();
        } else {
            top->next = nullptr;
        }
    }
    return res;
}
```

时间复杂度：O(n)

空间复杂度：O(n)




