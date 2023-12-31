---
title: "[JSCODE] - OS 면접 스터디 1주차"
description: "[JSCODE] - OS 면접 스터디 1주차"
date: 2023-11-09
update: 2023-12-01
tags: ["operating-system", "interview"]
series: "운영체제 면접 스터디"
---

## 📝 질문 리스트

### 운영체제는 무엇이고 어떤 역할을 수행하는가?

운영체제는 컴퓨팅 시스템을 운영하는 시스템이다.

약간 말장난 같지만, 실제로 운영체제는 사용자와 하드웨어 사이에서 자원을 어떻게 사용할 지를 결정한다.

대표적인 역할로는 프로세스 스케줄링, 프로세스 동기화 방식 등이 있다.

### 시분할 시스템

하나의 프로세서가 2개 이상의 프로세스의 작업을 처리해야할 때, 각각의 프로세스의 작업을 얼마만큼의 시간동안 처리를 할 것인지에 대한 정책이다.

시분할 시스템을 구현하기 위한 다양한 알고리즘이 있지만, 현재 가장 널리 사용되는 알고리즘은 Round-Robin 알고리즘이다.

Round Robin 알고리즘은, 각 프로세스의 CPU 할당 시간을 동일하게 설정하고, 할당 시간이 끝이 나면 인터럽트를 발생시켜 다음 프로세스의 작업을 수행하도록 하는 과정의 알고리즘이다.

보통 할당 시간은 매우 짧은 시간에 속하지만, CPU는 이 시간안에 매우 빠른 속도로 작업을 처리하기 때문에 사용자는 2개 이상의 프로세스가 동시에 실행되는 것처럼 보인다.

### 다중 프로그래밍 시스템(multi-programming system)

2개 이상의 프로그램이, 하나의 메모리에 동시에 적재되는 시스템을 말한다.

이때, 프로그램이 메모리에 적재될 때, 프로그램 전체를 올리진 않는다. 

용량이 작은 메모리에 2개 이상의 프로그램 전체를 적재할 수 없기 때문이다. 

따라서 당장 필요한 부분만 메모리에 적재한다.

### 대화형 시스템(interactive system)

사용자가 컴퓨터와 1:1로 대화한다는 느낌의 시스템이다.

다른 말로, 사용자가 입력한 결과가 컴퓨터에 즉시 출력된다는 것이다.

실제로는 여러 사용자가 한 대의 컴퓨터를 이용함에도, 1:1처럼 인식한다는 것이다.

이는 다중 프로그래밍 시스템과 시분할 시스템의 적용으로 가능하다.

### 다중 처리기 시스템(multi-processor system)

프로세서가 2개 이상인 시스템이다.

당연하게도 모든 프로세서가 자원을 함께 사용한다.

대칭적 다중 처리 시스템: 단일 운영체제 아래에서 2개 이상의 CPU가 동작하는 시스템이다.

각 CPU끼리는 데이터를 효율적으로 공유하는 구조로 운영된다.

비대칭적 다중 처리 시스템: 1개의 메인 CPU가 시스템을 제어하며, 나머지 CPU들은 미리 정의된 작업을 수행한다.

### 시스템 콜

프로세스가 OS 커널이 제공하는 서비스를 이용하고 싶을 때, 시스템 콜을 이용해 실행한다.

#### 종류
- 프로세스/스레드 관련
- 파일 IO 관련
- 소켓 관련
- Device 관련 (키보드 등)
- 프로세스 통신 관련

시스템 콜이 발생하면, 커널은 CPU에게 Interrupt를 발생하고, CPU는 다음 명령을 실행할 때 체크하고, 해당 커널 코드를 실행

### 커널

OS의 core라고 할 수 있다.

항상 메모리에 적재되어있다.

HW와 프로세스 사이의 인터페이스로서, 프로세스가 요청하는 시스템 콜에 대해 직접 수행한다.

왜 인터페이스?

프로세스는 개발된 프로그래밍 언어가 모두 다르고, 시스템 콜을 호출하는 방식이 모두 다르기 때문에 중간에 추상 계층이 필요하기 때문

운영체제와 커널의 차이?

커널은 운영 체제에 포함되는 하나의 모듈의 개념이다.

