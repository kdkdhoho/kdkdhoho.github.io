---
title: "[Java] Varargs는 어떻게 사용하고, 사용했을 때 장점이 무엇일까?"
description: "Java의 Varargs에 대해 알아보자"
date: 2023-04-08
tags: ["Java", "varargs"]
slug: "what-is-varargs"
---

## Varargs 탄생 배경

JDK 1.4 전까지는 다양한 수의 인자를 가진 메서드를 선언할 수 없었다.<br>
이를 해결하기 위해 두 가지 방식을 사용했다.

1. 메서드 오버로딩 (하지만 코드의 길이를 무한대로 증가시킨다.)
2. 전달할 값들을 배열로 받기

하지만 두 방법에 한계점들이 존재했고 이 문제를 개선하기 위해 Varargs를 개발했다.<br>
결국, Varargs는 **다양한 범위의 인자를 받기 위한 해결책**이다.

## Varargs 사용법 및 특징

```java
public class VarargsPractice {
    public static void main(String[] args) {
        printValues(); // 0개 이상의 인자를 받을 수 있다.
        printValues("1");
        printValues("1", "2");
        printValues("1", "2", "3");
        printValues(new String[]{"1", "2", "3"}); // 실제로는 배열로 동작하기에 문제되지 않는다.
    }

    public static void printValues(String... values) { // Varargs 사용
        for (int i = 0; i < values.length; i++) {
            System.out.println(values[i]); // 배열이므로 인덱싱한다.
        }
    }
}
```

## Varargs 사용 규칙

### 1. 한 메서드에는 오직 한 가지의 Varargs만 사용 가능하다.

```java
public void foo(String... inputs, int... numbers) {} // 컴파일 오류 
```

### 2. Varargs를 파라미터의 마지막 순서로 위치해야 한다.
```java
public void foo(int... numbers, String input) {} // 컴파일 오류
```

## Heap 오염 유발 가능

Varargs를 사용하는 건 힙 오염(Heap Pollution)을 유발할 수 있다.<br>
아래 코드를 살펴보자.

```java
public class Main {
    public static void main(String[] args) {
        List<String>[] strings = new List[3];
        strings[0] = List.of("a", "b", "c");
        strings[1] = List.of("1", "2", "3");
        strings[2] = List.of("!", "@", "#");

        System.out.println(firstOfFirst(strings)); // ClassCastException 발생
    }

    static String firstOfFirst(List<String>... strings) {
        Object[] objects = strings;
        List<Integer> ints = Collections.singletonList(42);
        objects[0] = ints; // Heap pollution

        return strings[0].get(0); // ClassCastException
    }
}
```

Varargs 메서드를 호출하면 인자를 받을 배열이 하나 생성된다.<br>
이때, 파라미터 타입이 실체화 불가 타입. 즉, 제네릭이 적용되어 런타임에 소거가 되는 타입이라면 힙 오염이 발생할 수 있는 것이다.<br>
> 참고) [배열의 공변과 제네릭의 불공변 관련 글](https://kdkdhoho.github.io/covariant-invariant-and-pecs)에서 자세히 다룬다.

그냥 배열과 리스트는 함께 사용하기엔 위험 요소들이 많고 가급적 리스트를 사용하면 모든 문제가 해결된다는 것만 기억하자.
> 참고) [이펙티브 자바 아이템 28](https://www.google.com/search?q=%EC%9D%B4%ED%8E%99%ED%8B%B0%EB%B8%8C+%EC%9E%90%EB%B0%94+%EC%95%84%EC%9D%B4%ED%85%9C+28&sourceid=chrome&ie=UTF-8#ip=1)

## Varargs의 장점

1. 메서드 인자의 수를 동적으로 결정 및 처리할 수 있다.
2. 코드를 간결하게 유지할 수 있다.

## Varargs의 단점

1. 메모리 사용량이 증가한다.<br>
   Varargs는 곧, 배열이다. Varargs를 사용하는 메서드는 호출될 때마다 매번 새로운 배열을 생성해야 하기 때문이다.
