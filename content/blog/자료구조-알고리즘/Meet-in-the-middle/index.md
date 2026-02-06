---
title: ""
description: ""
date: 2026-02-05
tags: ["알고리즘", "Meet in the middle"]
---

# Meet in the middle이란?
_Meet in the middle_ 은 전체 탐색 공간이 너무 커서 완전 탐색 방식으로는 해결이 불가능할 때, **탐색 범위를 두 부분으로 나누어 각각 해결한 뒤 그 결과를 조합해서 전체 해를 찾는 알고리즘 기법**이다.

이 방식은 분할 정복(Divide and Conquer)과 유사해보이지만, **부분 문제들이 서로 독립적이지 않고 결과값을 서로 대조해야 한다는 점에서 차이**가 있다.

# 사용 목적
이 알고리즘 기법의 주된 목적은 **지수 시간 복잡도를 가지는 문제의 연산 횟수를 획기적으로 줄이는 것**이다.

예를 들어, 크기가 n인 데이터에 대해 모든 경우의 수를 조사해야 하는 문제의 시간 복잡도가 O(2^n) 이라고 가정한다면, n=40일 때 연산 횟수는 약 1조를 넘어간다.

이때 Meet in the middle 기법을 적용하여, 문제를 n/2 크기의 두 부분으로 나누면 각각 2^20, 즉 1,048,576번의 연산만 수행한다.  
따라서 두 부분의 결과를 정렬하고 비교하는 과정을 포함하더라도 전체 복잡도는 O(2^(n/2) * n) 수준으로 감소한다.

# 기본적인 틀

Meet in the middle의 기본적인 형태를 Python 코드로 작성하면 다음과 같다. 

```python
def minimumDifference(self, nums: List[int]) -> int:
    # nums를 절반씩 나눈다.
    n = len(nums)
    left_nums = nums[:n//2]
    right_nums = nums[n//2:]

    # 각 배열로 만들 수 있는 모든 경우의 합을 저장한 리스트를 구한다.
    left_sums = get_sums(left_nums)
    right_sums = get_sums(right_sums)

def get_sums(self, arr: List[int]) -> List[int]:
    result = []

    def recurse(self, i, sum):
        if i == len(arr):
            result.append(sum)
            return
        recurse(i + 1, sum + arr[i])
        recurse(i + 1, sum)

    recurse(0, 0)
    return result
```

이렇게 두 배열로 나누고 각 배열에 대해 완전탐색을 수행한 다음에는 문제에서 요구하는 바를 적절히 구현하면 된다.

# 대표적인 활용 사례: 부분 집합의 합
N개의 정수가 주어졌을 때, 원소들의 합이 정확히 S가 되는 부분 집합의 개수를 구하는 문제를 예로 들 수 있다.  
이 문제는 다음과 같은 순서로 접근할 수 있다.

1. 데이터를 절반으로 나누어 집합 A와 B로 나눈다.
2. 집합 A에서 만들 수 있는 모든 부분 집합의 합을 구해 리스트 `sum_a`에 저장한다.
3. 집합 B에서 만들 수 있는 모든 부분 집합의 합을 구해 리스트 `sum_b`에 저장한다.
4. `sum_a`를 오름차순으로 정렬한다.
5. `sum_b`의 각 원소 `x`에 대해, `sum_a`에서 `S-x`가 존재하는지 이진 탐색으로 찾는다(혹은 해시맵을 사용해서 부분 집합의 합을 Key로, 합의 개수를 Value로 저장한 다음 찾는 방법도 있다.)

## 백준, 부분수열의 합2

백준의 [부분수열의 합2](https://www.acmicpc.net/problem/1208) 문제가 위에서 설명한 문제와 같다.  
아래는 풀이 코드이다.

```python
import sys

input = sys.stdin.readline

n, s = map(int, input().split())
arr = list(map(int, input().split()))

def main():
    # 배열을 절반씩 나눈다.
    left_arr = arr[:len(arr) // 2]
    right_arr = arr[len(arr) // 2:]

    # 나눈 배열에서 구할 수 있는 모든 부분 집합의 합을 구한다.
    left_sum_count_dict = get_sum_count_dict(left_arr)
    right_sum_count_dict = get_sum_count_dict(right_arr)

    answer = 0
    # 한 쪽 배열에서만 생성된 결과를 순회한다.
    for left_sum, left_cnt in left_sum_count_dict.items(): # O(2^20)
        target = s - left_sum
        if target in right_sum_count_dict: # O(1)
            answer += (left_cnt * right_sum_count_dict[target])

    # S가 0인 경우, 양쪽 모두 공집합을 선택한 경우가 중복으로 포함되므로 1 감소한다.
    if s == 0:
        answer -= 1

    print(answer)


def get_sum_count_dict(arr):
    result = {}
    recurse(0, 0, arr, result)
    return result

def recurse(i, sum, arr, result):
    if i == len(arr):
        count = result.get(sum, 0)
        result[sum] = count + 1
        return

    recurse(i + 1, sum + arr[i], arr, result)
    recurse(i + 1, sum, arr, result)


main()  
```

## LeetCode, Partition Array Into Two Arrays to Minimize Sum Difference
LeetCode의 [Partition Array Into Two Arrays to Minimize Sum Difference](https://leetcode.com/problems/partition-array-into-two-arrays-to-minimize-sum-difference/description/) 또한 Meet me in the middle 기법을 사용하는 대표적인 문제다.  

아래는 풀이 코드이다.

```python
import bisect

class Solution:
    def minimumDifference(self, nums: List[int]) -> int:
        S = sum(nums)
        # 전체 길이의 절반을 n으로 정의한다.
        n = len(nums) // 2
        left_nums = nums[:n]
        right_nums = nums[n:]

        # 재귀 함수를 사용하여 부분 집합의 합을 구하는 함수다.
        # 선택한 원소의 개수를 Key로, 합의 리스트를 Value로 반환한다.
        def get_sums(arr):
            result = {i: [] for i in range(n + 1)}

            def dfs(i, _sum, cnt):
                if i == len(arr):
                    result[cnt].append(_sum)
                    return
                dfs(i + 1, _sum + arr[i], cnt + 1)
                dfs(i + 1, _sum, cnt)

            dfs(0, 0, 0)
            return result

        left_part = get_sums(left_nums)
        right_part = get_sums(right_nums)

        answer = 1e9

        # 왼쪽에서 left_cnt개를 뽑는다.
        for left_cnt in range(n + 1):
            right_cnt = n - left_cnt # 오른쪽에서는 n - left_cnt개를 뽑는다.
            right_sums = right_part[right_cnt] # 해당 개수로 만들 수 있는 부분 수열의 총합 리스트
            right_sums.sort()

            for L in left_part[left_cnt]:
                # 두 배열의 합의 차이는 |2 * (L + R) - S| 이다.
                # 차이를 최소화하려면 right_sum이 S/2 - L에 가장 가까워야 한다.
                target = S/2 - L

                # bisect_left를 이용해 target이 들어갈 위치를 찾는다.
                idx = bisect.bisect_left(right_sums, target)

                # target보다 크거나 같은 값 중 가장 가까운 값 확인
                if idx < len(right_sums):
                    R = right_sums[idx]
                    diff = abs(S - 2*(L + R))
                    if diff < answer:
                        answer = diff

                # target보다 작은 값 중 가장 가까운 값 확인
                if idx > 0:
                    R = right_sums[idx - 1]
                    diff = abs(S - 2*(L + R))
                    if diff < answer:
                        answer = diff

        return int(answer)
```
