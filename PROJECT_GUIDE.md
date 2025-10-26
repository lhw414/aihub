# AI Hub 프로젝트 가이드

## 프로젝트 개요

**AI Hub**는 삼성리서치에서 개발한 AI 서비스들에 대한 소개, AI 스쿨 교육 링크 연결, 그리고 커뮤니티 구축을 위한 웹사이트입니다. 이 프로젝트는 React 기반의 모던한 프론트엔드와 Litestar 백엔드, PostgreSQL 데이터베이스로 구성되어 있습니다.

## 기술 스택

| 계층 | 기술 | 버전 |
|------|------|------|
| **프론트엔드** | React | 19.x |
| **프론트엔드 스타일링** | Tailwind CSS | 4.x |
| **프론트엔드 UI 컴포넌트** | shadcn/ui | - |
| **백엔드** | Express.js | 4.x |
| **API 통신** | tRPC | 11.x |
| **데이터베이스 ORM** | Drizzle ORM | - |
| **데이터베이스** | MySQL | 8.x |
| **패키지 매니저** | pnpm | 9.x |
| **런타임** | Node.js | 22.x |

## 프로젝트 폴더 구조

```
aihub/
├── client/                          # 프론트엔드 React 애플리케이션
│   ├── public/                      # 정적 자산 (favicon, robots.txt 등)
│   ├── src/
│   │   ├── pages/                   # 페이지 컴포넌트
│   │   │   ├── Home.tsx             # 메인 페이지
│   │   │   └── NotFound.tsx         # 404 페이지
│   │   ├── components/              # 재사용 가능한 UI 컴포넌트
│   │   │   ├── Navigation.tsx       # 상단 네비게이션 바
│   │   │   ├── NewsletterCarousel.tsx # AI 뉴스레터 캐러셀
│   │   │   ├── AiAppCarousel.tsx    # AI App 캐러셀
│   │   │   ├── QuickLinksSection.tsx # 퀵링크 섹션
│   │   │   ├── ui/                  # shadcn/ui 컴포넌트
│   │   │   └── ErrorBoundary.tsx    # 에러 경계 처리
│   │   ├── contexts/                # React Context (테마 등)
│   │   ├── hooks/                   # 커스텀 React 훅
│   │   ├── lib/
│   │   │   └── trpc.ts              # tRPC 클라이언트 설정
│   │   ├── const.ts                 # 상수 정의 (앱 제목, 로고 등)
│   │   ├── App.tsx                  # 라우팅 및 레이아웃
│   │   ├── main.tsx                 # React 진입점
│   │   └── index.css                # 전역 스타일 및 Tailwind 설정
│   ├── index.html                   # HTML 템플릿
│   ├── vite.config.ts               # Vite 빌드 설정
│   └── tsconfig.json                # TypeScript 설정
│
├── server/                          # 백엔드 Express 애플리케이션
│   ├── _core/                       # 프레임워크 핵심 기능 (수정 금지)
│   │   ├── index.ts                 # 서버 진입점
│   │   ├── context.ts               # tRPC 컨텍스트 생성
│   │   ├── trpc.ts                  # tRPC 라우터 기본 설정
│   │   ├── cookies.ts               # 쿠키 관리
│   │   ├── env.ts                   # 환경 변수 관리
│   │   ├── oauth.ts                 # OAuth 인증 처리
│   │   ├── llm.ts                   # LLM API 통합
│   │   ├── voiceTranscription.ts    # 음성 인식 API
│   │   ├── imageGeneration.ts       # 이미지 생성 API
│   │   └── notification.ts          # 알림 기능
│   ├── db.ts                        # 데이터베이스 쿼리 헬퍼
│   ├── routers.ts                   # tRPC 라우터 정의
│   └── storage.ts                   # S3 파일 저장소 관리
│
├── drizzle/                         # 데이터베이스 스키마 및 마이그레이션
│   ├── schema.ts                    # 데이터베이스 테이블 정의
│   └── migrations/                  # 마이그레이션 파일
│
├── shared/                          # 클라이언트-서버 공유 코드
│   ├── const.ts                     # 공유 상수
│   └── types.ts                     # 공유 타입 정의
│
├── storage/                         # S3 저장소 헬퍼
│   └── index.ts                     # 파일 업로드/다운로드 함수
│
├── drizzle.config.ts                # Drizzle ORM 설정
├── tsconfig.json                    # TypeScript 루트 설정
├── package.json                     # 프로젝트 의존성
├── pnpm-lock.yaml                   # 의존성 잠금 파일
└── todo.md                          # 프로젝트 작업 추적
```

## 데이터베이스 스키마

### 1. users 테이블
사용자 정보를 저장합니다. Manus OAuth를 통한 인증 후 자동으로 생성됩니다.

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| id | INT | 자동 증가 기본 키 |
| openId | VARCHAR(64) | Manus OAuth ID (고유값) |
| name | TEXT | 사용자 이름 |
| email | VARCHAR(320) | 사용자 이메일 |
| loginMethod | VARCHAR(64) | 로그인 방식 |
| role | ENUM | 사용자 역할 (user/admin) |
| createdAt | TIMESTAMP | 생성 시간 |
| updatedAt | TIMESTAMP | 수정 시간 |
| lastSignedIn | TIMESTAMP | 마지막 로그인 시간 |

