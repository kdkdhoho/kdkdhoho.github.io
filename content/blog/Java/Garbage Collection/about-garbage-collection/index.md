---
title: "JVM의 Garbage Collection과 동작 원리"
description: "드디어 정리한다. Garbage Collection"
date: 2023-12-08
tags: ["Java", "Garbage Collection"]
---

## Garbage Collection를 알아야 하는 이유

Garbage Collection(이하 GC)을 공부하다보니, GC를 너무 믿어서는 안되겠다고 생각됐다.<br>
[우형에서 발생한 일](https://techblog.woowahan.com/2628/)도 그렇고 [토스에서 발생한 일](https://www.youtube.com/watch?v=w4fWgLgop5U)을 보니 모두 애플리케이션의 메모리 관련 치명적 에러는 모두 이 *GC*와 관련이 있었기 때문이다.<br>
더군다나 [네이버 D2 글](https://d2.naver.com/helloworld/1329)에서도 **GC에 대해 잘 알고 있을수록 실력이 좋은 Java 개발자**라고 했다.

실력이 좋은 Java 개발자가 되기 위해 이 GC에 대해 알아보자.

## GC란?

Garbage Collection(이하 GC)은 **JVM 기반 애플리케이션에서 동적으로 할당되는 메모리 공간을 알아서 관리해주는 기술**이다.

> JVM의 메모리 구조는 [static을 더 잘 사용하기](https://kdkdhoho.github.io/static-with-memory-structure/) 글을 참고

프로세스는 필연적으로 새로운 데이터를 Heap 영역에 malloc(할당) 및 free(해제) 하게 된다.<br>
C나 C++의 경우 데이터가 저장된 메모리 공간을 직접 관리해야 한다.<br>
하지만 Java는 탄생 배경부터 개발자가 운영체제에 직접 의존하지 않아도 되도록 중간 계층인 **JVM을 통해 시스템 자원에 접근**하게 된다.<br>
따라서 JVM이 메모리 공간이 할당되었지만 더이상 사용되지 않아 필요없어진 메모리를 대신 처리해주는 역할을 수행하는 것이다.<br>
그 작업을 우리는 GC 라고 부르는 것이다.

## GC의 특징

GC로 인해 **개발자는 직접 메모리 공간을 관리할 필요가 없어진다**.<br>
즉, 개발자는 개발에만 집중할 수 있게 된다.<br>
또한 완벽하진 않지만 GC 덕분에 (완벽하진 않지만) Memory Leak 을 예방할 수 있다.

하지만, 그만큼 희생도 따르는 법.<br>
GC가 메모리 공간을 청소할 때 ❗️ **STOP THE WORLD** ❗현상이 발생한다.<br>
Stop the world는 **GC 쓰레드가 동작하는 순간에, 다른 쓰레드들은 동작하지 않는 현상**이다.<br>
> 참고) GC를 튜닝한다는 말은 주로 이 Stop the world 시간이 짧아지도록 한다는 말이다.<br>
> [Naver D2 - Garbage Collection 튜닝](https://d2.naver.com/helloworld/37111)

## GC의 기본 동작 원리

GC는 다양한 알고리즘이 존재한다.<br>
하지만 뒤에 나올 ZGC를 제외한 모든 알고리즘은 **Generational Collection**이라는 기술을 사용한다.<br>
Generational Collection은 대부분의 애플리케이션에서 경험적으로 관찰된 몇 가지 속성을 활용하여 탄생한 알고리즘이다.<br>   , 하는 기술이다.

관찰된 몇 가지 속성 중 가장 핵심이 되는 개념은 **Weak Generational Hypothesis**이다.<br>
Weak Generational Hypothesis이란 **대부분의 객체는 잠깐 동안만 필요하다는 가설**이다.<br>
아래 그림은 객체의 평균 생명주기 분포도를 나타낸 그래프다. X축은 객체가 할당된 시간, Y축은 객체가 할당된 정도이다.<br>
그래프를 해석해보면 **애플리케이션에서 수명이 짧은 객체들이 훨씬 많이 분포한다**는 의미이다.<br>
오라클 문서에서도 "_왼쪽의 날카로운 피크는 할당된 직후 회수할 수 있는(즉, "소멸된") 객체를 나타냅니다._" 라고 표현한다.

![객체 생명주기 평균 분포도 출처: https://docs.oracle.com/en/java/javase/16/gctuning/garbage-collector-implementation.html](distribution_for_lifetimes_of_objects.png)

즉, 이러한 경험적 관찰 결과를 바탕으로 Heap 영역에 있는 모든 객체에 대해 검사하지 않고 객체의 수명에 기반한 Collecting을 수행한다.<br>
결과적으로 사용하지 않는 객체를 회수하는 데에 필요한 작업을 최소화하였고, ZGC를 제외한 모든 GC 알고리즘이 Generational Collection 기술을 채택한 것이다.

그렇다면 이 객체가 할당된 세대, 혹은 나이는 어떻게 측정할까?<br>
객체의 나이를 측정하기 위한 메모리 공간은 아래와 같다.

![Serial GC의 기본적인 메모리 공간](default_arrangement_of_generations_int_the_serial_collector.png)

자세히 살펴보면 Young, Old로 크게 한번 나뉜다.<br>
이름에서 유추할 수 있듯이 상대적으로 젊은 객체는 Young, 늙은 객체는 Old에 저장된다.

Old는 뭐가 없어 보인다. Young 영역을 자세히 살펴보자.<br>
1개의 Eden과 2개의 Survivor, 그리고 1개의 Virtual 공간이 보인다.<br>

각 영역 별 특징으로는 다음과 같다.
1. **Eden 영역에는 처음 생성되는 대부분의 객체가 저장된다.**
2. **Survivor 영역 중 적어도 하나는 항상 비어있다.**

<br>
<br>

이 구조를 기반으로 나이를 증가하는 과정은 다음과 같다.

1. 처음 생성된 객체는 Eden 영역에 차곡차곡 쌓인다.
2. 쌓이다가 결국 공간이 꽉 차면 이때 Eden에 존재하는 객체 중, 필요있을만한 객체를 모두 Survivor 영역으로 이동한다.
3. 이때, **이동하는 객체에 나이를 증가시킨다.**
4. 마찬가지로 Survivor 영역도 모두 차게 되면, 필요있을만한 객체만이 반대편의 Survivor 영역으로 이동한다. 이때에도 마찬가지로 나이를 증가시킨다.

### 요약

이제, 위 정보를 토대로 GC의 전체적인 동작 방식을 정리해보자.

1. Eden 혹은 Survivor 영역이 모두 차면 Young Generation 영역만 수집하는 **Minor Collection**이 발생한다.<br>
   (적은 양의 객체만 참조하기에 Minor Collection은 비교적 빠르게 수행된다.)
2. Minor Collection이 진행되면서 특정 나이가 된 객체는 Old 영역으로 이동한다.
3. 진행되다 보면 Old Generation이 모두 차게 된다. 이때는 전체 영역을 Collecting하는 **Major Collection**이 발생한다.<br>
   (전체 객체를 확인해야 하기에 Minor에 비해 상당한 시간이 걸린다.)

## 이어서

다음으로는 GC 알고리즘의 종류와 각 특징에 대해 알아보자.

> ### 참고
> - https://youtu.be/FMUpVA0Vvjw?feature=shared <br>
> - https://youtu.be/vZRmCbl871I?feature=shared <br>
> - https://mangkyu.tistory.com/118 <br>
> - https://docs.oracle.com/en/java/javase/17/gctuning/available-collectors.html#GUID-45794DA6-AB96-4856-A96D-FDE5F7DEE498 <br>
> - https://stackoverflow.com/questions/70664562/criteria-for-default-garbage-collector-hotspot-jvm-11-17 <br>
> - https://medium.com/javarevisited/java-17-vs-java-11-exploring-the-latest-features-and-improvements-6d13290e4e1a <br>
> - https://www.optaplanner.org/blog/2021/09/15/HowMuchFasterIsJava17.html <br>
> - https://www.baeldung.com/jvm-garbage-collectors <br>
