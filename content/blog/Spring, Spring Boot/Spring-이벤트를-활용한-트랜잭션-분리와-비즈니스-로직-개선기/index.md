---
title: "Spring 이벤트를 활용한 트랜잭션 분리와 비즈니스 로직 개선기 (사용자가 섭취를 한다. 특정 상황에 부합하는 경우 포인트를 지급한다. 지급하게 된 경우 클라이언트에 응답을 보내 결과를 보여줘야 한다. 이때 백엔드의 로직은?)"
date: 2025-08-28
tags: ["Spring", "Spring Event"]
draft: true
---

> TODO: 2025.08.28 임시로 작성해두었습니다. 모든 흐름을 다시 정리하며 각 내용들에 대해 Deep Dive 합시다.

🎯 개선 배경

기존 복용 기록 저장 로직에서 다음과 같은 문제점들이 있었습니다:

// 기존 코드 - 강한 결합과 트랜잭션 경계 문제
@Service
public class IntakeRecordService {

      private final CaringService caringService; // 직접 의존

      public Long save(Long userId, Long myProductId, LocalDateTime intakeDateTime) {
          // 복용 기록 저장
          IntakeRecord record = new IntakeRecord(user, myProduct, intakeDateTime);
          intakeRecordRepository.save(record);

          // 케어링 포인트 처리 (같은 트랜잭션)
          caringService.recordIntake(user, myProduct, intakeDateTime);

          return record.getId();
      }
}

문제점들:
- 🔗 강한 결합: IntakeRecordService가 CaringService에 직접 의존
- 🔄 트랜잭션 경계: 케어링 처리 실패 시 복용 기록도 롤백
- ⏰ 응답 지연: 케어링 포인트 처리 완료까지 사용자 대기
- 📱 정보 부족: 포인트 지급 결과를 클라이언트에게 알릴 수 없음

🚀 해결 방안: Spring 이벤트 기반 아키텍처

1단계: 기본 이벤트 분리

먼저 Spring ApplicationEvent를 활용하여 서비스 간 직접 의존성을 제거했습니다.

// 이벤트 정의
public class IntakeRecordSavedEvent extends ApplicationEvent {
private final Long userId;
private final Long myProductId;
private final LocalDateTime intakeDateTime;

      // constructor, getters...
}

// 이벤트 발행
@Service
public class IntakeRecordService {
private final ApplicationEventPublisher applicationEventPublisher;

      public Long save(Long userId, Long myProductId, LocalDateTime intakeDateTime) {
          // 복용 기록 저장
          IntakeRecord record = new IntakeRecord(user, myProduct, intakeDateTime);
          intakeRecordRepository.save(record);

          // 이벤트 발행으로 대체
          IntakeRecordSavedEvent event = new IntakeRecordSavedEvent(this, userId, myProductId, intakeDateTime);
          applicationEventPublisher.publishEvent(event);

          return record.getId();
      }
}

// 이벤트 수신
@Service
public class CaringService {
@EventListener
public void recordIntake(IntakeRecordSavedEvent event) {
User user = userRepository.getById(event.getUserId());
MyProduct myProduct = myProductRepository.getById(event.getMyProductId());
// 케어링 처리 로직...
}
}

2단계: 트랜잭션 완전 분리

하지만 위 방식은 여전히 같은 트랜잭션에서 실행됩니다. @TransactionalEventListener를 사용하여 트랜잭션을 완전히 분리했습니다.

@Service
public class CaringService {

      @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
      @Transactional  // 새로운 트랜잭션 시작
      public void recordIntake(IntakeRecordSavedEvent event) {
          // 복용 기록 저장 트랜잭션이 성공적으로 커밋된 후에만 실행
          // 케어링 처리 실패가 복용 기록에 영향을 주지 않음
      }
}

트랜잭션 실행 순서:
1. IntakeRecordService.save() 트랜잭션 시작 (트랜잭션 A)
2. 복용 기록 저장 + 이벤트 발행
3. 트랜잭션 A 커밋 완료 ✅
4. CaringService.recordIntake() 실행 (트랜잭션 B)
5. 케어링 처리 (실패해도 복용 기록은 안전) ✅

3단계: 이벤트 발행 위치 최적화

처음에는 CaringService에서 포인트 지급 결과를 확인 후 이벤트를 발행했지만, 더 자연스러운 위치로 이동했습니다.

// Before: CaringService에서 발행
@Service
public class CaringService {
public void recordIntake(IntakeRecordSavedEvent event) {
// 케어링 처리...
Optional<BigDecimal> points = caringPointService.judgeAndIssuePoint(user);

          // 결과 확인 후 이벤트 발행
          if (points.isPresent()) {
              applicationEventPublisher.publishEvent(new CaringPointIssuedEvent(...));
          }
      }
}

