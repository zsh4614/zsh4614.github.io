---
title: LeetCode第三题：无重复字符的最长子串
notshow: false
tags:
  - 桶优化
  - 哈希
  - 滑动窗口
categories:
  - LeetCode
abbrlink: e92bc492
date: 2021-05-20 01:35:56
---

引言：本文主要分析LeetCode第三题，Python和C++实现；并进行了哈希优化和数组桶优化。

<!--more-->

### 题目

给定一个字符串，请你找出其中不含有重复字符的最长子串的长度。

### 示例

**示例 1:**

```
输入: s = "abcabcbb"
输出: 3 
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
```

**示例 2:**

```
输入: s = "bbbbb"
输出: 1
解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。
```

**示例 3:**

```
输入: s = "pwwkew"
输出: 3
解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
     请注意，你的答案必须是子串的长度，"pwke" 是一个子序列，不是子串。
```

**示例 4:**

```
输入: s = ""
输出: 0
```

**提示：**

- 0 <= s.length <= 5 * 104
- s由英文字母、数字、符号和空格组成

### 分析

1.设置两个游标，采用滑动窗口，右游标一直右滑，每滑动一位，从左游标开始遍历查找与右游标相等的值，如果找到，左游标移到相等位置的下一位，更新长度

### 实现

#### python

```python
def lengthOfLongestSubstring(self, s: str) -> int:
        start = 0
        length = result = 0
        for end in range(len(s)):
            for index in range(start,end):
                if s[index] == s[end]:
                    length = end - index- 1
                    start = index + 1
                    break
            length += 1
            result = max(length, result)
        return result
```

#### c++

```c++
int lengthOfLongestSubstring(string s) {
    int start(0), end(0), length(0), result(0);
    for(int i = 0; i < s.size(); ++i) {
        for(int j = start; j < end; ++j) {
            if(s[j] == s[end]) {
                start = j + 1;
                length = end - start;
                break;
            }
        }
        end++;
        length++;
        result = max(result, length);
    }
    return result;
}
```

可以使用**哈希**对查找相等元素进行优化

```c++
int lengthOfLongestSubstring(string s) {
    int start(0), end(0), length(0), result(0);
    map<char, int> hashmap;
    for(int i = 0; i < s.size(); ++i) {
        if(hashmap.find(s[end]) != hashmap.end() && hashmap[s[end]] >= start) {
            start = hashmap[s[end]] + 1;
            length = end - start;
        }
        hashmap[s[end]] = end;
        end++;
        length++;
        result = max(result, length);
    }
    return result;
}
```

### 拓展

- map操作，find与count的区别
- map与unordered_map的区别，到底哪个快？

- 利用数组进行桶优化

  ```c++
  int lengthOfLongestSubstring(string s)
  {
      int start(0), end(0), length(0), result(0);
      int sSize = int(s.size());
      vector<int> vec(128, -1);
      while (end < sSize) {
          char tmpChar = s[end];
          if (vec[int(tmpChar)] >= start)
          {
              start = vec[int(tmpChar)] + 1;
              length = end - start;
          }
          vec[int(tmpChar)] = end;
          
          end++;
          length++;
          result = max(result, length);
      }
      return result;
  }
  ```

  