# MCP App

MCP(Minecraft Control Panel)는 마인크래프트 서버 관리를 위한 웹 기반 관리 시스템입니다.

## 주요 기능

- 사용자 관리
  - 사용자 등록/수정/삭제
  - 권한 관리 (일반 사용자/관리자)
  - 페이지네이션 지원

- 블로그 관리
  - 게시글 작성/수정/삭제
  - 댓글 기능

- 시스템 설정
  - 서버 상태 모니터링
  - 시스템 설정 관리

## 기술 스택

- Frontend
  - React
  - TypeScript
  - Material-UI
  - React Router
  - Axios

## 시작하기

### 필수 조건

- Node.js 16.x 이상
- npm 7.x 이상

### 설치

```bash
# 프로젝트 클론
git clone [repository-url]

# 프로젝트 디렉토리로 이동
cd mcp-app

# 의존성 설치
npm install
```

### 개발 서버 실행

```bash
npm start
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 애플리케이션을 확인할 수 있습니다.

### 빌드

```bash
npm run build
```

## 환경 변수 설정

프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 다음 변수들을 설정하세요:

```
REACT_APP_API_URL=http://localhost:8000
```

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.