운영체제는 커널을 포함해, 컴퓨터 시스템을 총괄하는 개념으로 이해하고 있다.

### 유저모드와 커널모드

- 유저모드: 프로세서가 응용 프로그램을 실행하는 모드
- 커널모드: 프로세서가 커널 코드를 실행하는 모드

유저 모드에서 커널 모드로 전환될 때 인터럽트나 시스템 콜이 발생한다.

CPU의 mode bit 레지스터로 구분한다.

0이면 커널 모드, 1이면 유저 모드

커널모드가 필요한 이유는 누군가 만든 프로그램이 하드웨어를 직접 통제하게 되고, 점유하는 등과 같은 문제로 다른 프로세스에 영향을 미칠 수 있기 때문이다.

즉, 시스템을 보호하기 위해서

### 폴링

CPU가 I/O Device의 작업 내용이나 결과를 직접 확인하는 방식이다.

이 방식은 CPU의 작업이 수행되어야 하기에 프로세스 관점에서는 불필요한 오버헤드이다.

이 비효율적인 방식을 개선하기 위해 인터럽트가 탄생했다.

### 인터럽트

시스템에서 발생한 다양한 종류의 이벤트

#### 종류

- 전원에 문제가 생겼을 때
- IO 작업이 완료됐을 때
- 시간이 다 됐을 때 (timer 관련)
- 프로그램에서 0으로 나눴을 때
- 프로그램에서 잘못된 메모리 공간에 접근을 시도할 때

- 인터럽트 벡터: 인터럽트의 처리 루틴 주소를 가짐
- 인터럽트 처리 루틴: 인터럽트를 처리하는 커널 함수

### DMA

CPU는 매우 빠른 속도로 메모리에만 접근한다. 동시에 SSD 같은 비교적 빠른 I/O Device가 존재한다.

이런 상황에서 Device들이 잦은 빈도로 인터럽트를 발생하면, CPU의 성능이 떨어진다.

이를 방지하고자, I/O Device에서 각 buffer storage의 내용을 메모리에 block 단위로 직접 전송하고, 인터럽트를 발생하는 개념이다.

이 DMA는 CPU와 I/O Device 사이에 위치하는 DMA Controller에 의해 수행된다.

### 동기식 I/O과 비동기식 I/O

프로세스에 의해 I/O 요청이 발생하면, 프로세서는 이 요청을 처리한다.
이때, 동기식 I/O의 경우는 해당 I/O 작업이 완료된 후에야 다음 작업을 처리한다.
비동기식 I/O의 경우는 I/O 작업을 요청보내고, 바로 다음 작업을 실행한다.

동기식 I/O의 경우, 프로세스의 다음 작업이 디스크에서 읽은 값을 이용한 처리라면 적용할 수 있다.
하지만, I/O 작업의 경우 시간이 오래 걸리는 작업이기에 CPU의 효율을 매우 떨어트리는 방식이다.
즉, CPU의 성능을 희생하는 대신 작업의 결과를 보장할 수 있다.

비동기식 I/O의 경우, 프로세스의 다음 작업이 I/O 작업과 관련이 없는 경우 적용할 수 있다.
하지만 비동기식 I/O 작업의 결과를 즉시에 알 수 없다. 확인하려면 또 다른 요청이 필요할 수 있다.
그래도 CPU가 쉬지 않고 일할 수 있으므로 CPU의 효율을 끌어올릴 수 있다.

위의 경우는 하나의 프로세스에서의 경우를 가정한 것이다.
하지만 보통은 다수의 프로세스를 동시에 처리한다.
이때, I/O 작업을 요청한 프로세스는, 해당 작업이 완료될 때까지 대기시켜놓고, 그 시간동안 CPU는 다른 프로세스의 작업을 처리한다. 즉, 동기식 I/O 처리를 하며 CPU 스케줄링을 통해 CPU 성능과 작업의 정합성을 모두 지킨다.

## 📚 추가 학습

### 인터럽트와 시스템 콜, 그리고 유저 모드와 커널 모드

