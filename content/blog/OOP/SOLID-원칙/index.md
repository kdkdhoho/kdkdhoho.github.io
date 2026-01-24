---
title: "SOLID 원칙"
description: "객체지향 프로그래밍으로 소프트웨어를 설계할 때 권장하는 다섯 가지 원칙인 SOLID 원칙에 대해 정리한 글입니다."
date: 2025-10-05
tags: ["OOP", "SOLID 원칙"]
---

# 들어가며

SOLID 원칙은 **객체지향 디자인 패턴의 근본**이다.

객체지향 프로그래밍으로 소프트웨어를 설계할 때 권장하는 다섯 가지 원칙이다.
이 원칙을 준수하며 소프트웨어 설계를 하면 **유지보수성, 이해성, 유연성이 뛰어난 소프트웨어가 알아서 만들어진다**.

> SOLID 원칙은 로버트 C. 마틴(Robert C. Martin)의 디자인 원칙과 디자인 패턴 논문에서 처음 소개됐다.
> 이후 마이클 페더스(Michael Feathers)가 발전시켜 현재의 SOLID라는 약어를 제안하게 됐다.

# SOLID 원칙

SOLID는 다섯 용어의 앞 글자를 따서 지은 용어이다.
각 용어 순서대로 하나씩 살펴보자.

## 1. SRP(Single Responsibility Principle): 단일 책임 원칙
> 주관적 중요도: ⭐️⭐️⭐️⭐️

각 클래스나 모듈은 하나의 책임만 가져야 한다.
**클래스나 모듈이 변경되는 이유는 단 한 가지 때문이어야 한다**는 의미이다.

아래는 예제 코드이다.
백엔드 개발자를 의미하는 클래스인데, 서버를 구축하고 DB를 설정하며 MainPage를 개발하는 역할을 가진다.

```java  
public class SpringBackendDeveloper {  
    public void deployServer() {}
    public void setupDatabase() {}
    public void developMainPage() {}
}
```  

보통의 경우 백엔드 개발자에게 메인 페이지 개발의 책임을 부여하진 않는다.
따라서 이런 경우 SRP를 위반하고 있다고 볼 수 있다.

물론 상황에 따라 백엔드 개발자가 메인 페이지를 개발할 수는 있다.
이런 경우엔 SRP를 위반한다고 볼 수 없다.

따라서 SRP에서 의미하는 책임은, 어디서부터 어디까지 부여하냐에 따라 달라질 수 있다.

## 2. OCP(Open-Closed Principle): 개방 폐쇄 원칙
> 주관적 중요도: ⭐️⭐️⭐️⭐️⭐️

**구조 확장 및 변경에는 열려있고, 코드 수정에는 닫혀 있어야 한다**는 원칙이다.
다섯 가지 원칙 중에서 가장 중요하게 생각하는 원칙이다.

예제 코드를 살펴보자.

```java  
public class Boss {
    SpringBackendDeveloper springBackendDeveloper = new SpringBackendDeveloper();
    
    public void developService() {  
        springBackendDeveloper.setUpDatabase();
        springBackendDeveloper.deplyServer();
	}
}  
```  
Client 코드인 `Boss` 객체는 `SpringBackendDeveloper` 에 의존한다.
그런데 갑자기 Spring에서 Node로 서비스를 마이그레이션 해야 할 상황이 생겼다고 가정해보자.<br>  
`Boss`가 의존하는 `SpringBackendDeveloper`을 `NodeBackendDevloper`로 교체하기 위해 모든 코드를 수정해야 한다.

구조를 변경하려고 하니 Client인 `Boss` 객체에도 코드 수정이 이뤄지고 있다.
OCP를 잘 지키고 있지 못한다.

이제 OCP를 잘 지키는 코드를 보자.

```java
public interface BackendDeveloper {  
    void deployServer();  
    void setupDatabase();
}

public class SpringBackendDeveloper implements BackendDeveloper {
    @Override
    public void deployServer() {}
    @Override
	public void setupDatabase() {}
}
  
public class NodeBackendDeveloper implements BackendDeveloper {  
    @Override
    public void deployServer() {}
    @Override
	public void setupDatabase() {}
}  
  
public class Boss {
	private final BackendDeveloper backendDeveloper;
	
	public Boss(BackendDevloper backendDeveloper) {
		this.backendDeveloper = backendDeveloper;
	}
	
    public void developService() {
	    backendDeveloper.setupDatabase();
	    backendDeveloper.deployServer();
	}
}  
```  

이번에는 Client인 `Boss` 객체가 `BackendDeveloper` 라는 Interface를 의존한다.
그리고 생성자를 통해 외부로부터 구체적인 `BackendDeveloper` 를 주입받는다.

이러한 구조에서는 더이상 BackendDeveloper가 어떤 기술 스택을 사용하든 상관없이, 그리고 중간에 변경이 되어도 전혀 영향을 받지 않으며 본인의 로직을 수행할 수 있게 된다.

