---
title: "Python Syntax, 각종 라이브러리"
description: "Python Syntax와 각종 라이브러리에 대한 학습을 기록했습니다."
date: 2026-02-25
tags: ["Python"]
slug: "python-syntax"
---

# 표준 입출력
파이썬은 유닉스 계열 운영체제의 전통을 따라 표준 입력, 표준 출력, 표준 에러 스트림으로 구분된다.  
이 스트림들은 `sys` 모듈 내에 객체 형태로 정의되어 있다.

## sys 모듈과 표준 스트림
파이썬에서 표준 입출력을 직접 제어하기 위해서는 `sys` 모듈에 명시된 `sys.stdin`, `sys.stdout`, `sys.stderr` 객체를 이용하면 된다.  
이 객체들은 텍스트 IO를 위한 파일 객체와 유사하게 동작한다.

`sys.stdin`은 파이썬 프로그램이 사용자나 다른 프로세스로부터 데이터를 읽어오는 입력 스트림이다.  
`sys.stdout`은 파이썬 프로그램의 실행 결과나 일반적인 메시지를 출력하는 스트림이다.  

## 고수준 함수 `input()`과 `print()`의 동작 원리
파이썬에는 `sys.stdin`과 `sys.stdout`을 추상화 해놓은 함수가 있다.  
바로 `input()`과 `print()` 이다.

