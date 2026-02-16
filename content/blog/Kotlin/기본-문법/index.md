---
title: "Kotlin 기본 문법"
description: "Kotlin의 기본 문법을 정리한 글입니다."
date: 2026-01-09
tags: ["Kotlin", "Kotlin 기본 문법"]
slug: "post-20260109-8902e3"
---

# Hello world

가장 간단한 예제 코드다.

```kotlin
fun main() {
	println("Hello, world!")
}
```

- `fun` 키워드로 메서드를 선언한다.
- `main()` 메서드는 프로그램의 시작점이다.
- `println()`, `print()` 메서드는 표준 출력 함수다.

# Variables

- `val`: 불변 변수를 선언하는 키워드
- `var`: 가변 변수를 선언하는 키워드

- top-level 변수: `main()` 밖에서 선언한 변수

# Type

Kotlin은 기본적으로 타입 추론을 적용한다.
명시적으로 타입을 선언하려면 변수명 뒤에 `:` 를 적고 타입을 적는다.

|          종류           | 기본 타입                      | 예제 코드                                                       |
| :-------------------: | -------------------------- | ----------------------------------------------------------- |
|       Integers        | Byte, Short, Int, Long     | val year: Int = 2020                                        |
|   Unsigned Integers   | UByte, UShort, UInt, ULong | val score: UInt = 100u                                      |
| Floating-point numbrs | Float, Double              | val currentTemp: Float = 24.5f<br>val price: Double = 19.99 |
|        Boolean        | Boolean                    | val isEnabled: Boolean = true                               |
|      Characters       | Char                       | val separator: Char = ','                                   |
|        Strings        | String                     | val message: String = "Hello, world!"                       |

변수를 먼저 선언하고 나중에 초기화를 하려면 Type을 명시적으로 선언해야 한다.
```kotlin
val d: Int
println(d) // 에러 발생

d = 3
println(d) // 3
```

# Standard Input
- Java와 상호운용성이 지원되므로 Java의 `Scanner`를 사용할 수 있다.
```kotlin
import java.util.Scanner

fun main() {
	val sc = Scanner(System.`in`)

	val line = sc.nextLine() // 1, 2, 3
	print(line)
}
```

- Kotlin에서 지원하는 `readln()` 메서드로 입력을 받을 수 있다.
- 한 줄의 텍스트를 읽고 `String`으로 반환한다.
```kotlin
val name = readln()
val age = readln().toInt()
```

- Java의 `BufferedReader`와 `InputStreamReader`도 적용 가능하다.
```kotlin
import java.io.*

val br = BufferedReader(InputStreamReader(System.`in`))
```

# String Templates

템플릿 표현식은 `$` 를 사용한다.

예제 코드
```kotlin
val customers = 10
println("There are $customers customers")
println("There are ${customers + 1} customers)
```

# Collections

각 콜렉션은 Mutable 이거나 Read-Only이다.
## Lists

- 객체 생성
  ```kotlin
  val readOnlyShapes = listOf("triangle", "square", "circle")
  
  // MutableList에서 List로 캐스팅 가능
  val mutableShapes: MutableList<String> = mutableListOf("triangle", "square", "circle")
  val readOnlyShapes2: List<String> = mutableShapes
  
  val shapes: MutableList<String> = mutableListOf("triangle", "square", "circle")
  ```

- 인덱싱
    - `.first()`와 `.last()` 메서드로 편리하게 접근 가능하다.
  ```kotlin
  val shapes = listOf("triangle", "square", "circle")
  val firstShape = shapes[0];
  println(firstShape)
  println(shapes.first())
  println(shapes.last())
  ```

- 전체 개수: `.count()`
- 요소 포함 여부: `in`
  ```kotlin
  val readOnlyShapes = listOf("triangle", "square", "circle")
  val isContains = "square" in readOnlyShapes
  print(isContains) // true
  ```

- 요소 추가 및 삭제: `.add()`, `.remove()`
  ```kotlin
  val shapes = mutableListOf("triangle", "square", "circle")
  shapes.add("pentagon")
  shapes.remove("square")
  ```

## Sets

- 객체 생성
  ```kotlin
  val readOnlyFruit = setOf("apple", "banana")
  val fruit = mutableSetOf("apple", "banana")

  // Mutable에서 Read-Only로 캐스팅 가능
  val fruit: MutableSet<String> = mutableSetOf("apple", "banana", "cherry", "cherry")
  val fruitLocked: Set<String> = fruit
  ```

