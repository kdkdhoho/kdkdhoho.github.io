---
title: "다익스트라 알고리즘"
description: "다익스트라 알고리즘의 특징, 원리, 기본형 구현, 최적화형 구현에 대해 기록했습니다."
date: 2026-02-14
tags: ["algorithm", "dijkstra"]
slug: "dijkstra"
---

# 1. 다익스트라 알고리즘
다익스트라 알고리즘은 **특정 노드에서 다른 노드까지의 최단 거리를 구하는 알고리즘**입니다.

![다익스트라 알고리즘](thumbnail.png)

그래프의 모든 간선의 가중치에 음수가 없을 때만 다익스트라 알고리즘을 적용할 수 있는데요.  
기본적으로 **시작 노드를 기준으로 다른 노드까지의 최단 거리를 더하면서 갱신하는 구조**이기 때문에 음수 가중치가 존재하는 순간 올바른 계산이 불가능해지기 떄문입니다.

# 2. 알고리즘 순서
알고리즘이 동작하는 순서에 대해 자세히 살펴보겠습니다.

1. 특정 노드를 시작으로, 매 Round가 수행되는 개념으로 진행됩니다.
2. 각 Round는 한 노드에서 이동할 수 있는 다른 노드까지의 최단 경로를 갱신합니다.
3. 이때 탐색 범위 확장을 위해 최단 경로가 갱신된 노드로부터 다시 한번 Round를 수행합니다.
4. 위 과정을 반복하다보면 시작 노드로부터 연결된 모든 노드를 방문하게 되고, 결과적으로 방문한 모든 노드의 최단 경로가 기록됩니다.

# 3. 구현
다익스트라 알고리즘은 구현 방법이 두 가지로 나뉩니다.

하나는 기본형, 하나는 우선순위 큐를 이용한 개선된 구현 방법이 있습니다.

## 3.1. 기본형
기본형의 경우, 매 Round마다 아직 방문하지 않았으면서 최단 경로가 갱신된 노드를 찾는 코드가 포함됩니다.  
아래는 기본형을 구현한 Python 코드입니다.

> 백준의 [최단경로](https://www.acmicpc.net/problem/1753) 문제를 기준으로 작성해보았습니다.

```python
INF = 1e9

n, m = map(int, input().split()) # n: 노드 개수, m: 간선 개수
start = int(input()) # 시작 노드
graph = [[] for _ in range(n + 1)]
dist = [INF] * (n + 1) # 모든 노드에 대해 최단거리를 기록하는 배열
visited = [False] * (n + 1)

def main():
    # 연결 그래프 완성
    for _ in range(m):
        u, v, w = map(int, input().split())
        graph[u].append((v, w))

    dist[start] = 0 # 시작 노드의 거리를 0으로 초기화
    dijkstra() # 다익스트라 알고리즘 실행
    
def dijkstra():
    while True:
        curr = not_visited_and_min_dist_node()

        if curr == 0:
            break

        for nxt, weight in graph[curr]:
            if visited[nxt]:
                continue
            if dist[curr] + weight < dist[nxt]: # 연결된 노드까지의 최단 경로가 갱신이 되는 경우
                dist[nxt] = dist[curr] + weight # 새로운 최단 경로 값을 기록합니다.

        visited[curr] = True
        
# 방문하지 않았으면서 최단 경로가 갱신된 노드를 찾는 메서드
def not_visited_and_min_dist_node():
    min_dist = 1e9
    result = 0

    for i in range(1, n + 1):
        if visited[i]:
            continue
        if dist[i] < min_dist:
            min_dist = dist[i]
            result = i
            
    return result


main()
```

매 Round마다 노드를 순회하면서 다음 Round에서 실행될 노드를 찾는 과정이 포함됩니다.  
따라서 노드의 개수를 V라고 했을 때, **기본형의 시간 복잡도는 O(V^2)** 입니다.

사실 간선의 개수를 E라고 했을 때, 원래 시간 복잡도는 O(E + V^2) 입니다. 하지만 어떤 그래프든 O(E)의 상한값을 O(V^2)로 치환할 수 있기 때문에 O(V^2)로 간소화합니다.

## 3.2. 최적화형
우선순위 큐를 이용한 최적화 방식은, 다음 Round에 수행할 노드를 O(logV) 만에 구할 수 있게 됩니다.  

> 이번에도 동일한 문제를 기준으로 코드를 작성해보았습니다.

```python
from heapq import heappop, heappush

INF = 1e9

n, m = map(int, input().split())
start = int(input())
graph = [[] for _ in range(n + 1)]
dist = [INF] * (n + 1) # 모든 노드에 대해 최단 거리를 기록하는 배열

def main():
    for _ in range(m):
        u, v, w = map(int, input().split())
        graph[u].append((v, w))

    dist[start] = 0 # 시작 노드의 거리를 0으로 초기화
    dijkstra(start) # 다익스트라 알고리즘 실행

    for i in range(1, n + 1):
        if dist[i] == INF:
            print("INF")
        else:
            print(dist[i])


def dijkstra(start):
    min_heap = [(0, start)] # (거리, 노드) 쌍의 튜플을 우선순위 큐(최소 힙)에 저장합

    while min_heap:
        w, curr = heappop(min_heap)

        # 다익스트라 알고리즘은 최단 경로가 갱신된 노드로부터 Round를 수행합니다.
        # 따라서 우선순위 큐에 있던 거리가 dist 배열에 저장된 거리보다 큰 경우 Round를 진행하지 않습니다.
        if w > dist[curr]:
            continue

        for next, weight in graph[curr]:
            if dist[curr] + weight < dist[next]: # 연결된 노드까지의 최단 경로가 갱신이 되는 경우
                dist[next] = dist[curr] + weight # 최단 경로를 갱신합니다.
                heappush(min_heap, (dist[next], next)) # 우선순위 큐에 (새롭게 갱신된 거리, 노드 번호) 튜플을 삽입합니다.


main()
```

우선순위 큐를 통해 매 Round에서 실행될 노드를 찾는 연산이 O(V^2)에서 O(logV)로 줄었기 떄문에, 결과적으로 **최적화형의 시간 복잡도는 O(ElogV)가 됩니다**.