```text
유저 모드: 우리가 개발하는 프로그램은 일반적으로 유저 모드에서 실행
커널 모드: 프로그램 실행 중, 인터럽트가 발생하거나 시스템 콜을 호출하게 되면 커널 모드로 전환
전환할 때, 현재 실행 중이던 프로그램의 현재 상태를 저장
그 후, 발생한 인터럽트 혹은 시스템 콜을 직접 처리. 즉, CPU에서 커널 코드가 실행된다.
모든 처리가 완료되면, 중단됐던 프로그램의 상태를 복원
다시 통제권을 프로그램에게 반환. 즉, 커널 모드에서 유저 모드로 전환
프로그램이 이어서 실행

커널: 운영체제의 핵심
시스템 전반을 관리/감독하는 역할
하드웨어와 관련된 작업을 직접 수행

커널 모드를 만든 이유: 누군가 만든 프로그램이 하드웨어를 직접 통제하게 되고, 점유하는 등과 같은 문제로 다른 프로세스에 영향을 미칠 수 있다.
즉, 시스템을 보호하기 위해

인터럽트: 시스템에서 발생하는 이벤트 혹은 그런 이벤트를 알리는 매커니즘
종류
 - 전원에 문제가 생겼을 때
 - IO 작업이 완료됐을 때
 - 시간이 다 됐을 때 (timer 관련)
 - 프로그램에서 0으로 나눴을 때
 - 프로그램에서 잘못된 메모리 공간에 접근을 시도할 때

인터럽트가 발생하면, CPU에서는 즉시 인터럽트 처리를 위해 커널 코드가 커널 모드에서 실행.
여기서 ‘즉시’라고 했지만, 실행중이던 프로세스의 처리까지는 마무리한 뒤에 처리를 한다.

시스템 콜: 프로그램이 커널이 제공하는 서비스를 이용하고 싶을 때, 시스템 콜을 이용해 실행한다.
종류
- 프로세스/스레드 관련
- 파일 IO 관련
- 소켓 관련
- Device 관련 (키보드 등)
- 프로세스 통신 관련
시스템 콜이 발생하면, 해당 시스템 콜에 대응하는 커널 코드가 커널 모드에서 실행된다.
```

### Physical Memory, Virtual Memory

```text
Virtual Memory: 각 프로세스만의 논리적인 주소이다.
Physical Memory: 실제 메모리에 적재된 주소이다.

Virtual Memory에서, Physical Memory를 가리키기 위해선 중간에 변환해주는 역할이 필요하다. 이는 ATU(Address Translation Unit)에 의해 수행된다.
```

### I/O Bound, CPU Bound

```text
쓰레드의 관점에서, 수행할 작업의 시간이 I/O 작업과 CPU에 의해 처리되는 시간의 비중이 얼마나 많은지에 대한 내용이다.
```

### 인터럽트가 발생하면, CPU에서 어떤 일이 발생할까?

## 🤔 개인적인 궁금증

### ### I/O 작업은 왜 느리다고 하는가?

```text
보통 I/O 작업이 느리다는 말은 CPU와 비교해서 표현하는 것 같다.
그럼 왜 CPU에 비해 100만 배 이상 느릴까?

1. I/O 작업 자체가 느리거나 오래 걸리는 작업일 수 있다.
2. I/O 작업은 버스를 통해 CPU와 통신한다.
이 과정에서 대기 시간이 발생할 수 있기 때문이다.
3. 보통 I/O 장치는 인터럽트를 발생시켜 처리가 필요함을 알린다.
CPU의 인터럽트 마스크가 된 상태에서, 다른 중요한 작업을 하고 있을 수 있어서 바로 처리하지 않을 수 있기 때문이다.
게다가 인터럽트 작업을 처리하기 위해 CPU는 컨텍스트 스위칭을 한다.
4. Device의 물리적 거리도 영향이 있을까?
```

### 컨텍스트 스위칭은 프로세스 간 교환에서만 일어나는가? 쓰레드 간 교환에서는 일어나지 않는가?