### 2. newsletters 테이블
AI 관련 뉴스레터 정보를 저장합니다.

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| id | INT | 자동 증가 기본 키 |
| title | VARCHAR(255) | 뉴스레터 제목 |
| description | TEXT | 뉴스레터 설명 |
| thumbnailUrl | VARCHAR(512) | 썸네일 이미지 URL |
| linkUrl | VARCHAR(512) | 뉴스레터 링크 |
| order | INT | 표시 순서 |
| createdAt | TIMESTAMP | 생성 시간 |
| updatedAt | TIMESTAMP | 수정 시간 |

### 3. aiApps 테이블
AI 애플리케이션 정보를 저장합니다.

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| id | INT | 자동 증가 기본 키 |
| name | VARCHAR(255) | AI App 이름 |
| description | TEXT | AI App 설명 |
| thumbnailUrl | VARCHAR(512) | 썸네일 이미지 URL |
| linkUrl | VARCHAR(512) | AI App 링크 |
| order | INT | 표시 순서 |
| createdAt | TIMESTAMP | 생성 시간 |
| updatedAt | TIMESTAMP | 수정 시간 |

### 4. quickLinkCategories 테이블
퀵링크의 카테고리를 정의합니다.

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| id | INT | 자동 증가 기본 키 |
| name | VARCHAR(255) | 카테고리 이름 |
| order | INT | 표시 순서 |
| createdAt | TIMESTAMP | 생성 시간 |
| updatedAt | TIMESTAMP | 수정 시간 |

### 5. quickLinks 테이블
개별 퀵링크 정보를 저장합니다.

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| id | INT | 자동 증가 기본 키 |
| categoryId | INT | 카테고리 ID (외래키) |
| title | VARCHAR(255) | 링크 제목 |
| description | TEXT | 링크 설명 (호버 시 표시) |
| linkUrl | VARCHAR(512) | 링크 URL |
| iconUrl | VARCHAR(512) | 아이콘 URL |
| order | INT | 표시 순서 |
| createdAt | TIMESTAMP | 생성 시간 |
| updatedAt | TIMESTAMP | 수정 시간 |

## 빌드 및 실행 가이드

### 필수 요구사항

프로젝트를 실행하기 위해 다음이 필요합니다:

- **Node.js**: 22.x 이상
- **pnpm**: 9.x 이상 (npm 또는 yarn 사용 가능하지만 pnpm 권장)
- **MySQL**: 8.x 이상
- **.env 파일**: 환경 변수 설정 (아래 참고)

### 1단계: 저장소 클론 및 의존성 설치

```bash
# 프로젝트 디렉토리로 이동
cd aihub

# 의존성 설치
pnpm install
```

### 2단계: 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 환경 변수를 설정합니다:

```env
# 데이터베이스 연결
DATABASE_URL="mysql://username:password@localhost:3306/aihub"

# JWT 토큰 서명 키
JWT_SECRET="your-secret-key-here"

# Manus OAuth 설정
VITE_APP_ID="your-app-id"
OAUTH_SERVER_URL="https://api.manus.im"
VITE_OAUTH_PORTAL_URL="https://portal.manus.im"

# 앱 정보
VITE_APP_TITLE="AI Hub"
VITE_APP_LOGO="https://your-logo-url.png"

# 소유자 정보
OWNER_NAME="Your Name"
OWNER_OPEN_ID="your-open-id"

# 분석 도구
VITE_ANALYTICS_ENDPOINT="https://analytics.example.com"
VITE_ANALYTICS_WEBSITE_ID="your-website-id"
```

### 3단계: 데이터베이스 초기화

```bash
# 데이터베이스 스키마 생성 및 마이그레이션 실행
pnpm db:push

# (선택사항) 샘플 데이터 삽입
# 프로젝트 루트의 seed_data.sql 파일을 실행합니다
mysql -h localhost -u username -p aihub < seed_data.sql
```

### 4단계: 개발 서버 실행

```bash
# 개발 모드로 서버 시작 (핫 리로드 활성화)
pnpm dev
```

개발 서버가 실행되면 브라우저에서 `http://localhost:3000`에 접속할 수 있습니다.

### 5단계: 프로덕션 빌드

```bash
# 프로덕션 빌드 생성
pnpm build

# 빌드된 프로젝트 실행
pnpm start
```

## API 엔드포인트

모든 API는 tRPC를 통해 `/api/trpc` 경로로 제공됩니다.

### 인증 API

| 메서드 | 설명 |
|--------|------|
| `trpc.auth.me.useQuery()` | 현재 로그인한 사용자 정보 조회 |
| `trpc.auth.logout.useMutation()` | 로그아웃 처리 |

### 뉴스레터 API

