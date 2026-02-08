---
title: "LeetCode Weekly Contest 488 후기"
description: "LeetCode에서 주최하는 Weekly Contest 488을 보고 난 후기를 기록한 글입니다."
date: 2026-02-08
tags: ["LeetCode", "알고리즘", "Weekly Contest"]
---

# 들어가며
오늘은 LeetCode에서 주최하는 488번 째 Weekly Contest를 치뤘습니다.  
저번 주 기업 코딩테스트를 정말 오랜만에 보고 실수를 너무 많이 해서 멘탈이 나갔었는데요.  
이후 실패를 분석해보니 **실전 경험 부족**과 **현재 내가 어떤 유형의 문제를 모르는 지에 대한 피드백의 부재**라고 판단했습니다.  

그래서 '매주 모의고사처럼 시험을 볼 수 있으면 좋겠다'하고 생각이 들었고, 찾아보니 LeetCode의 Weekly Contest를 발견했습니다.  
매주 일요일 오전 11시 30분에 시작해서 총 4문제를 푸는 식의 Contest인데요. 등수에 따라 백팩, 텀블러, Big O Notebook 같은 상품도 준다고 합니다.

그리고 참여만 하면 기본적으로 200 포인트를 주는데, 이 포인트로 [LeetCode 굿즈나 아이템](https://leetcode.com/store/)를 구매할 수 있습니다. 

# 문제
## 1번 문제 ([바로가기](https://leetcode.com/contest/weekly-contest-488/problems/count-dominant-indices/))
1번 문제는 Prefix Sum을 이용해서 풀었습니다.  
제약 조건을 보니 `nums`의 최대 길이가 100이라서 2중 for문을 돌려도 통과했을 것 같은데, 문제를 읽자마자 Prefix Sum이 바로 떠올라서 해당 방법으로 풀었습니다.

```python
class Solution:
    def dominantIndices(self, nums: List[int]) -> int:
        n = len(nums)
        prefix_sum = [0] * n

        for i in range(n):
            if i == 0:
                prefix_sum[i] = nums[i]
                continue

            prefix_sum[i] = prefix_sum[i - 1] + nums[i]

        answer = 0
        for i in range(n):
            if i == n - 1: break
                
            a = nums[i]
            b = (prefix_sum[-1] - prefix_sum[i]) // (n-i-1)

            if a > b:
                answer += 1

        return answer
```

## 2번 문제 ([바로가기](https://leetcode.com/contest/weekly-contest-488/problems/merge-adjacent-equal-elements/description/))
2번 문제를 보고 가장 먼저 떠오른 방법은 모든 병합 작업을 완료할 때까지 `nums`를 순회하는 방법을 떠올렸지만, `nums`의 최대 길이가 10^5이기에 다른 방법을 생각해봤습니다.  

두 번째로 떠올린 방법은 앞에서부터 하나씩 순회하면서, 중복 요소를 만나면 합치고, 그 뒤 숫자에는 0으로 처리한 다음, 병합된 숫자를 기준으로 좌측과 우측 모두 병합 가능한 숫자를 탐색하는 식으로 생각해봤습니다.  
이 방법의 경우 `[5, 4, 3, 2, 1, 1]` 처럼 `nums` 배열의 맨 마지막 요소부터 시작해서 도미노 식으로 진행되면 결국 2중 for문을 돌리는 것과 마찬가지인 셈이 되므로 다른 방법을 생각해봤습니다.

그러다가 스택이 떠올랐습니다.  
마침 코딩테스트 오프라인 스터디에서 이번 주차에는 스택, 큐, DFS, BFS 문제를 풀고 있어서 그런가 스택이 떠올랐는데요.  
앞에서부터 순회하면서, 중복되지 않은 숫자는 모두 스택에 삽입하고, 그러다가 스택의 최상단 요소랑 nums에서 순회하는 요소랑 중복되면, 더이상 스택의 최상단 요소랑 중복되지 않을 때까지 `pop()`하고 합친 다음, 스택에 다시 삽입하는 식으로 구현했습니다.  
글로된 설명보다 차라리 아래 제출한 코드를 보시는 게 편할 것 같아요.

```python
class Solution:
    def mergeAdjacent(self, nums: List[int]) -> List[int]:
        stack = []

        for num in nums:
            if len(stack) == 0:
                stack.append(num)
                continue

            if stack[-1] == num:
                curr = num
                while True:
                    if len(stack) == 0:
                        break
                    if stack[-1] != curr:
                        break
                    prev = stack.pop()
                    curr += prev
                stack.append(curr)
                continue

            stack.append(num)

        return stack
```

## 3번 문제 ([바로가기](https://leetcode.com/contest/weekly-contest-488/problems/count-subarrays-with-cost-less-than-or-equal-to-k/))
3번 문제는 완전탐색으로 밖에 제출하지 못했습니다.  
사실 처음에는 슬라이딩 윈도우랑 힙(`heapq`)을 사용하면 되지 않을까? 해서 이것저것 해봤는데 갈피를 제대로 잡지 못해서 일단 완탐으로만 제출했습니다.

그런데 이후에 꽤 놀란 사실이 아래 사진에서 볼 수 있듯이 약 62%가 통과했습니다..  
![0.5솔로 하겠습니다..](half_score.png)  
이 문제에만 해당될 수 있긴 하지만, 일단 시간 복잡도 생각안하고 완탐으로 문제를 해결할 수 있을 정도로만 작성해서 제출하는 것도 부분 점수를 꽤 챙길 수 있을 것 같다는 생각이 드네요.

아래 코드는 제출한 완탐 코드입니다. 심플하죠? 
```python
class Solution:
    def countSubarrays(self, nums: List[int], k: int) -> int:
        answer = 0
        for l in range(len(nums)):
            for r in range(l, len(nums)):
                cost = (max(nums[l:r+1]) - min(nums[l:r+1])) * (r - l + 1)

                if cost <= k:
                    answer += 1

        return answer
```

Contest가 끝나고 LeetCode 내 커뮤니티에 Contest 488의 해답을 올려주신 분이 계셔서 이를 참고해 어떻게 풀면 좋을 지 공부해봤습니다.  
바로 _슬라이딩 윈도우_ 랑 _단조 큐_ 를 이용했습니다.  
_슬라이딩 윈도우_ 를 이용해서 1중 for문으로 최적화가 가능했고, _단조 큐_ 를 이용해서 l부터 r 까지의 범위 내 최솟값과 최댓값을 O(1) 만에 구할 수 있었네요.

슬라이딩 윈도우가 어떻게 이 문제에 적용이 될 수 있는지는 한번에 이해하기는 어렵네요..  
아직 슬라이딩 윈도우 유형에 대해 경험이나 생각하는 것이 부족한 것 같습니다.

코드는 다음과 같습니다.

```python
from collections import deque

class Solution:
    def countSubarrays(self, nums: List[int], k: int) -> int:
        n = len(nums)
        max_q = deque()
        min_q = deque()

        answer = 0
        l = 0
        for r in range(n):
            # 현재 숫자가 max_q의 마지막 값보다 크면, 이전 값들을 제거하여 내림차순 유지
            while max_q and nums[max_q[-1]] <= nums[r]:
                max_q.pop()
            max_q.append(r)

            # 현재 숫자가 min_q의 마지막 값보다 작으면, 이전 값들을 제거하여 오름차순 유지
            while min_q and nums[min_q[-1]] >= nums[r]:
                min_q.pop()
            min_q.append(r)

            while l <= r and max_q and min_q:
                max_val = nums[max_q[0]]
                min_val = nums[min_q[0]]
                window_size = r - l + 1

                # k를 초과하여 조건에 부합하지 않으면, l 포인터를 1 증가하여 윈도우 크기를 줄인다.
                if (max_val - min_val) * window_size > k:
                    # 제거되는 인덱스(l)가 큐의 head와 같으면 큐에서도 제거한다.
                    if max_q[0] == l:
                        max_q.popleft()
                    if min_q[0] == l:
                        min_q.popleft()

                    l += 1
                else: # 조건에 부합하면 순회를 멈춘다.
                    break

            # l부터 r까지 유효한 부분 배열 개수를 합친다.
            answer += (r - l + 1)

        return answer
```

## 4번 문제
4번 문제는 30분 가량을 남기고 시작했습니다. 문제를 읽자마자 `nums1`과 `nums2`의 길이가 최대 100임을 고려해서 부담 없이 완전탐색 방식으로 접근했는데요.    
하지만 생각보다 쉽게 풀리지 않았습니다.. 

아래는 제출한 코드입니다.    
(i, j)의 쌍을 2차원 배열에 모두 저장한 다음, 재귀함수를 통해 문제 조건에 맞는 `arr[i][j]` 를 k개 선택해서 최대값을 갱신하는 식으로 구현했습니다.

```python
class Solution:
    def __init__(self):
        self.answer = 0
    
    def maxScore(self, nums1: List[int], nums2: List[int], k: int) -> int:
        n = len(nums1)
        m = len(nums2)

        arr = [[0] * m for _ in range(n)]
        for i in range(n):
            for j in range(m):
                arr[i][j] = nums1[i] * nums2[j]

        self.recurse(0, 0, [], [], [], n, m, k, arr)
        return self.answer
                

    def recurse(self, x, y, used_x: List[bool], used_y: List[bool], selected: List[int], n, m, k, arr):
        if len(selected) > k:
            return
        if y == m:
            x += 1
            y = 0
        if x == n:
            if len(selected) == k:
                result = sum(selected)
                self.answer = max(self.answer, result)
            return

        # (x, y)를 고르는 경우
        if ((len(used_x) == 0) or (len(used_x) > 0 and used_x[-1] < x)) and ((len(used_y) == 0) or (len(used_y) > 0 and used_y[-1] < y)):
            used_x.append(x)
            used_y.append(y)
            selected.append(arr[x][y])
            self.recurse(x + 1, 0, used_x, used_y, selected, n, m, k, arr)
            selected.pop()
            used_y.pop()
            used_x.pop()

        # (x, y)를 고르지 않는 경우
        self.recurse(x, y + 1, used_x, used_y, selected, n, m, k, arr)
```

결과는 다음과 같습니다.  
![이것도 0.5솔..](q4_half_score.png)

하지만 코드를 다시 보니 재귀함수에서 2^10000 만큼의 연산이 수행되고 있었고, 예제 3번처럼 정답이 음수값이 나올 수 있었기에 `self.answer`를 0으로 초기화하면 안됐습니다.  
추가로 값의 범위가 -10^6 부터 10^6 까지이기에 정답의 절대값이 10억까지 나올 수 있었습니다.

4번은 Gemini에게 물어봐서 풀이를 배웠는데요. 바로 **DP**를 사용하는 것입니다.  
아래는 풀이 코드입니다.

```python
import sys

sys.setrecursionlimit(10**6)

class Solution:
    def maxScore(self, nums1: list[int], nums2: list[int], k: int) -> int:
        self.nums1 = nums1
        self.nums2 = nums2
        self.n, self.m = len(nums1), len(nums2)
        self.INF = float('inf')
        
        # 3차원 리스트 초기화 (None으로 설정하여 계산 여부 확인)
        # 크기는 (k+1) x (n+1) x (m+1)
        self.memo = [[ [None] * (self.m + 1) for _ in range(self.n + 1) ] for _ in range(k + 1)]

        return self.recurse(k, 0, 0)

    def recurse(self, cnt, i, j):
        if cnt == 0:
            return 0
        if i == self.n or j == self.m:
            return -self.INF

        # 리스트에서 값을 확인
        if self.memo[cnt][i][j] is not None:
            return self.memo[cnt][i][j]

        # 점수 계산 (선택, i 건너뛰기, j 건너뛰기)
        pick = self.nums1[i] * self.nums2[j] + self.recurse(cnt - 1, i + 1, j + 1)
        skip_i = self.recurse(cnt, i + 1, j)
        skip_j = self.recurse(cnt, i, j + 1)

        # 결과 저장 및 반환
        self.memo[cnt][i][j] = max(pick, skip_i, skip_j)
        return self.memo[cnt][i][j]
```

재귀 함수에서 탑다운 DP로 전환하는 걸 많이 연습했었는데 오랜만에 하려니 다 까먹었네요..  
그런데 애초에 재귀함수에서부터 접근을 잘못했습니다.

재귀함수랑 탑다운 DP로 전환하는 건 자신있었는데,, 이 문제는 다소 아쉽네요.  
탑다운 DP 연습도 다시 해야되겠습니다.

# 결과
시험 결과는 2솔입니다.. 😂😂😂
![시험 결과](result.png)

# LeetCode Contest 후기
## 1. 적절한 난이도 배치
김창준 님의 책 <함께 자라기>에서 몰입하기 가장 좋은 환경은 문제의 난이도가 자신의 실력보다 조금 높은 정도라고 했습니다.  
그런데 자신의 실력이 문제의 난이도보다 낮아서 불안한 경우, 문제의 난이도를 낮춰 쉬운 문제부터 시작해서 점차 난이도를 높여가면서 서서히 몰입하는 방법을 설명했습니다.

또, 이와 관련된 연구로 '_피실험자를 A, B 그룹으로 나누어 A 그룹은 어려운 코딩 문제를 먼저 풀게 한 다음 쉬운 문제를 풀게 했고, 반대로 B 그룹은 쉬운 문제를 풀고 어려운 문제를 풀게 했습니다. 두 그룹은 순서만 다르지 동일한 문제를 풀었습니다. 결과는, 작성 시간에는 유의미한 차이가 없었으나 **결함 수에 엄청난 차이**가 있었습니다. B 그룹이 A 그룹보다 절반 이하의 결함을 만들었습니다. 난이도를 낮춘 결과 학습 효과, 동기 강화, 스트레스 감소, 자기효능감 증가 등의 긍정적인 효과가 생겨 이득을 얻은 것으로 볼 수 있습니다._' 라고 책에 나와있는데요.

실제로 1번부터 4번 문제까지 난이도가 점차 올라가는 식으로 배치가 되어 있습니다. 이 점에서 책에서 언급한 내용을 직접 경험할 수 있게 됐습니다.

## 2. 문제가 깔끔하다.
가끔 백준이나 프로그래머스에서 문제를 풀다보면, 문제 지문이 엄청나게 길거나 수식어구들이 많이 껴있는 걸 볼 수 있습니다.  
이로 인해서 문제를 읽고 파악하는 것도 하나의 난관이 될 수 있는데요. LeetCode는 최대 7문장으로 문제를 정의합니다. 그래서 문제를 읽는 데 부담이 없습니다. 하지만 영어라는 점에서 약간의 한계가 있을 수 있습니다.

## 3. 제출은 가급적 한 번만 하자.
틀린 답안을 제출할 때마다 남은 시간이 5분 감소됩니다. 아마 이를 시사하는 바는, 가급적 제출하기 전에 테스트 케이스를 많이 돌려보면서 엣지 케이스와 시간 복잡도 계산까지 마친 다음에 완성된 코드를 제출하는 것을 유도하는 게 아닐까 싶은데요.

사실 실전에서도 제출하면 곧바로 결과를 알려주지 않습니다. 단지 제출만 됐다고 뜨죠.

LeetCode Content를 하는 목적 중에는 실전 감각을 늘리기 위한 목적도 있기에, 다음 Content부터는 단 한번의 제출만 한다는 마음으로 임해야겠습니다. 

## 4. 시험이 끝나고 이어서 풀 수 있다.
시험이 끝나면 실전처럼 더이상 문제에 접근도 하지 못할까 생각했었는데요. 그렇지 않습니다.  
제한 시간이 끝나면, 시간이 끝났다는 표시만 뜨고 페이지를 강제로 이동시키지 않습니다.

이는 어찌보면 장점이자 단점이 될 수 있겠는데요.

실전 감각을 늘리기 위한 목적에서는 다소 긴장감이 떨어질 우려가 있겠습니다.  
반면 문제의 경험치를 쌓는 측면에서는 시간이 지나도 끝까지 풀 수 있으니 장점으로 다가올 것 같습니다.

그런데 사실 LeetCode Contest는 지난 모든 Contest에 대해 언제든지 접근이 가능하도록 제공하고 있기 때문에, Contest 당일에는 시간이 지나면 스스로 마무리 짓는 것이 좋을 것 같습니다.

# 총평
'한번 해볼까?' 하는 생각으로 치른 Contest 였기에 큰 기대를 하지 않고 봤는데요.  
영어 해석 연습, 다양한 알고리즘 문제를 접할 수 있는 기회, 실전처럼 제한된 시간 안에 푸는 연습하기, 적절한 난이도 배치에 따른 몰입 등 많은 것을 얻어갈 수 있다는 점에서 맘에 들었습니다.  

일요일 오전 11시 30분부터 시작하기에 참여 자체가 쉽지 않을 수 있지만, 시간이 된다면 한번 도전해보는 것도 너무 좋겠습니다.

![미친(positive) 중국과 인도 사람들](ranking.png)
