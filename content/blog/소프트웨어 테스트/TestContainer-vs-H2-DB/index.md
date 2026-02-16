---
title: "CI 빌드 속도 66% 단축기: 테스트 환경의 DB를 TestContainers(MySQL)에서 H2로 전환하며 마주한 고민들"
description: "CI 최적화를 위해 테스트 DB 환경을 교체하며 분석한 성능 병목 지점과 '환경 불일치' 관리 전략을 공유하기 위해 작성한 글입니다."
date: 2026-02-13
tags: ["TestContainers", "H2", "CI/CD", "Testing"]
slug: "testcontainer-vs-h2-db"
---

# 1. 들어가며
Spring Boot로 백엔드 API를 개발할 때, 데이터베이스와 연동되는 테스트는 필수적입니다.  
기존에는 운영 환경(MySQL)과 100% 동일한 환경을 보장하기 위해 TestContainers를 사용했습니다.

하지만 프로젝트 규모가 커짐에 따라 **GitHub Actions에서 수행되는 CI 과정의 빌드 시간이 3분을 넘어가기 시작**했습니다. 이는 잦은 배포에 하나의 병목 지점이 되었습니다.  
이를 해결하기 위해 **인메모리 DB인 H2로 전환**을 결정했고, 결과적으로 **빌드 시간을 1분으로 단축**할 수 있었습니다.

이 과정에서 왜 TestContainers가 느린지, 그리고 테스트 환경 불일치 문제는 어떻게 관리했는지에 대한 분석을 기록해보려고 합니다.

---

# 2. TestContainers vs H2: 성능 병목의 근본적 원인

TestContainers를 사용할 때 발생하는 약 2분의 지연은 어디서 오는 걸까요? 단순히 DB 엔진의 차이를 넘어 인프라 구조적인 차이가 큽니다.

![TestContainers와 H2 비교](thumbnail.png)

## 2.1 인프라 라이프사이클과 오버헤드
- **컨테이너 초기화 비용**: H2는 JVM 내에서 객체가 생성되는 수준으로 즉시 실행됩니다. 반면 TestContainers는 Docker Daemon에 요청을 보내고, 이미지를 Pull 하고, 컨테이너를 생성/실행하는 무거운 과정을 거칩니다.
- **Ready-Check 메커니즘**: 컨테이너가 뜬 후에도 내부의 MySQL 프로세스가 완전히 올라올 때까지 _Wait Strategy_ 가 동작하며 추가로 수~수십 초를 대기합니다.
- **Cleanup 프로세스**: 테스트 종료 후 _Ryuk_ 컨테이너(TestContainers의 리소스 정리용 컨테이너)가 리소스를 정리하는 과정 또한 CI 환경에서는 모두 비용입니다.

## 2.2 I/O 관점의 차이 (Memory vs Disk/Network)
I/O 성능은 이 두 방식의 격차를 가장 크게 만드는 요인입니다.

- **저장 매체 (RAM vs Storage)**: H2는 JVM Heap 메모리에 데이터를 저장하므로 디스크 I/O가 0입니다. 반면, MySQL은 기본적으로 영속성을 위해 Docker 내부의 가상 파일 시스템(_Virtual File System_)에 데이터를 기록하며 실제 디스크 I/O를 유발합니다.
- **전송 계층 (Method Call vs Network Stack)**:
  - **H2**: 동일 프로세스 내 통신으로 비용이 사실상 없습니다.
  - **TestContainers:** 애플리케이션(Host)에서 컨테이너(Guest)로 데이터를 보낼 때 TCP/IP 네트워크 스택과 Docker Bridge Network를 통과해야 하며, 이 과정에서 컨텍스트 스위칭이 발생합니다.

--- 

## 3. 리스크 관리: '환경 불일치'를 어떻게 극복했는가?

