---
title: "Spring Event를 활용한 케어링 포인트 시스템 리팩토링 대화 기록"
description: "임시"
date: 2025-09-13
tags: ["Spring", "Spring Event"]
draft: true
---

## 개요
- **날짜**: 2025-08-28
- **주제**: 케어링 포인트 체크 및 지급 부분을 SpringApplicationEvent로 분리
- **목표**: 트랜잭션 분리, 느슨한 결합, 포인트 지급 결과 클라이언트 알림

## 1. 시작점과 문제 인식

### 사용자 질문
> 케어링 포인트 체크 및 지급 부분도 SpringApplicationEvent로 분리할까?

### 현재 상황 분석
```java
// IntakeRecordService.java - 43번째 줄
caringService.recordIntake(user, myProduct, intakeDateTime);
```

**문제점들:**
- `IntakeRecordService`가 `CaringService`에 직접 의존
- 동일한 트랜잭션 내에서 실행되어 장애 시 전체 롤백
- 강한 결합으로 인한 확장성 부족

## 2. 첫 번째 리팩토링 시도

### 기본 이벤트 구조 구현

1. **이벤트 클래스 생성**
```java
// IntakeRecordSavedEvent.java
public class IntakeRecordSavedEvent extends ApplicationEvent {
    private final Long userId;
    private final Long myProductId; 
    private final LocalDateTime intakeDateTime;
    
    // constructor, getters...
}
```

2. **IntakeRecordService 수정**
```java
// CaringService 의존성 제거
private final ApplicationEventPublisher applicationEventPublisher;

public Long save(Long userId, Long myProductId, LocalDateTime intakeDateTime) {
    // 복용 기록 저장
    IntakeRecord intakeRecord = new IntakeRecord(user, myProduct, intakeDateTime);
    intakeRecordRepository.save(intakeRecord);

    // 복용 기록 저장 이벤트 발행
    IntakeRecordSavedEvent event = new IntakeRecordSavedEvent(this, userId, myProductId, intakeDateTime);
    applicationEventPublisher.publishEvent(event);

    return intakeRecord.getId();
}
```

3. **CaringIntakeEventListener 생성 (초기 버전)**
```java
@Component
public class CaringIntakeEventListener {
    private final CaringService caringService;
    
    @EventListener
    @Transactional  
    public void handleIntakeRecordSaved(IntakeRecordSavedEvent event) {
        User user = userRepository.getById(event.getUserId());
        MyProduct myProduct = myProductRepository.getById(event.getMyProductId());
        
        caringService.recordIntake(user, myProduct, event.getIntakeDateTime());
    }
}
```

## 3. 구조 개선 - 불필요한 래퍼 클래스 제거

### 사용자 지적
> 따로 CaringIntakeEventListener 로 뺀 이유가 있을까? CaringService 의 `recordIntake`를 리스너로 해도 되지 않을까?

### 개선 방향
- 불필요한 래퍼 클래스 `CaringIntakeEventListener` 제거
- `CaringService.recordIntake()` 메서드를 직접 이벤트 리스너로 변경

### 구현
```java
// CaringService.java
@EventListener
@Transactional
public void recordIntake(IntakeRecordSavedEvent event) {
    User user = userRepository.getById(event.getUserId());
    MyProduct intakedMyProduct = myProductRepository.getById(event.getMyProductId());
    
    // 케어링 처리 로직...
}
```

**장점:**
- 코드 간소화 (클래스 1개, 의존성 주입 3개 제거)
- 직관적인 구조
- 중복 엔티티 조회 제거

## 4. 트랜잭션 분리 고민

### 사용자 질문
> `recordIntake` 메서드를 IntakeRecordService의 `save(Long, Long, LocalDateTime)` 메서드와 별도의 트랜잭션으로 분리하고 싶어.

### 트랜잭션 분리 방법 논의

