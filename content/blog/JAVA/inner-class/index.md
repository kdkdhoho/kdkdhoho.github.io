---
title: "[Java] inner 클래스와 종류에 대해"
description: "inner class, static inner class, non-static member class, anonymous inner class, local area inner class"
date: 2024-07-26
tags: ["JAVA", "inner class"]
---

## 내부 클래스(inner class)

내부 클래스(inner class)란, 다른 클래스 안에 정의된 클래스를 의미한다.<br>
내부 클래스는 **자신을 감싼 외부 클래스에서만 쓰여야 하며, 그 외의 쓰임새가 있다면 별도의 클래스로 만들어야 한다**.

내부 클래스를 선언하는 이유는 **두 클래스가 서로 긴밀한 관계임을 나타내기 위함**이다.<br>
이를 적절히 사용하면 **클래스를 논리적으로 구조화하여 패키지를 간소화**할 수 있고 **`private` 접근제어자를 이용해 클래스 자체를 캡슐화** 할 수 있다.

## 내부 클래스의 종류

종류로는 다음과 같다.

- 정적 멤버 클래스
- 비정적 멤버 클래스
- 익명 클래스
- 지역 클래스

## 비정적 멤버 클래스

비정적 멤버 클래스는 외부 클래스의 인스턴스를 통해서만 객체를 생성할 수 있다.<br>
외부 클래스의 인스턴스를 통해 생성된 비정적 멤버 클래스의 인스턴스는, 인스턴스화가 될 때 외부 인스턴스와 암묵적으로 연결되며 변경할 수 없다.<br>
즉, **비정적 멤버 클래스의 인스턴스가 생성될 때, 자신을 생성한 외부 인스턴스에 대한 참조**를 항상 가지게 된다.<br>
심지어 외부 클래스의 멤버를 참조하지 않아도, 클래스 파일에는 내부적으로 숨겨진 외부 참조가 존재하게 된다.<br>
따라서 비정적 멤버 클래스에서 **정규화된 this**로 외부 클래스의 멤버에 접근할 수 있다.

하지만 이런 특징으로 인해 **메모리 누수**가 발생할 수 있다.<br>
만약, 외부 클래스는 더이상 사용되지 않고 내부(멤버) 클래스만 사용된다고 하면, 외부 클래스를 메모리에서 제거해줘야 한다.<br>
따라서 외부 클래스를 참조하지 않는 멤버 클래스라면 **정적 멤버 클래스**로 선언하자.<br>
정적 멤버 클래스는 내부적으로도 외부 클래스를 참조하지 않는다.

아래는 비정적 멤버 클래스를 사용한 간단한 예시 코드이다.

```java
public class Outer {

    public int num = 10;

    public static class 정적_멤버_클래스 {
    }

    public class 비정적_멤버_클래스 {

        int x = 5;

        public void addX(int x) {
            this.x += x;
        }

        public void logic() {
            Outer.this.num = x; // 비정적 멤버 클래스에서 외부 클래스로 정규화된 this를 사용해 접근할 수 있다.
        }

        public int getX() {
            return x;
        }
    }
}

public class Main {
    public static void main(String[] args) {
        Outer outer = new Outer();
        Outer.비정적_멤버_클래스 비정적_멤버_클래스 = outer.new 비정적_멤버_클래스(); // 비정적 멤버 클래스는 외부 클래스의 인스턴스 없이 생성할 수 없다.

        System.out.println(비정적_멤버_클래스.getX()); // 5
        비정적_멤버_클래스.addX(10);
        비정적_멤버_클래스.logic();
        System.out.println(비정적_멤버_클래스.getX() + " " + outer.num); // 15 15
    }
}
```

## 정적 멤버 클래스

비정적 멤버 클래스에 `static` 키워드를 붙인 클래스이다.<br>
정적 멤버 클래스와 다르게, 외부 클래스의 인스턴스를 통하지 않고 정적 멤버 클래스의 인스턴스를 생성할 수 있다.<br>
따라서 **정적 멤버 클래스는 외부 클래스의 간접 참조가 존재하지 않는다**.

정적 멤버 클래스에 붙는 `static`은, 일반적으로 `static`이 메모리 상에서 동작하는 방식과는 다르다.<br>
`static`이더라도 인스턴스화 할 때 마다 매번 새로운 인스턴스를 생성하기 때문이다.

