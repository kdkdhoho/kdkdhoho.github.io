---
title: "@TransactionalEventListener 메서드를 테스트하기 위한 방법"
description: "TestTransaction를 이용해 테스트 중간에 트랜잭션을 강제로 커밋하기"
date: 2024-09-26
tags: ["Spring", "TestTransaction"]
slug: "transactional-event-listener-test-trouble-shooting"
---

## 개요

게시글에 댓글 작성 시, 게시글 작성자에게 알람을 생성하도록 하는 기능을 구현해야 했다.<br>
이때, 댓글과 알람의 결합도를 낮추기 위해 `ApplicationEventPublisher`을 사용했다.<br>
코드는 아래와 같다.
```java
public class CommentService {

    public CommentCreateResponse create(Long listId, String content, Long loginUserId) {
        User user = userRepository.getById(loginUserId);
        ListEntity list = listRepository.getById(listId);

        Comment comment = Comment.create(list, user, new CommentContent(content));
        Comment saved = commentRepository.save(comment);

        applicationEventPublisher.publishEvent(AlarmEvent.comment(list, saved));
        return CommentCreateResponse.of(saved, user);
    }
}

public class AlarmService {

    @TransactionalEventListener
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void save(AlarmEvent alarmEvent) {
        alarmEvent.validateDifferentPublisherAndReceiver();
        alarmRepository.save(alarmEvent.toEntity());
    }
}
```

여기서 `@TransactionalEventListener`와 `@Transactional(propagation = Propagation.REQUIRES_NEW)`에 대해 짚고 넘어가고 싶은데,

`@EventListener`이 아닌 `@TransactionalEventListener`을 적용한 이유는, 댓글 생성 로직이 Commit 된 후에 알람 생성 로직을 수행하도록 하기 위해서다.<br> 
> `@EventListener`는 이벤트가 발행되자마자 로직을 실행한다.<br>
> 반면 `@TransactionalEventListener`은 부모 트랜잭션이 Commit 된 이후에 실행된다.

트랜잭션 전파 속성을 `REQUIRES_NEW`로 설정한 이유는, `save()` 메서드는 부모 트랜잭션이 Commit 된 이후에 실행이 되어야 하는데, `REQUIRED`로 설정하면<br>
Commit이 된 트랜잭션에 합류하게 되고 그대로 종료하게 되므로, 결국 알람이 저장되지 않기 때문이다.

위 로직에 대한 통합 테스트 코드를 작성하기 위해 아래와 같이 코드를 작성했다.
```java
@Test
void 리스트에_댓글을_남길_경우_작성자에게_알람이_생성된다() {
    // given: 동호가 리스트를 생성한다.
    User listWriter = userRepository.save(동호());
    ListEntity list = listRepository.save(가장_좋아하는_견종_TOP3(listWriter, List.of()));

    // when: 정수가 댓글을 남긴다.
    User commentWriter = userRepository.save(정수());
    commentService.create(list.getId(), "첫 댓글!", commentWriter.getId());

    // then: 동호의 알람을 조회해서 검증한다.
    List<FindAlarmResponse> result = alarmRepository.getAlarms(listWriter);
    assertThat(result).hasSize(1);
    assertThat(result.get(0).getType()).isEqualTo(AlarmType.COMMENT.name());
    assertThat(result.get(0).getSendUserId()).isEqualTo(commentWriter.getId());
}
```

하지만 알람이 아무것도 존재하지 않았고, JPA 쿼리 로그를 보면 알람 데이터가 INSERT 되지 않는다.<br>

## 원인 파악

전체적인 로직을 하나씩 다시 살펴보자.<br>

`CommentService#create()`이 호출되고 `applicationEventPublisher.publishEvent(AlarmEvent.comment(list, saved));`을 호출한다.<br>
그리고 메서드는 종료한다.<br>
그러면 테스트 코드의 검증 부분으로 넘어가게 되고, 동시에 `AlarmService#save()`가 호출될 것이다.<br>

하지만 우리가 바라는 것은 `CommentService#create()`이 모두 종료되고, `AlarmService#save()`가 호출되고 나서야 검증 부분으로 넘어가는 것이다.<br>
따라서 `commentService.create(list.getId(), "첫 댓글!", commentWriter.getId());` 이후에 강제로 트랜잭션을 커밋해줘야 한다.

## 해결

스프링의 [TestTransaction](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/test/context/transaction/TestTransaction.html)을 통해 테스트 트랜잭션을 수동으로 제어할 수 있다.

