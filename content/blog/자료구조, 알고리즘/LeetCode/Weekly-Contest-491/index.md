---
title: "LeetCode Weekly Contest 491 후기"
description: "LeetCode에서 주최하는 Weekly Contest 491를 보고 난 후기를 기록한 글입니다."
date: 2026-03-01
tags: ["LeetCode", "알고리즘", "Weekly Contest"]
slug: "weekly-contest-491"
---

# 1. 들어가며
저번 주는 본가에 다녀온다고 2주 만에 LeetCode Contest를 치뤘습니다.  
오늘도 어김없이 치르고 바로 후기를 작성해보고자 합니다.

# 2. 문제
## 2.1. 1번 문제 ([링크](https://leetcode.com/problems/trim-trailing-vowels/description/))
1번 문제는 문자열 s가 주어질 때 문자열의 뒤에서부터 모음을 모두 제거하는 문제입니다.  
그냥 단순하게 뒤에서부터 인덱싱하면서 모음이 나오지 않을 때까지 탐색하다가, 그 범위의 부분 문자열을 반환하는 식으로 구현했습니다.

```python
class Solution:
    def trimTrailingVowels(self, s: str) -> str:
        i = len(s) - 1

        while i >= 0:
            if s[i] not in {'a', 'e', 'i', 'o', 'u'}:
                break
            i -= 1

        answer = s[:i+1]
        return ''.join(answer)
```

## 2.2. 2번 문제 ([링크](https://leetcode.com/problems/minimum-cost-to-split-into-ones/description/))
2번 문제는 정수 n이 주어질 때, n을 a + b = x를 만족하는 a와 b로 나누고, 그때의 a * b를 비용으로 산정합니다.  
이렇게 n개의 1이 나올 때까지의 최소 비용을 계산하는 문제였습니다.

N을 1부터 점점 올리면서 문제 해결 과정을 적어보았습니다.  
```plaintext
n
1 => 1
2 -> 1+1 => 1
3 -> 2+1 (2) -> 1+1 (1) => 3
4 -> 2+2 (4) -> ...
```

적다보니 자연스레 큐를 이용해야겠다는 생각이 떠올랐습니다.  
큐를 만들고 가장 먼저 주어진 n을 삽입한 다음, 큐가 빌 때까지 숫자를 하나 추출합니다.  
그 숫자가 짝수이면 n//2 과 n//2 + 1 로 a, b로 나누고, 그때의 cost를 answer에 더합니다.  
그리고 이때 a와 b 중에서 1이 아닌 값만 다시 큐에 넣는 식으로 구현했습니다.

작성한 코드는 다음과 같습니다.

```python
from collections import deque

class Solution:
    def minCost(self, n: int) -> int:
        if n == 1:
            return 0
            
        answer = 0
        
        q = deque()
        q.append(n)
        while q:
            x = q.popleft()

            a, b = 0, 0
            if x % 2 == 0:
                a, b = x // 2, x // 2
            else:
                a, b = (x // 2) + 1, x // 2

            cost = a * b
            answer += cost

            if a != 1:
                q.append(a)
            if b != 1:
                q.append(b)

        return answer
```

2번 문제까지는 쉽게 해결했습니다.

## 2.3. 3번 문제 ([링크](https://leetcode.com/problems/minimum-bitwise-or-from-grid/description/))
가장 아쉽고 시간을 많이 쏟은 3번 문제입니다..

문제 요구사항은 2차원 정수 배열이 주어지고, 각 행에서 숫자를 하나씩 골랐을 때, 고른 모든 숫자의 비트 OR 연산의 최솟값을 구하는 문제입니다.

맨 먼저 재귀 함수로 각 행에서 숫자를 하나 고르는 코드를 구현했습니다.  
이때의 시간 복잡도를 O(N * M) 로 계산했었는데요. 문제 조건에서 `N * M <= 10^5` 라고 명시되어 있어서 쉽게 풀 수 있을 것 같았지만 시간 복잡도 계산이 틀렸습니다.  
각 모든 칸을 단 한 번씩 방문한다면 O(N * M)이 맞지만, 실제로는 O(K * M * N)입니다. (K는 Bit OR 연산의 결과가 될 수 있는 모든 경우입니다.)

실제로 제출을 하고 나니 시간 초과가 발생했습니다.  
그래서 자연스럽게 탑다운 DP를 떠올렸습니다.

하지만 탑다운 DP를 구현하는 데에도 어려움이 있었고, 공간 초과, 히든 케이스로 인한 시간 초과 등..  
큰 갈피를 잡은 것 같았지만 끝내 풀지 못했습니다.

AI에게 접근 방법을 물어보니 그리디랑 비트 마스킹의 조합으로 풀 수 있다고 합니다.  
코드는 다음과 같습니다.

```python
class Solution:
    def minimumOR(self, grid: List[List[int]]) -> int:
        ans = 0
        
        for b in range(16, -1, -1):
            allowed_mask = ans | ((1 << b) - 1)
            can_avoid_b = True
            
            for row in grid:
                found_valid_in_row = False
                for val in row:
                    if (val | allowed_mask) == allowed_mask: 
                        found_valid_in_row = True
                        break
                
                if not found_valid_in_row:
                    can_avoid_b = False
                    break
            
            if not can_avoid_b:
                ans |= (1 << b)
                
        return ans
```

