---
title: "[Java] 배열의 공변, 제네릭의 불공변. 그리고 PECS"
description: "공변, 불공변. 그리고 PECS에 대해 알아보자"
date: 2024-04-23
tags: ["java", "공변, 불공변", "PECS"]
---

제네릭을 공부하다보면 배열과 함께 사용하는 것이 위험하다는 내용과 함께 자주 등장하는 용어인, **공변**과 **불공변*, 그리고 **실체화***가 있다.<br>
자주 쓰는 말이 아니다보니 잘 이해가 가지 않으면서 공변, 불공변 특성때문에 왜 제네릭과 배열은 잘 어울리지 못하는지에 대해 알아보자.

또한, 제네릭을 이용해 범용성 있는 API(public 메서드)를 작성하기 위해 알아야 하는 **PECS**에 대해서도 알아보자. 

## 공변과 불공변, 그리고 실체화

### 공변과 불공변

**배열은 공변**이다.<br>
공변이라는 뜻은, `Sub` 클래스가 `Super` 클래스의 하위 타입이라면 `Sub[]`는 `Super[]`의 하위 타입이 된다.<br>
즉, 함께 변한다는 의미로 해석된다.
```java
Fruit fruit = new Apple();
Fruit[] fruits = new Apple[5]; // OK
```

반면, **제네릭은 불공변**이다.<br>
마찬가지로 `Sub`가 `Super`의 하위타입이라 해도, `<Sub>`는 `<Super>`의 하위 타입이 아니다. 전혀 다른 타입이 된다.<br>
즉, 함께 변하지 않는다는 의미로 해석된다.

```java
List<Object> list = new ArrayList<Long>(); // 컴파일 에러. 제네릭 타입이 서로 다르다.
```

### 실체화

추가로 배열과 제네릭의 차이로는 런타임 시에 실체화가 된다는 것이다.

배열은 런타임에 어떤 타입인지 이미 알고 있다.<br>
제네릭은 컴파일 시에 검사하고 **소거**되어 런타임에는 타입에 대한 정보가 없다.

## 패러다임 차이 

이렇게 배열과 제네릭은 패러다임의 차이가 존재한다.<br>
이로 인해 둘을 어울리기 쉽지 않다.

때문에 제네릭 배열은 생성하지 못한다.

### 만약 제네릭 배열의 생성이 가능하다면

만약 제네릭 배열이 생성 가능한 상황을 가정해보자.

```java
List<String>[] stringList; // 매개변수화 타입이 List<String>인 제네릭 배열 선언
stringList = new ArrayList<String>[1]; // 제네릭 배열 생성

List<Integer> intList = List.of(42); // 매개변수화 타입이 List<Integer>인 리스트 초기화
Object[] arr = stringList; // stringList 배열을 Object[]로 업캐스팅. 배열의 공변성 때문에 가능.
object[0] = intList; // Object[]에 List<Integer> 타입의 변수 할당. 제네릭의 소거 때문에 가능.

String s = stringList[0].get(0); // 제네릭 정보로 인해 컴파일러는 자동으로 String으로 캐스팅한다. 이때, ClassCastException 발생
```

제네릭은 컴파일 타임에 타임 체크와 캐스팅을 강제한다.<br>
반면, 배열은 그렇지 않으며 공변한다.<br>

제네릭이 배열에 포함된다면, 제네릭은 결국 기능을 상실하게 되고 런타임에 `ClassCastException`이 발생할 수 있게 되는 것이다.<br>

### 제네릭 배열의 선언(사용)은 가능하다?

제네릭 배열이 **생성은 불가**하지만, **선언은 가능**하다.<br>
예를 들어, 가변인자 타입으로 제네릭을 받을 수 있다.

```java
public int firstValue(List<Integer>... ints) {} // 가변인자의 타입이 List<Integer>로, 제네릭 타입이다.
```

하지만 제네릭 배열을 사용하는 것은 **Heap Pollution**을 일으킬 수 있다고 친절하게 경고를 한다.
약간 모순처럼 느껴지지만 편리함 때문에 허용을 한다.<br>
대신, 편리성만큼 안정성도 챙겨야 한다.

