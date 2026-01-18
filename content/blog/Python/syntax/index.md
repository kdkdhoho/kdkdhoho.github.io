---
title: "Python 기본 문법"
description: "Python의 기본 문법에 대해 정리한 글입니다. 지속적으로 업데이트 해 갈 예정입니다."
date: 2026-01-14
tags: ["Python"]
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

`sep` 매개변수에 아무런 인자를 전달하지 않으면, 모든 화이트스페이스(whitespace)를 구분자로 간주한다.  
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

# range()
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

# 리스트(List)

## 리스트 컴프리헨션
Iterable 객체를 바탕으로 새로운 리스트를 생성할 때 사용하는 구문이다.  
기본 구조는 대괄호 내부에 결과값으로 산출될 표현식을 가장 먼저 배치하고, 그 뒤에 최소 하나 이상의 for 절과 필요한 경우 if 절을 덧붙이는 형태이다.

```python
squares = [x**2 for x in range(5)]
print(squares) # [0, 1, 4, 9, 16]`
```

리스트 컴프리헨션은 내부적으로 최적화된 바이트코드를 생성하여 작동한다. 덕분에 일반적인 for 루프를 돌며 리스트의 `append()` 메서드를 매번 호출하는 방식보다 실행 속도가 빠르다.

또한, 파이썬 3 이후의 리스트 컴프리헨션은 내부에서 사용되는 루프 변수(예: `i`)가 컴프리헨션 내부의 로컬 스코프에만 고립되도록 설계되어 있다. 

## 리스트 정렬
리스트를 정렬하는 방법에는 크게 두 가지가 있다.

1. 리스트 객체 자체의 내용을 변경하는 `list.sort()`
2. 정렬된 새로운 리스트를 반환하는 내장함수 `sorted()`

[표준 라이브러리 명세](https://www.google.com/search?q=https://docs.python.org/3/library/stdtypes.html%23list.sort)에 따르면 `list.sort()`는 리스트를 제자리에서 정렬하여 메모리를 절약하며, 반환 값은 None이다.  
반면 `sorted()` 메서드는 인자로 전달된 Iterable 객체를 변경하지 않고, 새로운 리스트를 반환하므로 원본 데이터를 유지해야 하는 경우에 적합하다.

파이썬의 정렬 알고리즘은 Timsort 알고리즘을 적용했다.

### 대소문자 구분 및 사용자 정의 정렬
기본적인 사전순 정렬은 대문자가 소문자를 앞서는 방식으로 진행된다. 이는 유니코드 표에서 대문자가 소문자보다 작은 값을 가지기 때문이다.  
만약 대소문자를 구분하지 않고 정렬하고 싶다면, `key` 매개변수를 활용해야 한다.  
`key` 매개변수에 `str.lower` 또는 `str.upper`를 전달함으로써, 모든 요소를 일시적으로 변환한 상태에서 비교를 수행한다.

```python
names = ['Bob', 'Amy', 'Xavier']
names.sort(key=str.lower)
print(names) # 결과: ['Amy', 'Bob', 'Xavier']  
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

# 출력 결과
# ('cpu', 'Intel i9')
# ('ram', '32GB')
# ('storage', '1TB SSD')
for z in zip(keys, values):
    print(z)

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
