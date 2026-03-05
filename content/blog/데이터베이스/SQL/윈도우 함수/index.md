---
title: "[SQL] 윈도우 함수"
description: "SQL의 윈도우 함수에 대해 학습한 내용을 정리했습니다."
date: 2026-03-05
tags: [ "SQL", "윈도우 함수" ]
slug: "sql-window-functions"
---

# 1. 들어가며
SQL의 윈도우 함수(Window Function)는 **행과 행 사이의 관계를 정의하기 위해 사용하는 도구**입니다.

일반적으로 `GROUP BY`가 여러 행을 하나의 요약된 결과(합계, 평균 등)로 합쳐버린다면, **윈도우 함수는 기존의 개별 행 데이터를 그대로 유지하면서 계산 결과만 옆에 덧붙여줍니다**.

# 2. 사용 방법
## 2.1. 사용 가능한 절
SQL 표준에 정의에 의하면 윈도우 함수는 `SELECT` 절과 `ORDER BY` 절에서만 사용 가능합니다.  

윈도우 함수의 기본 구조는 다음과 같습니다.

```sql
-- 기본 형태
SELECT 함수(칼럼) over (partition BY 칼럼 ORDER BY 칼럼)
```

- 함수: `SUM`, `AVG`, `ROW_NUMBER`, `RANK`, `NTILE` 등
- `PARTITION BY`: 데이터를 특정 그룹으로 나눕니다. (그룹별 계산이 필요할 때)
- `ORDER BY`: 그룹 내에서 계산을 수행할 순서를 정합니다.

이를 응용해서 `FROM` 절에 서브쿼리로 윈도우 함수를 작성하여, 그 결과를 테이블의 칼럼처럼 사용하는 것도 가능합니다.

```sql
SELECT *
FROM (
    SELECT ID, ROW_NUMBER() OVER (ORDER BY ID) AS ROW_NUM
    FROM 테이블
     ) AS subtable
WHERE ROW_NUM <= 5;
```

> 표준 SQL 및 많은 RDBMS에서는 `FROM` 절의 서브쿼리를 시스템이 참조하기 위해서는 이름이 필요하기 때문에 **별칭을 추가해줘야 합니다**.

# 3. 주요 윈도우 함수 종류
윈도우 함수에는 목적에 따라 크게 세 가지로 나눌 수 있고, 각 목적에 해당하는 함수가 존재합니다.

## 3.1. 순위 결정 함수 (Ranking)
데이터에 번호를 매길 때 사용합니다.

|       함수       |            설명             | 예시 (100, 100, 80점일 때) |
|:--------------:|:-------------------------:|:---------------------:|
| `ROW_NUMBER()` |   중복 상관없이 무조건 고유한 번호 부여   |        1, 2, 3        |
|    `RANK()`    |  중복 시 같은 등수, 다음 등수는 건너뜀   |        1, 1, 3        |
| `DENSE_RANK()` | 중복 시 같은 등수, 다음 등수를 이어서 부여 |        1, 1, 2        |

```sql
SELECT 
    ID, 
    PARENT_ID, 
    DIFFERENTIATION_DATE,
    ROW_NUMBER() OVER (
        PARTITION BY PARENT_ID
        ORDER BY DIFFERENTIATION_DATE ASC
    ) AS BIRTH_ORDER
FROM 
    ECOLI_DATA;
```

결과:

| ID | PARENT_ID | DIFFERENTIATION_DATE | BIRTH_ORDER |
|:---|:----------|:---------------------|:------------|
| 1  | NULL      | 2019-01-01           | 1           |
| 2  | NULL      | 2019-01-01           | 2           |
| 3  | 2         | 2020-01-01           | 1           |
| 4  | 2         | 2020-01-01           | 2           |
| 5  | 2         | 2020-01-01           | 3           |
| 6  | 4         | 2021-01-01           | 1           |
| 7  | 4         | 2022-01-01           | 2           |
| 8  | 6         | 2022-01-01           | 1           |

