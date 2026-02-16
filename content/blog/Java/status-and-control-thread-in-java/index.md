---
title: "Java Thread 2 - Java Thread의 상태와 행동을 제어하는 방법"
description: "쓰레드 상태와 상태 관련 메서드 (sleep, interrupt, yield, join)"
date: 2024-07-05
tags: [ "Java", "Thread" ]
slug: "status-and-control-thread-in-java"
---

## 들어가며

지난 글에는 Java에서 쓰레드를 구현하고 실행하는 방법, Main 쓰레드, 쓰레드의 우선순위, 쓰레드 그룹, 데몬 쓰레드에 대해 알아보았다.

이번 글에서는 쓰레드를 다루고 사용함에 있어 중요한 **쓰레드의 상태**와 **쓰레드의 행동을 제어하는 메서드**들에 대해 알아보겠다.

## 쓰레드의 실행제어

사실상 쓰레드를 사용함에 있어 핵심이 되는 부분이라고 생각한다.<br>
쓰레드를 생성하고 사용하는 것은 어렵지 않다. 하지만 개발자가 의도한대로 동작하는 것은 어렵다.<br>
개발자가 의도한대로 동작한다는 의미는, 동기화(synchronization)와 스케줄링(scheduling)을 한다는 말인데 스케줄링을 효율적으로 수행하면서 여러 쓰레드가 동시성 문제를 일으키지 않도록 동기화를 하는 것은 중요하면서 쉽지 않다.

스케줄링을 잘하기 위해선 **쓰레드의 상태**와 **관련 메서드**를 잘 알아야 한다.

## 쓰레드 상태

우선 쓰레드의 상태에 대해 알아보자.

```java
public class Thread implements Runnable {
   
      public enum State {
        NEW,
        RUNNABLE,
        BLOCKED,
        WAITING,
        TIMED_WAITING,
        TERMINATED;
    }
}
```

쓰레드의 상태에는 총 6가지가 있다.

|      상태       |                 설명                 |
|:-------------:|:----------------------------------:|
|      NEW      | 쓰레드가 생성되고 아직 `start()`가 호출되지 않은 상태 |
|   RUNNABLE    |         실행 가능하거나 실행 중인 상태          |
|    BLOCKED    |        락을 획득하기 위해 대기 중인 상태         |
|    WAITING    |       무기한으로 다른 쓰레드를 대기 중인 상태       |
| TIMED_WAITING |     지정된 시간동안 다른 쓰레드를 대기 중인 상태      |
|  TERMINATED   |          쓰레드의 작업이 종료된 상태           |

## 상태 관련 메서드

다음으로 상태 관련 메서드에 대해 알아보자.

|                                     메서드                                      |                                                             설명                                                             |
|:----------------------------------------------------------------------------:|:--------------------------------------------------------------------------------------------------------------------------:|
| static void sleep(long millis)<br/>static void sleep(long millis, int nanos) |                쓰레드를 지정한 시간동안 일시정지(WAITING, TIMED_WAITING, BLOCKED)시킨다.<br/>지정한 시간이 지나면, 다시 RUNNABLE 상태가 된다.                |
| void join()<br/>void join(long millis)<br/>void join(long millis, int nanos) |  특정 쓰레드를 지정한 시간동안 실행한다.<br/>지정된 시간이 지나거나 작업이 종료되면 `join()`을 호출한 쓰레드로 다시 돌아와 실행을 계속한다.<br/>시간을 지정하지 않으면 작업이 종료될 때까지 대기한다.   |
|                               void interrupt()                               | `sleep()`이나 `join()`에 의해 WAITING 상태가 된 쓰레드를 깨워 RUNNABLE 상태로 만든다.<br/>해당 쓰레드는 InterruptedException을 발생함으로써 일시정지상태를 벗어나게 된다. |
|                             static void yield()                              |                                  실행 중, 자신에게 주어진 실행시간을 다른 쓰레드에게 양보하고 자신은 RUNNABLE 상태가 된다.                                   |
|                           (deprecated) void stop()                           |                                                       쓰레드를 즉시 종료시킨다.                                                       |
|                         (deprecated) void suspend()                          |                                   쓰레드를 일시정지시킨다.<br/>`resume()`을 호출하면 다시 RUNNABLE 상태가 된다.                                   |
|                            (deprecated) resume()                             |                                     `suspend()`에 의해 일시정지상태에 있는 쓰레드를 RUNNABLE 상태로 만든다.                                      |

