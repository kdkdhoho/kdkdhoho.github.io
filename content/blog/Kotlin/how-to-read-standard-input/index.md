---
title: "[Kotlin] 표준 입력 읽는 방법"
description: "readln() 함수를 사용하여 표준 입력을 읽는 방법에 대해"
date: 2025-08-03
tags: ["Kotlin"]
slug: "how-to-read-standard-input"
---

Kotlin에서 표준 입력을 받기 위해선 `readln()` 함수를 사용하면 된다.  
Kotlin 내장 함수이기에 별도로 `import` 할 필요는 없다.

`readln()` 함수의 반호나 타입은 `String` 이다.  
따라서 `.toInt()`, `.toDouble()` 등의 형변환 메서드를 통해 손쉽게 형변환이 가능하다.  
또한 `split()` 메서드를 통해 바로 문자열을 분리할 수도 있다.  
만약 `toInt()` 메서드를 사용해 형변환을 시도했지만, 입력값이 숫자가 아닌 경우 예외가 발생한다.  
이때 예외를 발생하지 않고 처리할 수 있는 방법이 있는데, `toIntOrNull()`를 사용하면 된다.  
메서드 이름처럼 입력값이 숫자가 아닌 경우, `null`을 반환한다. 

`split()`과 형변환 메서드를 한 줄에 작성할 수도 있다.  
`readln().split(" ").map { it.toInt() }`

`readln()` 함수는 느리다.  
`BufferedReader(InputStreamReader(System.`in`))`를 사용하면 더 빠르게 입력을 받을 수 있다.
