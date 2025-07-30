---
title: "[DB] 프로시저, 함수, 패키지에 대해"
description: "데이터베이스 프로시저, 함수, 패키지 && 프로시저 vs 함수"
date: 2024-07-22
tags: ["DB"]
---

DB의 프로시저(Procedure), 함수(Function), 패키지(Package)에 대해 간단히 알아보자.<br>
그리고 프로시저와 함수의 차이에 대해서도 알아보자.

## 프로시저

DB 프로시저는 **데이터베이스에 저장된 일련의 쿼리와 절차적 코드를 포함하는 프로그램**이다.<br>
주로, 데이터베이스 내 복잡한 작업을 자동화하거나 반복적인 작업을 처리하는 데 사용된다.

### 주요 특징

1. 모듈성: 프로시저는 독립적인 모듈로서 여러 곳에서 재사용될 수 있다.
2. 성능 향상: SQL 쿼리를 미리 컴파일해 저장하기에 실행 시 더 빠르게 처리된다.
3. 반환 값 없음: 프로시저는 반환 값이 없어도 된다. 혹, 반환값이 있을 경우 `OUT` 매개변수를 이용해 반환한다.
4. 에러 처리: 프로시저 내에서 에러를 처리할 수 있다. 

### 사용 예시 코드

```sql
-- 프로시저 호출
CREATE PROCEDURE update_employee_salary {
    -- 파라미터 1
    IN employee_id INT,
    -- 파라미터 2
    IN new_salary DECIMAL(10, 2)
}
-- 실행부
BEGIN
    UPDATE employees
    SET salary = new_salary
    WHERE id = employee_id;
END;

-- 프로시저 호출
CALL update_employee_salary(1, 75000.00);
```

## 함수

DB 함수는 **특정 작업을 수행하고 하나의 값을 반환하는 쿼리 블록**이다.<br>
주로 데이터를 계산하거나 변환하는 데 사용된다.

### 주요 특징

1. 반환 값 필수: 함수는 항상 하나의 값을 반환해야 한다.
2. 호출 방식: 쿼리 내에서 호출될 수 있으며, SELECT 문 등에서 사용될 수 있다.
3. 트랜젝션 제어 불가: 트랜잭션을 제어하는 COMMIT, ROLLBACK 명령어가 포함될 수 없다.

### 사용 예시 코드

```sql
-- 함수 선언
CREATE FUNCTION get_employee_salary {
    -- 파라미터
    employee_id INT
} RETURNS DECIMAL(10, 2)
-- 실행부
BEGIN
    DECLARE employee_salary DECIMAL(10, 2);
    SELECT salary INTO employee_salary
    FROM employees
    WHERE id = employee_id
    RETURN employee_salary;
END;
```

## 패키지

DB 패키지는 **프로시저, 함수, 변수, 커서 등 DB 객체를 그룹화한 논리적인 단위**이다.<br>
Header와 Body로 나뉜다.

### 주요 특징

1. 관련 프로시저와 함수를 논리적인 한 단위로 묶음으로써 큰 단위의 모듈을 구축할 수 있다.
2. 패키지가 처음 호출될 때 메모리에 로드되므로 이후 이후의 호출에는 더 빠르게 실행된다.

### 사용 예시 코드

```sql
-- Header부
CREATE OR REPLACE PACKAGE employee_pkg IS
    PROCEDURE update_salary(employee_id INT, new_salary DECIMAL);
    FUNTION get_salary(employee_id INT) RETURN DECIMAL;
}

-- Body부
CREATE OR REPLACE PACKAGE BODY employee_pkg IS
    PROCEDURE update_salary(employee_id INT, new_salary DECIMAL) IS
    BEGIN
        UPDATE employees
        SET salary = new_salary
        WHERE id = employee_id;
    END update_salary;
    
    FUNCTION get_salary(employee_id INT) RETURN DECIMAL IS
        employee_salary DECIMAL(10, 2);
    BEGIN
        SELECT salary INTO employee_salary
        FROM employees
        WHERE id = employee_id
        RETURN employee_salary;
    END get_salary
END employee_pkg;

-- 패키지 내 프로시저 호출
EXEC employee_pkg.update_salary(1, 20000.00);
-- 패키지 내 함수 호출
SELECT employee_pkg.get_salary(1) FROM dual;
```