> 참고) stop(), suspend(), resume()은 쓰레드를 교착상태로 만들기 쉽기 때문에 deprecate 됐다.

### Thread의 LifeCycle

쓰레드의 라이프사이클을 그려보았다.<br>
항상 쓰레드가 번호 순서대로 동작한다는 보장은 없지만, 모든 경우를 한 번 씩 거친다는 가정하에 순서를 매겨보았다.<br>
사진을 클릭하면 깔끔하게 볼 수 있다.

![](thread-status-in-jvm.jpeg)

## sleep(long millis) - 일정 시간동안 대기한다.

`static void sleep(long millis)` 메서드는 쓰레드를 일정 시간동안 일시정지 상태로 만든다.<br>
일지정지된 쓰레드는 주어진 시간이 모두 지나거나(time-out) 또는 `interrupt()`가 호출되면 `InterruptedExcepion`이 발생되고 실행대기 상태가 된다.

주어진 시간이 모두 지났을 때에는 `InterruptedExcepion`이 발생하지 않고 `Runnable` 상태가 된다.

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("[" + LocalDateTime.now() + "] Start");
        MyThread1 myThread1 = new MyThread1();
        System.out.println("[" + LocalDateTime.now() + "] Init State ==> " + myThread1.getState());
        myThread1.start();
    }
}

class MyThread1 extends Thread {

    @Override
    public void run() {
        try {
            System.out.println("[" + LocalDateTime.now() + "] Before Sleep ==> " + getState());
            sleep(5 * 1000); // 5초간 sleep
            System.out.println("[" + LocalDateTime.now() + "] After Sleep ==> " + getState());
        } catch (InterruptedException e) {
            System.out.println("[" + LocalDateTime.now() + "] Interrupted ==> " + getState());
        }
    }
}

== Console ==
[2024-07-03T19:07:02.812505] Start
[2024-07-03T19:07:02.818183] Init State ==> NEW
[2024-07-03T19:07:02.825393] Before Sleep ==> RUNNABLE
[2024-07-03T19:07:07.829930] After Sleep ==> RUNNABLE
```

1. 위 코드를 실행하면 곧바로 "Init State ==> NEW"와 "Before Sleep ==> RUNNABLE"이 출력되고 5초 뒤에 "After Sleep ==> RUNNABLE" 이 출력된다.<br>
2. `myThread1`이 생성되어 _NEW_ 상태가 되고 `start()` 메서드 호출로 _RUNNABLE_ 상태로 바뀐다.<br>
3. 그리고 본인의 차례가 되면 `run()` 메서드가 호출되어 작업을 시작한다.<br>
4. `run()` 안에서 `sleep()`을 호출하기 전 상태는 _RUNNABLE_ 이고, `sleep()`이 호출되어 쓰레드는 동작을 멈추게 된다.
5. 5초가 지나면 RUNNABLE 상태로 바뀐다. 따라서 다음 코드를 수행할 수 있게 된다.<br>결과적으로 "After Sleep ==> RUNNABLE" 이 출력된다.

<br>

그럼 `MyThread`를 실행하고 3초 뒤에 `interrupt()`를 호출해보면 어떻게 될까?

```java
public class Main {
    public static void main(String[] args) throws InterruptedException {
        System.out.println("[" + LocalDateTime.now() + "] Start");
        MyThread1 myThread1 = new MyThread1();
        System.out.println("[" + LocalDateTime.now() + "] Init State ==> " + myThread1.getState());
        myThread1.start();

        Thread.sleep(3 * 1000);
        myThread1.interrupt();
    }
}