`TestTransaction.flagForCommit()`과 `TestTransaction.end()`을 이용하여 해결해보자.

```java
@Test
void 리스트에_댓글을_남길_경우_작성자에게_알람이_생성된다() {
    // given
    User listWriter = userRepository.save(동호());
    ListEntity list = listRepository.save(가장_좋아하는_견종_TOP3(listWriter, List.of()));

    // when
    User commentWriter = userRepository.save(정수());
    commentService.create(list.getId(), "첫 댓글!", commentWriter.getId());

    TestTransaction.flagForCommit(); // 현재 진행 중인 테스트 트랜잭션이 종료되면 커밋하도록 설정한다.
    TestTransaction.end(); // 현재 진행 중인 테스트 트랜잭션을 종료한다.

    // then
    List<FindAlarmResponse> result = alarmRepository.getAlarms(listWriter);
    assertThat(result).hasSize(1);
    assertThat(result.get(0).getType()).isEqualTo(AlarmType.COMMENT.name());
    assertThat(result.get(0).getSendUserId()).isEqualTo(commentWriter.getId());
}
```

우리가 의도한 대로 `commentService.create(list.getId(), "첫 댓글!", commentWriter.getId());` 실행 이후에, 해당 트랜잭션을 커밋하기 위해<br>
다음 라인에 `TestTransaction.flagForCommit();`과 `TestTransaction.end();`을 호출해주었다.<br>
각 코드를 호출하면, 현재 진행 중인 테스트 트랜잭션 컨텍스트가 종료되면 Commit하도록 설정을 변경하고, 강제로 종료시킨다.<br>
결과적으로 `CommentService#create` 메서드는 커밋이 되고, 자연스레 `AlarmService#save()`도 호출되어 의도한 대로 테스트가 수행된다.

아래는 테스트 결과 로그인데, EntityManager의 Session ID를 보면 1954816877가 댓글을 저장한다.<br>
저장이 끝나고 Commit하고, 이어서 645470836가 Open된다. 동시에 1954816877은 트랜잭션 전파로 인해 Suspendinge된다.<br>
그리고 645470836가 알람을 저장하고, 645470836 - 1954816877 순으로 Closing된다.