```sql
SELECT id,
       parent_id,
       differentiation_date,
       row_number() over (
        ORDER BY DIFFERENTIATION_DATE ASC
    ) AS birth_order
FROM ecoli_data;
```

결과:

| ID | PARENT_ID | DIFFERENTIATION_DATE | BIRTH_ORDER |
|:---|:----------|:---------------------|:------------|
| 1  | NULL      | 2019-01-01           | 1           |
| 2  | NULL      | 2019-01-01           | 2           |
| 3  | 2         | 2020-01-01           | 3           |
| 4  | 2         | 2020-01-01           | 4           |
| 5  | 2         | 2020-01-01           | 5           |
| 6  | 4         | 2021-01-01           | 6           |
| 7  | 4         | 2022-01-01           | 7           |
| 8  | 6         | 2022-01-01           | 8           |

## 3.2. 집계 함수 (Aggregate)
`GROUP BY` 없이도 누적 합계나 전체 평균을 구할 수 있습니다. (두 방식의 결정적인 차이로는 **데이터의 행이 줄어드는가, 유지되는가**에 있습니다.)

- `SUM(칼럼) OVER(ORDER BY 칼럼)`: 정렬 순서에 따른 누적 합계를 구합니다.

```sql
SELECT
    ID,
    DIFFERENTIATION_DATE,
    SIZE_OF_COLONY,
    SUM(SIZE_OF_COLONY) OVER (
        ORDER BY DIFFERENTIATION_DATE, ID
    ) AS RUNNING_SIZE_SUM
FROM ECOLI_DATA
ORDER BY DIFFERENTIATION_DATE, ID;
```

결과:

| ID | DIFFERENTIATION_DATE | SIZE_OF_COLONY | RUNNING_SIZE_SUM |
|:---|:---------------------|:---------------|:-----------------|
| 1  | 2019-01-01           | 10             | 10               |
| 2  | 2019-01-01           | 2              | 12               |
| 3  | 2020-01-01           | 100            | 112              |
| 4  | 2020-01-01           | 16             | 128              |
| 5  | 2020-01-01           | 17             | 145              |
| 6  | 2021-01-01           | 101            | 246              |
| 7  | 2022-01-01           | 101            | 347              |
| 8  | 2022-01-01           | 1              | 348              |

- `AVG(칼럼) OVER()`: 전체 데이터의 평균을 각 행 옆에 출력합니다.

```sql
SELECT id,
       parent_id,
       size_of_colony,
       AVG(size_of_colony) over () AS global_avg_size, AVG(size_of_colony) over (partition BY PARENT_ID) AS parent_avg_size
FROM ecoli_data
ORDER BY id;
```

결과:

| ID | PARENT_ID | SIZE_OF_COLONY | GLOBAL_AVG_SIZE | PARENT_AVG_SIZE |
|:---|:----------|:---------------|:----------------|:----------------|
| 1  | NULL      | 10             | 43.5            | 6               |
| 2  | NULL      | 2              | 43.5            | 6               |
| 3  | 2         | 100            | 43.5            | 44.3333         |
| 4  | 2         | 16             | 43.5            | 44.3333         |
| 5  | 2         | 17             | 43.5            | 44.3333         |
| 6  | 4         | 101            | 43.5            | 101             |
| 7  | 4         | 101            | 43.5            | 101             |
| 8  | 6         | 1              | 43.5            | 1               |

## 3.3. 분석 함수(Value)
현재 행을 기준으로 앞뒤 행의 값을 가져옵니다.

- `LAG()`: 이전 행의 값을 가져온다.
- `LEAD()`: 다음 행의 값을 가져온다.
- `NTILE(n)`: 전체를 n개의 그룹으로 등분한다.

