---
title: "macOS와 Linux의 File System 대소문자 구분으로 인해 발생한 문제 해결"
description: "GitHub Actions에 배포할 때 import가 자꾸 실패하는 경우 Git Working Tree Index를 확인해보세요"
date: 2025-08-18
tags: ["InfraStructure", "운영체제", "Git"]
---

# 발생한 문제

React 프로젝트 배포 자동화를 위해 GitHub Actions를 이용하고 있었다.  
그런데 이상하게 계속 빌드 단계(`CI=false npm run build`)에서 실패했다.  
에러 메시지는 "_Module not found: Error: Can't resolve '../pages/market/ProductDetail' in '/home/runner/work/pharmpick-market-react/pharmpick-market-react/src/router'_" 였다.  
라우터 관련 코드에서 `import`를 할 때 파일을 못 불러오는 문제였다.

상대 경로에서 절대 경로로도 수정해보고, package-lock.json도 삭제하고 다시 `npm install`도 해보고, `craco.config.js` 파일도 수정해보고 다 해봤다.  
그럼에도 다 실패했다.  
심지어 로컬에서는 항상 잘 되었다.

# 문제 해결

Claude Code는 신이다.  
갑자기 `git ls-files` 명령어로 Git에서 실제로 커밋된 파일명을 확인하더니 문제를 발견했다고 한다.

로컬 파일 시스템에서는 패키지 명이 `market`인데, Git에 저장된 파일명은 `Market`이라고 한다.  
그래서 일단 Git에 저장된 파일명을 `git mv` 명령어를 이용해서 수정하니까 빌드가 성공한다.

# 분석

## 1. macOS와 Linux의 파일 시스템 인식 차이
macOS는 **Case-Insensitive File System**이다.  
그래서 로컬에서 디렉터리 이름이 `Market`에서 `market`으로 변경되었음에도 충분히 인식할 수 있어서 Git에 저장된 파일 이름이 `Market`으로 저장되어 있어도 문제가 없던 것이었다.  
참고: [Apple Community - File system case sensitivity?](https://discussions.apple.com/thread/251191099?sortBy=rank)

하지만 배포 자동화를 위해 GitHub Actions VM에서 _Ubuntu_ 운영 체제를 사용했는데, Ubuntu는 **Case Sensitive File System** 이다.
참고: [Stack overflow - Are file names in Ubuntu case sensitive?]([Apple Community - File system case sensitivity?](https://discussions.apple.com/thread/251191099?sortBy=rank))

## 2. `git ls-files`
`git ls-files` 명령어는 **Git 저장소에서 추적 중인 파일들의 실제 경로**를 보여주는 명령어다.  
즉, Git에 실제로 기록된 파일들을 볼 수 있다. 인덱스에 저장된 파일이라고도 한다.  
그런데 실제로 다음과 같이 출력이 되었다.

```text
src/pages/Market/MarketMain.jsx
src/pages/Market/ProductDetail.jsx
src/pages/Market/ProductInfoNotice.jsx
```

## 3. 그렇다면 GitHub Actions에는 대체 왜 영향을 끼쳤을까?
GitHub Actions 빌드 과정은 다음과 같다.

1. `runs-on`을 ubuntu-latest에서 실행 -> Case Sensitive
2. git checkout → Git 저장소의 실제 파일명으로 파일들을 복원 -> 이때 src/pages/Market/MarketMain.jsx 이라고 저장되어 있음.
3. Webpack이 ../pages/market/ProductDetail을 찾으려 함
4. 하지만 실제로는 ../pages/market/ProductDetail만 존재
5. 파일을 찾을 수 없어서 빌드 실패

좀 더 자세히 보면, `git checkout` 명령어는 작업 트리에 있는 파일들을 인덱스나 특정 트리와 일치시키는 작업을 수행한다.  
그런데 현재 인덱스 자체에 _Market_ 이라고 되어 있으니 불일치가 발생한 것이었다.

# 결론

1. macOS는 Case-Insensitive, Linux(Ubuntu)는 Case-Sensitive 하다.
2. 프로젝트의 폴더명은 "market"인데, Git에 저장된 Working Tree Index는 "Market"이다.
3. macOS(로컬)에서는 되는데, GitHub Actions(Ubuntu)에서는 안되는 이유가 Git Working Tree Index에 저장된 파일명 대소문자 차이에 있었다.
