---
title: LeetCode第一百四十二题：环形链表二
notshow: false
date: 2022-01-16 16:40:10
tags:
- 链表
- 判圈算法
categories:
- LeetCode
---
引言：本文主要分析LeetCode第一百四十二题，判断一个链表是否有环，有环的话找到入环的结点，用佛洛依德判圈算法实现。

<!--more-->

### 题目：

给定一个链表，返回链表开始入环的第一个节点。 如果链表无环，则返回 null。
		
如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。如果 pos 是 -1，则在该链表中没有环。注意：pos 不作为参数进行传递，仅仅是为了标识链表的实际情况。

不允许修改链表。

### 示例
**示例一**

![image.png](https://s2.loli.net/2022/01/16/p4XMYle9k8yqxwm.png)

```
输入：head = [3,2,0,-4], pos = 1
输出：返回索引为 1 的链表节点
解释：链表中有一个环，其尾部连接到第二个节点。
```

**示例二**

![image.png](https://s2.loli.net/2022/01/16/v8whclNoCksYBQT.png)

```
输入：head = [1,2], pos = 0
输出：返回索引为 0 的链表节点
解释：链表中有一个环，其尾部连接到第一个节点。
```

**示例三**

![image.png](https://s2.loli.net/2022/01/16/2PmvFTZqnyrhkap.png)

```
输入：head = [1], pos = -1
输出：返回 null
解释：链表中没有环。
```

**提示：**

- 链表中节点的数目范围在范围 [0, 10^4] 内
- -10^5 <= Node.val <= 10^5
- pos 的值为 -1 或者链表中的一个有效索引


### 分析
本题可使用佛洛依德判圈算法求解。

### 实现

```c++
ListNode *detectCycle(ListNode *head) {
    ListNode* dummy1 = new ListNode(0);
    ListNode* slow = dummy1;
    ListNode* dummy2 = new ListNode(0);
    ListNode* fast = dummy2;
    slow->next = head;
    fast->next = head;
    
    while (fast != nullptr && fast->next != nullptr) {
        if (fast == slow) {
            fast = head;
            while (fast != slow->next) {
                fast = fast->next;
                slow = slow->next;
            }
            delete dummy1, dummy2;
            return fast;
        }
        slow = slow->next;
        fast = fast->next->next;
    } 
    delete dummy1, dummy2;
    return nullptr;
}
```
注意：这里虚拟了一个dummy结点，这样可以将头结点当作一般结点看待，否则可能需要判断头结点为空的情况，这样做就不用单独判断了。另外**新开辟的无用内存，在返回前一定要释放，否则会内存泄漏**，这里的slow和fast相当于工作结点。