---
title: Leetcode第二百三十四题：回文链表
notshow: false
tags:
  - 链表
  - 双指针
categories:
  - LeetCode
abbrlink: fa133c22
date: 2022-01-21 23:53:46
---

引言：本文主要介绍LeetCode第二百三十四题，判断一个链表是否是回文链表，并给出c++实现。

<!--more-->

### 题目
给你一个单链表的头节点 head ，请你判断该链表是否为回文链表。如果是，返回 true ；否则，返回 false 。

**示例1**

![image.png](https://s2.loli.net/2022/01/21/ZG1w5Au2j8v9KsT.png)

```
输入：head = [1,2,2,1]
输出：true
```

**示例2**

![image.png](https://s2.loli.net/2022/01/21/DcblhSoI8WV9QMg.png)

```
输入：head = [1,2]
输出：false
```

**提示**

- 链表中节点数目在范围[1, 10^5] 内
- 0 <= Node.val <= 9

### 分析
常规思路是用一个容器把结点全部按顺序存起来，然后遍历链表一一比对，但是消耗空间比较大，另一种容易想到的思路是反转链表，然后遍历判断每个结点是否相等，但是反转之后原链表就丢失了，所以不能这么做；正确思路应该是反转链表的后半部分，和前半部分的结点一一比对，如何找到中间的结点呢？用快慢指针！

### 实现

**容器**

```c++
bool isPalindrome(ListNode* head) {
    std::vector<uint8_t> vec;
    ListNode* work = head;
    while(work) {
        vec.emplace_back(work->val);
        work = work->next;
    }
    auto itr = vec.end();
    while (itr != vec.begin()) {
        itr--;
        if ((*itr) != head->val) {
            return false;
        }
        head = head->next;
    }
    return true;
}
```

时间复杂度：O(n)

空间复杂度：O(n)

**双指针**

```c++
bool isPalindrome(ListNode* head) {
    if (!head) {
        return true;
    } 
    if (!(head->next)) {
        return true;
    }
    auto reverse = [](ListNode* head){
        ListNode* pre = nullptr;
        ListNode* cur = head;
        while (cur) {
            ListNode* next = cur->next;
            cur->next = pre;
            pre = cur;
            cur = next;
        }
        return pre;
    };
    ListNode* slow = head;
    ListNode* fast = head;
    while (true) {
        slow = slow->next;
        fast = fast->next->next;
        if (fast == nullptr) {
            ListNode* rev = reverse(slow);
            while (rev) {
                if (rev->val != head->val) {
                    return false;
                }
                rev = rev->next;
                head = head->next;
            }
            return true;
        } else if (fast->next == nullptr) {
            ListNode* rev = reverse(slow->next);
            while (rev) {
                if (rev->val != head->val) {
                    return false;
                }
                rev = rev->next;
                head = head->next;
            }
            return true;
        }
    }
}
```

时间复杂度：O(n)

空间复杂度：O(1)


