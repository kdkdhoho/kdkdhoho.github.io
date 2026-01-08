---
title: "임시 제목: Flutter로 반응형 UI를 어떻게 개발할까? or Flutter와 UI"
description: ""
date: yyyy-MM-dd
tags: ["Flutter", "UI"]
draft: true
---

<details>
<summary>앱 개발에서 반응형 원칙 적용 방법</summary>

1. 가로 폭 기준 설계  
일반적으로 가로 폭을 기준으로 주요 레이아웃 분기한다. (예: Compact (≤ 600dp), Medium (601–900dp), Expanded (≥ 900dp))  
Flutter, Android, iOS 모두 width 기반 Breakpoint 패턴이 권장된다.

> ⁉️ Breakpoint 패턴이란?
> Breakpoints는 화면 너비(드물게 높이)를 기준으로 레이아웃을 분기하는 기준선이다.
> 일반적인 Breakpoint 예시 (Material Design 3, Flutter 권장)
> Compact (0–599dp) → 일반 스마트폰 세로
> Medium (600–839dp) → 대형 스마트폰 가로 / 소형 태블릿
> Expanded (840dp 이상) → 태블릿, 데스크톱, 폴더블

2. 세로 높이는 유연하게  
앱도 보통 세로 스크롤 중심이다. 따라서 고정된 높이를 기준으로 반응형을 설계하는 것은 드물다.

3. 비율 기반 설계 활용  
앱의 경우, 픽셀 단위보다는 비율 또는 DP 단위가 더 중요하다. (예: 예: 가로폭의 80% 차지, 16:9 비율 유지 등)

> ⁉️ DP 단위란?
> DP는 안드로이드에서 사용하는 단어이다. (DIP는 DP와 동일한 의미이며 예전 명칭이다.)  
> iOS에서는 pt(point)라는 개념을 사용한다.  
> Flutter에서는 논리적 픽셀(logical pixel)로 통일된다.

</details>

Flutter의 핵심인 위젯은 React에서 영감을 받음  
위젯으로 UI를 만드는 것이 핵심 아이디어.

StatefulWidget과 State가 별개의 객체인 이유: 두 객체는 서로 다른 생명주기를 가진다.  
Widget은 임시 느낌의 객체로, 애플리케이션의 현재 상태를 표현하는 데 사용된다.  
반대로 State는 `build()` 호출 사이에도 계속 유지되기 때문에 데이터들을 계속 가지고 있을 수 있다. 

Flutter에서 변경의 알림은 콜백을 통해서 위젯 계층 구조 '위쪽'으로 향한다.    
(단순히 상태를 그리기 위해서는 '아래'로 향한다.)  
이 흐름을 재조정하는 공통 부모는 State 객체이다. 그러니까 State 객체를 상속받아야, 데이터 변경의 알림을 상위 계층 구조에 알릴 수 있는 것이다. 

`setState()` 를 호출하면 Flutter에게 값이 변경됨을 알리고, `build()`를 재실행하게 된다. 