- 전체 개수 구하기: `count()`
- 요소 포함 여부: `in`
- 요소 추가 및 삭제: `.add()`, `.remove()`
## Maps

- 객체 생성
  ```kotlin
  val readOnlyMenus = mapOf("apple" to 100, "kiwi" to 190)
  val menus = mutableMapOf("apple" to 100, "kiwi" to 190)

  // Mutable을 Read-Only로 캐스팅 가능
  val menus2 = mutableMapOf()
  val readOnlyMenus2 = menus2
  ```

- 인덱싱: `[]`
  ```kotlin
  val menus = mapOf("apple" to 100, "kiwi" to 190)
  val applePrice = menus["apple"]
  println(applePrice) // 100
  val bananaPrice = menus["banana"]
  println(bananaPrice) // null
  ```

- 요소 추가: `[]`
  ```kotlin
  val menus = mutableMapOf("apple" to 100, "kiwi" to 190)
  menus["banana"] = 200
  println(menus) // {apple=100, kiwi=190, banana=200}
  ```

- 요소 삭제: `.remove()`
  ```kotlin
  val menus = mutableMapOf("apple" to 100, "kiwi" to 190)
  menus.remove("apple")
  println(menus) // {kiwi=190}
  ```

- 요소 개수: `.count()`
  ```kotlin
  val menus = mutableMapOf("apple" to 100, "kiwi" to 190)
  val totalCount = menus.count()
  println(totalCount) // 2
  ```

- Key 값 포함 여부: `.containsKey()`
  ```kotlin
  val menus = mutableMapOf("apple" to 100, "kiwi" to 190)
  val isContainsApple = menus.containsKey("apple")
  println(isContainsApple) // true
  ```

- Keys, Values 조회: `.keys`, `.values`
    - `.keys: MutableSet<T>`
    - `.values: MutableCollection<T>`
  ```kotlin
  val menus = mutableMapOf("apple" to 100, "kiwi" to 190)
  println(menus.keys) // [apple, kiwi]
  println(menus.values) // [100, 190]
  ```

## Collection Functions

| Java Stream          | Kotlin                          |
| -------------------- | ------------------------------- |
| `.stream()` 필요       | 바로 사용                           |
| 중간 연산은 lazy          | 기본은 eager, `asSequence()`로 lazy |
| `.forEach(x -> ...)` | `.forEach { ... }               |


# Array

## 2차원 Array

1. Array 생성자 사용
   `val arr = Array(3) { IntArray(4) }` // 3x4 크기의 Int 배열
   `val arr2 = Array(3) { IntArray(4) { -1 } }` // 3x4 크기의 모든 값이 -1로 초기화
   `val arr3 = Array(3) { i -> IntArray(4) { j -> i * 4 + j } }` // 위치에 따른 다른 값 초기화

2. arrayOf 사용
   ```kotlin
   val arr = arrayOf(
       intArrayOf(1, 2, 3),
       intArrayOf(4, 5, 6),
       intArrayOf(7, 8, 9)
   )
   ```

3. 타입별 특화 배열
   ```kotlin
   val intArr = Array(3) { IntArray(4) }
   val doubleArr = Array(3) { DoubleArray(4) }
   val stringArr = Array(3) { Array(4) { "" } }
   val nullableArr = Array<IntArray?>(3) { null }
   ```

# Sort

## `Comparable` Interface 구현하기
`Comparable` Interface를 구현하면 `compareTo()` 메서드를 오버라이딩해야 한다.
반환 타입은 `Int`인데, 양수이면 메서드의 주체가 되는 객체가 더 앞에, 음수이면 파라미터로 전달되는 객체가 더 앞에, 0이면 같은 순서임을 의미한다.

예제 코드
```kotlin
class Version(val major: Int, val minor: Int): Comparable<Version> {
    override fun compareTo(other: Version): Int = when {
        this.major != other.major -> this.major compareTo other.major // compareTo() in the infix form 
        this.minor != other.minor -> this.minor compareTo other.minor
        else -> 0
    }
}

fun main() {    
    println(Version(1, 2) > Version(1, 3)) // false
    println(Version(2, 0) > Version(1, 5)) // true
}
```

## Array 정렬
```kotlin
val arr = arrayOf(3, 1, 4, 1, 5)

