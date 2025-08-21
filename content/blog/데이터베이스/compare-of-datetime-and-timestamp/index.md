---
title: "[MySQL] DATETIME vs TIMESTAMP"
description: "두 자료형 알아보고 비교하기"
date: 2024-01-10
tags: ["database", "MySQL", "DATETIME", "TIMESTAMP"]
---

## 들어가며

최근 개인 프로젝트를 시작하면서 ERD 설계를 진행했습니다.

이때, 작성 날짜나 시작 날짜 같은 **날짜**에 대한 값을 저장할 칼럼이 필요했고 해당 칼럼의 자료형을 결정하는 과정에서 **DATETIME과 TIMESTAMP의 차이에 대해 궁금해졌습니다.**

따라서 이 둘을 이해해보겠습니다.

> 기준은 MySQL 8.0 입니다.

## DATETIME과 TIMESTAMP의 공통점

-  두 타입 모두 **날짜와 시간을 표현합니다.**
-  표현 형식은 `YYYY-MM-DD hh:mm:ss` 입니다.
-  최대 6자리 정밀도의 소수점 초 부분이 포함될 수 있습니다.
-  표현할 수 있는 범위의 차이 떄문에 약간 다른 점이 있습니다.
  - DATETIME은 `1000-01-01 00:00:00.000000`부터 `9999-12-31 23:59:59.499999` 까지입니다.
  - TIMESTAMP는 `1970-01-01 00:00:01.000000`부터 `2038-01-19 03:14:07.499999` 까지입니다.
- 자동으로 초기화하거나 현재의 날짜 및 시간으로 업데이트하는 기능을 제공합니다.
  - 예) `DEFAULT CURRENT_TIMESTAMP` or `ON UPDATE CURRENT_TIMESTAMP`

## DATETIME과 TIMESTAMP의 차이점

### 1. **지원하는 값의 범위에 차이가 있습니다.**

- DATETIME은 `1000-01-01 00:00:00` 부터 `9999-12-31 24:59:59` 까지입니다.
- TIMESTAMP는 `1970-01-01 00:00:01`UTC 부터 `2038-01-19 03:14:07`UTC 까지입니다.

### 2. **Current Time Zone에 따라 UTC 값으로 변환해주는 작업에 차이가 있습니다.**

- DATETIME은 작업을 지원하지 않습니다.
- TIMESTAMP는 저장 혹은 검색 시에 변환해줍니다.
    - 즉, TIMESTAMP는 Time Zone 변화에 유연합니다.
    - 추가로 Session 별로 Time Zone을 설정할 수 있습니다.

### 3. **값을 저장하는 공간의 크기에도 차이가 있습니다.**

- DATETIME은 8 byte를 차지합니다.
- TIMESTAMP는 4 byte를 차지합니다.

## 결론

날짜와 시간까지 함께 저장해야하는 칼럼의 자료형은, 가급적 **TIMESTAMP를 선택하는 것이 좋아보입니다.**

저장 공간의 이점도 있을 뿐더러, 무엇보다 Time Zone에 따른 UTC 값으로 자동 변환해주는 작업의 유무에서 큰 차이가 있기 때문입니다.

따라서 더 가볍고 유연한 테이블을 위해서는 DATETIME 보단 TIMESTAMP를 권장합니다.

## 번외: DATE 타입

- 시간없이 날짜에 대한 값만 지원합니다.
- `YYYY-MM-DD` 형식으로 표현합니다.
- 지원 범위는 `1000-01-01` 부터 `9999-12-31` 까지입니다.

> ### Reference
> - https://dev.mysql.com/doc/refman/8.0/en/datetime.html
> - https://dev.mysql.com/doc/refman/8.0/en/timestamp-initialization.html