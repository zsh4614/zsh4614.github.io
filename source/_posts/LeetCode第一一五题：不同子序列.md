---
title: LeetCode第一一五题：不同子序列
notshow: false
tags:
  - 动态规划
  - 算法优化
  - dfs
categories:
  - LeetCode
abbrlink: 5ff53701
date: 2021-10-23 17:04:46
---

引言：本文主要分析LeetCode第一一五题，利用C++实现；并进行了空间优化，另外还可以利用dfs进行时间优化。

<!--more-->

### 题目

给定一个字符串 s 和一个字符串 t ，计算在 s 的子序列中 t 出现的个数。

字符串的一个 子序列 是指，通过删除一些（也可以不删除）字符且不干扰剩余字符相对位置所组成的新字符串。（例如，"ACE" 是 "ABCDE" 的一个子序列，而 "AEC" 不是）

题目数据保证答案符合 32 位带符号整数范围。

### 示例

**示例1：**

```
输入：s = "rabbbit", t = "rabbit"
输出：3
```

**示例2：**

```
输入：s = "babgbag", t = "bag"
输出：5
```

**提示：**

- `0 <= s.length, t.length <= 1000`
- `s` 和 `t` 由英文字母组成

### 分析

1.可以用动态规划的方法求解，`dp[i][j]`表示`s[0]`到`s[i]`之中有多少个`t[0]`到`t[j]`序列。

从最后一个字符看，假设s和t的长度分别是n和m，如果`s[n-1]`和`t[m-1]`不相等，那么显然只能在`s[0]`到`s[n-2]`中去找t；如果`s[n-1]`和`t[m-1]`相等，那么又分为两种情况，一是用`s[n-1]`，那么需要在`s[0]`到`s[n-2]`中去找`t[0]`到`t[m-2]`，另一种是不用`s[n-1]`，那么这就变成了和`s[n-1]`和`t[m-1]`不相等相同的情况，那么`s[n-1]`和`t[m-1]`相等时的方案数就是这两种情况之和。

伪代码如下：

```
if s[n-1] != t[m-1]:
	dp[n-1][m-1] = dp[n-2][m-1]
else:
	dp[n-1][m-1] = dp[n-2][m-1] + dp[n-2][m-2]
```

2.按照上述分析，是一个二维的动态规划，当s比较长时，那么所需要开辟的空间就会非常大，所以还需要进行空间上的优化。可以发现`dp[n-1][m-1]`只和`dp[n-2][m-1]`与`dp[n-2][m-2]`有关，即这个二维数组只和它左上方和上方的元素有关，这样就可以不开辟二维数组，只开辟一维数组，然后不断更新，需要注意的是，要进行倒序更新。

### 实现

#### c++

```c++
int numDistinct(string s, string t) {
    if (s.size() < t.size()) {
        return 0;
    }
    vector<vector<size_t>> dp(s.size(), vector<size_t>(t.size(), 0));
    dp[0][0] = (s[0] == t[0]) ? 1 : 0; 
    for (int i = 1; i < t.size(); ++i) {
        dp[0][i] = 0;
    } 
    for (int i = 1; i < s.size(); ++i) {
        dp[i][0] = (s[i] == t[0]) ? (dp[i-1][0] + 1) : dp[i-1][0]; 
    }

    for (int i = 1; i < s.size(); ++i) {
        for (int j = 1; j < t.size(); ++j) {
            if(i < j) {
                dp[i][j] = 0;
            } else {
                if (s[i] == t[j]) {
                    dp[i][j] = dp[i-1][j-1] + dp[i-1][j];  
                } else {
                    dp[i][j] = dp[i-1][j];
                }
            }
        }
    }
    return dp[s.size() - 1][t.size() - 1];
}
```

#### 空间优化

```c++
int numDistinct(string s, string t) {
    if (s.size() < t.size()) {
        return 0;
    }
    vector<unsigned int> dp(t.size(), 0);
    dp[0] = (s[0] == t[0]) ? 1 : 0;
    for (int i = 1; i < t.size(); ++i) {
        dp[i] = 0;
    }
    for (int i = 1; i < s.size(); ++i) {
        for (int j = t.size() - 1; j > 0; --j){
            dp[j] = (s[i] == t[j]) ? (dp[j] + dp[j-1]) : dp[j];
        } 
        dp[0] = (s[i] == t[0]) ? (dp[0] + 1) : dp[0];
    }
    return dp[t.size() - 1];
}
```

### 拓展

这道题属于困难，优化的方法比较多，还有时间优化的余地，之后可以用dfs进行时间优化。

