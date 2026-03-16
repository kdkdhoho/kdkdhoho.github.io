---
title: "[알고리즘 오답노트] LeetCode - Longest Palindromic Substring"
description: "LeetCode의 Longest Palindromic Substring 문제를 풀다가 어려움을 겪어 기록한 글입니다."
date: 2026-03-16
tags: ["알고리즘", "LeetCode", "Greedy", "팰린드롬", "부분 문자열"]
slug: "longest-palindromic-substring"
---

# 문제 링크
https://leetcode.com/problems/longest-palindromic-substring/description/?envType=problem-list-v2&envId=dynamic-programming

# 어려웠던 점
## 1. 문제 접근 자체가 잘못됐다.  

생각한 방법은 다음 두 가지다.

1. 길이를 1부터 len(s)까지 반복 -> for문으로 1번 순회하면서 부분 문자열 자름 -> 팰린드롬이면 정답 갱신
   - 시간 복잡도는 O(N^3) 이다. 문자열 `s`의 최대 길이는 1,000이라서 제한된 시간 안에 해결할 수 없다.
2. 문자열 s 순회하면서 인덱스 i의 좌우를 보고 같으면 확장
   - 테스트 케이스 `cbbd` 때문에 이 아이디어를 떠올렸지만, 애초에 접근 자체가 잘못됐다. 왼쪽 혹은 오른쪽으로만 확장해서 판단하면 팰린드롬이 깨질 수 있다.

이 문제는 **문자열 s를 순회하면서, 길이가 홀수인 팰린드롬과 짝수인 팰린드롬을 찾기 위해 확장** 하는 방식으로 해결할 수 있다.

```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        n = len(s)
        if n == 0:
            return ""

        start = 0
        max_len = 1

        def expand(l, r):
            while l >= 0 and r < n and s[l] == s[r]:
                l -= 1
                r += 1
            return l + 1, r - 1

        for i in range(n):
            # 홀수 길이 팰린드롬
            l1, r1 = expand(i, i)
            if r1 - l1 + 1 > max_len:
                start = l1
                max_len = r1 - l1 + 1

            # 짝수 길이 팰린드롬
            l2, r2 = expand(i, i + 1)
            if r2 - l2 + 1 > max_len:
                start = l2
                max_len = r2 - l2 + 1

        return s[start:start + max_len]
```

# 느낀 점
1. 아직 부분 문자열 문제는 취약하다.
2. ~~[Manacher 알고리즘](https://kdkdhoho.github.io/posts/manacher-algorithm/)을 능숙히 썼다면 쉽게 풀었을 것 같다.~~ 아직 Manacher 알고리즘이 능숙하지 않다. 학습할 때도 어려웠는데 적용해서 문제를 풀려고 하니 잘 안된다.
3. 문제가 짧고 단순하다고 생각해서 쉽게 접근했다. 정석대로 주어진 예제로 충분히 생각하고 테스트 케이스를 만들어보고 검증했어야 했다.