arr.sort() // 원본 오름차순 정렬
arr.sortDescending() // 원본 내림차순 정렬

val sorted = arr.sortedArray() // 새 배열 오름차순 정렬
val sortedDesc = arr.sortedArrayDescending() // 새 배열 내림차순 정렬
```

## List 정렬
```kotlin
val list = listOf(3, 1, 4, 1, 5)
val sorted = list.sorted() // 새 리스트 오름차순 정렬
val sortedDesc = list.sortedDescending() // 새 리스트 내림차순 정렬

val mutableList = mutableListOf(3, 1, 4, 1, 5)
mutableList.sort() // MutableList라면 원본 변경 가능
```

## Custom Sorting
이를 위해서는 **`Comparator` 인스턴스를 생성하고, `compare()` 메서드를 구현**한다.
또한, **`sortedWith()` 메서드에 사용자가 정의한 `Comparator`를 전달**한다.
```kotlin
val lengthComparator = Comparator { str1: String, str2: String -> str1.length - str2.length }  
val list = listOf("aaa", "bb", "c")  
val sorted = list.sortedWith(lengthComparator)  
print(sorted) // [c, bb, aaa]
```
`Comparator`를 더 간단하게 정의하는 법은, 표준 라이브러리의 **`compareBy()` 메서드**를 사용하는 것이다.
```kotlin
val list = listOf("aaa", "bb", "c")  
val sorted = list.sortedWith(compareBy { it.length })
print(sorted) // [c, bb, aaa]
```

### `sortedBy()`, `sortedByDescending()`
컬렉션의 필드를 `Comparable` 값으로 매핑하는 선택기 함수를 인자로 받아, 해당 값의 오름차순으로 정렬한다.
```kotlin
data class Person(val name: String, val age: Int)

val people = listOf(Person("A", 30), Person("B", 25))
val sortedByAge = people.sortedBy { it.age } // 나이 기준 오름차순 정렬
val sorted = people.sortedWith(compareBy { it.age })
```

### `thenBy()`
여러 속성을 중첩해서 정렬 기준으로 할 때는 `thenBy()` 메서드를 사용한다.
```kotlin
val list = listOf("aaa", "bb", "c", "b", "a", "aa", "ccc")
val sorted = list.sortedWith(compareBy<String> { it.length }.thenBy { it })
print(sorted) // [a, b, c, aa, bb, aaa, ccc]
```

## Reverse Order
`reversed()` 메서드를 사용하면, 원소의 복사본으로 구성된 순서를 뒤집은 새로운 인스턴스가 반환된다.
```kotlin
val numbers = listOf("one", "two", "three", "four")
val reversed = numbers.reversed()
print(reversed) // [four, three, two, one]
```

`asReversed()` 메서드를 사용하면, 동일한 컬렉션 인스턴스가 반환되지만 원소의 순서만 역순으로 정렬된 결과가 반환된다.
따라서 원본 리스트가 변경되지 않는다면 `reversed()` 보다 최적화 된 동작이 될 수 있다.
특이하게 `asReversed()`의 결과와 원본 컬렉션 인스턴스의 변경 사항 모두 서로에게 동일한 결과를 낳는다.
```kotlin
val numbers = mutableListOf("one", "two", "three", "four")
val reversedNumbers = numbers.asReversed()
println(reversedNumbers)
numbers.add("five")
println(reversedNumbers)
```

# Control flow

- Kotlin에서는 `if` 보다는 `when`을 더 권장한다.
  읽기 쉽고, 분기를 추가하기 쉽고, 실수 발생 가능성이 적기 때문이다.
- Kotlin에는 삼항 연산자가 없다.
  대신 `if`를 람다식처럼 쓸 수 있다.
## if
예제 코드
```kotlin
val d: Int
val check = false

if (check) {
	d = 1
} else {
	d = 2
}

println(d) // 1
```

```kotlin
val a = 1
val b = 2