```typescript
// 뉴스레터 목록 조회 (기본 4개)
const { data: newsletters } = trpc.newsletter.list.useQuery({ limit: 4 });
```

### AI App API

```typescript
// AI App 목록 조회 (기본 3개)
const { data: aiApps } = trpc.aiApp.list.useQuery({ limit: 3 });
```

### 퀵링크 API

```typescript
// 카테고리별 퀵링크 조회
const { data: categoriesWithLinks } = trpc.quickLink.listWithCategories.useQuery();
```

## 주요 기능 설명

### 1. 상단 네비게이션 바

상단에 고정된 네비게이션 바는 AI Hub 로고와 3개의 드롭다운 메뉴를 포함합니다:

- **AI App**: AI 서비스 카테고리 및 상세 페이지 링크
- **AI 스쿨**: 교육 프로그램 및 학습 자료 링크
- **FAQ**: 자주 묻는 질문 및 지원 링크

마우스를 메뉴 항목에 호버하면 드롭다운이 자동으로 펼쳐집니다.

### 2. AI 뉴스레터 섹션

메인 페이지의 왼쪽 상단에 위치하며, 최신 AI 관련 뉴스레터를 2x2 그리드로 표시합니다. 좌우 화살표 버튼으로 다음 뉴스레터 묶음으로 이동할 수 있습니다.

### 3. AI App 섹션

뉴스레터 섹션 아래에 위치하며, 삼성리서치의 AI 서비스들을 3개씩 일렬로 표시합니다. 각 카드에는 앱 설명과 "자세히 보기" 버튼이 포함되어 있습니다.

### 4. 퀵링크 섹션

메인 페이지의 오른쪽에 고정되어 있으며, 카테고리별로 그룹화된 링크들을 표시합니다. 각 링크에 마우스를 호버하면 설명이 툴팁으로 표시됩니다.

### 5. 푸터

페이지 하단에는 회사 정보, 제품 링크, 지원 링크, 회사 정보 등을 포함한 풀 너비의 푸터가 있습니다.

## 개발 워크플로우

### 새로운 기능 추가

1. **데이터베이스 스키마 수정**: `drizzle/schema.ts`에서 테이블 정의 추가
2. **마이그레이션 실행**: `pnpm db:push` 명령 실행
3. **쿼리 헬퍼 작성**: `server/db.ts`에 데이터 조회 함수 추가
4. **API 라우터 정의**: `server/routers.ts`에 tRPC 프로시저 추가
5. **프론트엔드 컴포넌트 구현**: `client/src/components/` 또는 `client/src/pages/`에 UI 작성
6. **API 호출**: 컴포넌트에서 `trpc.*.useQuery()` 또는 `trpc.*.useMutation()` 사용

### 스타일 커스터마이징

- **전역 스타일**: `client/src/index.css`에서 CSS 변수 수정
- **컴포넌트 스타일**: Tailwind CSS 유틸리티 클래스 사용
- **shadcn/ui 컴포넌트**: `client/src/components/ui/` 디렉토리에서 커스터마이징 가능

### 배포

프로젝트는 Manus 플랫폼에 배포할 수 있습니다. 배포 전에 반드시 체크포인트를 생성해야 합니다:

```bash
# 변경사항 커밋 후 체크포인트 생성
# (UI의 Publish 버튼을 통해 배포)
```

## 문제 해결

### 개발 서버가 시작되지 않음

```bash
# 1. 의존성 재설치
pnpm install

# 2. 캐시 제거
pnpm store prune

# 3. 서버 재시작
pnpm dev
```

### 데이터베이스 연결 오류

```bash
# 1. DATABASE_URL 환경 변수 확인
echo $DATABASE_URL

# 2. MySQL 서버 상태 확인
mysql -h localhost -u username -p -e "SELECT 1"

# 3. 마이그레이션 다시 실행
pnpm db:push
```

### 타입스크립트 오류

```bash
# TypeScript 캐시 제거 및 재컴파일
pnpm tsc --noEmit
```

## 유용한 명령어

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 개발 서버 실행 (핫 리로드 활성화) |
| `pnpm build` | 프로덕션 빌드 생성 |
| `pnpm start` | 프로덕션 서버 실행 |
| `pnpm db:push` | 데이터베이스 마이그레이션 실행 |
| `pnpm db:studio` | Drizzle Studio 열기 (DB 관리 UI) |
| `pnpm lint` | 코드 린팅 실행 |
| `pnpm type-check` | TypeScript 타입 검사 |

## 참고 자료

- [React 공식 문서](https://react.dev)
- [Tailwind CSS 문서](https://tailwindcss.com)
- [tRPC 문서](https://trpc.io)
- [Drizzle ORM 문서](https://orm.drizzle.team)
- [Express.js 문서](https://expressjs.com)

## 라이센스

이 프로젝트는 삼성리서치에 의해 개발되었습니다.

## 지원

문제가 발생하거나 기능 요청이 있으면 프로젝트 저장소의 이슈 섹션에 보고해주세요.

