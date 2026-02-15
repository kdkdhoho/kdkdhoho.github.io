---
title: "[Java] 배열의 공변, 제네릭의 불공변. 그리고 PECS"
description: "공변, 불공변. 그리고 PECS에 대해 알아보자"
date: 2024-04-23
tags: ["Java", "공변, 불공변", "PECS"]
---

## 들어가며

제네릭을 공부하다보면 배열과 잘 어울리기 어렵다는 내용과 함께 자주 등장하는 용어인, **공변**과 **불공변**, 그리고 **실체화**가 있다.

잘 사용하지 않는 단어인, 공변과 불공변, 그리고 실체화가 **각각 어떤 의미**를 가지는지 알아보고<br>
**왜 제네릭과 배열은 잘 어울리지 못하는지**에 대해 알아보자.

또한, 제네릭을 이용해 범용성 있는 API(public 메서드)를 작성하기 위해 알아야 하는 **PECS**에 대해서도 알아보자.

<br>
<br>

---

## 1. 공변과 불공변, 그리고 실체화

### 1-1. 공변과 불공변

**배열은 공변**이다.<br>
공변이라는 뜻은, `Sub` 클래스가 `Super` 클래스의 하위 타입이라면 `Sub[]`는 `Super[]`의 하위 타입이 된다는 의미다.<br>
즉, **함께 변한다**는 의미로 해석된다.
```java
Fruit fruit = new Apple();
Fruit[] fruits = new Apple[5]; // OK
```

<br>

반면, **제네릭은 불공변**이다.<br>
마찬가지로 `Sub`가 `Super`의 하위타입이라 해도, `<Sub>`는 `<Super>`의 하위 타입이 아니다.<br>
전혀 다른 타입이 된다.<br>
즉, **함께 변하지 않는다**는 의미로 해석된다.

```java
List<Object> list = new ArrayList<Long>(); // 컴파일 에러. 제네릭 타입이 서로 다르다.
```

### 1-2. 실체화

배열과 제네릭의 또 다른 차이로는 **런타임 시에 실체화**가 된다는 것이다.

배열의 경우, 런타임에 타입 정보가 존재해야 한다. 즉, 배열은 어떤 타입인지 이미 알고 있다.<br>
제네릭의 경우, 런타임에 타입 정보가 없다. 컴파일 시에 타입을 검사하고 **소거**하여 런타임에는 타입에 대한 정보가 없다.

## 2. 패러다임 차이 

이렇게 **배열과 제네릭은 패러다임의 차이가 존재**한다.<br>
이로 인해 둘을 어울리기 쉽지 않다.

한 사례로, **제네릭 배열은 생성하지 못한다**.

### 2-1. 만약 제네릭 배열의 생성이 가능하다면

만약 제네릭 배열이 생성 가능한 상황을 가정해보자.

```java
List<String>[] stringList; // 매개변수화 타입이 List<String>인 제네릭 배열 선언
stringList = new ArrayList<String>[1]; // 제네릭 배열 생성

List<Integer> intList = List.of(42); // 매개변수화 타입이 List<Integer>인 리스트 초기화
Object[] arr = stringList; // stringList 배열을 Object[]로 업캐스팅. 배열의 공변성 때문에 가능.
object[0] = intList; // Object[]에 List<Integer> 타입의 변수 할당. 제네릭의 소거 때문에 가능.

String s = stringList[0].get(0); // 제네릭 정보로 인해 컴파일러는 자동으로 String으로 캐스팅한다. 이때, ClassCastException 발생
```

위에서 언급한 제네릭과 배열의 특징을 다시 상기해보자.<br>
제네릭은 컴파일 타임에 타임 체크와 캐스팅을 강제한다.<br>
반면, 배열은 그렇지 않으며 공변한다.<br>

**제네릭이 배열에 포함된다면, 제네릭은 결국 기능을 상실하게 되고 런타임에 `ClassCastException`이 발생할 수 있게 되는 것**이다.<br>

### 2-2. 제네릭 배열의 선언은 가능하다?

제네릭 배열이 **생성은 불가**하지만, **선언은 가능**하다.<br>
예를 들어, 가변인자 타입으로 제네릭을 받을 수 있다.

```java
public int firstValue(List<Integer>... ints) {} // 가변인자의 타입이 List<Integer>로, 제네릭 타입이다.
```

