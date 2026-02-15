---
title: "모든 원시값과 문자열을 포장한다. 왜?"
description: "원시값과 문자열을 포장하면 좋은 점 + 일급 컬렉션"
date: 2023-12-13
tags: ["Java", "oop", "클린코드"]
---

## 세 줄 요약

1. 코드의 가독성이 좋아진다. 
2. 코드를 객체지향으로 짤 수 있다.
3. 따라서 유지보수가 쉽다.

## 원시값과 문자열을 포장하지 않았을 때

```java
new RacingGame(List.of("doggy", "dazzle", "0chil"), 10);
```

이 코드를 보고 파라미터로 넘어가는 각 값들이 어떤 값들인지 바로 파악할 수 있을까?

적어도 해당 프로젝트에 대한 이해도가 없다면 절대 불가능할 것이다.

물론 아래 코드처럼 각 파라미터를 변수로 할당하고 변수명으로 유추할 수 있다.

```java
List<String> players = List.of("doggy", "dazzle", "0chil");
int playCount = 10;

new RacingGame(players, playCount);
```

그렇다면 아래 코드를 한번 보자

```java
Players players = new Players(List.of("doggy", "dazzle", "0chil"));
PlayCount playCount = new PlayCount(10);

new RacingGame(players, playCount);
```

분명 변수명은 같지만, 타입이 주는 힘이 느껴진다.

## 반복되는 행위를 수행할 수 있다

만약 위 코드에서 `List<String> players`와 `int playCount`가 넓은 범위에서 사용되면서, 동시에 각 변수를 사용하는 데 있어 반복되는 행위가 있다면 어떨까?

가령, 다양한 곳에서 각 Player들에게 playCount만큼 게임을 Play하는 행위가 이뤄져야 한다면 각 변수가 존재하는 메서드마다 실행 코드를 작성해줘야 할 것이다.

하지만 값을 포장하여 새로운 객체를 만든다면, 객체 간의 협력을 통해 충분히 수행할 수 있을 것이다.

이는 유지보수 관점에서 큰 강점이다!

---

추가로, 만약 playCount가 몇 회 이하여야 한다는 요구사항이 있을 경우를 생각해보자.

해당 경우에도 `PlayCount` 객체에서 애초에 객체를 생성할 때 검증을 해주면 된다.

그러면 해당 객체를 사용하는 모든 곳에서 검증을 해주지 않아도 된다!

## 일급 컬렉션

일급 컬렉션은 컬렉션을 감싼 객체이다.

사실, 일급 컬렉션도 값을 포장한 객체이므로 위에서 언급한 장점들이 모두 적용된다고 볼 수 있다.