class MyThread1 extends Thread {

    @Override
    public void run() {
        try {
            System.out.println("[" + LocalDateTime.now() + "] Before Sleep ==> " + getState());
            sleep(5 * 1000); // 5초간 sleep
            System.out.println("[" + LocalDateTime.now() + "] After Sleep ==> " + getState());
        } catch (InterruptedException e) {
            System.out.println("[" + LocalDateTime.now() + "] Interrupted ==> " + getState());
        }
    }
}

== Console ==
[2024-07-03T19:06:30.126652] Start 
[2024-07-03T19:06:30.136039] Init State ==> NEW
[2024-07-03T19:06:30.143565] Before Sleep ==> RUNNABLE
[2024-07-03T19:06:33.145258] Interrupted ==> RUNNABLE
```

"Before Sleep ==> RUNNABLE" 까지는 위와 동일하다.<br>
하지만 3초 뒤에 `myThread1.interrupt()`을 호출하니 "Interrupted ==> RUNNABLE"가 출력되었다.<br>
`InterruptedException`이 발생하는 것을 확인할 수 있다.

<br>

`sleep()`을 사용할 때 한 가지 주의할 점이 있다.<br>
아래 예시 코드를 살펴보자.

```java
public class Main {
    public static void main(String[] args) throws InterruptedException {
        MyThread1 myThread1 = new MyThread1();
        MyThread2 myThread2 = new MyThread2();
        myThread1.start();
        myThread2.start();

        // myThread1에게 2초간 sleep 시킨다.
        myThread1.sleep(2 * 1000);

        System.out.println("[Th-main] 종료 ");
    }
}

class MyThread1 extends Thread {

    @Override
    public void run() {
        for (int i = 0; i < 300; i++) {
            System.out.print("1");
        }
        System.out.println("[Th-1] 종료 ");
    }
}

class MyThread2 extends Thread {

    @Override
    public void run() {
        for (int i = 0; i < 300; i++) {
            System.out.print("2");
        }
        System.out.println("[Th-2] 종료 ");
    }
}

== Console ==
111111222222222222222222222222222221122211111111111222222221111111111111111111111111
122222222222222222222222222222222221222222111221111111122222222222222222222222222222
222211111111111111111111111111111111111111111111111111111111111111222222222222211111
111111112222222222222222222222222211111111111222222222221122222222222222222222222222
222222221111111111111111111111111111111111122222222222222222112222222221111111111111
111111111111111111111111222222222222222222222222222222222211111121222222222211122222
2222221122222222222222222221[Th-2] 종료 111111111111111111111111111111111111111111111
11111111111111111111111[Th-1] 종료 [Th-main] 종료 
```

위 코드를 살펴보면, `myThread1`과 `myThread2`를 실행하고, `myThread1.sleep(2 * 1000)`을 호출하여 `Thread1`에게 2초간 대기 상태에 빠지도록 했다.<br>
하지만 여러 번 반복 실행해도 매번 **[Th-main]이 맨 나중에 끝난다.**<br>
정작 [Th-1]은 제일 먼저 끝나는 경우도 발생한다.<br>
왜 이런 현상이 발생할까?

이유는 바로 **`sleep()` 메서드는 현재 실행 중인 쓰레드에 대해 동작**하기 때문이다.<br>
즉, 아래 두 코드가 동일한 것이다.

```java
myThread1.sleep(2 * 1000); == Thread.currentThread().sleep(2 * 1000);
```

이러한 이유로 `sleep()` 메서드는 static으로 선언되어 있으며, 참조변수를 이용해서 `sleep()`을 호출하기 보단 **가급적 `Thread.sleep()`을 통해 호출하는 것이 권장**된다.

`MyThread1`에 `sleep`을 걸고 싶으면 `MyThread1`에서 `sleep()`을 호출해야 한다.

## interrupt()와 interrupted() - 쓰레드의 작업을 취소한다.

**`interrupt()`는 쓰레드에게 작업을 멈추라고 요청**한다.<br>
하지만 요청만 할 뿐, 강제로 멈추게 할 수는 없다.<br>
그저 `Thread`의 인스턴스 변수인 `boolean interrupted` 값을 바꿀 뿐이다.

`boolean interrupted` 값을 확인하는 방법으로는 `boolean isInterrupted()`와 `static boolean interrupted()`가 있다.
둘의 차이로, `isInterrupted()`의 경우 단순히 `boolean interrupted` 값을 반환하지만,
`Thread.interrupted()`는 만약 `boolean interrupted` 값이 `true` 일 경우, 현재의 값을 반환하면서 값을 `false`로 설정한다.<br>
그리고 **`Thread.interrupted()`는 메서드를 호출하는 현재 쓰레드를 대상으로 동작**한다.

쓰레드가 `sleep()`, `wait()`, `join()` 에 의해 일시정지 상태에 있을 때, 해당 쓰레드에 `interrupt()`를 호출하면 `InterruptedException`이 발생하고 쓰레드는
RUNNABLE 상태로 바뀐다. 그리고 동시에 `interrupted` 상태는 `false`로 초기화된다.

아래 코드로 이해해보자.

```java
import javax.swing.*;