하지만 제네릭 배열을 사용하는 것은 **Heap Pollution**을 일으킬 수 있다고 친절하게 경고를 한다.<br>
약간 모순처럼 느껴지지만 이를 허용하는 이유는 **편리성** 때문이라고 한다.<br>
대신 반드시 안정성도 함께 챙겨야 한다!

제네릭 타입 배열(가변인자)를 선언하고 사용할 때, 안정성은 어떻게 챙길 수 있을까?

우선 *Heap Pollution*에 대해 이해해보자.

Heap Pollution은 **매개변수화된 타입의 변수(ints)가 타입이 다른 객체(ex. List<String>)를 참조하면 발생**하는 것이다.<br>
말이 조금 어려운데 코드로 이해해보자.

```java
public int firstValue(List<Integer>... intLists) {
    Object[] arr = intLists;

    List<String> strList = List.of("A", "b");
    arr[0] = strList; // 힙 오염 발생!

    return intLists[0].get(0);
}
```

위에서 봤던 제네릭 배열을 생성했을 때 생기는 문제와 동일하다.<br>
결국 배열의 공변성 때문에 제네릭의 타입 강제성이 사라지게 되어 런타임 시에 제네릭 타입이 다른 매개변수화된 타입이 배열에 할당되는 것이다.

따라서 위 문제만 사전에 완벽히 차단한다면, 안정성을 챙기게 되는 것이다.<br>
메서드 내부에서는 가변인자 배열에 새로운 값을 저장하지 말고, 배열의 참조가 메서드 외부로 유출되지 않는다면 안정성을 보장할 수 있다.<br>
안전하다고 판단되면 `@SafeVarargs` 어노테이션을 붙여주어 메서드를 사용하는 코드 쪽에서도 불필요한 경고를 제거해주자.

## 3. PECS

PECS는 _Producer-Extends, Consumer-Super_ 의 약자로, 와일드카드로 제네릭 타입을 제한할 때 사용하는 공식이다.

생산자는 `extends`를, 소비자는 `super`를 사용하라는 뜻인데, 생산자와 소비자는 각각 무엇을 의미하는 것이며 이 공식이 왜 탄생했을까?

### 3-1. 제네릭은 불공변하기 때문이다

위에서 언급했듯이, 제네릭은 불공변하다.<br>
때문에 유연성이 다소 부족할 수 있는데, 이를 개선하기 위해 PECS가 탄생했다.<br>
유연성이 부족한 상황을 코드로 살펴보자.

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
가능할 것 같은데 왜 실패할까?

`Stack<Number> stack`의 메서드 시그니처는 `pushAll(Iterable<Number> src)`와 같을 것이다.<br>
이때, 제네릭의 불공변 때문에 `Iterable<Integer>`과 `Iterable<Number>`는 다르다.<br>
이러한 상황들 때문에 제네릭은 유연성이 다소 부족한 것이다.

자바는 이런 상황을 보다 유연하게 만들기 위해 와일드카드를 지원하는 것이다.

그럼 이제 `pushAll(Iterable<E>)` 메서드를 와일드카드를 이용해 유연하게 만들면 다음과 같다.
```java
public void pushAll(Iterable<? extends E> src) {
    for (E e : src) {
        push(e);
    }
}
```
드디어 `Iterable<Integer>` 타입도 안전하게 파라미터로 전달할 수 있게 되었다.<br>
참고로 매개변수가 클래스에 값을 **생산**하고 있다.

<br>

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

드디어 `Collection<Number>` 타입도 파라미터로 전달할 수 있게 됐다.<br>
참고로 매개변수가 제네릭 클래스의 값을 **소비**하고 있다.

<br>

이처럼 제네릭 메서드의 유연함을 강화하기 위해 PECS는 탄생했다.<br>
생산자는 `extends`, 소비자는 `super`를 사용한다.<br>
메서드 **매개변수가 제네릭 클래스에 값을 생산하면 생산자**.<br>
메서드 **매개변수가 제네릭 클래스의 값을 소비하면 소비자**라는 의미로 이름을 붙인다.

처음 생산자, 소비자 단어를 접하면 한번에 이해가 잘 되지 않을 수 있다.<br>
이럴 땐 파라미터 관점에서 제네릭 클래스의 값을 생산하거나 소비하는 관점으로 보면 조금은 와닿을 수 있다.   
