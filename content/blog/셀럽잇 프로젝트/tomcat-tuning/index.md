---
title: "[셀럽잇] Tomcat 성능 최적화를 위해 Max-Threads, Max-Connections, Accept-Count 설정하기"
description: "[셀럽잇] Tomcat 성능 최적화를 위해 Max-Threads, Max-Connections, Accept-Count 설정하기"
date: 2023-09-09
tags: ["셀럽잇", "tomcat"]
series: "셀럽잇 프로젝트"
slug: "tomcat-tuning"
---

사용자 유치 전, 서버 성능 개선을 위해 Tomcat 성능 최적화를 진행하려고 합니다.

그 과정에서 설정할 값들인 `Max-Threads`, `Max-Connections`, `Accept-Count`에 대해 이해하려고 합니다.

## Max-Threads

JVM 기반에서 동작하는 Tomcat은 HTTP 요청을 받으면, 각 요청을 하나의 쓰레드가 처리하도록 동작합니다.

이 `Max-Threads` 설정은 Tomcat에서 최대 몇 개까지의 쓰레드를 동작시킬 것인지 설정하는 옵션입니다.

즉, 동시에 최대 몇 개의 요청을 처리할 것인지에 대한 설정입니다.

default 값은 200 입니다.

## Max-Connections

HTTP 요청을 수락하고 처리할 수 있는 최대 Connection의 수에 대한 설정입니다.

설정 수치에 도달하면, 추가 요청에 대해 Accept는 하지만 처리하진 않습니다.

Accept된 Connection은 현재 처리 중인 Connection의 수가 `Max-Connections`보다 아래로 떨어질 때까지 Block 됩니다.

Block 된 요청은 `Accept-Count` 수 만큼 존재할 수 있습니다.

default 값은 8192 입니다.

## Accept-Count

`Max-Connections` 보다 더 많은 요청이 들어오게 되어 요청을 Block 하면, 운영체제는 Block 된 요청을 대기 큐에 대기시킵니다.

이때, 대기 큐의 Size가 `Accept-Count` 입니다.

위 크기보다도 더 많은 요청이 들어오게 된다면, 운영체제가 해당 요청을 거절하거나 Connection Time Out이 발생하게 됩니다.

## 그렇다면 어떤 식으로 조절할까?

현재 vUser를 300명으로 했을 때를 가정하여 부하 테스트를 진행하고 있습니다.

그 결과 아래와 같은 최적의 값이 도출되는 것을 확인할 수 있었습니다.

- Max-Threads: 300
- Max-Connection: 8192 (default)
- Accept-Count: 10 (default)

> ### 참고
> - [톰캣 공식문서](https://tomcat.apache.org/tomcat-8.5-doc/config/http.html)