# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

이 프로젝트는 `gatsby-starter-blog`를 기반으로 한 개인 기술 블로그입니다. 주로 Java/Spring Boot, 데이터베이스, 인프라, Flutter 등의 주제를 다루며, 한국어 콘텐츠 중심으로 구성되어 있습니다. GitHub Pages를 통해 `kdkdhoho.github.io`에서 호스팅됩니다.

## 핵심 명령어

```bash
# 개발 서버 실행 (http://localhost:8000)
npm run develop

# 프로덕션 빌드
npm run build

# 빌드된 사이트 로컬 서버 실행
npm run serve

# Gatsby 캐시 정리 (문제 발생 시 사용)
npm run clean

# 코드 포맷팅
npm run format
```

## 아키텍처 구조

### 블로그 포스트 작성
- 경로: `content/blog/카테고리/포스트명/index.md`
- 이미지는 같은 디렉토리에 저장
- Frontmatter 필수 필드: `title`, `description`, `date`, `tags`

### 주요 컴포넌트
- `src/components/layout.js`: 전체 레이아웃 관리
- `src/components/bio.js`: 프로필 섹션 (2025년 목표 포함)
- `src/components/toc.js`: 목차 기능 (스크롤 추적)
- `src/templates/blog-post.js`: 블로그 포스트 템플릿

### 설정 파일
- `gatsby-config.js`: 플러그인 및 사이트 메타데이터
- `gatsby-node.js`: 페이지 생성 및 GraphQL 스키마
- `gatsby-browser.js`: 클라이언트 사이드 설정

## 스타일링

- **폰트**: Pretendard (한글 최적화)
- **CSS**: CSS Custom Properties 사용
- **코드 하이라이팅**: Prism.js
- **반응형**: 모바일 우선 디자인

## 특별 기능

### TOC (목차)
- 자동 생성되는 목차 컴포넌트
- 스크롤에 따른 활성 항목 하이라이트
- `gatsby-remark-table-of-contents` 플러그인 사용

### 태그 시스템
- 포스트별 태그 표시
- 태그 기반 필터링 가능

### 이미지 처리
- `gatsby-plugin-image`로 최적화
- 자동 webp 변환 및 반응형 이미지

## 콘텐츠 구조

```
content/blog/
├── algorithm/              # 알고리즘
├── database/              # 데이터베이스
├── java/                  # Java
├── spring/                # Spring Framework
├── 인프라/                # DevOps/Infrastructure
├── 플러터/                # Flutter
└── 창구-AI-스터디-잼/     # 스터디 내용
```

## 개발 워크플로우

1. 새 포스트 작성: `content/blog/카테고리/포스트명/index.md` 생성
2. Frontmatter 작성 (title, description, date, tags 필수)
3. `npm run develop`로 개발 서버 실행
4. 작성 완료 후 `npm run build`로 빌드 테스트
5. GitHub에 커밋하면 자동으로 GitHub Pages에 배포

## 한국어 최적화

- 날짜 형식: "YYYY년 M월 D일"
- Pretendard 폰트 사용
- 한국어 SEO 최적화
- 한국어 콘텐츠 중심의 UI/UX
- 코드 작성 이후 매번 개발 서버를 실행할 필요는 없어.