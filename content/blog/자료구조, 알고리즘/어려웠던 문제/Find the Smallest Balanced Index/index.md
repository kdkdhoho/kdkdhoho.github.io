---
title: "[알고리즘 오답노트] LeetCode - Find the Smallest Balanced Index"
description: "LeetCode의 Find the Smallest Balanced Index 문제를 풀다가 어려움을 겪어 기록한 글입니다."
date: 2026-03-08
tags: ["알고리즘", "LeetCode", "누적합", "누적곱"]
slug: "find-the-smallest-balanced-index"
---

# 문제 링크
https://leetcode.com/contest/weekly-contest-492/problems/find-the-smallest-balanced-index/description/

# 어려웠던 점
## 1. Suffix Product를 구할 때 인덱스를 맞추는 게 어려웠다.  
`suffix_product[n - 1]`에 1을 넣어야 하는지? 아니면 `nums[n - 1]` 을 넣어야 하는 지 헷갈렸다.  
정답은 `nums[n - 1]` 이다.  

Suffix의 맨 뒤에 초기값(0 or 1)을 넣어버리면 원본 정수 배열과 동시에 인덱싱하기 까다롭다.  
Suffix는 맨 뒤에서부터 작업을 수행하는 것이기 때문에, 그 정의 자체로도 원본 배열의 마지막 값을 넣는 것이 맞다.

## 2. Suffix Product를 구할 때 숫자가 매우 커진 걸 우려헀지만, 어떻게 처리해야 할 지 몰랐다.
문제 조건에 따르면 Suffix Product의 최대값은 (10^5)^(10^9) 까지 나올 수 있다.  

Python은 메모리가 허용하는 한 무한한 크기의 정수를 처리할 수 있다.  
하지만 자리수가 커질수록 연산에 드는 시간이 급격히 증가한다.  
따라서 수가 너무 커지지 않도록 해야 한다.

문제에서 구해야 하는 값은, 특정 인덱스의 왼쪽에 있는 모든 값의 전체 합과 우측 값의 전체 곱이다.  
그리고 두 값이 같아야 의미가 있다.  
따라서 곱의 결과가 전체 합의 최대값보다 커졌을 때 아무 의미가 없다.  
그러므로 Suffix Product를 구할 때 원본 배열의 전체 합보다 커지지 않도록 설정한다.

이렇게 값이 너무 커지지 않도록 제어하여 연산을 효율적으로 수행한다.

# 배운점
## 1. 누적곱도 누적합과 똑같은 방식으로 구할 수 있고 이용할 수 있다.
## 2. Python은 메모리가 허용하는 한 무한한 크기의 정수를 처리할 수 있다. 하지만 자리수가 커질수록 연산에 드는 시간이 급격히 증가한다.
