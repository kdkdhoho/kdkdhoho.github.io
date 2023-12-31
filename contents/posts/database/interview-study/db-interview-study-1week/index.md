---
title: "DB 면접 스터디 1주차"
description: "기록용"
date: 2023-11-21
update: 2023-12-01
tags: ["database", "interview"]
series: "DB 면접 스터디"
---

## 📝 질문 리스트

### 파일 시스템과 데이터베이스의 차이점에 대해서 설명해주세요.

파일 시스템은 물리적 액세스만 관리하고, 데이터베이스는 물리적 액세스와 논리적 액세스 모두 관리합니다.

둘 다 결국엔, 디스크에 물리적으로 저장된다.

특히 파일 시스템의 경우 디스크에 저장된 파일을 직접 다루는 시스템이다.

데이터베이스는 이 디스크에 저장된 파일과, 사용자 사이에서 데이터를 논리적인 구조로 관리하는 시스템

### 데이터베이스의 특징에 대해 설명해주세요.

실시간 사용성, 지속적인 변화, 동시에 공유, 값 참조가 있습니다.

### DBMS는 뭘까요? 특징에 대해 설명해주세요.

데이터베이스를 관리하는 시스템으로, 소프트웨어

MySQL, Oracle, Redis 등이 있다.

특징으로는, 데이터 일관성 유지, 복구, 동시 요청 제어 등이 있다.

### 스키마가 뭘까요? 3단계 데이터베이스 구조에 대해 설명해주세요.

스키마란, 데이터베이스에 저장된 데이터 구조를 정의하는 개념입니다.

이 스키마는 데이터베이스 구조에서 외부 스키마, 개념 스키마, 내부 스키마로 나뉩니다.

외부 스키마는 사용자가 보는 스키마입니다. 흔히 테이블이나 뷰를 의미한다고 보면 될 것 같습니다.

개념 스키마는 전체 데이터베이스의 정의를 의미합니다. 쉽게 말해 전체 테이블을 의미한다고 할 수 있습니다.

내부 스키마는 디스크에 실제 데이터가 저장되는 방법의 표현입니다. 인덱스, 자료형이 포함된다고 할 수 있습니다.

### 데이터 독립성에 대해서 설명해주세요. ← 이거 잘 이해가 안감

DB의 구조를 변경해도, 사용자에게 영향이 가지 않도록 하는 개념입니다.

두 가지의 데이터 독립성이 존재합니다.

논리적 데이터 독립성입니다. 이는, 논리적인 구조나 스키마를 변경해도 사용자는 동일하게 DML을 사용할 수 있어야 한다는 점입니다. 쉽게 말해 테이블 구조가 변경이 되어도 사용자는 논리적으로 동일한

물리적 데이터 독립성은, 물리적인 구조가 변경되어도 사용자에게는 영향을 주지 않습니다.

### RDBMS(관계형 데이터베이스 관리시스템)는 뭘까요?

데이터를 테이블 간의 정의된 관계를 통해 데이터를 조회하고 쓸 수 있는 시스템입니다.

### 릴레이션 스키마와 릴레이션 인스턴스에 대해서 설명해주세요.

릴레이션 스키마는, 쉽게 말해 테이블의 제약 조건입니다. 테이블의 이름, 각 칼럼의 이름과 자료형을 의미합니다. 자바로 비유하자면 클래스

릴레이션 인스턴스는, 자바로 비유하자면 인스턴스가 될 것 입니다. 즉, 스키마가 생성되고 어느 특정 시점에 테이블에 저장되어 있는 상태가 바로 릴레이션 인스턴스이다.

정적이냐 동적이냐의 관점으로 봐도 될 것 같다.

### 릴레이션의 차수와 카니덜리티에 대해 설명해주세요.

차수: 특정 테이블의 칼럼 수

카디널리티: 특정 칼럼에 해당하는 행들의 중복도입니다. 중복도가 높으면 카디널리티는 낮다라고 표현을 하고, 반대로 중복도가 낮으면 카디널리티는 높다고 합니다.

### 키(Key)에 대해서 설명해주세요. (슈퍼키, 후보키, 기본키, 대리키, 외래키)

슈퍼키: 테이블 내에서 고유성을 보장하는 데 사용되는 하나 이상의 칼럼의 집합

후보키: 슈퍼키의 성질을 포함하면서 동시에 최소성을 만족하는 키

기본키: ID 필드에 속하는 값들. 각 행을 구분짓는 값. Not Null이며 값이 중복되서는 안된다.

대리키: 사용자가 정의한 실제 데이터와는 상관없이 데이터베이스가 자동으로 생성하는 키를 의미. 주로 기본키로 사용하며, 데이터의 변경이나 실제 값의 변경에 대한 영향을 최소화한다.

외래키: 하나의 특정 테이블에서 다른 테이블과 관계를 맺기 위한 키. 주로 외래키는 관계를 맺어지는 테이블의 기본키이다.

### 무결성 제약조건에 대해서 설명해주세요. (도메인 무결성, 개체 무결성, 참조 무결성)

데이터 무결성: DB에 저장된 데이터가 결함이 없는지? 이 결함은, 일관성과 정확성

도메인 무결성(도메인 제약): 칼럼의 속성에 해당하는 값만 올 수 있다.

개체 무결성(기본키 제약): 테이블은 기본키를 설정해야 하고, 기본키는 Not Null, Unique 해야 한다.

참조 무결성(외래키 제약): 테이블 간의 참조 관계를 선언하는 제약 조건. 자식 테이블의 외래키는 부모 테이블의 기본키와 도메인이 동일해야 하며, 자식 릴레이션의 값이 변경될 때 부모 릴레이션의 제약을 받는다.

### 사용했던 데이터베이스에 대해서 설명해주세요. (오라클DB, MySQL, MariaDB, MongoDB 등)
