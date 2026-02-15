---
title: "Garbage Collection 튜닝에 대해"
description: "Garbage Collection 튜닝에 대해"
date: 2023-12-09
tags: ["Java", "garbageccollection"]
---

## GC에서 고려할 성능

GC의 주요 측정 기준은 **처리량**과 **지연 시간**이다.

처리량은 오랜 시간동안 측정하며, **(GC에 소요되지 않는 시간 / 전체 시간) * 100**을 의미한다.

지연 시간은 애플리케이션의 응답 속도이다.

즉, **GC를 얼마나 빠르고 더 적은 횟수로 수행할 것인가가 GC 튜닝에서 고려할 포인트**가 되는 것이다.

> ~~GC 튜닝에 대한 내용은 언젠가 알아보자~~

하지만 프로그램 특징에 따라 더 중요하게 여겨지는 기준은 달라질 것이다.

가령 웹서버의 경우 처리량은 네트워크 지연 현상에 가려질 수 있기에 지연 시간은 중요하게 생각하지 않을 수 있다.

하지만 GUI와 같은 실시간성이 아주 중요한 서비스의 경우, 처리량보다 지연 시간이 더 큰 가치가 될 것이다.

따라서 애플리케이션 특징에 따라 우선 순위를 두는 것이 좋다.

## Young, Old Generation 영역의 크기에 따른 비교

처리량과 지연 시간은 Young Genration과 Old Generation 영역의 크기 비율을 어떻게 가져가냐에 따라 달라진다.

*Young Generation*의 비율이 커질수록 GC가 발생하는 빈도는 낮아지기에 처리량은 증가할 수 있다.<br>
하지만 그만큼 *Old Generation*의 비율이 작아지고, 이는 *Major Collection*의 빈도가 증가하여 지연 시간에 부정적인 영향을 끼칠 것이다.

반대로 *Young Generation*의 비율이 작아질수록 *Minor Collection*의 빈도가 증가하고, 이는 처리량에 부정적 영향을 끼친다.<br>
하지만 그만큼 *Old Genration*의 비율이 커지고, 이는 *Major Collection*의 빈도가 줄어들어 지연 시간에 긍정적 영향을 끼칠 것이다.

// TODO: 아래 링크 보고 정리해보자
> 보다 자세한 내용은 [이 링크](https://docs.oracle.com/en/java/javase/17/gctuning/factors-affecting-garbage-collection-performance.html#GUID-5508674B-F32D-4B02-9002-D0D8C7CDDC75)를 참고

// TODO: 아래 링크로부터 이어서 글 작성
https://docs.oracle.com/en/java/javase/17/gctuning/garbage-collector-implementation.html#GUID-A24775AB-16A3-4B86-9963-76E5AC398A3E

## 유의사항

### 1. GC로 인한 Stop-the-world를 최소화하자

### 2. GC는 무적이 아니다.

https://techblog.woowahan.com/2628/
https://www.baeldung.com/jvm-garbage-collectors

### 2. 무적의 GC는 없다.

https://www.youtube.com/watch?v=FMUpVA0Vvjw
https://stackoverflow.com/questions/70664562/criteria-for-default-garbage-collector-hotspot-jvm-11-17

## 번외
Java 17 vs Java 11의 GC 성능 차이: https://medium.com/javarevisited/java-17-vs-java-11-exploring-the-latest-features-and-improvements-6d13290e4e1a, https://www.optaplanner.org/blog/2021/09/15/HowMuchFasterIsJava17.html#:~:text=Java%2017%20is%208.66%25%20faster,than%20the%20G1%20Garbage%20Collector

> ### 참고
> - https://youtu.be/FMUpVA0Vvjw?feature=shared <br>
> - https://youtu.be/vZRmCbl871I?feature=shared <br>
> - https://mangkyu.tistory.com/118 <br>
> - https://docs.oracle.com/en/java/javase/17/gctuning/available-collectors.html#GUID-45794DA6-AB96-4856-A96D-FDE5F7DEE498 <br>
> - https://stackoverflow.com/questions/70664562/criteria-for-default-garbage-collector-hotspot-jvm-11-17 <br>
> - https://medium.com/javarevisited/java-17-vs-java-11-exploring-the-latest-features-and-improvements-6d13290e4e1a <br>
> - https://www.optaplanner.org/blog/2021/09/15/HowMuchFasterIsJava17.html <br>
> - https://www.baeldung.com/jvm-garbage-collectors <br>