public class Main {
    public static void main(String[] args) {
        MyThread myThread = new MyThread();
        myThread.start();

        String input = JOptionPane.showInputDialog("아무 값이나 입력하세요.");
        System.out.println("입력값: " + input);
        myThread.interrupt();
        System.out.println("isInterrupted: " + myThread.isInterrupted());
    }
}

class MyThread extends Thread {

    @Override
    public void run() {
        int i = 10;

        while (i != 0 && !isInterrupted()) {
            System.out.println(i--);
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                System.out.println("InterruptedException 발생!");
            }
        }

        System.out.println("카운트 종료");
    }
}

== Console ==
10
9
8
7
입력값: abcd
InterruptedException 발생!
6
isInterrupted: true
5
4
3
2
1
카운트 종료
```

1. `MyThread`는 i를 출력하고 값을 1 감소한다.<br>
2. 그리고 `Thread.sleep(1000)` 으로 1초간 `TIMED_WAITING` 상태가 된다.<br>
3. 사용자의 입력이 주어지기 전까지는 `interrupt()` 가 발생되지 않기에 1초가 지나면 `InterruptedException`는 발생하지 않고 자동으로 `RUNNABLE` 상태로 변경된다.
4. 만약 이때, 사용자의 입력이 주어지면 `interrupt()`가 호출되어 _"isInterrupted: true"_ 가 출력된다.
5. 하지만 while문은 종료되지 않는다.
6. 이유는, `Thread.sleep(1000)` 으로 `TIMED_WAITING` 상태인 와중에, `interrupt()`가 호출되었기 때문에 **`InterruptedException`가 발생하면서
동시에 `interrupted` 상태는 `false`로 초기화**되기 때문이다.
따라서 `break`로 해당 while문을 탈출하거나, **catch문 안에 `interrupt()`를 호출하여 쓰레드 본인의 `interrupted` 상태를 `true`로 바꿔줘야 한다.**

```java
catch (InterruptedException e) {
    interrupt();
}
```

## yield() - 다른 쓰레드에게 양보한다.

`yield()`는 자신의 실행 시간을 다음 차례의 쓰레드에게 양보하고, 자신은 RUNNABLE 상태로 돌아간다.<br>
**`yield()`를 적절히 사용하면 프로그램의 응답성을 높이고 효율적인 멀티 쓰레딩 프로그램을 작성**할 수 있다.<br>
실제로 `yield()`를 사용해서 효율을 높인 예시 코드를 살펴보자.<br>

```java
public class Main {
    public static void main(String[] args) {
        MyThread thread1 = new MyThread("*");
        MyThread thread2 = new MyThread("**");
        MyThread thread3 = new MyThread("***");
        thread1.start();
        thread2.start();
        thread3.start();

        try {
            Thread.sleep(2000);
            thread1.suspend();
            Thread.sleep(2000);
            thread2.suspend();
            Thread.sleep(2000);
            thread1.resume();
            Thread.sleep(3000);
            thread1.stop();
            thread2.stop();
            Thread.sleep(2000);
            thread3.stop();
        } catch (InterruptedException e) {
        }
    }
}

