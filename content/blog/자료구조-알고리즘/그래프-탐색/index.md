---
title: ""
description: ""
date: yyyy-MM-dd
tags: ["", ""]
series: ""
---

# BFS

## 용도
- 최단 거리
- 단계별 확산 시뮬레이션

## 구현 시 주의사항
**방문 여부를 반드시 큐에 넣기 전에 설정**해야 한다.  
큐에서 뺄 때 처리하면, 중복된 노드가 큐에 여러 번 들어가 메모리 초과가 발생할 수 있다.

## 파이썬 코드  
```python
from collections import deque

dx = [-1,0,1,0]
dy = [0,1,0,-1]

def bfs(start_x, start_y):
    visited = [[False] * n for _ in range(n)]
    q = deque((start_x, start_y))
    
    while q:
        x, y = q.popleft()
        
        for d in range(4):
            nxt_x, nxt_y = x + dx[d], y + dy[d]
            if not in_array(nxt_x, nxt_y):
                continue
            if visited[nxt_x][nxt_y]:
                continue
            visited[nxt_x][nxt_y] = True
            q.append((nxt_x, nxt_y))
```

# DFS

## 용도
- 연결된 모든 칸 탐색
- 경로의 특징 확인

## 파이썬 코드

- 파이썬의 기본 재귀 호출 한도는 보통 1,000회로 제한된다. 100x100 크기의 격자를 탐색한다하더라도 이를 초과하는 수치이므로, `sys.setrecursionlimit`으로 깊이를 설정할 수 있다. 

```python
import sys
sys.setrecursionlimit(n**2)

dx = [-1,0,1,0]
dy = [0,1,0,-1]

def dfs(x, y):
    visited[x][y] = True
    
    for d in range(4):
        nxt_x, nxt_y = x + dx[d], y + dy[d]
        if not in_array(nxt_x, nxt_y):
            continue
        if visited[nxt_x][nxt_y]:
            continue
        dfs(nxt_x, nxt_y)
```
