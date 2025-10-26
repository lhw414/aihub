# AI Hub 프로젝트 - 설치 및 빌드 가이드

## 📋 목차

1. [시스템 요구사항](#시스템-요구사항)
2. [프로젝트 설치](#프로젝트-설치)
3. [환경 설정](#환경-설정)
4. [데이터베이스 설정](#데이터베이스-설정)
5. [개발 서버 실행](#개발-서버-실행)
6. [프로덕션 빌드](#프로덕션-빌드)
7. [배포](#배포)
8. [문제 해결](#문제-해결)

---

## 시스템 요구사항

### 필수 소프트웨어

- **Node.js**: v18.0.0 이상
- **npm** 또는 **pnpm**: v8.0.0 이상 (권장: pnpm)
- **Git**: 버전 관리용
- **MySQL** 또는 **TiDB**: 데이터베이스 (로컬 개발 시)

### 권장 개발 환경

- **OS**: macOS, Linux, Windows (WSL2)
- **에디터**: VS Code, WebStorm 등
- **브라우저**: Chrome, Firefox, Safari (최신 버전)

---

## 프로젝트 설치

### 1단계: 저장소 클론 (또는 파일 다운로드)

```bash
# Git을 사용하는 경우
git clone https://github.com/your-repo/aihub.git
cd aihub

# 또는 ZIP 파일을 다운로드한 경우
unzip aihub-source-code.zip
cd aihub
```

### 2단계: 의존성 설치

**pnpm 사용 (권장)**

```bash
# pnpm 설치 (처음 한 번만)
npm install -g pnpm

# 프로젝트 의존성 설치
pnpm install
```

**npm 사용**

```bash
npm install
```

**yarn 사용**

```bash
yarn install
```

### 3단계: 설치 확인

```bash
# Node 버전 확인
node --version  # v18.0.0 이상 필요

# pnpm 버전 확인
pnpm --version  # v8.0.0 이상 권장

# 설치된 패키지 확인
pnpm list
```

---

## 환경 설정

### 1단계: 환경 변수 파일 생성

프로젝트 루트에 `.env.local` 파일을 생성합니다:

```bash
# 프로젝트 루트에서
touch .env.local
```

### 2단계: 환경 변수 설정

`.env.local` 파일에 다음 내용을 추가합니다:

```env
# 데이터베이스 연결
DATABASE_URL="mysql://username:password@localhost:3306/aihub"

# JWT 시크릿 (개발용 임시값)
JWT_SECRET="your-secret-key-min-32-characters-long"

# OAuth 설정 (Manus 플랫폼)
VITE_APP_ID="your-app-id"
OAUTH_SERVER_URL="https://api.manus.im"
VITE_OAUTH_PORTAL_URL="https://manus.im/oauth"

# 앱 정보
VITE_APP_TITLE="AI Hub"
VITE_APP_LOGO="https://example.com/logo.png"

# 선택사항: 분석 및 API
VITE_ANALYTICS_ENDPOINT="https://analytics.example.com"
VITE_ANALYTICS_WEBSITE_ID="your-website-id"
BUILT_IN_FORGE_API_URL="https://api.example.com"
BUILT_IN_FORGE_API_KEY="your-api-key"
```

### 3단계: 환경 변수 설명

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `DATABASE_URL` | MySQL 데이터베이스 연결 문자열 | `mysql://root:password@localhost:3306/aihub` |
| `JWT_SECRET` | JWT 토큰 서명용 시크릿 (32자 이상) | `your-secret-key-min-32-characters` |
| `VITE_APP_ID` | OAuth 애플리케이션 ID | `app_xxxxx` |
| `OAUTH_SERVER_URL` | OAuth 서버 URL | `https://api.manus.im` |
| `VITE_OAUTH_PORTAL_URL` | OAuth 포털 URL | `https://manus.im/oauth` |
| `VITE_APP_TITLE` | 앱 제목 | `AI Hub` |
| `VITE_APP_LOGO` | 앱 로고 URL | `https://example.com/logo.png` |

---

## 데이터베이스 설정

### 1단계: MySQL 설치 (로컬 개발)

**macOS (Homebrew)**

```bash
brew install mysql
brew services start mysql
```

**Windows**

[MySQL 공식 다운로드](https://dev.mysql.com/downloads/mysql/)에서 설치

**Linux (Ubuntu)**

```bash
sudo apt-get update
sudo apt-get install mysql-server
sudo mysql_secure_installation
```

### 2단계: 데이터베이스 생성

```bash
# MySQL 접속
mysql -u root -p

# 데이터베이스 생성
CREATE DATABASE aihub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 사용자 생성 (선택사항)
CREATE USER 'aihub'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON aihub.* TO 'aihub'@'localhost';
FLUSH PRIVILEGES;

# 종료
EXIT;
```

### 3단계: 데이터베이스 마이그레이션

```bash
# 스키마 생성 및 마이그레이션 실행
pnpm db:push

# 또는 마이그레이션 생성 후 실행
pnpm db:generate
pnpm db:migrate
```

### 4단계: 샘플 데이터 추가 (선택사항)

```bash
# 샘플 데이터 SQL 파일 실행
mysql -u root -p aihub < seed_data.sql
```

---

## 개발 서버 실행

### 1단계: 개발 서버 시작

```bash
# 프로젝트 루트에서
pnpm dev
```

### 2단계: 서버 확인

터미널에 다음과 같은 메시지가 나타나면 성공입니다:

```
  VITE v7.1.9  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### 3단계: 브라우저에서 확인

웹 브라우저를 열고 다음 URL로 접속합니다:

```
http://localhost:5173
```

또는

```
http://localhost:3000
```

### 4단계: 페이지 확인

개발 서버가 실행되면 다음 페이지들을 확인할 수 있습니다:

| 페이지 | URL | 설명 |
|--------|-----|------|
| 메인 페이지 | `http://localhost:5173/` | AI 뉴스레터, AI App, 퀵링크 |
| 뉴스레터 상세 | `http://localhost:5173/newsletter/1` | PDF 뷰어 포함 |
| AI App 상세 | `http://localhost:5173/app/1` | 앱 정보 및 링크 |
| AI 스쿨 | `http://localhost:5173/school` | 강좌 목록 |
| FAQ | `http://localhost:5173/faq` | 자주 묻는 질문 |

### 5단계: 개발 서버 중지

터미널에서 `Ctrl + C`를 눌러 서버를 중지합니다.

---

## 프로덕션 빌드

### 1단계: 프로덕션 빌드 실행

```bash
# 프로젝트 루트에서
pnpm build
```

빌드가 완료되면 다음과 같은 메시지가 나타납니다:

```
✓ 1234 modules transformed.
dist/index.html                   0.45 kB │ gzip:  0.30 kB
dist/assets/index-abc123.js       234.56 kB │ gzip: 78.90 kB
dist/assets/index-def456.css      12.34 kB │ gzip:  3.45 kB
```

### 2단계: 빌드 결과 확인

빌드된 파일은 `dist/` 디렉토리에 생성됩니다:

```bash
ls -la dist/
```

### 3단계: 프로덕션 서버 실행 (로컬 테스트)

```bash
# 프로덕션 빌드 미리보기
pnpm preview

# 또는 프로덕션 서버 실행
pnpm start
```

### 4단계: 빌드 최적화 확인

```bash
# 번들 크기 분석
pnpm build --analyze

# 또는 별도 도구 사용
pnpm add -D vite-plugin-visualizer
```

---

## 배포

### Manus 플랫폼 배포

#### 1단계: 프로젝트 커밋

```bash
git add .
git commit -m "AI Hub 프로젝트 완성"
git push origin main
```

#### 2단계: 배포 준비

```bash
# 최종 빌드 확인
pnpm build

# 모든 테스트 통과 확인
pnpm test
```

#### 3단계: Manus 플랫폼에서 배포

1. Manus 대시보드 접속
2. 프로젝트 선택
3. "Publish" 버튼 클릭
4. 배포 설정 확인
5. "Deploy" 버튼 클릭

#### 4단계: 배포 확인

```bash
# 배포된 URL 확인
# https://aihub.manus.space (또는 커스텀 도메인)
```

### 다른 플랫폼 배포

#### Vercel 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

#### Netlify 배포

```bash
# Netlify CLI 설치
npm i -g netlify-cli

# 배포
netlify deploy --prod --dir=dist
```

#### Docker 배포

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
```

```bash
# Docker 빌드 및 실행
docker build -t aihub .
docker run -p 3000:3000 aihub
```

---

## 문제 해결

### 문제 1: 포트가 이미 사용 중입니다

```bash
# 포트 5173이 이미 사용 중인 경우
pnpm dev -- --port 3001

# 또는 기존 프로세스 종료
lsof -i :5173
kill -9 <PID>
```

### 문제 2: 데이터베이스 연결 실패

```bash
# 1. 환경 변수 확인
cat .env.local

# 2. MySQL 서버 상태 확인
mysql -u root -p -e "SELECT 1"

# 3. 데이터베이스 존재 확인
mysql -u root -p -e "SHOW DATABASES;"

# 4. 연결 문자열 다시 확인
# mysql://username:password@host:port/database
```

### 문제 3: 의존성 설치 실패

```bash
# 캐시 삭제
pnpm store prune

# 의존성 재설치
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 문제 4: TypeScript 에러

```bash
# TypeScript 컴파일 확인
pnpm tsc --noEmit

# 타입 정의 재설치
pnpm add -D @types/node @types/react @types/react-dom
```

### 문제 5: 빌드 실패

```bash
# 1. 개발 서버 중지 (Ctrl + C)

# 2. 캐시 삭제
pnpm store prune
rm -rf dist/

# 3. 빌드 재시도
pnpm build

# 4. 상세 로그 확인
pnpm build --debug
```

### 문제 6: 핫 리로드가 작동하지 않음

```bash
# 1. 개발 서버 재시작
# Ctrl + C로 중지 후 다시 실행
pnpm dev

# 2. 브라우저 캐시 삭제
# DevTools > Application > Clear site data

# 3. 파일 감시 설정 확인
# vite.config.ts에서 watch 옵션 확인
```

---

## 유용한 명령어

### 개발 관련

```bash
# 개발 서버 실행
pnpm dev

# TypeScript 타입 체크
pnpm type-check

# 린트 확인
pnpm lint

# 린트 자동 수정
pnpm lint:fix

# 코드 포맷팅
pnpm format

# 테스트 실행
pnpm test
```

### 데이터베이스 관련

```bash
# 스키마 생성/마이그레이션
pnpm db:push

# 마이그레이션 생성
pnpm db:generate

# 마이그레이션 실행
pnpm db:migrate

# 데이터베이스 리셋 (주의!)
pnpm db:reset

# Studio 실행 (데이터베이스 GUI)
pnpm db:studio
```

### 빌드 관련

```bash
# 프로덕션 빌드
pnpm build

# 빌드 결과 미리보기
pnpm preview

# 번들 분석
pnpm build --analyze

# 프로덕션 서버 실행
pnpm start
```

---

## 프로젝트 구조 빠른 참고

```
aihub/
├── client/                    # 프론트엔드
│   ├── src/
│   │   ├── pages/            # 페이지 컴포넌트
│   │   ├── components/       # 재사용 컴포넌트
│   │   ├── lib/              # 유틸리티
│   │   ├── App.tsx           # 메인 앱
│   │   └── main.tsx          # 진입점
│   └── index.html
├── server/                    # 백엔드
│   ├── db.ts                 # DB 쿼리
│   ├── routers.ts            # API 라우터
│   └── _core/                # 프레임워크
├── drizzle/                   # 데이터베이스
│   ├── schema.ts             # 스키마 정의
│   └── migrations/           # 마이그레이션
├── shared/                    # 공유 코드
├── .env.local                # 환경 변수 (생성 필요)
├── package.json              # 의존성
├── tsconfig.json             # TypeScript 설정
├── vite.config.ts            # Vite 설정
└── drizzle.config.ts         # Drizzle 설정
```

---

## 다음 단계

1. **개발 시작**: `pnpm dev` 실행
2. **코드 수정**: 파일 변경 시 자동 리로드
3. **테스트**: 변경 사항 브라우저에서 확인
4. **커밋**: Git으로 변경 사항 저장
5. **배포**: 준비 완료 시 배포

---

## 추가 리소스

- [Vite 문서](https://vitejs.dev/)
- [React 문서](https://react.dev/)
- [Tailwind CSS 문서](https://tailwindcss.com/)
- [tRPC 문서](https://trpc.io/)
- [Drizzle ORM 문서](https://orm.drizzle.team/)
- [Express 문서](https://expressjs.com/)

---

## 지원

문제가 발생하면:

1. 이 가이드의 "문제 해결" 섹션 확인
2. 터미널 로그 확인
3. 환경 변수 재확인
4. 캐시 삭제 후 재시도