이렇게 H2 DB로 전환함에 따라 속도를 얻은 대신 잃게 되는 가장 큰 가치는 **운영 환경과의 동일성**입니다.  
H2에 MySQL 모드가 있긴 합니다만, SQL Parser 수준의 호환성을 지원할 뿐, MySQL과 완전히 동일한 방식으로 동작하지는 않습니다.  

따라서 특정 구현체에 종속되지 않도록 다음과 같은 전략으로 이 차이를 극복했습니다.

1. **프로덕션 코드에서 모두 JPA에 의존한다.**
프로덕션 코드에서 DB와 통신하는 모든 코드는 JPQL과 Spring Data JPA를 사용함으로써 JPA에 의존하도록 했습니다.  
JPA를 사용하면 구현체에 따라 알아서 SQL을 만들어주기에 구현체를 변경하더라도 안전합니다.  

3. **테스트 격리 시, Truncate SQL 대신 JPA의 `deleteAllInBatch()` 사용**
기존에는 _DatabaseCleaner_ 라는 객체 안에서 Junit5의 `@BeforeEach` 단계마다 Truncate SQL을 통해 직접 DB CleanUp을 수행했습니다.  
이를 위해 외래키 제약 조건을 잠시 해제했다가 다시 설정해줬는데요. 이때 MySQL과 H2의 쿼리가 달랐습니다.  

MySQL은 `SET FOREIGN_KEY_CHECKS = 0;`, H2는 `SET REFERENTIAL_INTEGRITY FALSE;`를 사용합니다. 이 차이로 테스트 환경이 달라져 실패가 발생했습니다.  

그래서 Truncate SQL 대신 `deleteAllInBatch()`를 순서대로 호출해 벤더 종속 없이 데이터를 정리했습니다.  

> 물론 위 방법은 삭제 순서를 반드시 지켜야하며 모든 엔티티마다 삭제 코드를 반드시 추가해야 한다는 수고로움이 있긴 했습니다.

---

# 4. TestContainers를 포기할 수 없다면? (최적화 대안)
만약 프로덕션 코드에서 특정 DB에 종속적인 SQL으로 구현된 로직이 있거나, 운영 DB와 동일한 환경에서 테스트를 해야 한다면 TestContainers 사용이 불가피할 수 있습니다. 

이 경우에는 아래 방법들을 고려하여 TestContainers를 이용한 테스트 속도를 향상해볼 수 있습니다.

- **[Reusable Containers](https://java.testcontainers.org/features/reuse/) (v2.0.3+):** 테스트가 끝나도 컨테이너를 유지하여 다음 테스트 시 재사용합니다. 하지만 GitHub Actions 같은 일회성 CI 환경에서는 적용이 어렵다는 한계가 있습니다.
- **CI 환경 Docker Image 캐싱:** [GitHub Actions의 캐시 기능](https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching)을 이용해 이미지 Pull 시간을 단축할 수 있습니다.
- **MySQL 설정 최적화:** `innodb_flush_log_at_trx_commit=0` 등 데이터 유실을 감수하더라도 속도를 극대화하는 옵션을 `withCommand`로 주입하여 초기화 속도를 높일 수 있습니다.

```java
// MySQL 컨테이너 기동 속도 최적화 예시
new MySQLContainer<>("mysql:8.0")
    .withCommand(
        "--innodb_flush_log_at_trx_commit=0",
        "--sync_binlog=0",
        "--innodb_use_native_aio=0"
    );
```

# 5. 마치며
CI 빌드 시간을 3분에서 1분으로 단축함에 따라 더 잦은 배포가 가능하게 되었고, 이는 생산성과 시스템 안정성 향상을 야기할 수 있었습니다. 

중요한 것은 **어떤 도구가 더 좋은가**가 아니라, **현재 우리 팀의 상황에서 어떤 불편함을 해결해야 하는가**를 파악하고 그에 따른 기회비용을 관리하는 능력이라고 생각합니다.

# 참고
- [Testcontainers 공식 문서](https://testcontainers.com/)
- [GitHub Actions Dependency Caching](https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching)
