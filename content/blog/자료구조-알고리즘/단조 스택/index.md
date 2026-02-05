---
title: "단조 스택(Monotonic Stack)"
description: "단조 스택에 대해 학습한 내용을 기록했습니다."
date: 2026-02-05
tags: ["자료구조", "단조 스택", "Monotonic Stack"]
---

# 단조 스택이란?
단조 스택(Monotonic Stack)은, **스택 내부의 원소들을 항상 일정한 순서(오름차순 or 내림차순)를 유지하도록 관리**하도록 유지하는 특수한 형태의 스택이다.  
기본적인 스택의 단순한 LIFO 구조를 넘어, 새로운 데이터를 삽입할 때 기존 원소들과 비교하여 순서를 위반하는 원소들을 제거함으로써 단조성(Monotonicity)을 유지한다. 

스택 내 원소가 어떤 순서를 유지하느냐에 따라 두 가지로 나뉜다.  

1. 단조 증가 스택(Monotonic Increasing Stack)
- 스택 내부가 `[1, 3, 5, 8]`과 같이 오름차순으로 커지는 상태를 유지한다.
- 새로운 원소가 들어왔을 때, 그 원소보다 큰 기존 원소들을 모두 제거함으로써 순서를 지킨다.

2. 단조 감소 스택(Monotonic Decreasing Stack)
- 스택 내부가 내림차순으로 작아지는 상태를 유지한다.
- 새로운 원소가 들어올 때, 그 원소보다 작은 값들을 모두 제거함으로써 순서를 지킨다.

# 왜 쓰는가?
이 자료구조를 사용하는 가장 큰 이유는 **시간 복잡도의 효율성** 때문이다.  
배열에서 특정 원소보다 크거나 작은 다음 원소를 찾는 문제를 완전 탐색으로 해결하려면 O(N^2)의 시간이 소요된다.  
반면, 단조 스택을 이용하면 각 원소를 스택에 한 번 삽입하고 최대 한 번 제거하므로, 전체 과정을 O(N)의 선형 시간 내에 처리할 수 있다.

# 활용 예시
[LeetCode의 Daily Temperatures](https://leetcode.com/problems/daily-temperatures/description/) 문제가 있다.  

위 문제를 해결하기 위해 다음과 같이 작성할 수 있다.  
```python
class Solution:
    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:
        n = len(temperatures)
        answer = [0] * n

        stack = []
        for curr_idx, curr_temp in enumerate(temperatures):
            while stack and curr_temp > temperatures[stack[-1]]:
                last_idx = stack.pop()
                dist = curr_idx - last_idx
                answer[last_idx] = dist

            stack.append(curr_idx)

        return answer
```
