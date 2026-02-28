---
title: "[SQL] ANSI 표준 SQL의 조건식"
description: "ANSI SQL의 조건식에 대해 기록한 글입니다."
date: 2026-02-28
tags: ["SQL"]
slug: "ansi-sql-condition-statement"
---

# 1. CASE 문
표준 SQL은 `CASE` 문을 사용한다.  
`CASE` 문은 두 가지 방식으로 사용될 수 있다.

## 1.1. 검색형 CASE
```sql
CASE
    WHEN score >= 90 THEN 'A'
    WHEN score >= 80 THEN 'B'
    ELSE 'C'
END
```
## 1.2. 단순형 CASE
```sql
CASE year
    WHEN 1 THEN '신입'
    WHEN 2 THEN '주니어'
    ELSE '경력'
END
```

# 2. NULL 관련
특정 값이 NULL인 경우에 처리하기 위한 표준 함수인 `COALESCE()`가 있다.

## 2.1. COALESCE
`COALESCE()`에는 무한대의 인자를 넣을 수 있고, 나열된 인자 중 NULL이 아닌 첫 번째 값을 반환한다.

```sql
SELECT COALESCE(col1, col2, ...)
```

## 2.2. NULLIF
두 값이 같으면 NULL을, 다르면 첫 번째 값을 반환한다.  
주로 0으로 나누기 에러를 방지하거나, 의미 없는 특정 데이터(예: 공백)을 NULL로 처리할 때 사용한다.

```sql
SELECT NULLIF(col1, col2)
```