정적 내부 클래스에서 외부 클래스로의 접근은 `static` 필드나 메서드으로만 접근이 가능하다.<br>
만약 외부 클래스의 non-static 필드로 접근하기 위해선 외부 클래스의 인스턴스를 통해서만 접근할 수 있다.

아래는 정적 멤버 클래스를 사용한 간단한 예시 코드이다.

```java
public class Outer {

    public int num = 10;
    private static int privateStaticNum = 10;

    public int getNum() {
        return num;
    }

    public static void print(int num) {
        System.out.println(num);
    }

    public static class 정적_멤버_클래스 {

        int x = 5;

        public void addX(int x) {
            this.x += x;
        }

        public void logic() {
            // Outer.this.num = x; // 컴파일 오류
            // x += Outer.num; // 컴파일 오류
            x += Outer.privateStaticNum; // static 필드로 접근이 가능하다. 심지어 private 임에도 가능하다.

            int num = new Outer().getNum(); // 외부 클래스의 non-static 필드로 접근하기 위해선 외부 인스턴스를 통해야 한다.
            Outer.print(num); // static 메서드로 접근이 가능하다.
        }

        public int getX() {
            return x;
        }
    }
}

public class Main {
    public static void main(String[] args) {
        Outer.정적_멤버_클래스 정적_멤버_클래스 = new Outer.정적_멤버_클래스();
        System.out.println(정적_멤버_클래스.getX()); // 5

        정적_멤버_클래스.addX(10);
        System.out.println(정적_멤버_클래스.getX()); // 15

        정적_멤버_클래스.logic(); // 10
        System.out.println(정적_멤버_클래스.getX()); // 25

        Outer.정적_멤버_클래스 정적_멤버_클래스2 = new Outer.정적_멤버_클래스();
        System.out.println(정적_멤버_클래스 == 정적_멤버_클래스2); // false
    }
}
```

## 익명 클래스

익명 클래스는 클래스 이름이 존재하지 않는 내부 클래스이다.<br>
클래스나 인터페이스를 선언과 동시에 객체를 생성할 수 있다.

아래는 익명 클래스를 사용하는 간단한 예시 코드이다.

```java
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Member {

    private Long id;
    private String name;
}

public class JdbcTemplateTest {

    private static final RowMapper<Member> rowMapper = new RowMapper<Member>() { // 익명 클래스 (인터페이스 구현)
        @Override
        public Member mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new Member(
                    rs.getLong("id"),
                    rs.getString("name")
            );
        }
    };

    Member zz = new Member() { // 익명 클래스
        @Override
        public String toString() {
            return "new Member Instance";
        }
    };
}

class ma {
    public static void main(String[] args) {
        JdbcTemplateTest jdbcTemplateTest = new JdbcTemplateTest();
        Member zz = jdbcTemplateTest.zz;
        System.out.println(zz); // "new Member Instance"
    }
}
```

## 지역 클래스

지역 멤버와 동일하다.<br>
단지 클래스일 뿐이다.

non-static 문맥일 때만 **외부 클래스를 정규화된 this로 참조**할 수 있다.

아래와 같이 사용할 수 있다.

```java
public class Outer {

    public int num = 10;

    public void logic() {

        class 지역_클래스 {

            int x = 100;

            public void setX(int x) {
                this.x = x;
            }

            public void add() {
                Outer.this.num += x; // 외부 인스턴스 참조 가능
            }
        }

        지역_클래스 지역_클래스 = new 지역_클래스();
        System.out.println("초기 X: " + 지역_클래스.x); // 100

        지역_클래스.setX(num);
        System.out.println("수정 이후 X: " + 지역_클래스.x); // 10

        지역_클래스.add();
        System.out.println("지역_클래스.add() 이후 num: " + this.num);
    }
}

public class Main {
    public static void main(String[] args) {
        Outer outer = new Outer();
        outer.logic();
    }
}
```

## Referece
- 자바의 정석
- 이펙티브 자바
- https://inpa.tistory.com/entry/JAVA-%E2%98%95-%EC%9E%90%EB%B0%94%EC%9D%98-%EB%82%B4%EB%B6%80-%ED%81%B4%EB%9E%98%EC%8A%A4%EB%8A%94-static-%EC%9C%BC%EB%A1%9C-%EC%84%A0%EC%96%B8%ED%95%98%EC%9E%90#inner_%ED%81%B4%EB%9E%98%EC%8A%A4%EC%9D%98_%EB%AC%B8%EC%A0%9C%EC%A0%90
