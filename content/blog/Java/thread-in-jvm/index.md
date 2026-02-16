---
title: "Java Thread 1 - Java의 Thread에 대해 알아보자"
description: "Java에서 Thread를 구현하고 실행하는 방법과 쓰레드 우선순위, 쓰레드 그룹, 데몬 쓰레드"
date: 2024-07-03
tags: [ "Java", "Thread" ]
slug: "thread-in-jvm"
---

## 1. Java에서 Thread를 구현하고 실행하는 방법

Java에서 Thread를 구현하는 방법으로 두 가지가 있다.<br>
Thread 클래스를 상속받는 방법과 Runnable 인터페이스를 구현하는 방법이다.

어느 방법을 써도 상관은 없지만, Java는 다중 상속이 불가능하기 때문에 Thread 클래스를 상속받으면 다른 클래스를 상속받지 못하게 된다.<br>
또한 Thread 클래스를 상속받게 되면, 부모 클래스의 메서드를 오버라이딩할 수 있게 된다. 이로 인해, Thread 로서 기대하는 동작을 하지 않을 수 있다.

따라서 **재사용성과 일관성을 위해서는 Runnable 인터페이스를 구현하는 방법을 권장**한다.

### Thread 클래스 상속받기

```java
class MyThread extends Thread {

    @Override
    public void run() {
        // 작업 내용
    }
}
```

### Runnable 인터페이스 구현하기 (권장)

```java
class MyThread implements Runnable {

    @Override
    public void run() {
        // 작업 내용
    }
}
```

### 쓰레드 실행하기

위 두 방법 중 하나로 쓰레드를 생성했다면 실행하는 법도 알아야한다.<br>
기본적으로 쓰레드를 실행하는 방법으로는 `Thread` 클래스의 `start()` 메서드를 호출하는 것이다.<br>
하지만 `start()`을 호출하는 방법은 쓰레드를 구현한 방법에 따라 달라진다.

```java
@Test
void 쓰레드를_구현하는_두_방법의_차이() {
    Thread myThread1 = new MyThread1(); // Thread 클래스 상속
    myThread1.start();
    
    Thread myThread2 = new Thread(new MyThread2()); // Runnable 인터페이스 상속
    myThread2.start();
}

class MyThread1 extends Thread {

    @Override
    public void run() {
        System.out.println("Thread1 start !");
    }
}

class MyThread2 implements Runnable {

    @Override
    public void run() {
        System.out.println("Thread2 start !");
    }
}
```

Thread 클래스를 상속한 `MyThread1`은 바로 `Thread` 타입의 인스턴스 변수로 만들고 `run()` 메서드를 실행하면 된다.<br>
하지만 Runnable 인터페이스를 상속한 `MyThread2`는 인스턴스를 만들고, 참조 변수를 `Thread` 클래스의 생성자의 인자로 넘기며 결과적으로 `Thread` 타입 인스턴스를 생성해야 한다.

만약 Runnable 인터페이스를 상속받은 클래스의 인스턴스로 `run()`를 호출하면, 새로운 쓰레드가 생성되어 작업을 수행하지 않고, `run()` 메서드를 호출한 쓰레드가 작업을 이어서 수행하게 된다.

```java
@Test 
void 쓰레드를_구현하는_두_방법의_차이() {
    MyThread2 myThread2 = new MyThread2();
    myThread2.run();
}

== Console ==
Test worker
Test worker
Test worker
Test worker
Test worker
```

### start() 관련 참고 사항

1. **사실은 `start()` 메서드가 호출됐다고 바로 쓰레드의 동작이 실행되는 것은 아니다.**<br>
   Runnable 상태가 되고 CPU 스케줄링에 의해 자신의 차례가 되어야 비로소 실행되는 것이다.
   > 쓰레드의 실행 순서는 OS의 CPU 스케쥴러에 의해 결정된다.

   아래 그림은 쓰레드의 생명 주기를 나타낸 그림이다.
   ![Thread Status](thread-status.png)