// After: CaringPointService에서 실제 지급 시점에 발행
@Service
public class CaringPointService {
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
}

4단계: 동기 결과 수신 메커니즘

포인트 지급 결과를 클라이언트에게 즉시 알려주기 위해 CompletableFuture를 활용한 동기 처리 방식을 구현했습니다.

@Service
public class IntakeRecordService {
private final ConcurrentHashMap<Long, CompletableFuture<CaringPointIssuedEvent>> pendingPointEvents = new
ConcurrentHashMap<>();

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
              return IntakeRecordSaveResponse.withPoint(
                  record.getId(),
                  pointEvent.getIssuedPoints(),
                  pointEvent.getMaxConsecutiveCaringDays(),
                  pointEvent.getNextBigPointDay(),
                  pointEvent.getNextBigPointValue()
              );
          } catch (Exception e) {
              // 타임아웃 또는 포인트 미지급
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
}

5단계: 풍부한 응답 DTO 설계

클라이언트가 필요한 모든 정보를 한 번에 받을 수 있도록 응답 DTO를 설계했습니다.

@Builder
public record IntakeRecordSaveResponse(
Long intakeRecordId,                    // 복용 기록 ID
boolean didIssued,                      // 포인트 발급 여부  
int issuedPoint,                        // 포인트 지급액
int maxConsecutiveCaringDays,           // 연속 달성 일수
int nextBigPointDay,                    // 다음 큰 포인트 받을 일수 (5, 10, 15...)
int nextBigPointValue                   // 다음 큰 포인트 값
) {
// 정적 팩토리 메서드들...
}

📊 최종 아키텍처

sequenceDiagram
participant Client
participant IntakeRecordService
participant CaringService
participant CaringPointService

      Client->>IntakeRecordService: save() 호출
      IntakeRecordService->>IntakeRecordService: 복용 기록 저장 (Tx A)
      IntakeRecordService->>IntakeRecordService: 이벤트 발행 + Future 대기
      Note over IntakeRecordService: 트랜잭션 A 커밋

      IntakeRecordService-->>CaringService: IntakeRecordSavedEvent
      CaringService->>CaringService: 케어링 처리 (Tx B)
      CaringService->>CaringPointService: judgeAndIssuePoint()
      CaringPointService->>CaringPointService: 포인트 지급
      CaringPointService-->>IntakeRecordService: CaringPointIssuedEvent

      IntakeRecordService->>IntakeRecordService: Future 완료
      IntakeRecordService->>Client: 풍부한 응답 반환

🎉 개선 결과

✅ 달성한 목표들

1. 트랜잭션 독립성 보장
   - 케어링 처리 실패가 복용 기록 저장에 영향 없음
   - 각각의 비즈니스 로직이 독립적으로 동작
2. 느슨한 결합 달성
   - IntakeRecordService가 CaringService에 직접 의존하지 않음
   - 이벤트 기반으로 확장 가능한 구조
3. 사용자 경험 개선
   - 포인트 지급 결과를 즉시 확인 가능
   - 연속 달성 현황과 다음 목표 정보 제공
4. 성능 최적화
   - 포인트 지급 시 즉시 응답 (최대 대기시간 단축)
   - 트랜잭션 분리로 데이터베이스 락 시간 감소

📈 성능 비교

| 항목     | Before      | After       |
  |--------|-------------|-------------|
| 트랜잭션 수 | 1개 (결합됨)    | 2개 (독립적)    |
| 응답 시간  | 케어링 처리 완료까지 | 포인트 지급 시 즉시 |
| 장애 영향도 | 전체 실패       | 부분 격리       |
| 확장성    | 강한 결합       | 이벤트 기반 확장   |

🔮 향후 확장 가능성

이벤트 기반 아키텍처로 인해 다음과 같은 확장이 쉬워졌습니다:

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

💡 핵심 배운 점들

1. 이벤트 발행 위치의 중요성: 비즈니스 로직의 자연스러운 흐름을 따라 이벤트를 발행해야 함
2. 트랜잭션 경계 설계: @TransactionalEventListener를 활용한 트랜잭ション 분리의 강력함
3. 동기-비동기 하이브리드: CompletableFuture를 활용해 이벤트의 비동기적 특성과 동기적 응답 요구사항을 모두 만족
4. 확장 가능한 아키텍처: 이벤트 기반 설계로 새로운 요구사항에 대한 확장성 확보

이번 개선을 통해 단순한 서비스 분리를 넘어서 확장 가능하고 견고한 이벤트 기반 아키텍처를 구축할 수 있었습니다. Spring의
이벤트 메커니즘을 적극 활용하여 비즈니스 요구사항과 기술적 요구사항을 모두 만족하는 솔루션을 만들어낸 경험이었습니다.