즉, **구조 변경에는 열려있고 코드 수정에는 닫혀있는 구조**가 되는 것이다.

## 3. LSP(Liskov Substitution Principle): 리스코프 치환 원칙
> 주관적 중요도: ⭐️⭐️⭐️⭐️

**하위 타입은 상위 타입을 대체할 수 있어야 한다**는 원칙이다.
쉽게 생각하면, 상위 타입의 동작을 하위 타입에서도 그대로 동작한다는 것이다.

만약 아래와 같은 코드가 있다고 가정해보자.
```java  
import java.lang.UnsupportedOperationException;

public class DBA implements BackendDeveloper {  
	@Override
    public void deployServer() {
		throws UnsupportedOperationException();
	}
    
    @Override
	public void setupDatabase() {}
}  
```  

`BackendDeveloper` Interface를 구현하는 DBA 클래스이다.
만약, `Boss` 객체가 의존하는 `BackendDeveloper` 자리에 `DBA` 객체가 주입되면 어떻게 될까?

DBA이지만 백엔드 개발자의 역할을 충실히 수행하면 문제되진 않겠지만, 순정 DBA라면 `deployServer()` 메서드의 동작을 충실히 수행하긴 어려울 것이다.

## 4. ISP(Interface Segregation Principal) 인터페이스 분리 원칙
> 주관적 중요도: ⭐️⭐️⭐️⭐️

**클래스는 자신이 사용하지 않을 메서드를 구현하도록 강요받지 않아야 한다는 원칙**이다.

예제 코드를 살펴보자.
아래는 위 예제 코드에서 살펴본 DBA 클래스이다.

```java
public class DBA implements BackendDeveloper {  
	@Override
    public void deployServer() {
		throws UnsupportedOperationException();
	}
    
    @Override
	public void setupDatabase() {}
}
```

사실상 DBA는 `deployServer()` 메서드를 구현할 필요는 없다.
하지만 `BackendDeveloper` Interface에서 메서드를 정의해두었기에 어쩔 수 없이 구현해야 한다.

즉, ISP를 위반하고 있는 것이다.
따라서 Interface 구조가 아래와 같이 개선되면, ISP를 잘 지키는 구조가 되는 것이다.

```java
public interface BackendDeveloper {
	void deployServer();
}

public interface DBA {
	void setupDatabase();
}
```

## 5. DIP(Dependency Inversion Principle): 의존관계 역전 원칙
> 주관적 중요도: ⭐️⭐️⭐️⭐️⭐️

**고수준 모듈은 저수준 모듈의 구현에 의존해서는 안되며, 저수준 모듈이 고수준 모듈에 의존해야 한다**는 원칙이다.

- 고수준 모듈: 기능의 로직을 제어하는 핵심 모듈(클래스)
- 저수준 모듈: 구체적인 동작을 직접 구현하는 모듈(클래스)

여기서 **모듈은 클래스를 의미할 수도 있고 패키지를 의미할 수 있다.**
만약, 클래스 관점에서만 DIP를 지킨다면 DIP가 완전히 지켜지지는 않는다.
따라서 DIP를 잘 지켰는지 판단하려면 패키지 관점에서도 생각해야 한다.

무슨 말인지 아래 사진을 보자.

기존 예제였던 `Boss` 객체는 핵심 로직을 수행하므로 고수준 모듈에 속한다.
그리고 기존에 봤던 구조처럼, `BackendDeveloper`에 의존한다.
`Boss`와 `BackendDeveloper`는 어쩌면 패키지로 충분히 나눌 수 있다고 생각된다.
그럼 아래 구조가 될 것이다.

![wrong_dip.png](wrong_dip.png)

하지만 DIP의 설명 중, "*고수준 모듈은 저수준 모듈의 구현에 의존해서는 안되며*"를 위반한다.
고수준 모듈인 `Boss`가 저수준 모듈인 `BackendDevloper`를 의존하고 있다.

따라서 이러한 경우에는 Interface를 고수준 모듈(패키지)에 포함시키고, 구현체를 별도의 패키지로 분리함으로써 DIP를 온전히 지킬 수 있다.

![dip.png](dip.png)

# 마치며

SOLID 원칙은 내가 좋아하는, **읽기 쉽고 유연한 구조를 만들기 위한 기본 원칙**였다.

# 참고
- [A Solid Guide to SOLID Principles](https://www.baeldung.com/solid-principles)
- [모든 개발자가 알아야 할 SOLID의 진실 혹은 거짓](https://tech.kakaobank.com/posts/2411-solid-truth-or-myths-for-developers/)
- [얄팍한 코딩사진 YouTube, SOLID 원칙 - 객체지향 디자인 패턴의 기본기](https://youtu.be/4O6k9GN8FPo?si=47UNNDFVFRMWxKOV)
