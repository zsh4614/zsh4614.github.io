---
title: LeetCode第一百六十题：相交链表
notshow: false
date: 2022-01-17 23:01:11
tags:
- 链表
-  哈希
categories:
- Leetcode
---
引言：本文主要介绍LeetCode第一百六十题，判断两个链表是否相交，并找出相交的结点。
<!--more-->
### 题目
给你两个单链表的头节点 headA 和 headB ，请你找出并返回两个单链表相交的起始节点。如果两个链表不存在相交节点，返回 null 。

图示两个链表在节点 c1 开始相交：

![image.png](https://s2.loli.net/2022/01/17/xf6UjXkD2TeWI3F.png)

题目数据 保证 整个链式结构中不存在环。

注意，函数返回结果后，链表必须 保持其原始结构 。

### 示例

**示例1**

![image.png](https://s2.loli.net/2022/01/17/deKrCEjBOtQgmWI.png)

```
输入：intersectVal = 8, listA = [4,1,8,4,5], listB = [5,6,1,8,4,5], skipA = 2, skipB = 3
输出：Intersected at '8'
解释：相交节点的值为 8 （注意，如果两个链表相交则不能为 0）。
从各自的表头开始算起，链表 A 为 [4,1,8,4,5]，链表 B 为 [5,6,1,8,4,5]。
在 A 中，相交节点前有 2 个节点；在 B 中，相交节点前有 3 个节点。
```

**示例2**

![image.png](https://s2.loli.net/2022/01/17/pec9sSCqiohBu5r.png)

```
输入：intersectVal = 2, listA = [1,9,1,2,4], listB = [3,2,4], skipA = 3, skipB = 1
输出：Intersected at '2'
解释：相交节点的值为 2 （注意，如果两个链表相交则不能为 0）。
从各自的表头开始算起，链表 A 为 [1,9,1,2,4]，链表 B 为 [3,2,4]。
在 A 中，相交节点前有 3 个节点；在 B 中，相交节点前有 1 个节点。
```

**示例3**

![image.png](https://s2.loli.net/2022/01/17/hEXnDypY7I56LfO.png)

```
输入：intersectVal = 0, listA = [2,6,4], listB = [1,5], skipA = 3, skipB = 2
输出：null
解释：从各自的表头开始算起，链表 A 为 [2,6,4]，链表 B 为 [1,5]。
由于这两个链表不相交，所以 intersectVal 必须为 0，而 skipA 和 skipB 可以是任意值。
这两个链表不相交，因此返回 null 。
```

**提示：**

- listA 中节点数目为 m
- listB 中节点数目为 n
- 1 <= m, n <= 3 * 104
- 1 <= Node.val <= 105
- 0 <= skipA <= m
- 0 <= skipB <= n
- 如果 listA 和 listB 没有交点，intersectVal 为 0
- 如果 listA 和 listB 有交点，intersectVal == listA[skipA] == listB[skipB]

### 分析
如果只是判断两个链表是否相交，那么就很简单了，只需要判断最后一个结点是否是同一个结点。但是本题要返回相交的那个结点，一个最直接的思路是使用哈希表，先将一个链表的每个结点地址存储起来，然后在遍历第二个链表的时候去查表，这样时间复杂度是O(m+n)，空间复杂度为O(m)。另一种常用的思路是用双指针，同时遍历两个链表，当遍历到尾结点的时候，指向另一个链表的头结点，这样如果有相交的话，那么一定会指到同一个结点上；如果不相交的话，那么最后他们一定同时指向nullptr。

### 实现
**方法一：哈希**

```c++
ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
	unordered_set<ListNode*> hashset;
	while (headA != nullptr) {
		hashset.emplace(headA);
		headA = headA->next;
	}
	while (headB != nullptr) {
		if (hashset.find(headB) != nullptr) {
			return headB;
		}
		headB = headB->next;
	}
	return nullptr;
}
```

**方法二：双指针**

```
ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
    ListNode* workA = headA;
    ListNode* workB = headB;
    while (true) {
        
        if (workA == workB) {
            return workB;
        }
        workA = workA->next;
        workB = workB->next;
        if (workA == workB) {
            if (workB == nullptr) {
                return nullptr;

            }
        }
        if (workA == nullptr) {
            workA = headB;
        }
        if (workB == nullptr) {
            workB = headA;
        }
    }
}
```

类似的思路，看一下大神写的代码：

```
class Solution {
public:
    ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
        if (headA == nullptr || headB == nullptr) {
            return nullptr;
        }
        ListNode *pA = headA, *pB = headB;
        while (pA != pB) {
            pA = pA == nullptr ? headB : pA->next;
            pB = pB == nullptr ? headA : pB->next;
        }
        return pA;
    }
};
```
NB!!!