2. **한번 실행이 된 쓰레드는 재실행 할 수 없다.**<br>
   즉, 하나의 쓰레드에 대해 `start()`가 단 한 번만 호출될 수 있다.<br>
   만약, 동일한 작업을 한 번 더 수행해야 한다면 새로운 쓰레드를 생성해야 한다.
   ```java
   @Test
   void 쓰레드는_일회용이다() {
       Thread myThread = new MyThread(); // Thread 클래스 상속
       myThread.start();
       myThread.start();
   }
   
   class MyThread extends Thread {
   
         @Override
         public void run() {
               for (int i = 0; i < 5; i++) {
                     System.out.println(getName());
               }
         }
   }
   
   == Console ==
   Thread-3
   Thread-3
   Thread-3
   Thread-3
   Thread-3
   
   java.lang.IllegalThreadStateException
   // ... (생략)
   
   ---
   
   @Test
   void 쓰레드는_일회용이다() {
       Thread myThread = new MyThread(); // Thread 클래스 상속
       myThread.start();
       myThread = new MyThread();
       myThread.start();
   }
   
   == Console ==
   Thread-3
   Thread-3
   Thread-3
   Thread-3
   Thread-3
   Thread-4
   Thread-4
   Thread-4
   Thread-4
   Thread-4
   ```

### start()와 run()의 차이

`start()`와 `run()` 두 방법 모두 쓰레드의 작업을 수행하는 메서드이다.<br>
하지만 한 가지 큰 차이점이 있다면, `start()`는 **새로운 쓰레드를 만들고, 해당 쓰레드로 `run()`을 수행한다는 점**이다.<br>
반면 `run()`은 단순히 메서드를 호출하는 것과 동일하다.

### Main 쓰레드

Java에는 프로그램을 실행시키기 위한 엔트리포인트의 개념으로 main 메서드가 있다.<br>
이 메서드가 실행되면 **main 쓰레드가 생성**되고 **main 쓰레드가 main 메서드를 수행**하는 것이다.

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(Thread.currentThread().getName());
    }
}

== Console ==
main
```

main 메서드의 작업이 모두 수행되면 프로그램이 종료된다.<br>
하지만 main 메서드가 모든 작업을 마쳤다하더라도 다른 쓰레드가 아직 작업을 마치지 않은 상태라면 어떻게 될까?<br>
프로그램이 종료되지 않는다.

따라서, **실행 중인 유저 쓰레드(데몬 쓰레드가 아닌 쓰레드)가 하나도 없을 때 비로소 프로그램은 종료**된다.

## 2. 쓰레드의 우선순위

`Thread` 클래스에는 `int priority`라는 인스턴스 변수를 가진다.<br>
이 변수로 쓰레드의 작업 우선순위를 설정하여 쓰레드가 얻는 실행시간이 달라진다.

`Thread` 클래스의 `public final void setPriority(int newPriority)` 메서드를 통해 쓰레드의 우선순위를 결정할 수 있으며 설정할 수 있는 값의 범위는 1부터 10까지이다.
범위를 벗어난 값으로 설정하면 `IllegalArgumentException`이 발생한다.
아래는 `Thread` 클래스의 priority 관련 코드를 요약한 코드다.

```java
public class Thread implements Runnable {

    private int priority;

    /**
     * The minimum priority that a thread can have.
     */
    public static final int MIN_PRIORITY = 1;
    
    /**
     * The default priority that is assigned to a thread.
     */
    public static final int NORM_PRIORITY = 5;
    
    /**
     * The maximum priority that a thread can have.
     */
    public static final int MAX_PRIORITY = 10;
        
    public final void setPriority(int newPriority) {
        ThreadGroup g;
        checkAccess();
        if (newPriority > MAX_PRIORITY || newPriority < MIN_PRIORITY) { // 범위 제한
            throw new IllegalArgumentException();
        }
        if((g = getThreadGroup()) != null) {
            if (newPriority > g.getMaxPriority()) {
                newPriority = g.getMaxPriority();
            }
            setPriority0(priority = newPriority);
        }
    }
}
```

priority 값이 클수록 우선순위가 높아진다.<br>
또 알아두어야 할 것으로, 쓰레드를 생성한 쓰레드로부터 우선순위를 상속받는다.<br>
main 메서드를 수행하는 main 쓰레드는 priority 값이 5이므로 main 메서드 내에서 생성하는 쓰레드의 priority 값은 자동적으로 5가 된다.

```java
@Test
void 쓰레드의_우선순위() {
    MyThread1 myThread1 = new MyThread1();
    MyThread2 myThread2 = new MyThread2();

    myThread1.setPriority(7);

    System.out.println("Priority of myThread1(-): " + myThread1.getPriority());
    System.out.println("Priority of myThread2(|): " + myThread2.getPriority());

    myThread1.start();
    myThread2.start();
}

