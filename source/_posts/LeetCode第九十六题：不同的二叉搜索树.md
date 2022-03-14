---
title: LeetCode第九十六题：不同的二叉搜索树
notshow: false
tags:
  - 二叉树
  - 动态规划
  - 二叉搜索树
categories:
  - LeetCode
abbrlink: 6d10e558
date: 2022-02-14 21:35:49
---
引言：本文主要介绍LeetCode第九十六题，不同的二叉搜索树数量，并给出c++实现。

<!--more-->

### 题目
给你一个整数 n ，求恰由 n 个节点组成且节点值从 1 到 n 互不相同的 二叉搜索树有多少种？返回满足题意的二叉搜索树的种数。

**示例1**

![image.png](https://s2.loli.net/2022/02/14/WLQ716EtF5zqYTN.png)

```
输入：n = 3
输出：5
```

**示例2**

```
输入：n = 1
输出：1
```
**提示：**

- 1 <= n <= 19

### 分析
这道题首先要搞清楚二叉搜索树的定义，二叉搜索树的左儿子一定比根结点小，右儿子一定比根结点大，而且所有子树也一定是二叉搜索树。这道题其实和结点的值无关，只与大小关系有关，我们以从1到n的结点分别做为根结点，那么每种情况就是比根结点小的结点都在左子树上，大的都在右子树上，而子树的情况，也是这样，当以i为根结点时，那么左子树的情况就是G(i-1)，右子树的情况就是G(n - 1 - i)，所以G(i - 1) * G(n - 1 - i)就是以i为根结点的所有情况数量，以其他结点为根结点时也是类似，所以加在一起有如下递推关系式：

![image.png](https://s2.loli.net/2022/02/14/QIatenpuVd1J5Ns.png)

### 实现

```c++
int numTrees(int n) {
    if (n == 0 || n == 1) {
        return 1;
    }
    int res = 0;
    for (int i = 0; i < n; ++i) {
        res += numTrees(i) * numTrees(n - 1 - i);
    }
    return res;
}
```

### 拓展
其实满足上述递推关系式的数叫做卡塔兰数，可以证明，卡塔兰数的递推关系式如下：

![6F9AC23A-F832-4FC7-9E9A-767437F6FACD.png](https://s2.loli.net/2022/02/14/mafL5cOnVMuzqBH.png)

推导[如下](https://blog.csdn.net/Sherry_Yue/article/details/88364746)。