---
title: "[Docker] 도커의 기본적인 명령어들"
description: "도커를 사용해보자!"
date: 2024-05-01
tags: ["docker"]
---

웬만하면 `docker command --help`처럼, `--help`를 통해 바로 파악하거나 공식 문서를 통해 자세히 이해할 수 있다.

그래도 도커를 공부하면서 유용한 명령어들을 정리할 겸 작성한다.

## 버전 관련

- `docker version`: 도커의 버전을 확인한다.
- `docker -v`: 도커 버전을 간략하게 확인한다.

## 이미지 관련

- `docker pull NAME[:TAG]`: 도커 허브에서 이미지를 받는다.
- `docker images`: 도커 엔진에 존재하는 이미지 목록을 출력한다.

## 컨테이너 관련

- `docker run`: 컨테이너를 생성과 동시에 실행한다. 내부로 들어간다.
  - `-i`: 상호 입출력을 설정한다.
  - `-t`: tty를 활성하하여 bash shell을 사용한다.
  - `--name NAME`: 컨테이너 이름을 설정한다.
  - `-p`: 호스트의 포트와 컨테이너의 포트를 바인딩해 연결한다.
    - `-p [호스트의 포트]:[컨테이너의 포트]`
    - 컨테이너에 접속할 호스트의 포트를 설정하고, 해당 컨테이너의 포트에 해당하는 프로세스로 통신하는 것이다.
  - ex) `docker run -i -t --name myUbuntu -p 7777:80 ubuntu:14.04`
  - `-d`: `-i`, `-t`가 접근 가능한 상태, Attach로 설정했다면, `-d`는 Detached 모드로 설정한다.
  - `-e`: 컨테이너 내부의 환경변수를 설정한다.
  - `-v`: 컨테이너에 볼륨을 설정한다.
    - `-v HOST_DIRECTORY:CONTAINER_DIRECTORY`: 호스트 볼륨 공유 설정
    - `-v VOLUME_NAME:CONTAINER_DIRECTORY`: 도커 볼륨 설정
  - `--net DRIVER_NAME`: 네트워크 드라이버를 설정한다.
  - `--net-alias HOST_NAME`: 컨테이너의 Domain Name을 설정한다.
  - `--log-opt max-size={} | max-file={}`: 컨테이너가 남기는 로그 파일의 최대 용량과 개수를 설정한다.
- `docker update`: 컨테이너의 설정을 변경한다.
- `docker create NAME|ID`: 컨테이너를 단순히 생성만 한다. 내부로 들어가진 않는다.
- `docker start NAME|ID`: 컨테이너를 실행한다.
- `docker attach NAME|ID`: 컨테이너 내부로 들어간다.
- `docker exec [OPTIONS] CONTAINER COMMAND`: 컨테이너 내부에서 명령어를 실행한다.
  - ex) `docker exec -it mysql /bin/bash`: mysql 컨테이너에 bash shell을 통해 접근한다.
  
- `exit`: 컨테이너를 정지시킴과 동시에 내부에서 빠져나온다.
- `Ctrl + P + Q`: 컨테이너를 정지시키지 않고 내부에서 빠져나온다.
- `Ctrl + D`: 빠져나옴과 동시에 컨테이너를 종료한다.

- `docker inspect NAME|ID`: 도커 객체에 대해 저수준의 정보까지 출력한다.

- `docker ps`: 실행중인 컨테이너 정보 출력한다.
  - `-a`: 정지된 컨테이너도 모두 출력한다.

- `docker rename NAME|ID NEW_NAME`: 컨테이너의 이름을 변경한다.

- `docker stop NAME|ID`: 컨테이너를 중지한다.
- `docker rm NAME|ID`: 컨테이너를 삭제한다.
  - `-f`: 실행 중인 컨테이너를 강제로 삭제한다.
- `docker container prune`: 모든 컨테이너를 삭제한다.

- `docker volume creat NAME`: 도커 볼륨을 생성한다.

## 네트워크 관련

- `docker network create --driver DRIVER DRIVER_NAME`
  - `docker run -it --net DRIVER_NAME`: NAME에 해당하는 네트워크 드라이버를 통해 컨테이너를 생성한다.
- `docker network disconnect DRIVER_NAME CONTAINER_NAME`: 컨테이너에 네트워크를 할당 해제한다. 
- `docker network connect DRIVER_NAME CONTAINER_NAME`: 컨테이너에 네트워크를 할당한다.

## 로깅 관련

- `docker logs CONTAINER`: 컨테이너의 로그를 확인한다.
  - `--tail n`: 뒤에서부터 n줄을 출력한다.
  - `--since Unix_Time`: 특정 시간 이후의 로그를 확인한다.
  - `-t`: 타임 스탬프를 출력한다.
  - `-f`: 로그를 실시간으로 확인한다.

## 이미지 관련

- `docker commit [OPTIONS] CONTAINER [REPOSITORY[:TAG]]`: 컨테이너를 이미지로 만들어 도커 허브에 커밋한다.
  - `-a, --author`: 작성자
  - `-m, --message`: 커밋 메시지
- `docker save [OPTIONS] IMAGE`: 이미지를 파일로 추출한다.
  - `-o, --output NAME`: 추출될 파일명을 설정한다.
- `docker load [OPTIONS]`: 추출된 이미지를 도커로 업로드한다.
  - `-i, --input FILE`: 업로드 할 파일명을 선언한다. 
- `docker tag SOURCE_IMAGE[:TAG] TARGET_IMAGE[:TAG]`: SOURCE_IMAGE의 이름에 TARGET_IMAGE을 추가한다.