class MyThread1 extends Thread {

    @Override
    public void run() {
        for (int i = 0; i < 300; i++) {
            System.out.print("-");
            for (int j = 0; j < 10000000; j++) {
            }
        }
    }
}

class MyThread2 extends Thread {

    @Override
    public void run() {
        for (int i = 0; i < 300; i++) {
            System.out.print("|");
            for (int j = 0; j < 10000000; j++) {
            }
        }
    }
}


== Console ==
Priority of myThread1(-): 7
Priority of myThread2(|): 5 // Default로 5가 설정되어 있다.
-|-|-------------------------------------------------------
-----------------------------------------------------------
-----------------------------------------------------------
-----||||||||||||||||||||||||||||||||||||||||||||||||||||||
||-----------------------------||||||||||||||||||||||||||||
|||||||||||||||||||||||||||||||||||||||||||||||
```

위 콘솔에 출력된 결과물은 두 쓰레드의 작업 결과이다.<br>
매번 수행 결과는 달라지지만, 매번 "-" 가 더 많이, 그리고 자주 나오지는 않는다.<br>
이유로는 맥북 에어 M1 (4코어) 환경에서 테스트를 수행했기 때문인데, 4개의 코어에서 동시에 2개의 쓰레드를 처리할 수 있기 때문에 우선순위는 크게 작용되지 않는 모습이다.<br>
우선순위는 싱글 코어에서 큰 효과를 나타낼 것으로 기대한다.

멀티코어라 해도 운영체제마다 다른 방식으로 스케쥴링하기 때문에, 어떤 운영체제에서 실행하느냐에 따라 다른 결과를 얻을 수 있다.
굳이 우선순위에 차등을 두어 쓰레드를 실행하려면, 특정 운영체제에의 스케쥴링 정책과 JVM의 구현을 직접 확인해야 한다.<br>
자바는 쓰레드가 우선순위에 따라 어떻게 다르게 처리되어야 하는지에 대해 강제하지 않기에 JVM에 따라 우선순위 관련 구현이 다를 수 있기 때문이다.

만일 확인한다한들, 운영체제의 스케쥴러에 종속적이라서 어느 정도 예측만 가능하지 정확히 알 수는 없다.
차라리 **쓰레드에 우선순위를 부여하는 대신 작업에 우선순위를 두어 `PriorityQueue`에 저장해놓고, 우선순위가 높은 작업이 먼저 처리되도록 하는 것이 나을 수 있다.**

## 3. 쓰레드 그룹

쓰레드 그룹은 **서로 관련된 쓰레드를 그룹으로 다루기 위한 것**으로, 폴더를 생성해 관련된 파일들을 함께 넣어 관리하는 것처럼 관리할 수 있다.
또, 폴더 안에 폴더를 생성할 수 있듯이 쓰레드 그룹에 다른 쓰레드 그룹을 포함시킬 수 있다.

사실 쓰레드 그룹은 보안상의 이유로 도입된 개념으로, **쓰레드 자신이 속한 쓰레드 그룹이나 하위 쓰레드 그룹은 변경할 수 있지만 다른 쓰레드 그룹의 쓰레드는 변경할 수 없다.**

**모든 쓰레드는 반드시 쓰레드 그룹에 포함되어 있다.**
따라서 쓰레드를 생성할 때 별도로 쓰레드 그룹을 지정하지 않으면, 쓰레드를 생성한 쓰레드와 같은 쓰레드 그룹에 속하게 된다.

```java
@Test
void 모든_쓰레드는_반드시_쓰레드_그룹에_포함된다() {
    Thread currentThread = Thread.currentThread();
    MyThread1 myThread1 = new MyThread1();

    System.out.println("ThreadGroup of CurrentThread ==> " + currentThread.getThreadGroup().getName());
    System.out.println("ThreadGroup of MyThread1 ==> " + myThread1.getThreadGroup().getName());

    assertThat(currentThread.getThreadGroup()).isEqualTo(myThread1.getThreadGroup());
}

