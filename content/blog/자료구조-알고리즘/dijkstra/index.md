---
title: "다익스트라 알고리즘"
description: "다익스트라 알고리즘의 특징, 원리, 기본형, 최적화형, 구현"
date: 2024-10-30
tags: ["algorithm", "dijkstra"]
---

## 다익스트라 알고리즘

특정 노드에서 다른 노드까지의 최단 거리를 구하는 알고리즘이다.<br>
유향인지 무향인지는 상관없지만 가중치가 음수가 하나라도 존재하는 순간, 적용하지 못한다.<br>
알고리즘의 기본 원리 상으로 시작 노드르 기준으로 다른 노드까지의 최단 거리를 **더하면서 갱신**하는 구조이기 때문에<br>
음수 가중치가 존재하는 순간 올바른 계산이 불가능해지기 떄문이다.

## 기본 원리

<img src="https://upload.wikimedia.org/wikipedia/commons/5/57/Dijkstra_Animation.gif" alt="다익스트라 알고리즘.gif (출처: 위키피디아)">

특정 노드를 시작으로 매 round가 수행된다.<br>
이 round는, 한 노드에서 이동할 수 있는 다른 노드까지의 최단 경로를 갱신하는 과정이 수행된다.<br>
다음 노드로의 확장을 위해, 최단 경로가 갱신된 노드로부터 다시 한번 round를 수행한다.<br>
위 과정을 반복하다보면 결국 모든 노드를 거치게 되고, 결과적으로 시작 노드를 기점으로 다른 모든 노드까지의 최단 경로가 기록되게 된다. (모든 노드가 연결되어 있다는 가정하에)

## 시간 복잡도

다익스트라는 구현하는 데 있어 기본형과 우선순위 큐를 사용한 개선된 구현 방법이 있다.

### 기본형

기본형의 경우, 매 round마다 아직 방문하지 않았으며 최단 경로가 갱신된 노드를 찾는 코드가 포함된다.

[최단경로 문제](https://www.acmicpc.net/problem/1753)를 기준으로 코드를 작성하면 다음과 같다.

```python
INF = 1e9

n, m = map(int, input().split())
start = int(input())
graph = [[] for _ in range(n + 1)]
dist = [INF] * (n + 1)
visited = [False] * (n + 1)


def main():
    for _ in range(m):
        u, v, w = map(int, input().split())
        graph[u].append((v, w))

    dist[start] = 0
    dijkstra()


def dijkstra():
    while True:
        curr = not_visited_and_min_dist_node()

        if curr == 0:
            break

        for nxt, weight in graph[curr]:
            if visited[nxt]:
                continue
            if dist[curr] + weight < dist[nxt]:
                dist[nxt] = dist[curr] + weight

        visited[curr] = True


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

결국 모든 노드를 기준으로 최단 경로를 갱신하게 되는데, 이때 매 round마다 for문으로 조건에 맞는 노드를 찾는다.<br>
따라서 시간 복잡도는, 노드의 개수를 V라고 했을 때 O(V^2)가 된다.<br>
(원래는 O(E + V^2)이지만, 어떤 그래프이든 O(E)의 상한값을 O(V^2)로 치환할 수 있어 포함하지 않는다.)

### 최적화형

우선순위 큐를 사용하여, 다음 round를 수행할 노드를 O(1) 만에 추출한다.<br>
마찬가지로 동일한 문제를 기준으로 코드를 작성해보면 아래와 같다.

```python
import heapq

INF = 1e9

n, m = map(int, input().split())
start = int(input())
graph = [[] for _ in range(n + 1)]
dist = [INF] * (n + 1)


def main():
    for _ in range(m):
        u, v, w = map(int, input().split())
        graph[u].append((v, w))

    dijkstra(start)

    for it in range(1, n + 1):
        if dist[it] == INF:
            print("INF")
        else:
            print(dist[it])


def dijkstra(start):
    dist[start] = 0
    q = [(0, start)]

    while q:
        w, curr = heapq.heappop(q)

        if w > dist[curr]:
            continue

        for nxt, weight in graph[curr]:
            if dist[nxt] > dist[curr] + weight:
                dist[nxt] = dist[curr] + weight
                heapq.heappush(q, (dist[nxt], nxt)) # O(V)


main()
```

기본형은 본래 O(E + V^2) 였다.<br>
round 마다 최단 경로를 갱신할 노드를 찾는 데에 모든 노드를 조회하기 때문에 V^2가 되었는데,<br>
우선 순위 큐(최소 힙)을 사용하면 이를 찾는 데에 logV 만큼 걸린다.<br>
따라서 O(E + VlogV)가 된다.