```sql
SELECT
    ID,
    DIFFERENTIATION_DATE,
    SIZE_OF_COLONY,
    LAG(SIZE_OF_COLONY) OVER (ORDER BY DIFFERENTIATION_DATE, ID) AS PREV_SIZE
FROM ECOLI_DATA
ORDER BY DIFFERENTIATION_DATE, ID;
```

결과:

| ID | DIFFERENTIATION_DATE | SIZE_OF_COLONY | PREV_SIZE |
|:---|:---------------------|:---------------|:----------|
| 1  | 2019-01-01           | 10             | NULL      |
| 2  | 2019-01-01           | 2              | 10        |
| 3  | 2020-01-01           | 100            | 2         |
| 4  | 2020-01-01           | 16             | 100       |
| 5  | 2020-01-01           | 17             | 16        |
| 6  | 2021-01-01           | 101            | 17        |
| 7  | 2022-01-01           | 101            | 101       |
| 8  | 2022-01-01           | 1              | 101       |

```sql
SELECT
    ID,
    DIFFERENTIATION_DATE,
    SIZE_OF_COLONY,
    LEAD(SIZE_OF_COLONY) OVER (ORDER BY DIFFERENTIATION_DATE, ID) AS NEXT_SIZE
FROM ECOLI_DATA
ORDER BY DIFFERENTIATION_DATE, ID;
```

결과:

| ID | DIFFERENTIATION_DATE | SIZE_OF_COLONY | NEXT_SIZE |
|:---|:---------------------|:---------------|:----------|
| 1  | 2019-01-01           | 10             | 2         |
| 2  | 2019-01-01           | 2              | 100       |
| 3  | 2020-01-01           | 100            | 16        |
| 4  | 2020-01-01           | 16             | 17        |
| 5  | 2020-01-01           | 17             | 101       |
| 6  | 2021-01-01           | 101            | 101       |
| 7  | 2022-01-01           | 101            | 1         |
| 8  | 2022-01-01           | 1              | NULL      |

```sql
SELECT
    ID,
    SIZE_OF_COLONY,
    NTILE(4) OVER (ORDER BY SIZE_OF_COLONY DESC) AS SIZE_QUARTILE
FROM ECOLI_DATA
ORDER BY SIZE_OF_COLONY DESC, ID;
```

결과:

| ID | SIZE_OF_COLONY | SIZE_QUARTILE |
|:---|:---------------|:--------------|
| 6  | 101            | 1             |
| 7  | 101            | 1             |
| 3  | 100            | 2             |
| 5  | 17             | 2             |
| 4  | 16             | 3             |
| 1  | 10             | 3             |
| 2  | 2              | 4             |
| 8  | 1              | 4             |

# 4. 활용 예시

## 4.1. 누적 매출 계산
매일의 매출과 지금까지의 총 매출액을 함께 보고 싶은 경우 다음과 같이 SQL을 작성할 수 있습니다.

```sql
SELECT sales_date,   -- 날짜
       daily_amount, -- 각 날짜의 매출액
       SUM(daily_amount) over (ORDER BY sales_date) AS accumulated_amount -- 각 날짜의 누적 매출액
FROM sales_table;
```

## 4.2. 백분위를 기준으로 그룹 나누기

특정 칼럼을 기준으로 그룹을 나눌 땐 `NTILE(n)` 함수를 사용해서 지정한 개수만큼 범위를 나눕니다.

아래 코드는 프로그래머스의 [대장균의 크기에 따라 분류하기 2](https://school.programmers.co.kr/learn/courses/30/lessons/301649) 문제입니다.

```sql
SELECT id,
       (CASE
            WHEN quartile = 1 THEN 'CRITICAL'
            WHEN quartile = 2 THEN 'HIGH'
            WHEN quartile = 3 THEN 'MEDIUM'
            ELSE 'LOW'
           END) AS colony_name
FROM (SELECT id,
             ntile(4) over (ORDER BY size_of_colony DESC) AS quartile
      FROM ecoli_data) AS subtable
ORDER BY id;
```