그리디도 약하고 비트 마스킹도 약해서.. 그나마 익숙한 방법인 재귀 함수랑 탑다운 DP로 풀 수 있는 방법이 없는 지 물어보니 다음과 같은 코드를 작성해주었습니다.

```python
import sys

sys.setrecursionlimit(10**7)

class Solution:
    def minimumOR(self, grid: List[List[int]]) -> int:
        n = len(grid)
        
        # 최적화 3: 각 행의 중복을 제거하고 오름차순 정렬 (작은 값부터 탐색하여 global_min을 빠르게 갱신)
        filtered_grid = [sorted(list(set(row))) for row in grid]
        
        memo = {}
        global_min = float('inf') # 전역 최솟값 추적용

        def recurse(x, prev):
            nonlocal global_min
            
            # 최적화 1 (Branch and Bound): 
            # OR 연산은 값이 줄어들지 않으므로, 이미 최소치 이상이면 탐색 중단
            if prev >= global_min:
                return float('inf')
                
            if x == n:
                global_min = min(문, prev)
                return prev
                
            if (x, prev) in memo:
                return memo[(x, prev)]

            res = float('inf')
            
            for val in filtered_grid[x]:
                next_or = prev | val
                
                # 최적화 2 (Submask Check): 
                # 새로운 비트가 켜지지 않는 원소를 발견하면, 이보다 더 좋은 선택지는 없음
                if next_or == prev:
                    res = min(res, recurse(x + 1, next_or))
                    break # 탐색 가지치기 (핵심)
                
                res = min(res, recurse(x + 1, next_or))
                
            memo[(x, prev)] = res
            return res

        return recurse(0, 0)
```

솔직히 몇 번을 다시 보고 AI에 질문을 해도 잘 이해가 가지 않아 넘어가려고 합니다.
어차피 주 목표는 기업 코테인데 기업 코테 수준에는 이 정도는 투머치이기 때문에 계속 붙잡고 있는 건 비효율적이라고 판단되기 때문입니다..! (핑계 아님 🥲)

## 2.4. 4번 문제 ([링크](https://leetcode.com/problems/count-subarrays-with-k-distinct-integers/description/))
4번 문제는 시간이 부족해 아예 보질 못했었는데요.  

정수 배열 `nums`와 두 정수 `k`, `m`이 주어질 때, 정확히 `k`개의 서로 다른 정수를 포함하고 각 서로 다른 정수는 최소 `m`번 이상 나타나는 부분 배열을 찾는 것입니다.

이 문제를 읽자마자 슬라이딩 윈도우와 해시를 사용해야겠다는 생각이 들었습니다.  
범위를 0부터 시작해서 "범위 내 숫자 종류가 k개를 초과하면 윈도우 축소. k개 미만이면 윈도우 확장", "k가 만족하면 각 숫자 개수가 m개를 넘지 못하면 윈도우 확장. 만족하면 정답 카운트하고 윈도우 확장." 라는 아이디어로 접근했습니다.

```python
"""
접근 방법
1. 슬라이싱 윈도우
  - 범위 내 숫자 종류가 k개를 초과하면 윈도우 축소. k개 미만이면 윈도우 확장
  - 각 숫자 개수가 m개를 넘지 못하면 윈도우 확장. 만족해도 윈도우 확장.
"""
class Solution:
    def countSubarrays(self, nums: list[int], k: int, m: int) -> int:
        answer = 0
        n = len(nums)
        l, r = 0, 0
        counter = dict()
        counter[nums[0]] = 1

        while r < n:
            if len(counter.keys()) > k:
                counter[nums[l]] -= 1
                if counter[nums[l]] == 0:
                    del counter[nums[l]]
                l += 1
                if l >= n: break
                continue

            if len(counter.keys()) < k:
                r += 1
                if r >= n: break
                counter[nums[r]] = counter.get(nums[r], 0) + 1
                continue

            is_all_over_m = True
            for count in counter.values():
                if count < m:
                    is_all_over_m = False
                    break

            if is_all_over_m:
                answer += 1

            r += 1
            if r >= n: break
            counter[nums[r]] = counter.get(nums[r], 0) + 1

        return answer
```

테스트 케이스는 한번에 모두 맞았습니다!  
하지만 정작 제출을 해보니 테스트 케이스 한 가지에서 결과가 1 차이로 틀렸습니다.  
뭔가 윈도우 범위를 조절하는 부분에서 착오가 있었던 것 같습니다.

혼자 생각해봤을 때 어디가 틀렸는 지 모르겠어서 AI에게 물어보았더니, 세 개의 포인터 혹은 두 개의 슬라이딩 윈도우를 하나의 루프 안에서 굴리는 방식으로 풀어야 한다고 합니다.  

이 문제도 일단은 넘겨야겠습니다.. ㅜㅜ

# 마치며
이번에도 결국 2/4 솔입니다. ㅜㅜ
그래도 3번이랑 4번은 문제 갈피를 잡았다..는 점에서 실력이 쪼끔씩은 늘고 있는 것 같습니다. 😂

다음엔 3솔을 해보고 싶네요.