class MyThread implements Runnable {

    private final Thread thread;

    private boolean stopped = false;
    private boolean suspended = false;

    public MyThread(String name) {
        this.thread = new Thread(this, name);
    }

    @Override
    public void run() {
        String name = thread.getName();
        
        while (!stopped) { // stopped 될 때까지 무한정 실행
            if (!suspended) { // suspend 상태가 아니면
                System.out.println(name); // name 출력

                try {
                    Thread.sleep(1000); // 1초 대기
                } catch (InterruptedException e) {
                    System.out.println(name + " - interruped !!");
                }
            } else { // suspend 상태이면
                // yield() 호출
                // 만약, yield()를 호출하지 않으면 무한정 while 문을 반복한다.
                Thread.yield();
            }
        }

        System.out.println(name + " - stopped");
    }

    public void suspend() {
        suspended = true;
        this.thread.interrupt();
        System.out.println(thread.getName() + " - interrupt() by suspend()");
    }

    public void stop() {
        stopped = true;
        this.thread.interrupt();
        System.out.println(thread.getName() + " - interrupt() by stop()");
    }

    public void resume() {
        suspended = false;}

    public void start() {
        this.thread.start();
    }
}
```

`suspend()`와 `stop()`, `resume()`은 교착상태를 유발하기에 deprecated 되었지만, `yield()`를 잘 이해하기 위해 사용했다.<br>

위 코드에서 중점적으로 봐야할 것은 Main 메서드의 로직보다는 `MyThread`의 로직이다.<br>

`MyThread`는 _stopped_ 가 되기 전까지는 name을 출력하고 1초간 대기하는 작업을 무한히 수행한다.<br>
하지만 이때, _suspended_ 상태에 따라 행동이 달라진다.<br>
만약, `suspend()`가 호출되어 잠시 일시정지 상태가 되었을 때, 출력을 하지 않는다.<br>
더이상 while문을 돌 필요가 없게 된 것이다.<br>
따라서 `suspended`가 `false`가 될 때까지 다른 쓰레드에게 작업을 양보하는 것이 효율적일 것이다.

실제로 위 코드에서 `yield()` 메서드를 호출하는 부분을 주석처리해보면, 프로그램이 비효율적으로 동작하는 것을 확인할 수 있다.

## join() - 다른 쓰레드의 작업을 기다린다.

`join()` 메서드를 호출하는 쓰레드 자신이, 하던 작업을 멈추고 특정 쓰레드에게 지정된 시간동안 작업을 수행하도록 본인은 WAITING 상태로 대기할 때 사용한다.<br>
시간을 지정하지 않으면, 특정 쓰레드의 작업이 모두 끝날 때까지 대기한다.

`join()`도 `sleep()` 처럼 `interrupt()`로 WAITING 상태에서 RUNNABLE 상태로 된다.<br>
둘의 차이로, **`join()` 메서드는 대상이 현재 쓰레드가 아닌 다른 특정 쓰레드에 대해서 동작한다**는 점이다.<br>
이때문에 static 메서드가 아니다.

이번에도 예시 코드를 살펴보자.

아래 코드는 300번 동안 각자의 문자열을 출력하는 `Thread1`과 `Thread2`가 있을 때<br>
main 쓰레드가 `Thread1`과 `Thread2`의 작업이 끝날 때까지 대기하기 위해 `join()` 메서드를 호출하는 코드이다.

```java
public class Main {
    public static void main(String[] args) {
        Thread1 thread1 = new Thread1();
        Thread2 thread2 = new Thread2();
        thread1.start();
        thread2.start();

        long startTime = System.currentTimeMillis();

        try {
            thread1.join(); // main 쓰레드가 thread1의 작업이 끝날 때까지 기다린다.
            thread2.join(); // main 쓰레드가 thread2의 작업이 끝날 때까지 기다린다.
            // thread1과 thread2에 join() 했기 때문에, main 쓰레드는 바로 종료되지 않는다.
        } catch (InterruptedException e) {
        }

        long endTime = System.currentTimeMillis();
        System.out.println("소요시간: " + (endTime - startTime));
    }
}

