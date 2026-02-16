---
title: "InnoDB 스토리지 엔진의 락"
description: "InnoDB 스토리지 엔진 레벨의 락에 대해 이해해보자"
date: 2024-01-11
tags: ["database", "MySQL"]
series: "Real MySQL 8.0"
slug: "05-lock-of-innodb-storage-engine"
---

Lock에는 MySQL 엔진이 관리하는 Lock과 InnoDB 스토리지 엔진이 관리하는 락이 있다.

이번에는 InnoDB 스토리지 엔진이 관리하는 Lock에 대해 알아보자.

## 레코드 락

InnoDB 엔진이 관리하는 락 중에서 핵심이다.

다른 DBMS의 레코드 락과 동일하지만 한 가지 중요한 차이는 **레코드 자체가 아니라 인덱스의 레코드를 잠근다는 것이다.**<br>
따로 생성한 세컨더리 인덱스 뿐만 아니라 PK 인덱스도 마찬가지다.<br>
다만, PK 인덱스는 갭 락을 걸지 않고 레코드 락만 걸지만 세컨더리 인덱스에서는 넥스트 키 락 또는 갭 락을 이용한다.

## 갭 락

갭 락은 **레코드와 해당 레코드와 바로 인접한 레코드 사이 간격을 잠그는 것을 의미**한다.

갭 락의 역할은 **레코드와 레코드 사이에 새로운 레코드가 INSERT 되는 것을 막기 위함**이다.

갭 락 그 자체보다는 넥스트 키 락의 일부로 자주 사용된다.

## 넥스트 키 락

레코드 락과 갭 락을 합쳐놓은 형태의 잠금이다.

갭 락이나 넥스트 키 락의 주목적은, 바이너리 로그에 기록되는 쿼리가 Slave 서버에서 실행될 때 Master 서버에서 만들어 낸 결과와 동일한 결과를 만들어내도록 보장하는 것이다.