== Console ==
ThreadGroup of CurrentThread ==> main
ThreadGroup of MyThread1 ==> main
```

자바 애플리케이션이 실행되면, JVM은 main과 system이라는 쓰레드 그룹을 만든다.<br>
그리고 JVM 운영에 필요한 쓰레드들을 생성해서 이 쓰레드 그룹에 포함한다.<br>
예를 들어 main 메서드를 수행하는 main 쓰레드는 main 쓰레드 그룹에 속하고, 가비지컬렉션을 수행하는 Finalizer 쓰레드는 system 쓰레드 그룹에 속하게 된다.

우리가 생성하는 모든 쓰레드 그룹은 main 쓰레드 그룹의 하위 쓰레드 그룹이 되며, 쓰레드 그룹을 지정하지 않고 생성한 쓰레드는 자동적으로 main 쓰레드 그룹에 속하게 된다.

## 4. 데몬 쓰레드

데몬 쓰레드(Daemon Thread)는 **백그라운드에서 실행하는 쓰레드**로, **일반 쓰레드(데몬 쓰레드가 아닌 쓰레드)의 작업을 돕기 위한 쓰레드**이다.
일반 쓰레드가 종료되면, 데몬 쓰레드는 더이상 작업을 수행할 이유가 없어지기 때문에 강제적으로 자동 종료되는 특징을 가진다.
이 점을 제외하고는 일반 쓰레드와 다르지 않다.

데몬 쓰레드는 무한루프와 조건문을 이용해서 무한히 실행하며 특정 조건이 만족되면 작업을 수행하고 다시 대기하도록 작성한다.
아래는 데몬 쓰레드를 사용하는 예시이다.

```java
public class MyDaemonThread implements Runnable {

    static boolean autoSave = false;

    public static void main(String[] args) {
        Thread thread = new Thread(new MyDaemonThread());
        thread.setDaemon(true); // 설정해주지 않으면 데몬 쓰레드가 종료되지 않는다.
        thread.start();

        for (int i = 1; i <= 10; i++) {
            try {
                Thread.sleep(1000); // 1초마다
            } catch (InterruptedException e) {
            }

            System.out.println(i); // i를 출력한다.

            // i가 5가 되면 autoSave 값을 true로 변경한다.
            if (i == 5) {
                autoSave = true;
            }
        }
    }

    @Override
    public void run() {
        while (true) { // 일반 쓰레드가 종료될 때까지 계속해서 수행한다.
            try {
                Thread.sleep(3 * 1000); // 3초마다 실행
            } catch (InterruptedException e) {
            }

            // 조건이 만족하면 정해진 작업을 수행한다.
            if (autoSave) {
                autoSave();
            }
        }
    }

    public void autoSave() {
        System.out.println("작업 파일이 자동 저장되었습니다.");
    }
}

== Console ==
1
2
3
4
5
작업 파일이 자동 저장되었습니다.
6
7
8
작업 파일이 자동 저장되었습니다.
9
10
```

데몬 쓰레드가 3초마다 작업을 수행하도록 설정했다.<br>
하지만 쉬지않고 `autoSave` 값을 체크하도록 설정하면 어떻게 될까?<br>
예상컨데 i가 5가 되는 순간부터 자동 저장이 무수히 많이 수행될 것이다.<br>
이는 CPU 사용량을 급격히 높이고 심하면 프로그램에 장애까지 생길 것이다.<br>
따라서 적절히 시간 공백을 두어 주기적으로 한 번씩 실행하도록 하는 것이 중요하다.

## 5. getAllStackTraces()

`getAllStackTraces()`를 호출하면 Running 또는 Runnable 상태인 모든 쓰레드의 호출스택을 출력할 수 있다.

```java
import java.util.Map;
import org.junit.jupiter.api.Test;

class ThreadTest {

