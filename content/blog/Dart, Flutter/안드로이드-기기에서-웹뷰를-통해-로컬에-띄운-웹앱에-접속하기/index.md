---
title: "안드로이드 기기에서 웹뷰를 통해 로컬에 띄운 웹앱에 접속하기"
date: 2025-08-16
tags: ["Flutter", "Android"]
slug: "post-20250816-2b1107"
---

# 들어가며
현재 개발 중인 플러터 앱에서 웹뷰를 통해 제공 중인 기능이 있다.  
해당 기능의 동작을 테스트하기 위해 실제 안드로이드 기기에 연결 후 로컬에 띄운 리액트 앱과 스프링 서버에 접속하려고 하는데 플러터, 리액트, 스프링에서 싱크를 맞춰야 했다.  
이 과정이 꽤나 복잡하여 놓칠 수 있는 포인트가 많다고 판단되어 이를 정리하려고 한다.

# 그런데 왜 안드로이드 기기에서는 싱크를 맞춰야하지?
결론은, **맥북과 안드로이드 기기는 서로 다른 컴퓨터**이기 때문이다.  
다른 말로, 맥북과 안드로이드 기기는 USB로 연결되어 있음에도 서로 다른 IP를 가지는 서로 다른 두 대의 컴퓨터이다.  
그래서 안드로이드에서 `http://localhost`로 네트워크 요청을 보내면 안드로이드 기기 스스로에게 요청을 보내게 되는 것이다.

하지만 우리가 원하는 행동은 안드로이드에서 맥북으로 요청이다.  
그렇기에 맥북의 IP로 직접 요청해야 하는 것이다.

이를 그림으로 나타내면 아래와 같은 그림이 될 것이다.  
![맥북과 Android 기기의 Layer](layer_architecture.png)

# 싱크 맞추는 법

## 0. 맥북과 Android 기기의 와이파이 통일시키기
두 기기를 동일한 네트워크로 통일시킨다.  
서로 달라도 다른 대로 IP 주소를 설정해주면 되겠지만, 굳이 번거로운 일이겠다.

## 1. 맥북 IP 주소 확인
`ifconfig | grep "inet " | grep -v 127.0.0.1` 명령어를 입력하면 나오는 결과 중, `inet` 뒤에 나오는 IP 주소가 맥북의 주소다.  
두 가지가 나오는 데 위에 나오는 주소로 설정하겠다.
```text
inet 192.168.x.x netmask 0xffffff00 broadcast 192.168.x.xx
inet 192.168.y.y netmask 0xffffff00 broadcast 192.168.y.yy
```

## 2. 플러터에 맥북 IP 주소 설정
맥북 주소에 플러터가 요청을 보내도록 `.env` 파일 등을 수정하자.  

또한 Android 같은 경우는 `AndroidManifest.xml` 파일 등을 통해 접속을 허용해야 하는 경우가 있다.  
나같은 경우에는 `android/app/src/debug/AndroidManifest.xml`에 아래와 같이 정의했다.  
`main/AndroidManifest.xml`과는 분리하여 debug 모드일 때에만 로컬 호스트에 접속에 가능하도록 하여 보안을 신경썼다.  
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET"/>

    <application
        android:networkSecurityConfig="@xml/network_security_config">
    </application>
</manifest>
```
```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <!-- 기본적으로 HTTPS만 허용 -->
    <base-config cleartextTrafficPermitted="false">
        <trust-anchors>
            <certificates src="system"/>
        </trust-anchors>
    </base-config>
    
    <!-- 개발 환경에서만 특정 도메인에 대해 HTTP 허용 -->
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="false">192.168.x.x</domain>
    </domain-config>
</network-security-config>
```

추가로 `MARKET_URL=http://192.168.x.x:3000` 같이 웹뷰를 통해 접속하려는 주소도 설정한다.

## 3. 웹앱에서 접속하려는 서버 주소 설정

플러터만 설정하면 안된다.  
웹뷰에서 띄우려는 웹앱에서 요청을 보낼 서버의 주소도 설정해줘야 한다.  

이 부분이 조금 의아했는데, 뒤에서 설정할 CORS도 웹앱의 호스트와 포트 번호로 설정하기도 하고 웹앱에서 보내는 요청인데 왜 플러터와 동일하게 설정해줘야 하는 지가 궁금했다.  
알고보니 **웹앱이 '안드로이드 기기 위에서' 요청을 보내는 구조**이기 때문이었다.

우리가 맥북에서 카카오톡을 이용해 메시지를 전송한다.  
그 메시지 데이터는 결국 **우리의 PC의 인터넷 회선을 통해** 물리적으로 외부로 요청을 보내게 된다.  
카카오톡이 메시지를 보냈다고 할 수도 있지만, 좀 더 정확히 이야기하면 PC가 메시지를 보낸 것이다.  
카카오톡은 메시지를 보내도록 '명령'하고, PC가 그 명령을 받아 '실행'하는 구조이다.  
따라서 **웹앱에서 설정한 서버 주소는 Android 기기를 통해서 요청을 보내게 되므로** `192.168.x.x:8080` 으로 설정해줘야 한다.  
헷갈리면 위에서 본 사진을 다시 한번 보자.  
![맥북과 Android 기기의 Layer](layer_architecture.png)

## 4. CORS 설정하기

이제 마지막으로 서버에서 CORS를 허용해야 한다.  
브라우저(Flutter의 웹뷰)가 요청을 담아 보내는 `Origin` 헤더(웹앱의 주소)를 기준으로 허용하면 된다.