Heap Pollution은 매개변수화된 타입의 변수(ints)가 타입이 다른 객체(ex. List<String>)를 참조하면 발생하는 것이다.<br>
이를 사전에 완벽히 차단하는 전제하에 사용하면 된다!<br>
메서드 내부에서는 가변인자 배열에 새로운 값을 저장하지 말고, 배열의 참조가 메서드 외부로 유출되지 않는다면 안전하다고 볼 수 있다.<br>
만약, 안전하다고 판단되면 `@SafeVarargs` 어노테이션을 붙여주어 메서드를 사용하는 코드 쪽에서도 불필요한 경고를 제거해주자.

---

<br>
<br>

## PECS

PECS는 _Producer-Extends, Consumer-Super_ 의 약자로, 와일드카드로 타입을 제한할 때의 공식이다.

생산자는 `extends`를, 소비자는 `super`를 사용하라는 뜻 같은데, 생산자는 무엇이고 소비자는 무엇일까?<br>
그리고 이 공식이 왜 탄생했을까?

### 제네릭은 불공변하기 때문이다

위에서 언급했듯이, 제네릭은 불공변하다.<br>
때문에 유연성이 다소 부족할 수 있는데, 이를 개선하기 위해 PECS가 탄생했다.<br>
코드로 자세히 살펴보자.

```java
public class Stack<E> {
    public Stack();
    public void push(E e);
    public E pop();
    public boolean isEmpty();
    
    public void pushAll(Iterable<E> src) {
        for (E e : src) {
            push(e);
        }
    }
}
```

위와 같은 코드가 있다.<br>
얼핏 보면, 문제는 없어보인다.

하지만 `Stack<Number> stack`에 `Iterable<Integer> ints`를 인자로 넘기면 컴파일 오류가 발생한다.<br>
얼핏 보면 가능할 것 같은데 왜 실패할까?

`Stack<Number> stack`의 메서드 시그니처는 `pushAll(Iterable<Number> src)`와 같을 것이다.<br>
이때, 제네릭의 불공변 때문에 `Iterable<Integer>`과 `Iterable<Number>`는 다르다.

따라서 자바는 이런 자바의 딱딱함을 보다 유연하게 사용하기 위해 와일드카드를 지원하는 것이다.

그럼 이제 `pushAll(Iterable<E>)` 메서드를 와일드카드를 사용해 유연하게 만들어보면 다음과 같다.
```java
public void pushAll(Iterable<? extends E> src) {
    for (E e : src) {
        push(e);
    }
}
```
드디어 `Iterable<Integer>` 타입도 안전하게 파라미터로 전달할 수 있게 되었다.

그럼 반대로 값을 모두 뽑아 옮기는 `popAll()` 메서드도 만들어보자.

```java
public void popAll(Collection<E> c) {
    while (!this.isEmpty()) {
        c.add(this.pop());
    }
}
```

위 메서드도 얼핏 보면 문제 없어보인다.<br>
하지만 `Stack<Integer> stack`의 모든 원소를 `Collection<Number>` 로 옮기려고 하면 컴파일 에러가 발생한다.<br>
왜냐하면, `Integer` 타입을, `Collection<Number>`에 추가하려고 했기 때문이다.<br>
제네릭의 불공변 때문에 `Integer`와 `Number`는 다르다.

이제 이를 와일드카드로 해결해보자.

```java
public void popAll(Collection<? super E> c) {
    while (!this.isEmpty()) {
        c.add(this.pop());
    }
}
```

드디어 `Collection<Number>` 타입도 안전하게 파라미터로 전달할 수 있다.

이처럼 제네릭 메서드의 유연함을 강화하기 위해 PECS는 탄생했는데, 생산자는 `extends`, 소비자는 `super`이다.<br>
그렇다면 생산자와 소비자는 각각 무엇을 의미하는걸까?

메서드 매개변수가 제네릭 클래스에 값을 생산하면 생산자.<br>
메서드 매개변수가 제네릭 클래스의 값을 소비하면 소비자라는 의미로 이름을 붙였다.

파라미터 관점에서 제네릭 클래스의 값을 생산하고 소비하는 관점으로 보면 조금은 와닿을 수 있다.   