**옵션 1: @TransactionalEventListener 사용 (권장)**
```java
@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
@Transactional
public void recordIntake(IntakeRecordSavedEvent event) {
    // 복용 기록 저장 트랜잭션 커밋 후 실행
}
```

**옵션 2: @Async + @EventListener**
```java
@Async
@EventListener 
public void recordIntake(IntakeRecordSavedEvent event) {
    // 비동기 처리
}
```

### 트랜잭션 실행 순서 확인
1. `IntakeRecordService.save()` 트랜잭션 시작
2. 복용 기록 저장 + 이벤트 발행
3. **트랜잭션 커밋 완료** ✅
4. `CaringService.recordIntake()` 실행 (별도 트랜잭션)
5. 케어링 실패해도 복용 기록은 안전 ✅

## 5. 동기/비동기 처리 딜레마

### 사용자 요구사항 추가
> 만약 `CaringService.recordIntake()`이 실행되고 `CaringPointService.judgeAndIssuePoint(User)` 메서드의 실행 결과로 User에게 Point가 지급되었다고 가정했을 때, 이 발급 사실을 클라이언트에게 알려야 하거든.

### 해결 방안 검토

**문제점:**
- 트랜잭션 분리 필요
- 포인트 지급 결과를 클라이언트에게 알림 필요
- 성능과 사용자 경험 고려

**해결 방안 3가지:**

1. **동기 처리 + 응답 DTO 확장** (선택됨)
2. **비동기 + WebSocket/SSE 알림**  
3. **비동기 + 폴링 API**

## 6. 최종 구현 - 하이브리드 접근법

### 포인트 지급 이벤트 설계
```java
public class CaringPointIssuedEvent extends ApplicationEvent {
    private final Long userId;
    private final Integer issuedPoints;
    private final Integer maxConsecutiveCaringDays;
    private final Integer nextBigPointDay;
    private final Integer nextBigPointValue;
    
    // constructor, getters...
}
```

### 이벤트 발행 위치 최적화

**사용자 제안:**
> `CaringService.recordIntake()`에서 포인트 지급 여부를 판단해서 결과를 이벤트로 발행하는 것보다, `CaringPointService.issuePoint()`에서 `user.issueCaringPoint()`의 결과가 존재하면 바로 발행하는 게 로직 흐름을 따라가는 게 수월할 것 같아.

### 최적화된 구조
```java
// CaringPointService.java
private void issuePoint(User user) {
    Optional<BigDecimal> issuedPoint = user.issueCaringPoint();
    
    if (issuedPoint.isPresent()) {
        // 포인트 히스토리 저장
        PointHistory pointHistory = new PointHistory(user, null, "케어링", issuedPoint.get());
        pointHistoryRepository.save(pointHistory);
        
        // 실제 지급 시점에서 즉시 이벤트 발행 🎯
        CaringPointIssuedEvent event = new CaringPointIssuedEvent(/*...*/);
        applicationEventPublisher.publishEvent(event);
    }
}
```

### CompletableFuture를 활용한 동기 결과 수신
```java
// IntakeRecordService.java
private final ConcurrentHashMap<Long, CompletableFuture<CaringPointIssuedEvent>> pendingPointEvents = new ConcurrentHashMap<>();

public IntakeRecordSaveResponse save(Long userId, Long myProductId, LocalDateTime intakeDateTime) {
    // 복용 기록 저장
    IntakeRecord record = new IntakeRecord(user, myProduct, intakeDateTime);
    intakeRecordRepository.save(record);
    
    // 포인트 결과 대기를 위한 Future 준비
    CompletableFuture<CaringPointIssuedEvent> pointEventFuture = new CompletableFuture<>();
    pendingPointEvents.put(userId, pointEventFuture);
    
    // 이벤트 발행
    IntakeRecordSavedEvent event = new IntakeRecordSavedEvent(this, userId, myProductId, intakeDateTime);
    applicationEventPublisher.publishEvent(event);
    
    try {
        // 최대 5초 대기 (포인트 지급 시 즉시 완료)
        CaringPointIssuedEvent pointEvent = pointEventFuture.get(5, TimeUnit.SECONDS);
        return IntakeRecordSaveResponse.withPoint(/*...*/);
    } catch (Exception e) {
        return IntakeRecordSaveResponse.withoutPoint(record.getId());
    } finally {
        pendingPointEvents.remove(userId);
    }
}

@EventListener
public void handleCaringPointIssued(CaringPointIssuedEvent event) {
    CompletableFuture<CaringPointIssuedEvent> future = pendingPointEvents.get(event.getUserId());
    if (future != null) {
        future.complete(event); // 즉시 완료!
    }
}
```