println("bigger is ${if (a > b) a else b}")
```

## when
- 여러 경우의 분기가 있는 경우 적합하다.
- 각 분기에서 `->` 를 사용하여 각 경우에 해당하는 작업을 작성한다.
- 모든 분기 중, 하나가 충족할 때까지 순차적으로 검사한다. 이후 만족하는 분기만 실행하고 when 절은 종료된다.
    - 그렇다고 `else` 가 필수는 아니다.

- 기본 형태
  ```kotlin
  val obj = "Hello"
  when (obj) {
      "1" -> println("One")
      "Hello" -> println("Greeting")
      else -> println("Unknown")
  }
  ```

- 특정 분기에 여러 조건을 포함하려면 `,` 로 구분지어 함께 작성한다.
  ```kotlin
  val obj = "Hello"
  when (obj) {
      "1", "Hello" -> println("One")
      else -> println("Unknown")
  }
  ```

- 위 예제에서 `obj`가 없어도 `when` 절은 작성 가능하다. 또한, 값을 반환하여 변수에 할당할 수 있다.
  이때는 `else` 가 필수다.
  ```kotlin
  fun main() {
      val trafficLight = "Red"

      val trafficAction = when {
          trafficLight == "Green" -> "Go"
          trafficLight == "Yellow" -> "Slow down"
          trafficLight == "Red" -> "Stop"
          else -> "Malfunction"
      }

      println(trafficAction) // Stop
  }
  ```


# Ranges
- `..` 연산자를 통해 범위를 설정한다. `1..4` 는 `1, 2, 3, 4` 와 동일하다.
- `..<` 연산자는 끝 값을 제외한다. `1..<4` 는 `1, 2, 3` 과 동일하다.
- `downTo` 연산자는 역순으로 설정한다. `4 downTo 1`는 `4, 3, 2, 1`과 동일하다.
- 등비는 `step`을 통해 설정한다. `1..5 step 2` 는 `1, 3, 5`와 동일하다.
- `Char` 타입도 가능하다. `'a'..'d'` 는 `'a', 'b', 'c', 'd'`와 동일하다.
  `'z' downTo 's' step 2` 는 `'z', 'x', 'v', 't'`와 동일하다.

# Loops
- `for` 과 `while`이 있다.

## for
- `in` 키워드 뒤에 Ranges를 작성한다.
```kotlin
for (number in 1..5) {
	println(number)
}
```

- Collections 도 순회 가능하다.
```kotlin
val numbers = [1, 2, 3, 4, 5]
for (number in numbers) {
	println(number)
}
```

## while
```kotlin
var count = 5
while (count > 0) {
	println("count: $count")
	count--
}
```

- `do-while`도 지원한다.
```kotlin
var count = 5
do {
	println("count: $count")
	count--
} while (count > 0)
```

# Funtions
- `fun` 키워드로 함수를 선언한다.
- 각 파라미터는 반드시 타입이 선언되어야 한다.
- 함수 반환 타입은 `()` 뒤에 `:` 와 함께 작성한다.

예제 코드
```kotlin
fun hello(): String {
	return "Hello, world!"
}

