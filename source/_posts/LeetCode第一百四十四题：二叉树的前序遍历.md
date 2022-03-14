---
title: LeetCode第一百四十四题：二叉树的前序遍历
notshow: false
tags:
  - 二叉树
  - 二叉树遍历
categories:
  - LeetCode
abbrlink: 2568988d
date: 2022-01-29 23:11:23
---

引言：本文主要介绍LeetCode第一百四十四题，对二叉树进行前序遍历，并给出c++实现。

<!--more-->

### 题目

给你二叉树的根节点 root ，返回它节点值的前序遍历。

**示例1**

![image.png](https://s2.loli.net/2022/01/29/3uCdQJNIDKjmpqR.png)

```
输入：root = [1,null,2,3]
输出：[1,2,3]
```

**示例2**

```
输入：root = []
输出：[]
```

**示例3**

```
输入：root = [1]
输出：[1]
```

**示例4**

![image.png](https://s2.loli.net/2022/01/29/26xpMiUJCXz8jHa.png)

```
输入：root = [1,2]
输出：[1,2]
```

**示例5**

![image.png](https://s2.loli.net/2022/01/29/h4D5web1dx8ozZC.png)

```
输入：root = [1,null,2]
输出：[1,2]
```

**提示：**

- 树中节点数目在范围 [0, 100] 内
- -100 <= Node.val <= 100


### 分析
本题可以用迭代和递归方法解决，和中序遍历类似。

### 实现

**递归**

```c++
vector<int> preorderTraversal(TreeNode* root) {
    std::vector<int> res;
    std::function<void(TreeNode*& root)> func = [&](TreeNode*& root) {
        if (!root) {
            return;
        }
        res.emplace_back(root->val);
        func(root->left);
        func(root->right);
    };
    func(root);
    return res;
}
```    

**迭代**

```c++
vector<int> preorderTraversal(TreeNode* root) {
    std::vector<int> res;
    std::stack<TreeNode*> stack;
    while (root || !stack.empty()) {
        while (root) {
            stack.push(root);
            root = stack.top();
            res.emplace_back(root->val);
            root = root->left;
        }
        root = stack.top();
        stack.pop();
        root = root->right;
    }
    return res;
}
```

### 疑问

为什么那个匿名函数的参数写成const不行？    