    @Test
    void getAllStackTraces() {
        MyThread1 myThread1 = new MyThread1("Thread1");
        MyThread2 myThread2 = new MyThread2("Thread2");
        myThread1.start();
        myThread2.start();
    }
}

class MyThread1 extends Thread {

    public MyThread1(String name) {
        super(name);
    }

    @Override
    public void run() {
        try {
            sleep(5 * 1000); // 5초 대기한다.
        } catch (InterruptedException e) {
        }
    }
}

class MyThread2 extends Thread {

    public MyThread2(String name) {
        super(name);
    }

    @Override
    public void run() {
        Map<Thread, StackTraceElement[]> allStackTraces = getAllStackTraces();

        int id = 0;
        for (Map.Entry<Thread, StackTraceElement[]> entry : allStackTraces.entrySet()) {
            Thread thread = entry.getKey();
            StackTraceElement[] stackTraceElements = entry.getValue();

            System.out.println("[" + ++id + "] name : " + thread.getName() + ", group : " + thread.getThreadGroup().getName() + ", daemon : " + thread.isDaemon());

            for (StackTraceElement stackTraceElement : stackTraceElements) {
                System.out.println(stackTraceElement);
            }

            System.out.println();
        }
    }
}

== Console ==
[1] name : Monitor Ctrl-Break, group : main, daemon : true
java.base@17.0.11/sun.nio.ch.SocketDispatcher.read0(Native Method)
java.base@17.0.11/sun.nio.ch.SocketDispatcher.read(SocketDispatcher.java:47)
...(생략)

[2] name : Notification Thread, group : system, daemon : true

[3] name : Reference Handler, group : system, daemon : true
java.base@17.0.11/java.lang.ref.Reference.waitForReferencePendingList(Native Method)
java.base@17.0.11/java.lang.ref.Reference.processPendingReferences(Reference.java:253)
java.base@17.0.11/java.lang.ref.Reference$ReferenceHandler.run(Reference.java:215)

[4] name : Signal Dispatcher, group : system, daemon : true

[5] name : Thread1, group : main, daemon : false
java.base@17.0.11/java.lang.Thread.sleep(Native Method)
app//MyThread1.run(ThreadTest.java:24)

[6] name : main, group : main, daemon : false
java.base@17.0.11/java.lang.StringLatin1.regionMatchesCI(StringLatin1.java:399)
java.base@17.0.11/java.lang.String.regionMatches(String.java:2232)
...(생략)

[7] name : Thread2, group : main, daemon : false
java.base@17.0.11/java.lang.Thread.dumpThreads(Native Method)
java.base@17.0.11/java.lang.Thread.getAllStackTraces(Thread.java:1671)
app//MyThread2.run(ThreadTest.java:38)

[8] name : Common-Cleaner, group : InnocuousThreadGroup, daemon : true
java.base@17.0.11/java.lang.Object.wait(Native Method)
java.base@17.0.11/java.lang.ref.ReferenceQueue.remove(ReferenceQueue.java:155)
java.base@17.0.11/jdk.internal.ref.CleanerImpl.run(CleanerImpl.java:140)
java.base@17.0.11/java.lang.Thread.run(Thread.java:840)
java.base@17.0.11/jdk.internal.misc.InnocuousThread.run(InnocuousThread.java:162)

[9] name : Finalizer, group : system, daemon : true
java.base@17.0.11/java.lang.Object.wait(Native Method)

Process finished with exit code 0
```

콘솔 창에 출력된 결과를 보면, 따로 생성한 `Thread1`, `Thread2`를 제외하고 7개의 쓰레드가 실행 중이거나 대기 상태에 있다는 것을 알 수 있다.

일부는 group이 system인 쓰레드, daemon으로 동작 중인 쓰레드가 있는 것도 확인할 수 있다.

## 다음으로

지금까지 Java에서 쓰레드를 구현하고 실행하는 방법, Main 쓰레드, 쓰레드의 우선순위, 쓰레드 그룹, 데몬 쓰레드에 대해 알아보았다.<br>
다음으로 쓰레드의 상태와 쓰레드의 행동을 제어하는 메서드들에 대해 알아보겠다.