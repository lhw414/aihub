# AI Hub 프로젝트 구조 및 주요 파일

## 프로젝트 개요
AI Hub는 React 19 + Tailwind CSS 4 + Express + tRPC 기반의 풀스택 웹 애플리케이션입니다.
AI 관련 뉴스레터, 앱, 교육 자료를 한 곳에서 제공하는 플랫폼입니다.

## 디렉토리 구조

```
aihub/
├── client/                          # 프론트엔드 (React)
│   ├── src/
│   │   ├── pages/                   # 페이지 컴포넌트
│   │   │   ├── Home.tsx             # 메인 페이지
│   │   │   ├── NewsletterDetail.tsx # 뉴스레터 상세 페이지
│   │   │   ├── AiAppDetail.tsx      # AI App 상세 페이지
│   │   │   ├── AiSchool.tsx         # AI 스쿨 페이지
│   │   │   ├── Faq.tsx              # FAQ 페이지
│   │   │   └── NotFound.tsx         # 404 페이지
│   │   ├── components/              # 재사용 가능한 컴포넌트
│   │   │   ├── Navigation.tsx       # 상단 네비게이션
│   │   │   ├── NewsletterCarousel.tsx # 뉴스레터 캐러셀
│   │   │   ├── AiAppCarousel.tsx    # AI App 캐러셀
│   │   │   ├── QuickLinksSection.tsx # 퀵링크 섹션
│   │   │   ├── PdfViewer.tsx        # PDF 뷰어
│   │   │   └── ErrorBoundary.tsx    # 에러 바운더리
│   │   ├── lib/
│   │   │   └── trpc.ts              # tRPC 클라이언트 설정
│   │   ├── contexts/
│   │   │   └── ThemeContext.tsx     # 테마 컨텍스트
│   │   ├── App.tsx                  # 메인 앱 컴포넌트
│   │   ├── main.tsx                 # 진입점
│   │   └── index.css                # 글로벌 스타일
│   ├── public/                      # 정적 자산
│   │   ├── newsletters/             # PDF 파일들
│   │   └── newsletter-thumbnails/   # PDF 썸네일
│   └── package.json
│
├── server/                          # 백엔드 (Express + tRPC)
│   ├── db.ts                        # 데이터베이스 쿼리 함수
│   ├── routers.ts                   # tRPC 라우터 정의
│   ├── storage.ts                   # S3 저장소 헬퍼
│   └── _core/                       # 프레임워크 코어
│       ├── context.ts               # tRPC 컨텍스트
│       ├── trpc.ts                  # tRPC 설정
│       ├── env.ts                   # 환경 변수
│       ├── cookies.ts               # 쿠키 헬퍼
│       ├── llm.ts                   # LLM 통합
│       ├── voiceTranscription.ts    # 음성 변환
│       ├── imageGeneration.ts       # 이미지 생성
│       ├── notification.ts          # 알림 시스템
│       └── systemRouter.ts          # 시스템 라우터
│
├── drizzle/                         # 데이터베이스 스키마
│   ├── schema.ts                    # 테이블 정의
│   └── migrations/                  # 마이그레이션 파일
│
├── shared/                          # 공유 코드
│   └── const.ts                     # 상수 정의
│
├── drizzle.config.ts                # Drizzle ORM 설정
├── tsconfig.json                    # TypeScript 설정
├── vite.config.ts                   # Vite 설정
├── package.json                     # 프로젝트 의존성
└── todo.md                          # 프로젝트 진행 상황

```

## 주요 기능

### 1. 뉴스레터 시스템
- PDF 기반 뉴스레터 저장 및 관리
- PDF 첫 페이지를 썸네일로 자동 추출
- 뉴스레터 상세 페이지에서 PDF 뷰어 제공
- 캐러셀 형식으로 최신 뉴스레터 표시

### 2. AI App 관리
- 다양한 AI 애플리케이션 소개
- 각 앱의 상세 정보 페이지
- 앱 링크를 통한 외부 서비스 연결
- 캐러셀 형식으로 앱 목록 표시

