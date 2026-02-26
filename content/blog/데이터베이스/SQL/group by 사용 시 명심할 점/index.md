---
title: "[SQL] GROUP BY 사용할 때 명심할 점"
description: "GROUP BY 사용하면서 실수한 경험에 대해 기록했습니다."
date: 2026-02-26
tags: ["SQL", "GROUP BY"]
slug: "remember-to-use-group-by"
---

# 문제 상황
식당의 정보를 가지는 `REST_INFO` 테이블과 각 식당의 리뷰 데이터를 가지는 `REST_REVIEW` 테이블이 있습니다.

이 두 테이블을 조인해서 원하는 칼럼의 값과 특정 식당의 평균 점수를 가져오는 요구 사항이 있었습니다.

처음엔 아래와 같이 SQL을 작성했습니다.

```sql
SELECT ri.rest_id, ri.rest_name, ri.food_type, ri.favorites, ri.address, ROUND(AVG(rr.review_score), 2) as average
FROM rest_info ri JOIN rest_review rr ON ri.rest_id = rr.rest_id
WHERE ri.address LIKE '서울%'
GROUP BY ri.rest_id
ORDER BY average DESC, ri.favorites DESC
```

원하는 결과는 나왔지만, `GROUP BY` 절에서 잘못 사용했다는 점을 알게 됐습니다.

# 왜 잘못 사용했는가?
ANSI 표준 SQL의 원칙은 다음과 같습니다.  
"_SELECT 절에 있는 컬럼 중, 집계 함수(SUM, AVG, COUNT 등)에 들어가지 않은 모든 컬럼은 반드시 GROUP BY 절에 명시해야 한다._"

하지만 저는 어차피 id로 묶으면 결과는 똑같이 묶인다고 판단해서 id로만 그룹화를 수행했습니다.

그렇다면 결과는 똑같은데 왜 굳이 SELECT 절에 있는 칼럼 중, 집계 함수를 제외한 모든 칼럼을 GROUP BY 절에 명시해야 할까요?

바로, **DB 엔진이 그룹으로 묶이지 않은 데이터 중 어떤 것을 출력해야 할지 스스로 결정하지 않기 위해서**입니다.  
과거 MySQL의 경우 "어차피 ID가 같으면 이름이나 주소도 같겠지?"라고 대충 이해하고 결과를 보여줍니다. 이를 'Hidden Columns' 허용이라고 합니다.

하지만 현대 MySQL, Oracle, SQL Server에서는 "_id는 묶였는데 이름은 그룹화되지 않았어! 어떤 이름을 가져올지 모르겠으니 에러를 낼게!_" 라며 실행을 거부합니다.

우리는 id가 유니크하다는 걸 알지만, DB 입장에서는 id가 같아도 address가 여러 개일 가능성을 배제할 수도, 보장할 수도 없기 때문입니다.

따라서 조회하려는 모든 정보가 이 그룹 내에서 유일하다는 것을 문법적으로 확정해주는 작업이, 바로 GROUP BY에 모든 컬럼을 적는 것입니다.

# 참고

- [MySQL 공식문서 - 14.19.3 MySQL Handling of GROUP BY](https://dev.mysql.com/doc/refman/8.0/en/group-by-handling.html)