```text

둘 다 가능하다.
하지만 성능 상 차이가 발생한다.

우선 컨텍스트 스위칭이 무엇인가?
CPU/코어에서 실행중이던 프로세스/쓰레드가 다른 프로세스/쓰레드로 교체되는 것이다.

그럼 왜 성능 차이가 발생하는가?
쓰레드 컨텍스트 스위칭은 같은 프로세스 내에서의 컨텍스트 스위칭이다.
이때 프로세스의 가상 메모리 주소를 공유해서 사용한다.

하지만 프로세스 컨텍스트 스위칭은, 이 **가상 메모리 주소 관련 처리**에 대한 **오버헤드**가 발생한다.
이때 수행되는 처리로는 각 프로세스 PCB에 컨텍스트 저장, CPU 레지스터에 컨텍스트 교체 등이 있다.
이러한 오버헤드의 차이로 인해 성능 상 차이가 발생한다.

그렇다고 쓰레드 컨텍스트 스위칭이 오버헤드가 없다는 건 아니다.
상대적으로 더 적은 오버헤드이지, 아예 없는 건 아니다.
```

### Tomcat maxThreads 기본값은 왜 200이고, HikariCP Max-Connection의 기본값은 왜 10일까?

```text
Tomcat의 maxThreads 값은, 들어온 요청과 1:1로 Connect를 하고, 그 Connect를 처리하기 위해 생성하는 쓰레드의 최대 개수이다.
즉, 하나의 프로세스 내의 존재하는 쓰레드이고, 이는 쓰레드 컨텍스트 스위칭이 발생한다.

HikariCP는 JDBC Connection Pool이다.
JDBC Connection은 Java 기반 애플리케이션과 RDMBS와의 Connection이다.
즉, 프로세스 간의 소켓 통신이 일어나고, 이는 프로세스 컨텍스트 스위칭이 발생한다.

그래서 HikariCP의 Max-Connection Size를 설정할 때, Size가 클수록 처리해야 할 Thread가 많아지고, 이는 곧 컨텍스트 스위칭을 자주 유발하기 때문에 오히려 적은 수의 Thread로 처리하는 것이 오버헤드 비용을 줄여 더 나은 성능을 보이는 것 같다.

HikariCP Max-Connection의 기본값이 10인 이유는, 자체 벤치 마킹을 통해 결정했다.
https://github.com/brettwooldridge/HikariCP#checkered_flag-jmh-benchmarks

Tomcat maxThreads의 기본값이 10인 이유는? 모르겠다. 아마 Tomcat에서 자체적인 테스트를 통해 도출된 결과값이 아닐까?
```

### EC2의 Swap Memory란?**

```text
우리는 흔히 EC2에서 Linux 게열의 OS를 사용한다.
따라서 Linux에서의 Swap Memory는, 메인 메모리의 용량보다 더 많은 공간이 필요할 때 디스크의 일부 공간을 사용하는 개념이다.
메모리 관리 알고리즘(LRU, LFU)에 의해 잘 사용되지 않는 데이터를 디스크에 저장하는 방식이다.
하지만, 디스크를 사용하는만큼 속도는 느리다.

이때, 디스크에 할당되는 일부 공간을 Swap Memory, 혹은 Swap Space 라고 한다.
```

## 🎯 피드백

- 목소리, 말투 침착 또박. 듣는 입장에서 잘 들어옴 속도도 빨라지지 않고 일정했다.
- 눈을 마주치고 답변
- 꼬리 질문에도 맞든 안맞든 최대한 답변하는 모습
- 아는 개념에 대해선 핵심 단어를 강조
- 폴링에 대해 설명할 때, 짧게 대답했다. 이는 꼬리 질문을 유도해보인걸로 보여서 좋았다.
근데 너무 짧았던 것 같다. 근데 꼬리 질문에서 대답 못하면, 이거밖에 모르나보네. 할 수 있다.
- 아는건 많아 보인다. 근데, 정리가 되지 않고 내용이 길어진다.
장황하게 설명하기보다 개념에 대해 짚고, 부가 설명을 하는 게 좋아 보인다.
- 모르는 질문에 있어서는 시간을 가지고 답변 굿.
- 말이 길어지는 경향이 있다. 개념을 물어봤을 때, 이런 개념입니다. 하고 부연 설명.
- 질문에 대해 답변이 한번씩은 많이 짧았다.
한 마디만 더 했으면 면접관 입장에서 한번 더 물어볼 의향이 들었을텐데..