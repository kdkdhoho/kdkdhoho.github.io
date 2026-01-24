---
title: "유클리드 호제법으로 최대공약수와 최소공배수 구하기"
description: "유클리드 호제법을 이해하고, 이를 이용해 최대공약수와 최소공배수를 구하는 방법에 대해 정리한 글입니다."
date: 2026-01-24
tags: ["알고리즘", "유클리드 호제법", "최대공약수", "최소공배수"]
---

# 유클리드 호제법
수학적으로 두 개 이상의 정수에 대해 공통된 약수 중, 가장 큰 값을 최대공약수(GCD, Greatest Common Divisor)라고 하며, 공통된 배수 중 가장 작은 값을 최소공배수(LCM, Least Common Multiple)라고 한다.  

이 중에서 최대 공약수를 쉽고 빠르게 구할 수 있는 알고리즘이 있는데, 바로 [유클리드 호제법](https://ko.wikipedia.org/wiki/%EC%9C%A0%ED%81%B4%EB%A6%AC%EB%93%9C_%ED%98%B8%EC%A0%9C%EB%B2%95)이라는 알고리즘이 있다.  
호제법이란 말은 두 수가 서로 상대방 수를 나누어서 결국 원하는 수를 얻는 알고리즘을 나타낸다.

![호제법 애니메이션](https://upload.wikimedia.org/wikipedia/commons/e/e2/Euclidean_algorithm_252_105_animation_flipped.gif)

2개의 자연수 a, b에 대해서 a를 b로 나눈 나머지를 r이라고 하면, (단, a > b) a와 b의 최대공약수는 b와 r의 최대공약수와 같다.  
이 성질에 따라 b를 r로 나눈 나머지 r\`를 구하고, 다시 r과 r\`을 나눈 나머지를 구하는 과정을 반복하여, 최종적으로 나머지가 0이 되었을 때 나누는 수가 a와 b의 최대공약수이다.

## 구현
위는 재귀의 특징을 가지고 있는데, 이를 Python 코드로 작성하면 다음과 같다.

```python
def gcd(a, b):
    if a < b:
        a, b = b, a
    if b == 0:
        return a
    return gcd(b, a % b)
```

# 최소 공배수
최대 공약수를 구하면 최소 공배수도 쉽게 구할 수 있다.  
최소 공배수는 두 수 a, b의 곱을 두 수의 최대 공약수로 나누어 구할 수 있다.  
이는 a, b의 모든 소인수를 포함하되, 공통된 부분(최대공약수)이 중복으로 곱해지는 것을 방지하는 원리다.

## 구현
```python
def lcm(a, b):
    return a * b // gcd(a, b)
```

# 참고
- [Wikipedia, 유클리드 호제법](https://ko.wikipedia.org/wiki/%EC%9C%A0%ED%81%B4%EB%A6%AC%EB%93%9C_%ED%98%B8%EC%A0%9C%EB%B2%95)
