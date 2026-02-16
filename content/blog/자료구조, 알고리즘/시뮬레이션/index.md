---
title: "시뮬레이션 유형 풀이 전략 및 자주 나오는 유형"
description: "코딩테스트 문제 유형 중, 시뮬레이션에 해당하는 문제에 어떻게 접근하는지? 그리고 자주 나오는 유형에 대해 간단한 설명과 코드를 정리했습니다."
date: 2026-01-28
tags: ["코딩테스트", "시뮬레이션"]
slug: "post-20260128-63175b"
---

# 1. 시뮬레이션 연습
**시간이 오래 걸려도 끝까지 풀어보는 게 중요하다**.  
기본적으로 시간이 많이 필요한 유형이다. 구현해야 할 것도 많고 신경써야 할 것이 너무 많기 때문이다.

**잘 나눠서 단계 별로 푸는 게 중요**하다.

# 2. 시뮬레이션 푸는 전략

## 2.1. 문제 정확히 이해하기
설계 들어가기 전에, **문제를 여러 번 읽어도 좋으니 확실히 이해**한다.  
입력 예시와 출력 예시를 보면서 내가 이해한 게 맞는지 판단한다.

## 2.2. 설계 (함수 단위로 나누기)
보통 시뮬레이션은 **동작이 여러 단계**로 나뉜다.  
그 단계를 각각 메서드로 추출한다.

이때, **가급적 문제에서 제시하는 순서대로 메서드를 나누자**.  
"이거 생략해도 되겠는데?" 혹은 "이거 메서드 하나로 퉁쳐도 되겠는데?"라고 생각해도 가급적 문제에서 설명하는 동작 순서대로 메서드를 나누자.  
여기서 발견하기 어려운 버그가 생기기 쉽다.

## 2.3. 데이터 저장을 어떻게 할 것인지?
시뮬레이션이 어렵게 느껴지는 이유는 **데이터 저장을 어떻게 할 것인지 고민이 부족한 탓일 가능성이 크다**.

각 동작(메서드)마다 사용하기 용이한 자료구조가 있는데, 한 가지 방식으로 하면 시뮬레이션을 풀어내기 어려운 것이다.  
때문에 **하나의 데이터를 여러 가지 방식으로 모두 저장해보고, 각 동작마다 가장 다루기 쉬운 형태의 데이터를 다루면서 구현**한다.  
이때 특정 종류의 자료구조의 데이터가 업데이트되면 나머지 자료구조의 값들도 동기화를 해야 한다!

예를 들어 입력값 1,2,3을 배열 [1,2,3] 혹은 문자열 "123"로 저장할 수 있고, 만약 [1,2,3]이 [2,2,3]으로 바뀌면, 문자열도 "223"으로 갱신한다.  
**각 자료구조마다 또 다른 자료구조를 기반으로 갱신하는 메서드를 만든다**.

## 2.4. 구현하기
이제 설계해놓은 메서드대로 하나씩 구현한다.  
이때 모든 메서드를 한 번에 만들어놓고 테스트하면 테스트 단위가 커지기 때문에, 최대한 작은 단위로 테스트를 자주 하는 것이 효율적이다.

> 연습 문제: https://www.acmicpc.net/problem/21610  
> 결과 코드: https://www.acmicpc.net/source/102395954

# 3. 자주 나오는 유형
## 3.1. 2차원 배열 90도 회전하기
### 3.1.1. 정사각형 형태의 2차원 배열 회전하기
만약 3x3 크기의 2차원 배열이 있을 때, 큐브처럼 오른쪽으로 90도 씩 회전하면 인덱스는 다음과 같다.

- 변경 전  
(0,0) (0,1) (0,2)
(1,0) (1,1) (1,2)
(2,0) (2,1) (2,2)

- 변경 후  
(2,0) (1,0) (0,0)
(2,1) (1,1) (0,1)
(2,2) (1,2) (0,2)

기존의 1행이 3열, 2행이 2열, 3행이 1열로 변경되었고,  
기존의 1열이 1행, 2열이 2행, 3열이 3행이 되었다.

이제 이 규칙에 따라 새로운 배열에 값을 할당한다.

```python
def rotate(arr):
    n = len(arr)

    result = [[0] * n for _ in range(n)]

    for x in range(n):
        for y in range(n):
            result[y][n-1-x] = arr[x][y]
            
    return result
```

파이썬에서는 다음과 같이 간결하게 작성할 수도 있다.

- 시계 방향: `list(zip(*arr[::-1]))` 
- 반시계 방향: ` list(zip(*arr))[::-1]`

### 3.1.2. 직사각형 형태의 2차원 배열 90도 회전하기
3x4 형태의 2차원 배열을 시계 방향으로 90도 회전하면 4x3 형태의 2차원 배열이 된다.  
따라서 나머지는 모두 똑같은데 `result` 배열을 만들 때 크기를 신경써줘야 한다.