> [바이너리 로그?](https://www.linux.co.kr/bbs/board.php?bo_table=lecture&wr_id=5775)

## Auto Increment 락

MySQL에는 테이블에 INSERT 할 때, 자동 증가하는 숫자를 넣어주는 `AUTO_INCREMENT` 칼럼 속성이 존재한다.

보통 ID 칼럼에 사용하곤 하는데, 테이블에 동시에 여러 건의 INSERT가 발생하는 경우 저장되는 각 레코드의 ID 값은 중복되지 않고 순서대로 증가하는 값이 자동으로 저장된다.

InnoDB 스토리지 엔진에서는 이 작업을 위해 내부적으로 **AUTO_INCREMENT 락** 이라고 하는 테이블 수준의 잠금을 사용한다.

어쩌면 당연하게 새로운 레코드를 저장하는 쿼리, INSERT, REPLACE 쿼리에서만 작동한다.

해당 락은, **트랜잭션과 상관없이 INSERT 혹은 REPLACE 쿼리에서 AUTO_INCREMENT 값을 가져올 때만 락이 걸렸다가 즉시 해제한다.**

AUTO_INCREMENT 락은 테이블 당 하나만 존재한다.<br>
따라서 2개 이상의 INSERT 쿼리가 동시에 실행되는 경우, 하나의 쿼리가 해당 테이블에 AUTO_INCREMENT 락을 걸면 나머지 쿼리는 락이 해제될 때까지 기다려야 한다.

> 참고로 AUTO_INCREMENT 칼럼에 값을 명시적으로 넣어준 쿼리가 실행되어도 AUTO_INCREMENT 락은 수행된다. 그 이유는, AUTO_INCREMENT 속성이 걸린 칼럼에 값이 명시적으로 담겨져
> INSERT 되면, AUTO_INCREMENT 값을 재설정하는 작업이 수행되기 떄문이다.

AUTO_INCREMENT 락은 명시적으로 획득하고 해제하는 방법은 없다.<br>
그리고 아주 짧은 시간동안 존재하는 락이기 때문에 대부분 문제가 잘 되지 않는다.

지금까지는 MySQL 5.0 이하 버전에서 사용되던 방식이다.<br>
MySQL 5.1 이상부터는 `innodb_autoinc_lock_mode` 시스템 변수를 이용해 작동 방식을 변경할 수 있다.

### innodb_autoinc_lock_mode = 0

위에서 설명된 방식 그대로 사용한다.

### innodb_autoinc_lock_mode = 1

MySQL 서버가 INSERT 되는 레코드의 수를 정확히 예측할 수 있을 때에는 AUTO_INCREMENT 락을 걸지 않고, 훨씬 빠른 래치(뮤텍스)를 이용한다.

락이 존재하는 타이밍이 존재하긴 하지만 AUTO_INCREMNET 락보다는 훨씬 빠르게 테이블에 락을 걸고 해제하게 된다.

다만, _INSERT 되는 레코드의 수를 정확히 예측할 수 있어야 한다_는 전제 조건이 있기 때문에 이 조건을 만족하지 못하면 AUTO_INCREMENT를 사용한다.

대량의 INSERT 쿼리가 처리될 때는, InnoDB 스토리지 엔진이 AUTO_INCREMENT 값을 한 번에 여러 값을 할당받아서 사용한다.<br>
하지만 이때 할당받은 값을 모두 사용하지 못하게 되면 폐기하게 되어, 그 다음 INSERT 쿼리에서 AUTO_INCREMENT 값은 중간 값이 누락된 값이 저장될 수 있다.

위 설정에서는 하나의 INSERT 쿼리로 저장되는 레코드는 연속된 자동 증가 값을 가진다는 특징을 가진다.<br>
따라서 이 설정 모드를 _연속 모드_ 라고도 한다.

### innodb_autoinc_lock_mode = 2

해당 설정은 AUTO_INCREMENT 락을 걸지 않고 가벼운 래치(뮤텍스)를 사용한다.

이 설정에서는 **대량 INSERT 문장이 실행되는 중에도 다른 커넥션에서 INSERT를 수행할 수 있다.**<br>
결과적으로 동시 처리 성능이 높아진다.

하지만 자동 증가 값이 연속되는 것은 보장할 수 없다. 단지 유니크한 값만 생성한다는 것만 보장한다.<br>
하나의 INSERT 쿼리로 저장할 때에도 순서는 보장할 수 없다. 따라서 _인터리빙 모드_ 라고도 한다.

위 설정에서 **STATEMENT 포맷의 바이너리 로그를 사용하는 Replication 에서는 Master와 Slave의 AUTO_INCREMENT 값이 달라질 수 있다.**<br>
STATEMENT 포맷의 바이너리 로그를 사용한다면 mode 값을 1로 설정하자.

## 인덱스와 InnoDB의 잠금

레코드 락에서 언급한대로 InnoDB는 **레코드 자체가 아니라 인덱스의 레코드를 잠근다.**

이 말은 즉슨, **SELECT나 UPDATE, DELETE 처럼 변경해야 할 레코드를 찾기 위해 인덱스를 타고 검색하게 되는데, 이 과정에서 조건에 해당하는 레코드를 전부 잠근다.**

MySQL의 InnoDB에서 인덱스 설계가 중요한 이유 또한 이것이다.

### 레코드 수준의 잠금 확인 및 해제

MySQL 8.0부터는 performance_schema의 data_locks와 data_lock_waits 테이블을 통해 확인할 수 있다.

```sql
# 현재 프로세스의 목록을 조회한다.
mysql> SHOW PROCESSLIST;

# performance_schema의 data_locks와 data_lock_waits 테이블을 통해 잠금 대기 순서를 조회한다.
mysql> SELECT 
    r.trx_id waiting_trx_id, 
    r.trx_mysql_thread_id waiting_thread, 
    r.trx_query waiting_query, 
    b.trx_id blocking_trx_id,
    b.trx_mysql_thread_id blocking_thread, 
    b.trx_query blocking_query 
    FROM performance_schema.data_lock_watis w
    JOIN information_schema.innodb_trx b
    ON b.trx_id = w.blocking_engine_transaction_id
    JOIN infromation_schema.innodb_trx r
    ON r.trx_id = w.requesting_engine_transaction_id;
    
# 각 스레드가 어떤 잠금을 가지는지 상세하게 조회한다.
mysql> SELECT * FROM performance_schema.data_locks\G
```

문제가 되는 잠금이 있다면 `mysql> KILL {thread_id}` 를 통해 스레드를 강제 종료하자.

### Reference

> - https://dev.mysql.com/doc/refman/8.0/en/example-auto-increment.html
> - https://product.kyobobook.co.kr/detail/S000001766482