```text
2024-09-26T18:43:55.139+09:00 DEBUG 54024 --- [           main] o.s.orm.jpa.JpaTransactionManager        : Found thread-bound EntityManager [SessionImpl(1954816877<open>)] for JPA transaction
2024-09-26T18:43:55.140+09:00 DEBUG 54024 --- [           main] o.s.orm.jpa.JpaTransactionManager        : Participating in existing transaction
2024-09-26T18:43:55.142+09:00 DEBUG 54024 --- [           main] org.hibernate.SQL                        : 
    insert 
    into
        comment
        (content, created_date, is_deleted, list_id, updated_date, user_id, id) 
    values
        (?, ?, ?, ?, ?, ?, default)
2024-09-26T18:43:55.142+09:00 TRACE 54024 --- [           main] org.hibernate.orm.jdbc.bind              : binding parameter (1:VARCHAR) <- [첫 댓글!]
2024-09-26T18:43:55.142+09:00 TRACE 54024 --- [           main] org.hibernate.orm.jdbc.bind              : binding parameter (2:TIMESTAMP) <- [2024-09-26T18:43:55.140749]
2024-09-26T18:43:55.142+09:00 TRACE 54024 --- [           main] org.hibernate.orm.jdbc.bind              : binding parameter (3:VARCHAR) <- [false]
2024-09-26T18:43:55.142+09:00 TRACE 54024 --- [           main] org.hibernate.orm.jdbc.bind              : binding parameter (4:BIGINT) <- [1]
2024-09-26T18:43:55.142+09:00 TRACE 54024 --- [           main] org.hibernate.orm.jdbc.bind              : binding parameter (5:TIMESTAMP) <- [2024-09-26T18:43:55.140749]
2024-09-26T18:43:55.142+09:00 TRACE 54024 --- [           main] org.hibernate.orm.jdbc.bind              : binding parameter (6:BIGINT) <- [2]
2024-09-26T18:43:55.145+09:00 DEBUG 54024 --- [           main] o.s.orm.jpa.JpaTransactionManager        : Initiating transaction commit
2024-09-26T18:43:55.146+09:00 DEBUG 54024 --- [           main] o.s.orm.jpa.JpaTransactionManager        : Committing JPA transaction on EntityManager [SessionImpl(1954816877<open>)]
2024-09-26T18:43:55.155+09:00 DEBUG 54024 --- [           main] o.s.orm.jpa.JpaTransactionManager        : Found thread-bound EntityManager [SessionImpl(1954816877<open>)] for JPA transaction
2024-09-26T18:43:55.155+09:00 DEBUG 54024 --- [           main] o.s.orm.jpa.JpaTransactionManager        : Suspending current transaction, creating new transaction with name [com.listywave.alarm.application.service.AlarmService.save]
2024-09-26T18:43:55.155+09:00 DEBUG 54024 --- [           main] o.s.orm.jpa.JpaTransactionManager        : Opened new EntityManager [SessionImpl(645470836<open>)] for JPA transaction
2024-09-26T18:43:55.155+09:00 DEBUG 54024 --- [           main] o.s.orm.jpa.JpaTransactionManager        : Exposing JPA transaction as JDBC [org.springframework.orm.jpa.vendor.HibernateJpaDialect$HibernateConnectionHandle@7ce660fc]
2024-09-26T18:43:55.156+09:00 DEBUG 54024 --- [           main] o.s.orm.jpa.JpaTransactionManager        : Found thread-bound EntityManager [SessionImpl(645470836<open>)] for JPA transaction
2024-09-26T18:43:55.156+09:00 DEBUG 54024 --- [           main] o.s.orm.jpa.JpaTransactionManager        : Participating in existing transaction
2024-09-26T18:43:55.158+09:00 DEBUG 54024 --- [           main] org.hibernate.SQL                        : 
    insert 
    into
        alarm
        (comment_id, created_date, is_checked, list_id, receive_user_id, type, send_user_id, id) 
    values
        (?, ?, ?, ?, ?, ?, ?, default)
2024-09-26T18:43:55.158+09:00 TRACE 54024 --- [           main] org.hibernate.orm.jdbc.bind              : binding parameter (1:BIGINT) <- [1]
2024-09-26T18:43:55.158+09:00 TRACE 54024 --- [           main] org.hibernate.orm.jdbc.bind              : binding parameter (2:TIMESTAMP) <- [2024-09-26T18:43:55.156967]
2024-09-26T18:43:55.158+09:00 TRACE 54024 --- [           main] org.hibernate.orm.jdbc.bind              : binding parameter (3:VARCHAR) <- [false]
2024-09-26T18:43:55.158+09:00 TRACE 54024 --- [           main] org.hibernate.orm.jdbc.bind              : binding parameter (4:BIGINT) <- [1]
2024-09-26T18:43:55.158+09:00 TRACE 54024 --- [           main] org.hibernate.orm.jdbc.bind              : binding parameter (5:BIGINT) <- [1]
2024-09-26T18:43:55.158+09:00 TRACE 54024 --- [           main] org.hibernate.orm.jdbc.bind              : binding parameter (6:VARCHAR) <- [COMMENT]
2024-09-26T18:43:55.159+09:00 TRACE 54024 --- [           main] org.hibernate.orm.jdbc.bind              : binding parameter (7:BIGINT) <- [2]
2024-09-26T18:43:55.160+09:00 DEBUG 54024 --- [           main] o.s.orm.jpa.JpaTransactionManager        : Initiating transaction commit
2024-09-26T18:43:55.160+09:00 DEBUG 54024 --- [           main] o.s.orm.jpa.JpaTransactionManager        : Committing JPA transaction on EntityManager [SessionImpl(645470836<open>)]
2024-09-26T18:43:55.161+09:00 DEBUG 54024 --- [           main] o.s.orm.jpa.JpaTransactionManager        : Closing JPA EntityManager [SessionImpl(645470836<open>)] after transaction
2024-09-26T18:43:55.161+09:00 DEBUG 54024 --- [           main] o.s.orm.jpa.JpaTransactionManager        : Resuming suspended transaction after completion of inner transaction
2024-09-26T18:43:55.161+09:00 DEBUG 54024 --- [           main] o.s.orm.jpa.JpaTransactionManager        : Closing JPA EntityManager [SessionImpl(1954816877<open>)] after transaction
2024-09-26T18:43:55.212+09:00 DEBUG 54024 --- [           main] tor$SharedEntityManagerInvocationHandler : Creating new EntityManager for shared EntityManager invocation
```

## 결과

결과적으로, 테스트 중간에 강제로 커밋을 수행하여 성공적으로 `@TransactionalEventListener`에 해당하는 메서드를 테스트할 수 있게 되었다.<br>