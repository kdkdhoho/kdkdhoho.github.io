---
title: "[Infra] Github Actions를 이용한 CI 작업 속도를 캐싱으로 개선하기"
description: "CI 속도를 개선해보자"
date: 2024-05-23
tags: ["infra", "github actions", "ci workflow"]
---

## 들어가며

현재 [ListyWave](https://listywave.com) 프로젝트에서 백엔드는 CI를 위해 Github Actions를 이용 중이다.

수행하는 작업을 의미하는 Workflow는 크게 아래와 같이 나눌 수 있다.

1. 코드 체크아웃
2. JDK 준비
3. Gradle 준비
4. 빌드

하지만 **Gradle을 준비하고 빌드하는 _Build with Gradle_ 과정에서 최소 1m이 걸리고 있었다.**<br>
(~~지금 보니 Gradle 준비와 빌드가 동시에 일어나고 있었다. 즉, 빌드를 2번 수행했었다 😓~~)

![개선 전](not-enhanced.png)

이를 Github Actions Market Place에 있는 [actions/gradle-cache](https://github.com/marketplace/actions/gradle-cache)를 이용해 속도를 개선하려고 한다.

## actions/gradle-cache

우선 [actions/gradle-cache](https://github.com/marketplace/actions/gradle-cache)에 대해 간단하게 이해해보자.

Github Actions는 작업이 수행될 때마다 매번 새로운 환경의 가상 호스트를 생성하고 작업을 수행한다.<br>
따라서 JDK 셋업이나 Gradle 셋업 및 빌드 과정이 매번 동일하게 수행된다.

하지만 위 작업들은 변경되지 않는 한, **캐싱을 이용할 수 있는 작업들**이다.

_actions/gradle-cache_ 는 그 중에서도, Gradle을 셋업하고 빌드하는 과정을 전반적으로 수행해주며 동시에 원격 혹은 로컬에 캐싱을 지원해주는 기술이다.

## Gradle 성능 개선

[Gradle 공식 문서](https://sejoung.github.io/2021/08/2021-08-04-gradle_build/)와 [기술 블로그](https://sejoung.github.io/2021/08/2021-08-04-gradle_build/)를 통해 **Gradle 자체적으로 성능 개선을 위한 옵션을 지원**하고 있는 것을 확인할 수 있었다.

여러 종류의 옵션이 지원되고 있는데, 나는 그 중에서 **빌드를 병렬적으로 수행하게 해주는 옵션**과 **빌드 캐시를 활성화해주는 옵션을 설정**했다.

옵션에 대한 자세한 설명은 공식 문서나 블로그 글을 참고해보면 좋겠다.

## 개선된 CI Workflow

이제 위 내용을 모두 적용한 CI Workflow는 아래과 같다.

```yaml
name: CI workflow

on:
  pull_request:
    branches: [ "dev", "prod" ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-22.04

    steps:
      - name: 체크아웃
        uses: actions/checkout@v4

      - name: JDK 셋업
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          cache: 'gradle'
          distribution: 'corretto'

      - name: Gradle 셋업, 빌드, 캐시
        uses: burrunan/gradle-cache-action@3bf23b8dd95e7d2bacf2470132454fe893a178a1
        with:
          arguments: build
          properties: |
            --build-cache
            --parallel
```

위 Workflow로 수행한 결과는 아래와 같다.

![개선 후](enhanced.png)
![Gradle 셋업, 빌드, 캐시 작업 로그](detail-of-gradle-job.png)

Gradle를 셋업하는 과정에서 캐시 데이터를 활용한 것을 볼 수 있고, 빌드 과정 중에서 `Task :compileJava`, `Task :compileTestJava`, `Task :test ` 작업이 모두 캐시로부터 수행된 것을 확인할 수 있다.<br>
그 결과, 확실히 Gradle과 관련된 작업에서 상당한 성능 개선이 이루어진 것을 확인할 수 있다.

혹시나해서 고의로 실패하는 테스트를 작성 후 Workflow를 실행해보았다.
![실패하는 테스트 작성 후 실행 결과](result-for-fail-test.png)
Build가 성공적으로 실패하는 것을 확인할 수 있었다.

## 마치며

바쁘고 바쁜 현대 사회에서 CI에 헛된 시간을 낭비할 수 없다.<br>
어렵지 않고 단순한 위 작업을 통해 우리의 중요한 시간을 더 중요한 곳에 쏟을 수 있길 바란다.