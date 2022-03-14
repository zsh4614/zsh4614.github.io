---
title: LeetCode第一九八题：打家劫舍
notshow: false
tags:
  - 动态规划
categories:
  - LeetCode
abbrlink: 464a6b04
date: 2021-10-23 17:04:46
---

引言：本文主要分析LeetCode第一九八题，属于典型动态规划，最后C++实现。

<!--more-->

#### 题目

你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警。

给定一个代表每个房屋存放金额的非负整数数组，计算你不触动警报装置的情况下 ，一夜之内能够偷窃到的最高金额。

#### 示例

##### 示例1

```
输入：[1,2,3,1]
输出：4
解释：偷窃 1 号房屋 (金额 = 1) ，然后偷窃 3 号房屋 (金额 = 3)。
     偷窃到的最高金额 = 1 + 3 = 4 。
```

##### 示例2

```
输入：[2,7,9,3,1]
输出：12
解释：偷窃 1 号房屋 (金额 = 2), 偷窃 3 号房屋 (金额 = 9)，接着偷窃 5 号房屋 (金额 = 1)。
     偷窃到的最高金额 = 2 + 9 + 1 = 12 。
```

##### 提示

- `1 <= nums.length <= 100`
- `0 <= nums[i] <= 400`

#### 分析

对于第i辆车，可以选择偷和不偷，最后求偷的情况下和不偷的情况下哪种情况偷的总数更多就可以了。偷的情况`dp[i]=dp[i-2]+p[i]`，不偷的情况`dp[i]=dp[i-1]`。

#### 实现

C++

```c++
int rob(vector<int>& nums) {
    int n = nums.size();
    int prepre = 0, pre = 0, now = 0;
    for (int i = 0; i < n; ++i) {
        now = max(pre, prepre+nums[i]);
        prepre = pre;
        pre = now;
    }
    return now;
}
```

#### 总结

这道题很典型的dp问题，而且思路比较简单，我刚开始复杂了，但是也没太复杂：

```c++
// 初始解法
class Solution {
public:
    int rob(vector<int>& nums) {
        vector<int> y(nums.size(), 0);
        vector<int> n(nums.size(), 0);
        y[0] = nums[0];
        n[0] = 0;
        for (int i = 1; i < nums.size(); ++i) {
            y[i] = n[i - 1] + nums[i];
            n[i] = max(y[i - 1], n[i - 1]);
        }
        return max(y[nums.size() - 1], n[nums.size() - 1]);
    }
};

// 空间优化
class Solution {
public:
    int rob(vector<int>& nums) {
        vector<int> dp = {nums[0], 0, nums[0]};

        for (int i = 1; i < nums.size(); ++i) {
            dp[0] = dp[1] + nums[i];
            dp[1] = max(dp[2], dp[1]);
            dp[2] = dp[0];
        }
        return max(dp[0], dp[1]);
    }
};
```