### 동기 처리 확인

**사용자 질문:**
> 그럼 최대 5초 대기하다가 이벤트를 수신하면 곧바로 결과를 return 하는거야?

**답변:** 
네, `CompletableFuture.get(5, TimeUnit.SECONDS)`는 최대 5초 대기하지만, 이벤트를 수신하는 즉시 `future.complete(event)`가 호출되어 즉시 결과를 반환합니다.

## 7. 최종 결과물

### 응답 DTO
```java
@Builder
public record IntakeRecordSaveResponse(
    Long intakeRecordId,                    // 복용 기록 ID
    boolean didIssued,                      // 포인트 발급 여부  
    int issuedPoint,                        // 포인트 지급액
    int maxConsecutiveCaringDays,           // 연속 달성 일수
    int nextBigPointDay,                    // 다음 큰 포인트 받을 일수
    int nextBigPointValue                   // 다음 큰 포인트 값
) {
    // 정적 팩토리 메서드들...
}
```

### 실행 흐름
1. `IntakeRecordService.save()` 호출
2. 복용 기록 저장 + 이벤트 발행 + CompletableFuture 대기 시작
3. 트랜잭션 A 커밋
4. `CaringService.recordIntake()` 실행 (트랜잭션 B)
5. `CaringPointService.judgeAndIssuePoint()` 호출
6. 포인트 지급 시 `CaringPointIssuedEvent` 발행
7. `IntakeRecordService`에서 이벤트 수신 → CompletableFuture 완료
8. 포인트 정보 포함한 응답 반환

## 8. 개선 결과

### 달성한 목표들
- ✅ **트랜잭션 독립성 보장**: 케어링 실패가 복용 기록에 영향 없음
- ✅ **느슨한 결합**: 이벤트 기반으로 서비스 간 의존성 제거
- ✅ **포인트 지급 결과 알림**: 클라이언트가 즉시 결과 확인 가능
- ✅ **성능 최적화**: 포인트 지급 시 즉시 응답, 타임아웃 처리

### 핵심 배운 점들
1. **이벤트 발행 위치의 중요성**: 비즈니스 로직의 자연스러운 흐름을 따라야 함
2. **트랜잭션 경계 설계**: `@TransactionalEventListener` 활용의 강력함  
3. **동기-비동기 하이브리드**: `CompletableFuture`로 두 요구사항을 모두 만족
4. **확장 가능한 아키텍처**: 이벤트 기반으로 새로운 요구사항 대응 용이

## 9. 향후 확장 가능성

```java
// 새로운 기능 추가 시 기존 코드 수정 없이 이벤트 리스너만 추가
@Component
public class NotificationService {
    @EventListener
    public void sendPointNotification(CaringPointIssuedEvent event) {
        // 포인트 지급 알림 전송
    }
}

@Component  
public class AnalyticsService {
    @EventListener
    public void trackIntakeRecord(IntakeRecordSavedEvent event) {
        // 복용 기록 분석 데이터 수집
    }
}
```

---

이 대화를 통해 단순한 서비스 분리를 넘어서 확장 가능하고 견고한 이벤트 기반 아키텍처를 구축하는 전 과정을 다뤘습니다. Spring의 이벤트 메커니즘을 적극 활용하여 비즈니스 요구사항과 기술적 요구사항을 모두 만족하는 솔루션을 만들어냈습니다.