### 3. 교육 플랫폼
- AI 스쿨 강좌 목록
- 강좌별 난이도 및 기간 표시
- 수강신청 기능

### 4. 커뮤니티
- FAQ 페이지 (아코디언 형식)
- 자주 묻는 질문 및 답변
- 기술 지원 링크

### 5. 퀵링크 시스템
- 카테고리별 빠른 접근 링크
- 호버 시 설명 표시
- 외부 링크 새 탭 열기

## 데이터베이스 스키마

### users 테이블
- id: 사용자 ID
- openId: OAuth ID
- name: 사용자명
- email: 이메일
- role: 역할 (user, admin)
- createdAt, updatedAt, lastSignedIn: 타임스탬프

### newsletters 테이블
- id: 뉴스레터 ID
- title: 제목
- description: 설명
- thumbnailUrl: 썸네일 URL
- linkUrl: 링크 URL
- pdfUrl: PDF 파일 URL
- pdfThumbnailUrl: PDF 썸네일 URL
- order: 정렬 순서

### aiApps 테이블
- id: 앱 ID
- name: 앱 이름
- description: 설명
- thumbnailUrl: 썸네일 URL
- linkUrl: 링크 URL
- order: 정렬 순서

### quickLinkCategories 테이블
- id: 카테고리 ID
- name: 카테고리명
- order: 정렬 순서

### quickLinks 테이블
- id: 링크 ID
- categoryId: 카테고리 ID (외래키)
- title: 제목
- description: 설명
- linkUrl: 링크 URL
- iconUrl: 아이콘 URL
- order: 정렬 순서

## API 엔드포인트

### Newsletter API
- `trpc.newsletter.list` - 뉴스레터 목록 조회
- `trpc.newsletter.getById` - 뉴스레터 상세 조회

### AI App API
- `trpc.aiApp.list` - AI 앱 목록 조회
- `trpc.aiApp.getById` - AI 앱 상세 조회

### Quick Link API
- `trpc.quickLink.listWithCategories` - 카테고리별 퀵링크 조회

### Auth API
- `trpc.auth.me` - 현재 사용자 정보
- `trpc.auth.logout` - 로그아웃

## 기술 스택

### 프론트엔드
- React 19
- TypeScript
- Tailwind CSS 4
- Vite
- Wouter (라우팅)
- Lucide React (아이콘)
- tRPC (타입 안전 API)

### 백엔드
- Express.js
- tRPC
- Drizzle ORM
- MySQL/TiDB

### 개발 도구
- TypeScript
- ESLint
- Prettier
- Vitest

## 개발 가이드

### 환경 변수
프로젝트에서 사용되는 주요 환경 변수:
- `DATABASE_URL`: 데이터베이스 연결 문자열
- `JWT_SECRET`: JWT 서명 시크릿
- `VITE_APP_ID`: OAuth 애플리케이션 ID
- `OAUTH_SERVER_URL`: OAuth 서버 URL
- `VITE_OAUTH_PORTAL_URL`: OAuth 포털 URL

### 빌드 및 실행

```bash
# 의존성 설치
pnpm install

# 데이터베이스 마이그레이션
pnpm db:push

# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start
```

## 주요 컴포넌트 설명

### Navigation.tsx
상단 고정 네비게이션 바로 AI App, AI 스쿨, FAQ 메뉴의 드롭다운을 제공합니다.

### NewsletterCarousel.tsx
뉴스레터를 2x2 그리드 + 캐러셀 형식으로 표시하며, 클릭 시 상세 페이지로 이동합니다.

### AiAppCarousel.tsx
AI 앱을 3개 일렬 + 캐러셀 형식으로 표시하며, 클릭 시 상세 페이지로 이동합니다.

### QuickLinksSection.tsx
카테고리별 퀵링크를 표시하며, 호버 시 설명이 툴팁으로 나타납니다.

### PdfViewer.tsx
PDF 파일을 iframe으로 표시하며 다운로드 기능을 제공합니다.

## 배포

프로젝트는 Manus 플랫폼에 배포 준비가 완료되었습니다.
Management UI의 Publish 버튼을 통해 배포할 수 있습니다.