fun sum(x: Int, y: Int): Int {
	return x + y
}
```

- 반환 타입이 없는 메서드의 반환 타입은 `Unit` 이다. 명시적으로 작성할 필요는 없다.
  `return` 도 굳이 작성하지 않아도 된다.
  `Unit`은 단 하나의 값(`Unit`)만을 가지는 유형이다.
  ```kotlin
  fun printMessage(message: String) {
      println(message)
  }
  ```

## Named Arguments
- 함수를 호출할 때 매개변수 이름을 포함하는 것이다.
- 코드를 더 쉽게 파악할 수 있게 돕는다.
- 이름을 포함하면 메서드 시그니처의 매개변수 순서를 지키지 않아도 된다.

예제 코드
```kotlin
fun printMessageWithPrefix(message: String, prefix: String) {
	println("[$prefix] $message)
}

fun main() {
	printMessageWithPrefix(prefix = "Log", message = "Hello") // [Log] Hello
}
```

## Default Parameter Values
- 메서드 파라미터에 기본값을 설정할 수 있다.
- 해당 파라미터로 값이 전달되지 않으면, 설정한 기본값이 할당된다.

예제 코드
```kotlin
fun printMessageWithPrefix(message: String, prefix: String = "Info") {
    println("[$prefix] $message")
}

fun main() {
    printMessageWithPrefix("Hello", "Log") // [Log] Hello
    printMessageWithPrefix("Hello") // [Info] Hello
}
```

## Single-Expression Functions
- 단일 람다식 함수로 작성할 수 있다.
  이 경우, Kotlin이 반환 타입을 추론한다. 물론 명시적으로 반환 타입을 작성할 수 있다.
  ```kotlin
  fun sum(x: Int, y: Int): Int {
      return x + y
  }

  fun sum(x: Int, y: Int) = x + y
  fun sum(x: Int, y: Int): Int = x + y
  ```

## Lambda Expressions
- 람다식을 작성할 수 있다.
- 람다식 파라미터에 타입을 반드시 작성해야 한다.
- 람다식 본문에 `{}` 를 통해 여러 코드를 실행할 수 있다.
  ```kotlin
  // 람다식 X
  val text = "hello"
  fun toUpperCase(value: String): String {
      return value.uppercase()
  }

  // 람다식 O
  val text = "hello"  
  val upperCased = { text: String -> text.uppercase() }  
  println(upperCased(text))
  ```

- 람다식에 파라미터가 없는 경우 `->` 를 작성하지 않고 바로 본문을 작성하면 된다.
  ```kotlin
  val print = { println("Log Message") }  
  print()
  ```

- 람다식을 다양한 방법으로 사용할 수 있다.
    - Pass to another function
        - 가장 좋은 예시는 Collections의 `.filter()` 이다.
          `.filter()` 메서드는 람다식을 파라미터로 전달 받는다.
          ```kotlin
          val numbers = listOf(1, -2, 3, -4, 5, -6)
          val positives = numbers.filter( { x -> x > 0 } ) // 바로 전달

          val isNegative = { x: Int -> x < 0 } // 함수 타입의 변수 선언
          val negatives = numbers.filter(isNegative) // 변수 전달

          println(positives) // [1, 3, 5]
          println(negatives) // [-2, -4, -6]
           ```
        - 람다식이 유일한 인자인 경우 `()` 없이 전달할 수 있다.
          이를 *trailing lambda* 라고 한다.
          `val positives = numbers.filter { x -> x > 0 }`
        - `.map()` 도 똑같이 적용 가능하다.
          ```kotlin
          val numbers = listOf(1, -2, 3, -4, 5, -6)
          val doubled = numbers.map { x -> x * 2 }
          println(doubled) // [2, -4, 6, -8, 10, -12]
            ```
    - Return from a function
        - 메서드의 반환 타입이 될 수 있다.
          아래 예제 코드의 경우 `toSeconds()` 메서드의 반환 타입은 `(Int) -> Int` 형식의 람다식이다.
          ```kotlin
          fun main() {  
              val timesInMinutes = listOf(2, 10, 15, 1)  
              val min2sec = toSeconds("minute")  
              val totalTimeInSeconds = timesInMinutes.map(min2sec).sum()  
              println("Total time is $totalTimeInSeconds secs") // Total time is 1680 secs
          }  
            
          fun toSeconds(time: String): (Int) -> Int = when (time) {  
              "hour" -> { value -> value * 60 * 60 }  
              "minute" -> { value -> value * 60 }  
              "second" -> { value -> value }  
              else -> { value -> value }  
          }
          ```
    - Invoke Separately
        - 람다식은 `{}` 뒤에 `()`를 추가하고, `()` 안에 인자를 전달함으로써 선언과 동시에 호출이 가능하다.
          ```kotlin
          val result = { text: String -> text.uppercase() }("hello")
          println(result)
          ```

- 람다식에 타입을 지정할 수 있다.
  변수명 뒤에 `:` 를 작성하고, `()` 안에 파라미터의 타입을 `,`로 구분하여 작성한다.
  반환 타입은 `->` 뒤에 작성한다.
  ```kotlin
	val toUpperCase: (String) -> String = { value -> value.uppercase() }
	```
    - 매개변수가 없다면 `()` 는 비어둔다.
      ```kotlin
        val printHello: () -> Unit = { println("Hello") }  
        val printWorld = { println("World") }  
        printHello() // Hello
        printWorld() // World
        ```

- Trailing Lambdas
    - 람다식을 메서드 인자로 전달할 때, `()` 밖으로 배치할 수 있는 문법이다.
    - 람다식이 유일한 인자이거나, 마지막 인자인 경우 가능하다.
  ```kotlin
  list.filter({ it > 0 }) // 일반 방식
  list.filter { it > 0 } // Trailing Lambdas 적용

  list.fold(0, { sum, element -> sum + element }) // 일반 방식
  list.fold(0) { sum, element -> sum + element } // Trailing Lambdas 적용
  ```


# Classes

https://kotlinlang.org/docs/kotlin-tour-classes.html#compare-instances