class Thread1 extends Thread {

    @Override
    public void run() {
        for (int i = 0; i < 300; i++) {
            System.out.print(new String("-"));
        }
    }
}

class Thread2 extends Thread {

    @Override
    public void run() {
        for (int i = 0; i < 300; i++) {
            System.out.print(new String("|"));
        }
    }
}

== Consele ==
소요시간: 8
```

위 코드를 실행하면 실행 시간이 매번 0 이상의 값이 나올 것이다.<br>
만약 `join()` 관련 코드를 모두 주석처리 한 다음 실행해보면, 항상 0이 출력되는 것을 확인할 수 있다.

이번에는 `join()` 메서드를 사용하는 다른 예시로, 가비지 콜렉터를 데몬 쓰레드로 만들어본 코드를 통해 `sleep()`, `interrupt()`, `join()` 을 사용하는 법에 대해 이해해보자.<br>
자세한 설명은 주석을 참고하자.

```java
class GarbageCollector extends Thread {

    private static final int MAX_MEMORY = 1000;

    int usedMemory = 0;

    public GarbageCollector() {
        setDaemon(true);
    }

    @Override
    public void run() {
        while (true) {
            try {
                sleep(10 * 1000); // 10초 주기로 실행한다.
            } catch (InterruptedException e) {
                System.out.println("Awaken by interrupt()");
            }
            gc(); // 로직을 수행한다.
            System.out.println("Garbage Collected. Free Memory : " + freeMemory()); // 결과를 출력한다.
        }
    }

    private void gc() {
        usedMemory -= 300;
        if (usedMemory < 0) {
            usedMemory = 0;
        }
    }

    public int totalMemory() {
        return MAX_MEMORY;
    }

    public int freeMemory() {
        return MAX_MEMORY - usedMemory;
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        GarbageCollector gc = new GarbageCollector();
        gc.start();

        int requiredMemory = 0;
        for (int i = 0; i < 20; i++) {
            requiredMemory = (int) (Math.random() * 10) * 20;

            // 필요한 메모리가 사용할 수 있는 양보다 크거나, 전체 메모리의 60% 이상을 사용했을 경우
            if (gc.freeMemory() < requiredMemory || gc.freeMemory() < gc.totalMemory() * 0.4) {
                gc.interrupt(); // sleep 상태인 gc를 깨운다.
                gc.join(100); // 0.1초 동안 gc가 작업을 수행할 때까지 main 쓰레드는 잠시 대기한다.
            }

            gc.usedMemory += requiredMemory;
            System.out.println("usedMemory: " + gc.usedMemory);
        }
    }
}
```

## 마치며

지금까지 **쓰레드의 상태**와 **쓰레드의 행동을 제어하는 메서드**들에 대해 알아보았다.<br>
쓰레드를 다루기 위해서 필수적인 지식이므로 직접 코드를 작성하고 실행시켜가며 이해하는 것이 중요해보인다.

다음으로는 여러 쓰레드를 동시에 실행시켰을 때, **동기화하는 법**에 대해 알아보겠다.