---
title: LeetCode第一百零一题：对称二叉树
notshow: false
tags:
  - 二叉树
  - 队列
categories:
  - LeetCode
abbrlink: dc905f90
date: 2022-02-09 18:23:54
---

引言：本文主要分析LeetCode第一百零一题，判断一颗二叉树是不是对称二叉树，并给出c++实现。

<!--more-->

### 题目

给你一个二叉树的根节点 `root` ， 检查它是否轴对称。

**示例1**

![image.png](https://s2.loli.net/2022/02/09/PZ82L4cjJNe5vqE.png)

```
输入：root = [1,2,2,3,4,4,3]
输出：true
```

**示例2**

![image.png](https://s2.loli.net/2022/02/09/CW9zMkq8h3xZGYD.png)



```
输入：root = [1,2,2,null,3,null,3]
输出：false
```

**提示：**

- 树中节点数目在范围 `[1, 1000]` 内

- `-100 <= Node.val <= 100`



### 分析

这道题比较容易想到的一个思路就是递归，判断两个结点，左右儿子结点是否分别相等，这样递归下去；二叉树将递归改成迭代，首先我们引入一个队列，这是把递归程序改写成迭代程序的常用方法。初始化时我们把根节点入队两次。每次提取两个结点并比较它们的值（队列中每两个连续的结点应该是相等的，而且它们的子树互为镜像），然后将两个结点的左右子结点按相反的顺序插入队列中。当队列为空时，或者我们检测到树不对称（即从队列中取出两个不相等的连续结点）时，该算法结束。



### 实现

**递归**

```c++
bool check(TreeNode* lhs, TreeNode* rhs) {
    if (!lhs && !rhs) {
        return true;
    }
    if (!lhs || !rhs) {
        return false;
    }
    return lhs->val == rhs->val && check(lhs->left, rhs->right) && check(lhs->right, rhs->left);
}
bool isSymmetric(TreeNode* root) {
	return check(root, root);
}
```

时间复杂度：O(n)

空间复杂度：O(n)



**迭代**

```c++
bool check(TreeNode* lhs, TreeNode* rhs) {
    std::queue<TreeNode*> queue;
    queue.push(lhs);
    queue.push(rhs);
    while (!queue.empty()) {
        auto l = queue.front();
        queue.pop();
        auto r = queue.front();
        queue.pop();
        if (!l && !r) {
            continue;
        } 
        if ((!l || !r) || l->val != r->val) {
            return false;
        } 
        queue.push(l->left);
        queue.push(r->right);
        queue.push(l->right);
        queue.push(r->left);
    }
    return true;
}
bool isSymmetric(TreeNode* root) {
    return check(root, root);
}
```

时间复杂度：O(n)

空间复杂度：O(n)