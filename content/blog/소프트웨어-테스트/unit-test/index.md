---
title: "단위 테스트 이해하기"
description: "단위 테스트, JUnit, AssertJ"
date: 2023-11-27
tags: ["unit-test", "test"]
---

## 단위 테스트란?

애플리케이션에서 동작하는 **기능 또는 메서드를 실행**시키는 **독립적인 단위의 테스트**이다.

이때 기능이라는 말이 포함되어있다. 즉, 단위 테스트라고 해서 무조건 메서드만 테스트하는 건 아니다.

## 왜 단위 테스트를 하나?

잘 작성한 단위 테스트는 **개발자가 작성한 단위(기능 또는 메서드)를 매우 빠르게 검증**할 수 있다.

### 단위 테스트를 하지 않았을 때의 문제점

1. 테스트 코드를 프로덕션 코드에 작성해야한다.<br>
   이는 배포하는 jar 파일의 크기에 영향을 줄 것이고 배포 시간에도 영향을 줄 것이다.

2. 기능을 개발할 때마다 직접 실행시켜 동작을 확인해야한다.<br>
   이는 작성한 기능에 대해 검증받는 시간의 주기가 길어질 것이다.<br>
   즉, 버그를 낳을 확률이 증가한다.

이 외에도 문제점이 다양하게 있겠지만, 이만하면 단위 테스트를 할 가치가 충분히 있어보인다.

## JUnit

이렇게 좋은 단위테스트를 어떻게 할까?<br>
바로 [JUnit](https://junit.org/junit5/) 프레임워크를 사용한다.

> 우테코 5기 최고 미남 [제리의 프레임워크 vs 라이브러리 vs API 테코톡](https://youtu.be/yKEwNVbAFC0?feature=shared)을 보면 프레임워크에 대해 알 수 있다.

JUnit 홈페이지에 있는 소개글에 의하면 "JVM 기반이며 Java 8 이상에 초점을 맞춰 다양한 스타일의 테스트를 지원한다"고 한다.

자세한 사용법은 [User Guide](https://junit.org/junit5/docs/current/user-guide/)를 참고하자.

## 특징
### 1. 메서드 실행 순서

[공식 문서](https://junit.org/junit5/docs/current/user-guide/#writing-tests-test-execution-order)에 의하면 테스트 실행 순서를 이렇게 설명한다.

"_기본적으로, 테스트 클래스와 메서드는 결정론적이지만 의도적으로 명확하지 않은 순서로 정렬이 된다._"

무슨 소리일까? 🤔

결정론적 알고리즘에 대해 검색해보니 아래와 같이 설명한다.

"_예측한 그대로 동작하는 알고리즘이다. **어떤 특정한 입력이 들어오면 언제나 똑같은 과정을 거쳐서 언제나 똑같은 결과를 내놓는다**."_

즉, 순서에 대한 보장은 할 수 없지만 입력과 출력은 매번 동일한 것이 보장된다. 라고 이해하면 될 것 같다.

> 왜 이렇게 구현했을까 고민했을 땐, 테스트 순서로부터 독립성을 보장하기 위함이지 않을까한다.<br>
> 좋은 단위 테스트는 독립적이어야한다. 테스트 순서에도 영향을 받아서는 안된다.

```java
class TestOrderTest {

    private static final AtomicInteger number = new AtomicInteger(1);

    @Test
    void C() {
        System.out.println("Test C - " + number.getAndIncrement());
    }

    @Test
    void B() {
        System.out.println("Test B - " + number.getAndIncrement());
    }

    @Test
    void A() {
        System.out.println("Test A - " + number.getAndIncrement());
    }

    @Test
    void E() {
        System.out.println("Test E - " + number.getAndIncrement());
    }

    @Test
    void D() {
        System.out.println("Test D - " + number.getAndIncrement());
    }
}
```

실제 위 예제 코드로 순서를 바꿔도 보고 그룹 단위로 변경해가며 실행하면 위에서 설명하는 특징을 실제로 보이는 것을 확인할 수 있다.

> 만약 클래스에 작성한 테스트 코드의 순서대로 동작하고 싶다면 `@TestInstance(value = TestInstance.Lifecycle.PER_CLASS)`를 추가하자<br>
> 혹은 `@TestMethodOrder(OrderAnnotation.class)`를 클래스 레벨에 추가하고, 각 메서드에 `@Order(int value)`로 조절하자

> 클래스 간의 테스팅 순서도 조절할 수 있다고 한다. 이는 필요할 때 알아보자.

### 2. AssertJ 활용

[AssertJ](http://joel-costigliola.github.io/assertj/assertj-core-quick-start.html)는 "_능수능란한 검증문 자바 라이브러리_" 라고 설명한다.

단순히 말해서 유용한 Assertion문을 선언할 수 있도록 도와주는 라이브러리라고 생각하자.

AssertJ는 메서드 체이닝 가능한 assert문을 지원하는 라이브러리이다.<br>
이를 이용해서 더욱 가독성 좋은 단위 테스트를 작성할 수 있다.<br>
아래 코드로 비교해보자.

```java
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.assertj.core.api.Assertions.assertThat;

@Test
void assertJTest() {
    // junit 메서드 사용
    assertEquals(expected, actual);

    // assertJ 메서드 사용
    assertThat(actual).isEqualTo(expected);
}
```

> 자세한 사용법은 [Java Doc](http://javadoc.io/doc/org.assertj/assertj-core) 참고

추가적인 장점으로는 실패 메시지가 자세하다는 점과 다양한 검증 메서드를 지원한다고 한다.<br>
심지어 [JUnit 공식 사이트](https://junit.org/junit5/docs/current/user-guide/#writing-tests-assertions-third-party)에서도 써드파티 Assertion 라이브러리로 AssertJ를 권장한다.

## Junit vs AssertJ

Junit은 프레임워크고 AssertJ는 라이브러리이다.

AssertJ를 이용해 단위 테스트 코드를 작성하고, JUnit에게 `@Test`와 같은 어노테이션으로 메서드를 위임하여 실행시킨다. 