```python
def rotate(arr):
    n = len(arr)
    m = len(arr[0])

    result = [[0] * n for _ in range(m)]

    for x in range(n):
        for y in range(m):
            result[y][n-1-x] = arr[x][y]
            
    return result
    
arr = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12]
]
result = rotate(arr)
print(result)

# 출력
# [9, 5, 1]
# [10, 6, 2]
# [11, 7, 3]
# [12, 8, 4]]
```

## 3.2. 값 땡겨오기, 사이사이 빈칸 압축(1차원 배열)
만약 `arr = [1, 0, 1, 2, 3, 1, 0, 0, 0, 3, 3, 4, 2, 0, 2]` 이 배열이 주어질 때, 0을 모두 뒤로 배치하고 나머지 값을 앞으로 땡겨야 하는 경우다.

1. 큐를 사용한다.
```python
from collections import deque

def solution(arr):
    q = deque()
    zero_count = 0
    for x in arr:
        if x == 0:
            zero_count += 1
            continue
        q.append(x)

    return list(q) + [0] * zero_count
```

2. 포인터(인덱스) 활용
```python
def solution(arr):
    last = -1
    
    for i, x in enumerate(arr):
        if x == 0:
            continue
        last += 1
        arr[last] = arr[i]
        
    for i in range(last + 1, len(arr)):
        arr[i] = 0
        
    return arr


arr = [1, 0, 1, 2, 3, 1, 0, 0, 0, 3, 3, 4, 2, 0, 2]
result = solution(arr)
print(result) # 출력: [1, 1, 2, 3, 1, 3, 3, 4, 2, 2, 0, 0, 0, 0, 0]
```

만약 0을 왼쪽으로 땡겨야하는 경우에는 다음과 같다.
```python
def solution(arr):
    last = len(arr)
    
    for i in range(len(arr))[::-1]:
        if arr[i] == 0:
            continue
        last -= 1
        arr[last] = arr[i]
        
    for i in range(0, last):
        arr[i] = 0
        
    return arr


arr = [1, 0, 1, 2, 3, 1, 0, 0, 0, 3, 3, 4, 2, 0, 2]
result = solution(arr)
print(result)  # 출력: [0, 0, 0, 0, 0, 1, 1, 2, 3, 1, 3, 3, 4, 2, 2]
```

## 3.3. 2차원 배열 중력 작용
2차원 배열에서 (x, y) 위치에 있는 값을 테트리스처럼 바닥으로 내려야 하는 경우다.

```python
def gravity(arr):
    n = len(arr)
    
    for y in range(n):
        last = n
        
        for x in range(n - 1, -1, -1):
            if arr[x][y] == 0:
                continue
            last -= 1
            arr[last][y] = arr[x][y]
            
        for x in range(last - 1, -1, -1):
            arr[x][y] = 0
            
    return arr


arr = [
    [1, 2, 3, 4],
    [0, 0, 2, 3],
    [0, 0, 0, 1]
]
result = gravity(arr)
print(result)

# 결과
# [0, 0, 0, 4]
# [0, 0, 3, 3]
# [1, 2, 2, 1]]
```

간혹 중간에 -1이 포함되고, -1을 만나면 그 이하로 내려가지 않아야 하는 경우에는 다음과 같이 작성한다.  
```python
def gravity(arr):
    n = len(arr)
    
    for y in range(n):
        last = n
        
        for x in range(n)[::-1]:
            if arr[x][y] == -1:
                last = x
                continue
                
            if arr[x][y] == 0:
                continue
                
            last -= 1
            arr[last][y] = arr[x][y]
            
        for x in range(last - 1, -1, -1):
            arr[x][y] = 0
            
    return arr


arr = [
    [1, 2, 3, 4],
    [0, 0, 0, 0],
    [0, -1, 2, 3],
    [0, 0, 0, 1]
]
result = gravity(arr)
print(result)

# 출력
# [0, 0, 0, 0]
# [0, 2, 0, 4]
# [0, -1, 3, 3]
# [1, 0, 2, 1]
```

## 3.4. 격자에서 이동 dx, dy (우회전, 좌회전, 반대방향보기)
dx, dy 테크닉을 활용한다.

```python
# 북 동 남 서
dx = [-1,0,1,0]
dy = [0,1,0,-1]
d = 0

d = (d+1) % 4 # 우회전
d = (d+3) % 4 # 좌회전
d = (d+2) % 2 # 180도
d ^= 2 # 180도
```

## 3.5. 달팽이
```python
dx = [-1, 0, 1, 0]
dy = [0, 1, 0, -1]


def snail(n):
    arr = [[0] * n for _ in range(n)]

    d = 1
    x, y = 0, 0
    num = 1

    while num <= n * n:
        arr[x][y] = num
        num += 1

        next_x, next_y = x + dx[d], y + dy[d]
        if (0 <= next_x < n and 0 <= next_y < n) and arr[next_x][next_y] == 0:
            x, y = next_x, next_y
            continue

        d = (d + 1) % 4
        x, y = x + dx[d], y + dy[d]

    return arr


print(snail(3))

# 출력: [[1, 2, 3], [8, 9, 4], [7, 6, 5]]
```