[파이썬 내장 함수 명세](https://docs.python.org/ko/3.13/library/functions.html)에 따르면, `print()` 함수는 인자로 받은 객체들을 문자열로 변환한 뒤 지정된 파일 스트림에 기록한다. 기본값으로 `sys.stdout`이 설정되어 있지만, file 매개변수를 통해 출력 대상을 변경할 수도 있다.  
`print()` 함수가 호출되면 **데이터는 스트림 버퍼에 저장**되어있다가 특정 조건이 충족되면 실제 출력 장치로 전달된다.  
만약 `print()` 함수에 여러 인자를 전달하면, 파이썬은 각 인자들을 공백을 구분자로 하여 출력한다. 

반면 `input()` 함수는 `sys.stdin`에서 한 줄을 읽은 뒤, 끝의 줄바꿈 문자를 제거하여 문자열로 반환한다.  
만약 입력 스트림의 끝에 도달하면 EOFError를 발생하는데, 이는 스트림 기반 입출력의 기본적인 처리 방식이다. (참고: [geeksforgeeks - Handling EOFError Exception in Python](https://www.geeksforgeeks.org/python/handling-eoferror-exception-in-python/))

## `input()` vs `sys.stdin.readline`
`input()`은 파이썬 내장 함수로, 편의성에 초점이 맞춰져 있다.  
추상화된 기능으로는 다음과 같다.  
- 입력받기 전 화면에 출력할 안내 메시지(prompt)를 인자로 받을 수 있다.
- 입력한 문자열에서 끝에 개행 문자(`\n`)를 자동으로 제거하여 반환한다.
- 매번 호출될 때마다 개행 문자를 확인하고 제거하는 과정을 거치므로 `sys.stdin.readline`에 비해 느리다.

`sys.stdin.readline`은 `sys` 모듈에 정의된 메서드이다.  
특징으로는 다음과 같다.  
- 안내 메시지를 출력하는 기능이 없으며, 단순히 버퍼에서 한 줄을 읽어온다.
- 개행 문자를 포함한 상태로 문자열을 반환한다. 따라서 공백 제거가 필요한 경우 `strip()` 사용이 필요하다.
- `input()`보다 훨씬 빠르다. 대량의 데이터를 반복적으로 입력받아야 하는 경우 적합하다.

함수 앨리어싱(Function Aliasing)을 통해 `input()` 메서드를 사용하는 것처럼 사용할 수 있다.  
파이썬에서는 **모든 것이 객체**이다. 즉, 메서드인 `sys.stdin.readline`의 객체 주소값이 `input` 이라는 변수에 할당된다. 이후 `input()`을 호춣하면 `sys.stdin.readline` 메서드가 호출되는 구조다.  
```python
import sys
input = sys.stdin.readline
data = input()
```

# 문자열(String)

## 특징
파이썬에서 문자열은 불변 객체이다.

## `input()`과 함께 쓰기 좋은 `.strip()` 메서드
`.strip()` 메서드는 파이썬 문자열 클래스인, `str`에 정의되어 있다.  
이 메서드는 문자열의 시작과 끝 부분에 존재하는 연속된 화이트스페이스(whitespace) 문자를 모두 제거한다.

> 화이트스페이스?  
> 공백(space), 탭(\t), 줄바꿈(\n), 복귀(\r) 등

메서드 파라미터에 아무런 인자를 전달하지 않을 경우 기본적으로 모든 종류의 화이트스페이스를 제거한다.  
인자를 전달할 경우, 전달된 문자열을 set으로 처리하고, 문자열에 포함된 각각의 문자에 대해서 제거 대상으로 인식한다.

## `input()`과 함께 쓰기 좋은 `.split()` 메서드
`.split()` 메서드는 파이썬 문자열 클래스인, `str`에 정의되어 있다.  
이 메서드는 하나의 문자열을 특정 구분자를 기준으로 분리하여, 부분 문자열 리스트를 반환하는 메서드이다.

`sep` 매개변수에 **아무런 인자를 전달하지 않으면, 모든 화이트스페이스(whitespace)를 구분자로 간주**한다.  
만약 문자열이 `a b c`인 경우, `['a', 'b', 'c']`가 반환된다.

만약 인자가 전달되는 경우, 해당 구분자가 나타나는 모든 위치를 기준으로 분리한다.  
만약 문자열이 `a, b, c`이면서 인자가 `, ` 인 경우에, `['a', 'b', 'c']`가 반환된다.

## f-string (Literal String Interpolation)
파이썬에서는 _f-string_ 이라는 특수한 Syntax가 지원된다. (버전 3.6부터)  
f-string은 문자열 리터럴 앞에 `f` 또는 `F` 접두사를 붙여 정의하며, 문자열 내부에 중괄호 안에 파이썬 표현식을 삽입한다.  
예시: `print(f'a={a}')`

코드 내의 `{a}` 부분은 런타임에 평가되어 변수 a가 참조하고 있는 객체의 문자열 표현으로 치환된다.

% 연산 방식이나 `str.format()` 메서드에 비해, f-string은 문자열과 변수를 직관적으로 배치할 수 있어 가독성이 뛰어나다.  
뿐만 아니라 단순한 함수 호출보다 성능상 이점이 있다고 한다. 이유는, 컴파일 단계에서 최적화된 바이트코드로 변환되어 처리되기 때문이다.

파이썬 커뮤니티에서 가장 권장되는 현대적인 출력 방식이다.

공식 명세 링크: [f-strings - Python 3.6 documentation](https://peps.python.org/pep-0498/)

## `islower()`, `isupper()`
대소문자를 판별하는 대표적인 메서드이다.  
문자열 객체의 모든 케이스가 각각 소문자인지 혹은 대문자인지 검사하여 Boolean 값으로 반환한다.

## `lower()`, `upper()`
파이썬의 문자열 클래스(str)에는 대소문자 변환을 위한 메서드가 존재한다.  
바로 `lower()`, `upper()` 이다.

`lower()`은 문자열 내의 모든 대문자를 소문자로, `upper()`은 모든 소문자를 대문자로 변환하여 새로운 문자열을 반환한다.

```python
name = 'John'
result_lower = name.lower()
result_upper = name.upper()
print(result_lower) # 결과: john
print(result_upper) # 결과: JOHN
```

## `join()`
리스트처럼 선형 자료구조(리스트 등) 내의 문자열 요소를 하나로 합치는 가장 공식적으로 효율적인 방법으로, `str.join(interable)` 메서드가 있다.  
이 메서드는 구분자로 사용할 문자열 객체에서 호출되며, 하나로 합치고자 하는 변수를 인자로 전달한다.

```python
list = ['a', 'p', 'p', 'l', 'e']
result = ''.join(list)
print(result) # 결과: apple

result2 = ', '.join(list)
print(result2) # 결과: a, p, p, l, e 
```

만약 인자로 전달되는 변수 내의 모든 요소는 반드시 문자열 타입이어야 한다. 그렇지 않으면 TypeError가 발생한다.  
만약 숫자형 요소가 저장된 변수라면 `map(str, list)` 메서드를 활용하여 모든 요소를 문자열 타입으로 변환하고, `.join(list)`를 호출하는 방식으로 해결할 수 있다.

성능 측면에서 반복적인 `+` 연산자를 통한 결합보다 압도적으로 유리하다.  
파이썬의 문자열 객체은 불변 객체이기 때문에, 리스트를 순회하면서 `+`로 문자열이 결합될 때마다 매번 새로운 객체가 생성되어 메모리 공간을 할당해야 하기 때문이다.  
반면 `join()` 메서드는 결합을 시작하기 전, iterable을 한 번 순회하여 결과 문자열의 총 길이를 미리 계산한다.  
그리고 그만큼의 메모리 공간을 한 번만 할당하기 때문에 훨씬 효율적이다.

## `startswith()`, `endswith()`
대상 문자열이 특정 접두사(prefix)로 시작하는지? 그리고 특정 접미사(suffix)로 끝나는지를 확인하는 메서드이다.  
대소문자를 구분하여 정확히 일치할 때만 True를 반환한다.  
따라서 대소문자 구분 없이 검색해야 할 때는, 대상 문자열과 검색 문자열을 `lower()`이나 `upper()`로 같은 케이스로 맞추고 검색해야 한다.

```python
text = "Python Programming is fun"

print(text.startswith("Python"))  # 출력: True
print(text.startswith("python"))  # 출력: False

---

filename = "document.pdf"

# 확장자 확인
if filename.endswith(".pdf"):
    print("이 파일은 PDF 문서입니다.")
```

### 튜플을 이용한 다중 접사 검사
심지어 두 메서드에는 튜플(Tuple)을 전달할 수도 있는데, 인자로 튜플을 전달하면 해당 튜플에 포함된 요소 중 하나라도 일치할 경우 True를 반환한다.  
```python
image_files = ["cat.jpg", "dog.png", "report.docx"]
for file in image_files:
    if file.endswith((".jpg", ".jpeg", ".png", ".gif")):
        print(f"이미지 파일 발견: {file}")
```

### 검색 범위 지정 매개변수(start, end)
`startswith()`와 `endswith()` 메서드는 검색 범위를 제한할 수 있는 매개변수인 start와 end를 지원한다.  
필수값은 아니며, 슬라이싱과 동일하게 반개방 원칙을 적용한다.

```python
message = "Hello, Python developers"

# 인덱스 7부터 모든 문자열을 추출하여 "Python" 으로 시작하는지 확인
print(message.startswith("Python", 7)) # 결과: True

# 인덱스 0부터 4까지 문자를 추출하여 "Hello"로 끝나는지 확인
print(message.endswith("Hello", 0, 5)) # 결과: True
```

## `replace()`
str 클래스에는 문자열 내부에 특정 문구나 패턴을 다른 문구로 교체하는 `replace(old, new[, count])` 메서드를 제공한다.  
대상 문자열에서 발견되는 모든 `old` 부분 문자열을 `new`로 치환한 복사본을 반환한다.

이 메서드를 사용할 때 가장 유의해야 할 점은 **문자열의 불변성**이다.  
`replace()` 메서드는 원본 문자열을 직접 수정하는 것이 아니라, 치환 작업이 완료된 새로운 문자열 객체를 생성하여 메모리에 할당한다.  
만약 원본 변수의 내용을 바꾸고 싶다면 변수에 결과값을 다시 대입해야 한다.

세 번째 선택적 파라미터인 `count`를 통해 치환할 횟수를 지정할 수 있다.  
예를 들어 `text.replace(" ", "", 2)` 코드는 `text` 변수 내 공백 중에서 앞에서부터 2개까지만 빈 문자열로 변경된다.

대소문자를 엄격하게 구분한다.

## `index(x, [start, end])`, `rindex(x, [start, end])`
### `index(x, [start, end])`
해당 리스트 내에 있는 요소 중, x 파라미터에 전달된 요소와 일치하는 값의 가장 앞의 인덱스를 반환한다.  
이때 `[start, end]` 파라미터에 인자를 선택적으로 전달하여, 특정 범위 내에서 조회가 가능하다.

```python
fruits = ['apple', 'banana', 'cherry', 'banana']
index_of_banana = fruits.index('banana')
print(index_of_banana) # 결과: 1

second_banana_index = fruits.index('banana', 2)
print(second_banana_index) # 결과: 3
```

만약, 찾으려는 요소가 리스트에 존재하지 않으면 ValueError가 발생한다. 따라서 안전한 코드를 작성하려면 예외처리를 반드시 해야 한다.

```python
try:
    result = fruits.index('orange')
except ValueError:
    print("리스트에 해당 값이 존재하지 않습니다.")
```

`index()` 메서드의 시간 복잡도는 O(N)이다.

### `rindex(x, [start, end])`
`rindex()`는 `index()`와 방향이 반대인 메서드이다.  
즉, 문자열에서 특정 부분 문자열이 나타나는 가장 오른쪽 인덱스를 반환하는 메서드이다.

```python
text = "banana"
last_a = text.rindex("a")
print(last_a) # 출력: 5

text2 = "AbCdEFG"
last_dE = text2.rindex("dE")
```

`rindex()` 메서드 역시 `start`와 `end` 매개변수를 통해 탐색 범위를 제한할 수 있다.

`rindex()`는 `index()`와 똑같이, 특정 문자열을 찾지 못하면 ValueError를 뱉는다.

## `find(sub[, start[, end]])`와 `rfind(sub[, start[, end]])`
`find()`와 `rfind()` 는 문자열 내에서 특정 부분 문자열(sub)이 처음으로 나타내는 인덱스를 반환한다.  
`find()`는 인덱스 0부터 마지막 인덱스까지 탐색을 시작하고, `rfind()`는 마지막 인덱스부터 0까지 탐색한다.

`index()`, `rindex()`와 가장 큰 차이는 부분 문자열이 존재하지 않을 경우 예외를 뱉지 않고 -1을 반환한다는 점이다.

## `isspace()`
str 객체가 지원하는 `isspace()` 함수는 문자열 내의 모든 문자가 공백 문자이고, 적어도 하나 이상의 문자가 존재할 때 True 를 반환한다.
여기서 공백 문자란, 유니코드 문자 상에서 공백으로 분류된 문자나 탭(\t), 줄바꿈(\n), 캐리지 리턴(\r) 등을 포함한다.

```python
text1 = "   "
text2 = "\t\n"
text3 = "  a  "
text4 = ""

print(text1.isspace()) # 출력: True
print(text2.isspace()) # 출력: True
print(text3.isspace()) # 출력: False
print(test4.isspace()) # 출력: False
```

## 문자열의 시퀀스 자료형
파이썬에서 문자열은 시퀀스 자료형으로 분류된다.  
시퀀스 자료형이란, 정수를 인덱스로 사용하여 효율적으로 원소에 접근할 수 있는 유한한 길이의 순서가 있는 집합을 의미한다.  
구체적으로 파이썬에서는 유니코드 코드 포인트들의 불변 시퀀스로 정의되어 있어, 리스트나 튜플과 같은 유사한 구조적 특징을 공유한다.

### 문자열의 간접 순회
반복문(for)과 `range()` 객체를 이용하여 문자열 시퀀스를 순회할 수 있다.

```python
str = 'hello'
for i in range(0, len(str)):
    print(str[i])
```

### 문자열의 직접 순회
정수 인덱스를 통한 순회가 아닌, 각 문자에 대해서도 순회할 수 있다.  
이는 파이썬의 Iterable Protocol과 관련이 있는데 **모든 시퀀스 자료형은 Iterable 객체**이다.  
즉, `for char in str:` 과 같은 구문으로 문자열 내부의 각 문자를 직접 하나씩 꺼내올 수 있다.

```python
str = 'hello'
for char in str:
    print(char)
```

## 문자열 자르기
파이썬에서 문자열을 자르는 방법은 인덱스를 활용한 슬라이싱 방법과 특정 구분자를 기준으로 나누는 방식으로 나뉜다.

### 슬라이싱
슬라이싱은 파이썬에서 **시퀀스 자료형**이 제공하는 방법이다.  
대괄호 안에 시작 인덱스, 끝 인덱스, 보폭(step)을 지정하는 `[start:stop:step]` 구문을 사용하여, 문자열의 일부를 추출한다.  
이때 시작 인덱스는 포함하지만, 끝 인덱스는 포함하지 않는 반개방 구간 원칙을 따른다. 예를 들어 `s[0:5]` 라고 하면, 0부터 4까지 인덱스에 해당하는 문자열이 반환된다.

특정 인덱스부터 나머지를 모두 포함해서 자르고 싶다면, `s[3:]` 처럼 시작 인덱스만 작성하면 된다.  
이는 인덱스가 3인 위치부터 뒤에 있는 모든 문자열을 포함해서 반환한다.  
이를 응용하여 `s[:-n]` 구문을 활용한다면, 문자열의 뒤에서부터 n개의 문자를 제거한 문자열이 반환된다.  

```python
name = 'Peter Parker'
last = name[0:5] # Peter
fisrt = name[6:] # Parker
```

또한 `[::-1]` 을 활용하면, 리스트를 역순으로 쉽게 뒤집을 수 있다.  
이는 시퀀스의 모든 원소를 역순으로 정렬한 새로운 리스트 객체를 반환한다.

`[::n]`의 경우, 리스트의 처음부터 끝까지 순회하면서 보폭은 n으로 추출한 결과가 반환된다.

## 문자에서 유니코드로 (`ord()`), 유니코드에서 문자로 (`chr()`)
특정 문자의 유니코드 값을 구하는 방법은 파이썬 내장 함수 중 하나인, `ord()`를 사용하면 된다. (참고로 서수를 뜻하는 "ordinary"의 약어이다.)  
그 반대의 경우에는 마찬가지로 파이썬의 내장 함수 중 하나인, `chr()`를 사용하면 된다.

```python
ch = 'a'
print(ord(ch)) # 결과: 97

code = 97
print(chr(code)) # 결과: a
```

## `in` 연산자로 부분 문자열 판별하기 
Python에서 `in` 연산자를 이용하면 임의의 문자열이 특정 문자열의 부분 문자열인지 쉽게 판별 가능하다.  
왼쪽 피연산자가 우측 피연산자의 부분 문자열인 경우 `Ture`를, 그렇지 않으면 `False`를 반환한다.

```python
str_a = "banana"
str_b = "ana"
print(str_b in str_a) # 결과: True
```

# 형변환

## 문자열 -> int
기본적으로 내장 함수인 `int()` 메서드를 사용한다.

예제 코드
```python
a = '10'
print(int(a))
```

# 함수

```python
def
```

# `range()`
파이썬에서 `range()`는 숫자들의 **불변 시퀀스**를 표현하는 내장 타입이다.  
주로 for 루프에서 특정 횟수만큼 반복할 때 사용되지만, 리스트나 튜플처럼 인덱싱, 슬라이싱, 멤버십 테스트를 지원하는 완전한 시퀀스 자료형으로 분류된다.  
호출 시점에 모든 숫자를 메모리에 생성하여 저장하는 것이 아니라, 필요한 시점에 값을 계산하여 반환하는 특징을 가진다.

`range()`는 인수의 개수에 따라 두 가지 형태로 호출할 수 있다.

첫 번째는, `range(stop)`이다.  
0부터 시작하여 stop 직전까지 1씩 증가하는 정수 시퀀스를 생성한다. (예: `range(5)` = [0, 1, 2, 3, 4])

두 번째는, `range(start, stop, [step])`이다.  
start부터 시작하여 step 크기만큼 증가하며 stop-1 까지의 시퀀스를 생성한다. (예: `range(1, 10, 2)` = [1, 3, 5, 7, 9])  
모든 인수는 정수여야 하며, step이 0일 경우 ValueError가 발생한다. 

## 메모리 효율성과 지연 평가 매커니즘
`range()` 객체의 가장 핵심적인 기술은 메모리 효율성이다.  
[파이썬 공식 문서](https://www.google.com/search?q=https://docs.python.org/3/library/stdtypes.html%23range)에서는 `range`가 시퀀스의 크기에 상관없이 항상 일정한 크기의 작은 메모리 공간을 점유한다고 설명한다.  
이는 전체 시퀀스 데이터를 실제로 저장하는 대신, 오직 start, stop, step 값만을 저장하고 값이 요청될 때마다 산술 연산을 통해 해당 요소를 계산하기 때문이다.  
이러한 방식을 지연 평가(Lazy Evaluation)이라고 하며, 수백만 개의 숫자를 포함하는 범위를 다루더라도 리스트와 달리 메모리 부족 현상을 유발하지 않는다.

## 시퀀스 연산의 최적화
`range()`는 단순한 제너레이터가 아니다. 인덱싱과 멤버십 테스트에서 최적화된 성능을 제공한다.  
내부적으로 `getitem` 메서드를 구현하고 있어, O(1)의 시간 복잡도로 특정 요소에 접근할 수 있으며, `in` 연산 역시 매우 효율적이다.  
파이썬 인터프리터는 시퀀스를 처음부터 끝까지 순회하며 숫자를 찾는 대신, 입력된 값이 start, stop, step의 수학적 경계 내에 존재하는지 산술적으로 계산하여 즉시 결과를 반환하기 때문이다.

# `sum()`
파이썬 내장함수인 `sum(iterable, [start=0])`은 인자로 전달된 Iterable 객체(리스트, 튜플, 집합)의 요소들을 왼쪽에서 오른쪽으로 합산한 총합을 반환한다.

두 번째 인자인 start는 합산 결과에 더해질 초기값을 지정하는 역할을 하며, 기본값은 0으로 설정되어 있다. Optional 한 파라미터이다.

만약 리스트 내 요소들이 부동소수점 데이터라면, 오차를 방지하기 위해 `math` 모듈에서 `fsum()` 함수를 별도로 지원한다.

# `enumerated()`
내장 함수인 `enumerated(iterable, start=0)`는 Iterable 객체를 인자로 전달받아, 인덱스와 해당 요소를 포함하는 튜플을 반환하는 Iterator 를 생성한다.  
이를 for loop 에 활용하면, 인덱스와 해당 인덱스의 요소 값을 하나의 튜플 형태로 사용할 수 있다. 

```python
fruits = ['apple', 'banana', 'cherry']
for i, fruit in enumerate(fruits):
    print(f"인덱스 {i}의 과일은 {fruit}다.")
```

두 번째 파라미터인 `start`에 정수값을 전달하여 시작 번호를 0이 아닌 위치부터 순회하도록 할 수 있다.

# `filter(function, iterable)`
Python의 내장 함수인 `filter(function, iterable)` 함수는 iterable 객체의 각 요소에 대해 특정 조건의 함수(function)을 적용하여, 그 결과가 True인 요소들만 골라내는 함수이다.

function이 `None`이 아닌 경우, `(item for item in iterable if function(item))` 과 동일한 역할을 하는 iterator를 반환한다.  
만약 `None`인 경우, 다음과 같은 요소들을 필터링한다.
- 빈 문자열: `""`
- 숫자 0: `0`, `0.0`
- 빈 컨테이너: `[]`, `{}`, `()`
- 기타: `None`, `False`

```python
def is_even(n):
    return n & 1 == 0
numbers = [1, 2, 3, 4, 5, 6]
result = filter(is_even, numbers)
print(list(result))  # 출력: [2, 4, 6]

data = ["a", "", "b", None, "c", False]
result = list(filter(None, data))
print(result)  # 출력: ['a', 'b', 'c']
```

# `map(function, iterable, *iterables)`
Python의 `map(function, iterable, *iterables)` 함수는 iterable 파라미터에 Iterable 객체를 인자로 전달하면, 모든 요소에 function을 적용한 결과인 새로운 Iterator를 반환한다.

`map()`은 결과를 즉시 리스트로 반환하지 않고, map 객체라는 Iterator를 반환한다. 데이터를 메모리에 미리 다 올려두지 않고, 필요할 때마다 하나씩 생성하여 전달하는 지연 평가(Lazy Evaluation) 방식을 사용하기 때문에 메모리 효율성을 높여주며, 결과가 필요할 때 `list()`나 for문을 통해 구체화 할 수 있다.

`map()`은 두 개 이상의 리스트를 인자로 전달받을 수 있다. 이때 전달된 function은 각 리스트에서 하나씩 꺼낸 값을 인자로 받으며, 가장 짧은 리스트의 길이가 끝나면 반복이 종료된다.

```python
str_numbers = ["1", "2", "3"]
int_numbers = list(map(int, str_numbers)) # 결과: [1, 2, 3] 

numbers = [1, 2, 3, 4]
squared = list(map(lambda x: x**2, numbers)) # 결과: [1, 4, 9, 16]

list1 = [1, 2, 3]
list2 = [10, 20, 30]
sums = list(map(lambda x, y: x + y, list1, list2)) # 결과: [11, 22, 33]
```

Python 창시자인 귀도 반 로섬을 비롯한 많은 개발자들은 단순한 연산의 경우 `map()`보다 리스트 컴프리헨션을 사용하는 것을 권장한다.  
별도의 lambda를 선언할 필요가 없어 읽기 쉽고, 성능 면에서도 미세하게 유리한 경우가 많다.

# 리스트(List)

## 리스트를 큐로 사용하기
리스트를 큐로도 사용할 수 있다. 하지만 이는 권장되지 않는다.  
리스트의 끝에 덧붙이거나, 끝에서 꺼내는 것은 빠르지만, 리스트의 머리(0번 인덱스)에 덧붙이거나 머리에서 꺼내는 것은 느리다. 다른 요소들을 모두 한 칸씩 이동시켜야 하기 때문이다.

대신 `collections.deque`를 사용할 것을 권장한다.

## 리스트끼리 `+` 연산
Python에서 두 리스트에 `+` 연산을 적용하면 두 리스트를 결합하여 새로운 리스트를 반환한다.

```python
# case1
[0] + [list(map(int, input().strip().split())) for _ in range(n)]

# case2
board = [[0] * (m + 1)]
for _ in range(n):
    row = [0] + [list(map(int, input().strip().split()))]
    board.append(row)

# case3
board = [[0]*(m+1)] + [[list(map(int, input().strip().split()))] for _ in range(r)]
```

### `extend()`
`list.extend(list2)`는 대상 list에 인자로 전달된 리스트(_list2_)를 하나씩 추가한다.  
즉, 새로운 리스트를 생성하는 것이 아닌 기존 리스트의 값을 추가하므로 메모리를 절약할 수 있는 방법이다.

## 리스트 컴프리헨션
Iterable 객체를 바탕으로 새로운 리스트를 생성할 때 사용하는 구문이다.  
기본 구조는 대괄호 내부에 결과값으로 산출될 표현식을 가장 먼저 배치하고, 그 뒤에 최소 하나 이상의 for 절과 필요한 경우 if 절을 덧붙이는 형태이다.

```python
squares = [x**2 for x in range(5)]
print(squares) # [0, 1, 4, 9, 16]`
```

리스트 컴프리헨션은 내부적으로 최적화된 바이트코드를 생성하여 작동한다. 덕분에 일반적인 for 루프를 돌며 리스트의 `append()` 메서드를 매번 호출하는 방식보다 실행 속도가 빠르다.

또한, 파이썬 3 이후의 리스트 컴프리헨션은 내부에서 사용되는 루프 변수(예: `i`)가 컴프리헨션 내부의 로컬 스코프에만 고립되도록 설계되어 있다. 

### 2차원 리스트 객체 생성
2차원 리스트를 선언할 때도 리스트 컴프리헨션을 사용한다.

```python
arr = [[0] * m for _ in range(n)]
```

## 리스트 정렬
리스트를 정렬하는 방법에는 크게 두 가지가 있다.

1. 리스트 객체 자체의 내용을 변경하는 `list.sort([reverse=False])`
- 리스트를 제자리에서 정렬하여 메모리를 절약하며, 반환 값은 `None`이다.
- 내림차순 정렬을 하려면 `reverse` 네임드 파라미터에 `True` 를 전달한다.

2. 정렬된 새로운 리스트를 반환하는 내장함수 `sorted()`
- 인자로 전달된 Iterable 객체를 변경하지 않고, **새로운 리스트를 반환**하므로 원본 데이터를 유지해야 하는 경우에 적합하다.

파이썬의 정렬 알고리즘은 [Tim Sort 알고리즘](https://d2.naver.com/helloworld/0315536)을 적용한다.  
참고로 Tim Sort 알고리즘의 시간 복잡도는 O(NlogN) 이다.

기본적인 사전순 정렬은 대문자가 소문자를 앞서는 방식으로 진행된다. 이는 유니코드 표에서 대문자가 소문자보다 작은 값을 가지기 때문이다.  
만약 대소문자를 구분하지 않고 정렬하고 싶다면, `key` 매개변수를 활용해야 한다.  
`list.sort()`와 `sorted()`는 모두 _key_ 매개변수를 가지는데, 이는 값을 비교하기 전에 각 리스트 요소에 대해 호출할 함수를 지정한다.  

_key_ 매개변수는 단일 인자를 취하고 정렬 목적으로 사용할 키를 반환하는 함수(또는 Callable)여야 한다.  
_key_ 함수가 각 입력 레코드에 대해 정확히 한 번 호출되기 때문에 속도가 빠르다.  
사용에 유의해야 할 점은, _key_ 매개변수는 매개변수의 위치에 기반하여 인자를 전달하는 Positional Argument가 아니다. 매개변수의 이름을 명시해서 `=` 연산자로 인자를 전달해야 하는 **Keyword Argument**이다. 

```python
student_tuples = [
    ('john', 'A', 15),
    ('jane', 'B', 12),
    ('dave', 'B', 10),
]
result = sorted(student_tuples, key=lambda student: -student[2]) # 2번 인덱스 값을 역순으로 정렬한다.
print(result) # 결과: [('john', 'A', 15), ('jane', 'B', 12), ('dave', 'B', 10)]
```

## 리스트 복사
### 1차원 리스트
1차원 리스트를 복사하는 방법으로는 다음과 같다.

- 슬라이싱 활용: `copied = origin[:]`
- `list()` 생성자 활용: `copied = list(origin)`
- `copy()` 메서드 활용: `copied = origin.copy()`

다만 모두 **얕은 복사** 방법이다. 리스트의 각 요소도 새로운 객체로 복사하는 **깊은 복사**를 수행하려면 `copy` 모듈의 `deepcopy()` 메서드를 사용한다.

```python
import copy

copied = copy.deepcopy(origin) 
```

### 2차원 리스트 복사

```python
origin = [
    [1, 2, 3],
    [4, 5, 6]
]
```

위와 같은 2차원 리스트의 경우, 단순히 리스트 슬라이싱(`copied = origin[:]`)으로 복사하는 건 위험하다.
각 행에 해당하는 리스트 요소들의 주소값이 그대로 복사되기 때문에, 참조 오염이 발생할 수 있기 때문이다.

따라서 2차원 리스트는 다음과 같은 방법으로 복사한다.

- 리스트 컴프리헨션
  - 가장 빠르고 범용적인 방법이다. 각 행을 순회하면서 슬라이싱으로 새로운 행을 복사해서 넣는다.
  - `copied = [row[:] for row in origin]`
- `copy.deepcopy()` 사용
  - 모든 객체를 재귀적으로 복사한다.
  - 그만큼 속도가 매우 느리다.
  - `copied = copy.deepcopy(origin)`

### 기존 리스트에 새로운 리스트 덮어쓰기
기존에 존재하는 리스트의 주소값을 그대로 유지한 채, 새로운 리스트의 내부 요소를 덮어쓰고 싶을 때가 있다.  
이때는 **슬라이싱 할당** 기법을 사용한다.

```python
origin = [
    [1, 2, 3],
    [4, 5, 6]
]
print(id(origin)) # 4444236928
print(origin) # [[1, 2, 3], [4, 5, 6]]

new_arr = [
    [4, 5, 6],
    [1, 2, 3]
]

origin[:] = [row[:] for row in new_arr]
print(id(origin)) # 4415761408
print(origin) # [[4, 5, 6], [1, 2, 3]]
```

## 리스트 비교
파이썬에서 두 리스트를 비교하는 가장 기본적인 방법은 `==` 연산자를 사용하는 것이다.  
`==` 연산자는 두 리스트의 길이가 동일하고, 대응하는 모든 요소의 값이 같으며, 그 순서까지 일치할 때 `True` 를 반환한다.

반면 식별 연산자인 `is`는 두 리스트가 메모리상 동일한 객체인지를 확인한다.  
두 리스트의 요소가 완벽하게 같더라도 서로 다른 메모리 주소에 할당된 객체이면 `is` 연산은 `False`를 반환한다.

# lambda
프로그래밍에서 람다(lambda)는 이름 없는 익명 함수를 의미한다. Python에서도 람다식을 지원한다.  
기본 구문은 `lambda parameters: expression`의 형태를 띈다.  
이 식은 호출되었을 때 인자(parameters)를 받아 지정된 표현식(expression)을 평가한 결과를 반환하는 함수 객체를 생성한다.

아래 코드는 일반 함수 정의와 lambda 표현식을 이용한 함수 생성을 비교한 코드다.  
```python
def add(x, y):
    return x + y
    
add_lambda = lambda x, y: x + y
print(add_lambda(2, 3)) # 결과: 5
```

lambda는 그 자체로 변수를 할당하기보다는 **다른 함수의 인자로 전달할 때 유용하다**.  
특히 `map()`, `filter()`, `sorted()` 같은 함수와 함께 자주 사용된다.

```python
numbers = [1, 2, 3, 4, 5, 6]
print(list(filter(lambda x: x & 1 == 0, numbers))) # 출력: [2, 4, 6]
print(list(map(lambda x: x**2, numbers))) # 출력: [1, 4, 9, 16, 25, 36]
```

# 집합(Set)
파이썬에서 집합, Set은 **중복을 허용하지 않고 요소의 순서를 유지하지 않는 가변 컨테이너 자료형**이다.  
수학의 집합 개념을 프로그래밍적으로 구현한 것이며, 주로 데이터의 중복을 제거하거나 특정 요소가 존재하는 지 확인을 효율적으로 수행하기 위해 사용한다.

가장 큰 특징은 내부적으로 [해시 테이블](https://kdkdhoho.github.io/자료구조-알고리즘/해시/) 구조를 사용한다는 점이다. (파이썬은 해시 충돌 해결 전략으로, 독자적인 조사 공식을 사용하는 개방 주소법을 채택한다.)  
이로 인해 요소의 추가, 삭제, 검색 작업 시간의 평균은 O(1)에 해당하여 매우 빠른 처리 속도를 보장한다.

다만 순서가 없기에 리스트나 튜플처럼 인덱싱이나 슬라이싱을 불가하다.  
또한 Set에 포함되는 요소는 반드시 해시 가능(Hashable)해야 하므로, 리스트나 딕셔너리 같은 가변 객체는 집합의 원소가 될 수 없다.

> 해시 가능(Hashable)?  
> 객체가 고유한 해시 값을 유지하여 비교 가능한 상태

코드로는 `{}`를 사용하거나 `set()` 생성자 함수를 호출해서 만들 수 있다.
```python
numbers = [1, 2, 2, 3, 3, 3]
unique_numbers = set(numbers)
print(unique_numbers) # 결과: {1, 2, 3}

fruits = {'apple', 'banana'}
```

주의할 점은 빈 집합을 생성할 때, `set()`을 사용해야 한다는 점이다.  
`{}` 구문은 빈 딕셔너리를 생성하는 데 우선권이 있다.

## 집합 요소의 추가 및 삭제 메서드

단일 요소를 추가할 때는 `add()` 메서드를 사용하고, 여러 요소를 한꺼번에 추가할 때는 `update()` 메서드에 리스트나 튜플 같은 Iterable을 전달한다.  

단일 요소를 삭제할 때는 `remove()` 메서드를 사용하는데, 만약 요소가 존재하지 않으면 KeyError가 발생한다.  
요소가 없음에도 안전하게 삭제하고 있다면 `discard()` 를 사용한다.  
맨 마지막 항목을 제거하고 싶다면 `pop()` 메서드도 사용할 수 있다.  
모든 요소를 지우고 싶다면 `clear()` 메서드를 사용한다.

```python
s = {1, 2, 3}
s.add(4)
s.update([5, 6, 7])
print(s) # {1, 2, 3, 4, 5, 6, 7}

s.remove(1)
s.discard(0)
removed_value = s.pop()
s.clear()
```

## 수학적 집합 연산의 활용
파이썬의 집합은 수학의 집합 개념을 구현한 것으로 합집합, 교집합, 차집합과 같은 수학적 연산을 메서드나 연산자 형태로 지원한다.

구체적인 사용법은 아래 코드를 참고하자.

```python
set_a = {1, 2, 3, 4}
set_b = {3, 4, 5, 6}

# 합집합: 두 집합의 모든 요소
union_set = set_a | set_b
print(union_set) # 결과: {1, 2, 3, 4, 5, 6}

# 교집합: 두 집합의 공통 요소
intersection_set = set_a & set_b
print(intersection_set) # 결과: {3, 4}

# 차집합: 한 집합에만 존재하는 요소
difference_set = set_a - set_b 
print(difference_set) # 결과: {1, 2}

# 대칭 차집합: 공통 요소를 제외한 나머지
symetric_diff = set_a ^ set_b
print(symetric_diff) # 결과: {1, 2, 5, 6}
```

## 집합의 멤버십 테스트와 성능
집합을 사용하는 가장 핵심적인 이유 중 하나는 `in` 키워드를 이용한 멤버십 테스트의 효율성이다.  
리스트의 경우 특정 요소가 있는 지 확인하기 위해 모든 요소를 순회해야 하므로 O(N)의 시간이 걸리지만, 집합은 해시 값을 통해 직접 위치를 찾으므로 데이터 크기에 상관없이 O(1)의 시간으로 결과를 얻을 수 있다.  
따라서 대규모 데이터 Set에서 존재 여부를 반복적으로 확인해야 한다면, 데이터를 먼저 집합(Set)으로 변환하는 것이 성능 최적화에 큰 기여를 한다.

```python
numbers = {1, 2, 3}
print(1 in numbers) # True
```

# 딕셔너리(Dictionary)
파이썬의 딕셔너리는 키(Key)와 값(Value) 쌍을 저장하는 가변 컨테이너 자료형이다.  
`{}`를 사용하거나 `dict()` 생성자를 통해 생성할 수 있다.  
고유한 키를 통해 연관된 데이터에 즉각적으로 접근할 수 있도록 설계되어 있다.

## 해시 기반 작동 원리와 Key의 제약 조건
딕셔너리는 내부적으로 [해시 테이블(Hash Table)](https://kdkdhoho.github.io/%EC%9E%90%EB%A3%8C%EA%B5%AC%EC%A1%B0-%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98/%ED%95%B4%EC%8B%9C/) 구조를 사용한다.  
따라서 특정 키를 검색할 때, 해당 키의 해시 값을 계산하여 데이터가 저장된 메모리 위치를 직접 찾아낸다.  
이로 인해 요소가 아무리 많아지더라도 평균적으로 O(1) 만큼의 시간 복잡도로 데이터를 저장, 탐색할 수 있다.

Set과 마찬가지로 Key에는 반드시 해시 가능한 객체(정수, 문자열, 튜플)가 저장되어야 한다. 리스트나 딕셔너리 같은 가변 객체는 키로 사용될 수 없다.

## 삽입 순서 보장과 메모리 최적화 구조
과거에는 요소 순서가 무작위로 유지되었지만 파이썬 3.7부터는 요소가 삽입된 순서를 보장한다. (참고: [PEP 468 명세](https://peps.python.org/pep-0468/))  

## 사용법

### 요소 삽입
딕셔너리에 요소를 삽입하는 방법은 크게 세 가지 방법이 있다.

1. `[]` 키워드 사용

인덱싱 하듯이 `[]`로 Key-Value 쌍을 넣을 수 있다.  
만약 Key가 이미 존재한다면 새로운 Value로 덮어쓴다.

```python
profile = {}
profile['username'] = 'coder123'
print(profile) # {'username': 'coder123'}

profile['username'] = 'coder456'
print(profile) # {'username': 'coder456'}
```

2. `setdefault()`
`setdefault()`는 딕셔너리에서 Key 존재를 확인하고, 없을 때만 값을 삽입한다.

```python
profile = {}

# 'email' 이라는 키가 없으므로 삽입된다.
profile.setdefault('email', 'coder@gmail.com')
print(profile) # {'email': 'coder@gmail.com'}

# 이미 'email' 이라는 키가 존재하므로 삽입되지 않는다.
profile.setdefault('email', 'coder123@gmail.com')
print(profile) # {'email': 'coder@gmail.com'}
```

3. `update()`
여러 데이터를 한꺼번에 갱신하거나 추가할 때는 `update()` 메서드를 사용한다.  
파라미터로 딕셔너리 객체나 키-값 쌍의 Iterable 객체를 받아 대상 딕셔너리에 병합한다.  
이때 동일한 키가 있을 경우, 새로운 값으로 덮어쓴다.

```python
profile = {}
profile.update({'username': 'coder123', 'access_level': 2})
print(profile) # {'username': 'coder123', 'access_level': 2}
```

### 요소 조회
딕셔너리에서 요소를 조회하는 방법에는 두 가지가 있다.

1. `[]`
삽입과 마찬가지로 인덱싱하듯이 `[]` 키워드로 조회할 수 있다.  
이때, 존재하지 않는 Key로 조회할 경우 KeyError 가 발생한다.

```python
profile = {}
name = profile['name']
print(name) # KeyError 발생
```

2. `get()`
`[]`과 달리 Key가 존재하지 않을 경우, 예외를 발생시키는 대신 개발자가 원하는 값을 반환한다.  
만약 원하는 값을 지정하지 않으면 `None` 을 반환한다.

```python
profile = {}
name = profile.get('name')
print(name) # None

name2 = profile.get('name', 'coder123')
print(name2) # coder123
```

### 요소 삭제
특정 Key 값과 일치하는 요소를 삭제하기 위해서는 크게 3가지 방법이 있다.

1. `del()`
`del()` 메서드에 인자로 전달한 값과 동일한 Key를 가진 요소를 삭제한다.  
다만 해당 Key 값이 없다면 KeyError 가 발생하기에 주의해야 한다.

```python
my_dict = {"name": "Jack", "age": 25, "city": "Seoul"}

del my_dict["age"]
print(my_dict)  # 결과: {'name': 'Jack', 'city': 'Seoul'}
```

2. `.pop()`
요소를 삭제함과 동시에 해당 요소의 값(Value)를 반환받을 수 있다.  
또한 두 번째 인자로 기본값을 설정하면 해당 요소가 없어도 에러 없이 넘어갈 수 있어 안전하다.

```python
my_dict = {"name": "Jack", "age": 25}

# 삭제된 값을 변수에 담을 수 있음
removed_value = my_dict.pop("age") 

# 키가 없을 경우를 대비한 기본값 설정 (에러 방지)
result = my_dict.pop("hobby", "찾는 키가 없습니다.") 

print(my_dict)  # 결과: {'name': 'Jack'}
print(result)   # 결과: '찾는 키가 없습니다.'
```

3. 딕셔너리 컴프리헨션
기존 딕셔너리를 수정하는 것이 아닌, 특정 키를 제외한 새로운 딕셔너리를 생성하는 방법이다.  
특정 Key 값이 존재하지 않아도 안전하고, 여러 Key 값을 한꺼번에 제거할 때 유용하다.  
다만, 위 두 방법보다 더 많은 연산이 수행된다.
   
```python
my_dict = {"a": 1, "b": 2, "c": 3}

# 'b' 키만 제외하고 새로운 딕셔너리 생성
new_dict = {k: v for k, v in my_dict.items() if k != "b"}

print(new_dict)  # 결과: {'a': 1, 'c': 3}
```

### 기타 메서드

- `keys()`: 모든 Key를 담은 뷰 객체를 반환한다.
- `values()`: 모든 Value를 담은 뷰 객체를 반환한다.
- `items()`: Key-Value 한 쌍의 튜플을 담은 뷰 객체를 반환한다.
- `clear()`: 모든 요소를 삭제한다.

### 딕셔너리 뷰 객체 (Dictionary View Objects)
`dict.keys()`, `dict.values()`, `dict.item()` 메서드가 반환하는 특수한 객체를 의미한다.  
이 객체들은 딕셔너리의 항목들에 대한 동적인 뷰를 제공하며, 딕셔너리가 변경될 때마다 뷰 객체에 즉각 반영됨을 의미한다.

`dict_keys`, `dict_items`은 집합(Set)과 유사한 동작을 지원한다.
모든 항목이 해시 가능한 경우, 이 객체들에 대해 교집합(&), 합집합(|), 차집합(-) 등의 연산을 수행할 수 있기 때문이다.  
이로 인해 두 딕셔너리 사이의 공통된 키를 찾거나, 특정 키를 제외하는 작업을 쉽게 처리할 수 있다.

### 딕셔너리 컴프리헨션
딕셔너리 컴프리헨션은 반복문과 조건문을 결합하여 딕셔너리를 선언적으로 구성하는 방법이다.  
리스트 컴프리헨션의 딕셔너리 버전이다.  
반복문을 사용하는 것보다, 가독성이 좋고 인터프리터 수준에서 최적화되어 실행 속도 면에서도 유리하다.

이 기법은 특히 두 개의 리스트를 하나의 딕셔너리로 결합할 때 `zip()` 메서드와 함께 자주 사용된다.
`zip()` 메서드는 파이썬의 내장 함수로, Iterable 객체를 인자로 받아서 각 객체의 동일한 인덱스에 있는 요소들을 튜플로 묶어주는 Iterator를 생성한다.

```python
keys = ['cpu', 'ram', 'storage']
values = ['Intel i9', '32GB', '1TB SSD']

for z in zip(keys, values):
    print(z)
    
# 출력 결과
# ('cpu', 'Intel i9')
# ('ram', '32GB')
# ('storage', '1TB SSD')

# zip()을 이용해 딕셔너리 컴프리헨션 적용
specs = {k: v for k, v in zip(keys, values)}}

# if 절을 추가하여 조건에 부합하는 항목만 필터링 할 수 있다.
specs2 = {k: v for k, v in zip(keys, values) if len(k) > 3}

# 값의 형태를 직접 가공하여 생성하는 것도 가능하다.
upper_specs = {k.upper(): v for k, v in specs.items()}
```

```python
keys = ['cpu', 'ram', 'storage']
values = ['Intel i9', '32GB', '1TB SSD']


```

# 패킹과 언패킹
파이썬이 제공하는 기능 중 하나는 **패킹과 언패킹**이다.  

## 패킹
패킹은 여러 독립적인 데이터를 하나의 시퀀스 객체로 묶는 과정이다.  
가장 대표적인 형태는 별도 선언 없이 `,`를 사용하여 나열된 값들을 하나의 변수에 할당하는 방식이다.  
아래와 같은 코드를 실행할 때 파이썬 인터프리터는 `10, 20, 30` 을 하나의 튜플로 묶어준다.

```python
coordinates = 10, 20, 30
print(coordinates)  # 출력: (10, 20, 30)
print(type(coordinates))  # 출력: <class 'tuple'>
```

## 언패킹
패킹의 반대 개념으로, 리스트나 튜플과 같은 Iterable 객체 내부에 담긴 요소들을 개별 변수에 할당하는 기법이다.  
이때 [공식 레퍼런스](https://docs.python.org/3/reference/simple_stmts.html#assignment-statements)에 따르면, `=`의 좌항에 명시된 변수의 개수와, 우항에 있는 Iterable 객체의 사이즈가 동일해야 한다.  
그렇지 않으면 ValueError가 발생한다.

```python
coordinates = 10, 20, 30
x, y, z = coordinates
print(x, y, z)  # 출력: 10 20 30
```

언패킹은 리스트, 튜플 뿐 아니라 문자열, Set, 딕셔너리의 뷰 객체 등 모든 Iterable에 대해 동일하게 작동한다.

```python
# 문자열 언패킹
str_val = "roro"
a, b, c, d = str_val
print(a, b, c, d) # 출력: r o r o

# Set 언패킹
set_val = {'r', 'o', 'r', 'o'}
a, b = set_val
print(a, b) # 출력: o r (요소 순서가 보장되지 않는다.)

# 딕셔너리 언패킹
dic_val = {1: 'w', 2: 'a', 3:'d', 4: 'e'}
a, b, c, d = dic_val
print(a, b, c, d) # 출력: 1 2 3 4 (key 값에 대해서만 언패킹을 수행한다.)
```

## 확장된 Iterable 언패킹과 별표 연산자
파이썬 3 버전에서는 [PEP 3132 명세](https://peps.python.org/pep-3132/)를 통해 확장된 Iterable 언패킹 기능을 지원한다.  
`*` 연산자를 이용해서 Iterable의 나머지 요소를 하나의 리스트로 묶어 받는 기능이다.

```python
numbers = [1, 2, 3, 4, 5]
first, *middle, last = numbers
print(first, middle, last) # 출력: 1 [2, 3, 4] 5
```

만약 할당할 요소가 없다면 빈 리스트가 반환되며, 언패킹 연산 내에서 두 개 이상의 `*` 연산자를 사용할 수 없다.

## 딕셔너리 언패킹
`**` 연산자를 통해 딕셔너리도 Key-Value 형태로 언패킹할 수 있다.  
주로 메서드 호출 시 인자를 전달하거나, 여러 딕셔너리를 하나로 합칠 때 사용할 수 있다.

```python
base_fruite = {'apple': 1, 'banana': 2}
extra_fruite = {'kiwi': 3, 'banana': 4}

# 두 딕셔너리를 언패킹하여 병합한다. 이때 중복된 키는 뒤에 오는 것으로 할당된다.
merged_fruite = {**base_fruite, **extra_fruite}
print(merged_fruite)  # 출력: {'apple': 1, 'banana': 4, 'kiwi': 3}
```

시간 복잡도는 O(N)로 효율적이다.

# 클래스와 메서드
```python
class Smartphone:
    # 클래스 변수: 모든 인스턴스가 공유하는 데이터
    market = "Global Market"

    def __init__(self, model: str, battery: int):
        # 인스턴스 변수: 각 객체마다 고유하게 가지는 데이터
        # self를 통해 현재 생성되는 객체의 속성에 값을 할당한다.
        self.model = model
        self.battery = battery

    # 인스턴스 메서드: 객체의 상태(battery)를 변경한다.
    # 첫 번째 파라미터에 항상 `self`를 정의한다.
    def use_app(self, app_name: str, consumption: int):
        # `self` 키워드를 통해 인스턴스 변수에 접근한다.   
        if self.battery >= consumption:
            self.battery -= consumption
            print(f"{self.model}에서 {app_name} 앱을 실행한다. 잔량: {self.battery}%")
        else:
            print(f"배터리가 부족하여 {app_name}을 실행할 수 없다.")

    @classmethod
    def change_market(cls, new_market: str):
        # 클래스 메서드: 클래스 변수(market)를 수정한다.
        # cls는 클래스 자체(Smartphone)를 가리킨다.
        cls.market = new_market
        print(f"판매 시장이 {cls.market}으로 변경되었다.")

    @staticmethod
    def is_valid_battery(level: int) -> bool:
        # 정적 메서드: 클래스나 인스턴스의 속성에 접근하지 않는 독립적 기능을 수행한다.
        return 0 <= level <= 100

# 인스턴스 생성: 설계도(클래스)를 바탕으로 실제 객체를 만든다.
# 이때 __init__ 메서드가 자동으로 호출되어 self에 iphone 객체가 전달된다.
iphone = Smartphone("iPhone 15", 100)
galaxy = Smartphone("Galaxy S24", 80)

# 인스턴스 메서드 호출: self는 자동으로 각 객체(iphone, galaxy)를 가리킨다.
iphone.use_app("YouTube", 20)
galaxy.use_app("Instagram", 15)

# 클래스 메서드 호출: 클래스 이름을 통해 호출하며 모든 인스턴스에 영향을 미친다.
Smartphone.change_market("Korea Market")

# 정적 메서드 호출: 인스턴스 생성 없이도 유효성 검사 등의 로직을 수행할 수 있다.
print(f"배터리 수치 유효성 확인: {Smartphone.is_valid_battery(120)}")```
```

- `__init__`에 `self.model`과 같이 self를 통해 변수명을 적으면 해당 인스턴스만의 고유 공간에 데이터가 저장된다. 인스턴스 변수는 각 인스턴스별로 고유한 데이터를 위한 것이고, 클래스 변수는 해당 클래스의 모든 인스턴스가 공유하는 속성과 메서드를 위한 것이다.
- 메서드를 호출할 때 `self`를 직접 명시하지 않아도 되는 이유는, 파이썬의 메서드 바인딩 메커니즘 때문이다. `iphone.use_app()`을 호출하면 파이썬은 내부적으로 `Smartphone.use_app(iphone, ...)`으로 변환하여 실행한다. 이를 통해 `use_app()` 메서드 내부에서 `self` 키워드를 통해 인스턴스 변수(`self.battery`)에 접근할 수 있게 된다.
- `@classmethod`로 지정된 메서드는 인스턴스가 아닌, 클래스 자체를 첫 번째 인자로 전달받는다. 이름 관례는 `cls`이다.
- `@staticmethod`로 지정된 메서드는 어떠한 인자도 자동으로 받지 않으며, 단순히 클래스라는 공간 안에 포함된 일반 함수와 같이 동작한다.

## 중첩 함수 (Nested Function)
인스턴스 메서드 내부에 또 다른 메서드를 선언하여 사용할 수 있다. 이를 **중첩 함수(Nested Function)**이라고 한다.

특징  
- 중첩 함수는 **부모 함수 내에서만 호출할 수 있다**.
- 중첩 함수는 **부모 함수의 변수나 `self`에 접근할 수 있다**. 이때 부모 함수의 변수 값을 변경하려면 `nonlocal` 키워드로 먼저 선언해주고 값을 업데이트해야 한다. 그렇지 않으면, 중첩 함수 내에서만 유효한 지역 변수가 할당되는 것으로 처리된다.  
- 중첩 함수는 자동으로 **`self` 인자를 전달받지 않는다**. `self`를 사용하려면 부모 함수가 받은 `self`를 그대로 사용해야 한다.

```python
class MyClass:
    def parent_method(self, x):
        def child_func(y):
            return y + x
            
        result = child_func(10)
        return f"Result is {result}"

obj = MyClass()
print(obj.outer_method(5))  # 출력: Result is 15
```

## LEGB 규칙
Python에서 변수에 값을 바인딩하거나 변수 값을 참조하는 경우, LEGB 규칙을 따른다.  
LEGB는 다음과 같은 의미를 가진다.

- Local: 함수 또는 람다 표현식 내부의 변수. 변수가 정의된 가장 안쪽의 범위다.
- Enclosing: 중첩 함수에서 자신을 감싸는 바깥 함수의 범위다. 즉, 부모 함수에 선언된 변수다.
- Global: 모듈의 최상위 수준 또는 전역 선언이 된 변수 범위다.
- Built-in: `len`, `range`, `ValueError` 등 파이썬에 기본적으로 내장된 이름들이다.

### _UnboundLocalError_
Python의 LEGB 규칙이 익숙하지 않을 때, _UnboundLocalError_ 가 흔하게 발생한다.  
이 에러는 **함수 내에서 전역 변수를 수정하려 할 때 발생**한다.  
파이썬은 함수 내부에서 변수에 값을 할당하는 문장이 존재하면, 해당 변수를 해당 함수의 지역 변수로 취급한다.

```python
x = 10

def example():
    x = x + 1 

example() # UnboundLocalError 발생
```

[파이썬 공식 명세](https://www.google.com/search?q=https://docs.python.org/3/faq/programming.html%23why-am-i-getting-an-unboundlocalerror-when-the-variable-has-a-value)에 따르면, **함수 내의 어디서든 변수에 할당이 이루어지면, 그 변수는 명시적으로 다른 선언이 없는 한 로컬 변수로 간주된다**.

### `global`, `nonlocal` 
만약 함수 내부에서 외부 범위(_Enclosing_ or _Global_) 변수의 값을 할당하려면 특정 키워드가 필요하다.

- `global`: 전역 범위(Global)에 선언된 변수에 할당할 때 사용한다.
- `nonlocal`: 부모 함수(Enclosing)에 선언된 변수에 할당할 때 사용한다.

### 가변 객체(예: 리스트, 딕셔너리)의 예외 상황
리스트나 딕셔너리 같은 객체는 `global` 선언 없이도 내부 값을 수정할 수 있다.  
이는 변수 이름이 가리키는 객체 자체를 재할당하는 것이 아니라, 객체 내부 속성을 변경하는 것이기 때문이다.

```python
arr = [1, 2, 3]

def modify_list():
    arr[0] = 99 # global 선언 없이 가능 (객체 내부 수정)

def replace_list():
    # global arr # 이 선언이 없으면 UnboundLocalError 발생 가능성 있음
    arr = [4, 5, 6] # 변수 이름에 새 객체를 할당하므로 Local 변수로 새로 생성됨
```

## 타입 힌트 (Python 3.5+)
파이썬은 기본적으로 동적 타입 언어다. 하지만 Python 3.5 버전부터 `def func(a: int, b: str, c: List[int]) -> bool:` 형태의 **타입 힌트**를 사용하여 예상 타입을 명시할 수 있다.

이로 인해 가독성과 디버깅을 도우며, 정적 분석 도구(mypy 등)나 IDE를 통해 타입 검사를 할 수 있다. 물론, 파이썬 인터프리터가 런타임에 타입을 강제하지는 않는다.

# math 모듈

## `prod()`
`prod(Iterable, *, [start=1])` 메서드는 Iterable 객체를 인자로 받아, 해당 객체의 모든 요소의 곱을 반환한다.  
`start` 파라미터는 곱셈의 시작값을 지정하는 데 사용되며, 기본값은 1이다.


## `comb()`
서로 다른 n개의 원소 중에서 r개를 선택하는 조합(Combination)의 개수를 구하려면 `math.comb(n, r)` 함수를 사용하면 된다.

```python
import math

a, b = 3, 2
result = math.comb(a, b)
print(result) # 3
```

# `itertools` 모듈

## `combinations()`
서로 다른 n개의 원소 중에서 r개를 선택하는 조합(Combination)은 `itertools.combinations(iterable, r)` 함수를 이용하면 된다.  
이 함수는 iterable 객체에서 길이가 r인 모든 가능한 조합을 사전식 순서로 반환한다.

```python
from itertools import combinations

numbers = [1, 2, 3]
result = list(combinations(numbers, 2))
print(result) # 결과: [(1, 2), (1, 3), (2, 3)]
```

## `combinations_with_replacement()`
동일한 요소를 중복해서 선택할 수 있는 중복 조합이 필요한 경우에는 `itertools.combinations_with_replacement(iterable, r)` 함수를 사용한다.

```python
from itertools import combinations_with_replacement

items = ['A', 'B']
result = list(combinations_with_replacement(items, 2))
print(result) # 결과: [('A', 'A'), ('A', 'B'), ('B', 'B')]
```

# `collections` 모듈

## `collections.deque`
Deque 자료구조를 지원하는 모듈이다.
> Deque 자료구조는 Double-Ended Queue의 약자로, Head와 Tail에서 모두 요소를 삽입/삭제 할 수 있는 구조이다.

다음과 같이 사용할 수 있다.

```python
from collections import deque

d = deque()
d.append(1)
d.append(2)
print(d) # 출력: deque([1, 2])

d.appendleft(3)
print(d) # 출력: deque([3, 1, 2])

d.reverse()
print(d) # 출력: deque([2, 1, 3])

d.rotate(1) # rotate(n): 내부 요소를 오른쪽으로 n번 시프트한다. 음수이면 왼쪽으로 시프트한다. 
print(d) # 출력: deque([3, 2, 1])

print(d.count(1)) # 출력: 1
print(d.index(3)) # 출력: 0. index(): 첫 번째 일치를 반환하거나 찾을 수 없으면 ValueError를 발생시킵니다.

x = d.pop()
print(d) # 출력: deque([3, 2])
print(x) # 출력: 1

x = d.popleft()
print(d) # 출력: deque([2])
print(x) # 출력: 3

d.clear()
print(d) # 출력: deque([])
```

## `defaultdict()`
Python에서 기본 딕셔너리를 사용할 때 _KeyError_ 를 항상 신경써야 한다.  
하지만 `collections.defaultdict` 모듈을 사용하면 이 _KeyError_ 에서 자유롭고 간결한 코드를 작성할 수 있게 된다.

일단 사용 예제 코드를 살펴보자.

```python
from collections import defaultdict

nums = [10, 20, 30, 30]

counter = defaultdict(int)
for num in nums:
    counter[num] += 1

print(counter) # 출력: defaultdict(<class 'int'>, {10: 1, 20: 1, 30: 2})
```

1. `defaultdict()`는 인자로 `int` 나 `list` 같은 _Callable 객체_ (함수 형태 또는 람다식)만 가능하다.
2. 이제 `defaultdict()`로 생성된 딕셔너리에 존재하지 않는 Key 값으로 조회를 하면, 인자로 전달한 _Callable 객체_ 에 따라 **기본값을 생성**해준다.

# `heapq` 모듈
Python에서 힙(Heap) 자료구조는 `heapq` 모듈을 통해 제공된다. 기본적으로 최소 힙으로 구현되어 있다.

기본적으로 리스트를 선언한 다음, heapq 모듈의 `heappush(heap, item)`, `heappop(heap, item)` 메서드를 이용해 리스트에 요소를 삽입, 삭제하는 구조로 사용된다.  
```python
import heapq

heap = []
heapq.heappush(heap, 4)
heapq.heappush(heap, 1)
heapq.heappush(heap, 7)
print(heap) # 출력: [1, 4, 7]

smallest = heapq.heappop(heap)
print(smallest) # 출력: 1
print(heap) # 출력: [4, 7]
```

기존에 요소가 들어있는 리스트를 힙으로 만드려면, `heapq.heapify(heap)` 메서드를 사용한다.  
```python
import heapq

nums = [5,2,8,4]
heapq.heapify(nums)
print(nums) # 출력: [2, 4, 8, 5]
```

최대 힙을 구현하려면, 데이터에 `-`를 붙여서 음수값으로 만들어줘야 한다. 값을 넣을 때와 추출할 때 모두 `-`를 붙여 최대 힙을 사용하는 방식이다.  
```python
import heapq

nums = [5,2,8,4]
max_heap = list(map(lambda x: -x, nums))
heapq.heapify(max_heap)
print(max_heap) # 출력: [-8, -4, -5, -2]

max_value = -heapq.heappop(max_heap)
print(max_value) # 출력: 8
print(max_heap) # [-5, -4, -2]
```

# `bisect` 모듈
Python의 `bisect` 모듈은 정렬된 리스트를 유지하면서 새로운 요소를 삽입할 적절한 위치를 찾는 이진 분할(Binary Bisection) 알고리즘을 제공한다.

이 모듈은 정렬된 시퀀스에서 특정 값을 찾거나, 삽입할 때 매번 전체를 다시 정렬하지 않고도 효율적으로 순서를 유지할 수 있도록 돕는다.

내부적으로 **이진 탐색(Binary Search)** 알고리즘을 사용하기 때문에, 위치를 찾는 데 O(logN)의 시간 복잡도를 가진다.  
하지만 실제로 삽입하는 함수(`insort_left()`, `insort_right()`)의 경우, 리스트 중간에 요소를 삽입할 떄 발생하는 데이터 이동으로 인해 O(n)의 시간이 소요된다.

주요 함수는 다음과 같다.

- `bisect_left(a, x, lo=0, hi=len(a))`: 정렬된 순서를 유지하면서 리스트 a에 값 x를 삽입할 가장 왼쪽 인덱스를 찾는다. 만약 리스트 내에 이미 x와 동일한 값이 있다면, 그 값 왼쪽 인덱스를 반환한다.
- `bisect_right(a, x, lo=0, hi=len(a))`: bisect_left와 유사하지만, 리스트 내에 이미 x와 동일한 값이 있는 경우 그 값의 오른쪽 인덱스를 반환한다. `bisect()` 함수는 이 함수의 별칭이다.
- `insort_left(a, x, lo=0, hi=len(a))`: bisect_left를 사용하여 삽입 위치를 찾은 뒤, 실제로 리스트 a에 x를 삽입한다.
- `insort_right(a, x, lo=0, hi=len(a))`: bisect_right를 사용하여 삽입 위치를 찾은 뒤, 실제로 리스트 a에 x를 삽입한다. `insort()` 함수는 이 함수의 별칭이다.
