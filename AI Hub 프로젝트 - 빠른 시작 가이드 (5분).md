# AI Hub 프로젝트 - 빠른 시작 가이드 (5분)

이 가이드는 AI Hub 프로젝트를 최소한의 시간으로 로컬에서 실행하는 방법을 설명합니다.

---

## 📦 사전 요구사항

- Node.js v18 이상
- MySQL (또는 Docker로 실행)
- Git

---

## 🚀 빠른 시작 (5단계)

### 1단계: 프로젝트 다운로드 (1분)

```bash
# ZIP 파일 해제
unzip aihub-source-code.zip
cd aihub

# 또는 Git 클론
git clone <repository-url>
cd aihub
```

### 2단계: 의존성 설치 (2분)

```bash
# pnpm 설치 (처음 한 번만)
npm install -g pnpm

# 프로젝트 의존성 설치
pnpm install
```

### 3단계: 환경 설정 (1분)

프로젝트 루트에 `.env.local` 파일 생성:

```bash
cat > .env.local << 'ENVEOF'
DATABASE_URL="mysql://root:password@localhost:3306/aihub"
JWT_SECRET="your-secret-key-min-32-characters-long"
VITE_APP_ID="your-app-id"
OAUTH_SERVER_URL="https://api.manus.im"
VITE_OAUTH_PORTAL_URL="https://manus.im/oauth"
VITE_APP_TITLE="AI Hub"
VITE_APP_LOGO="https://example.com/logo.png"
ENVEOF
```

### 4단계: 데이터베이스 설정 (1분)

```bash
# MySQL 시작 (이미 실행 중이면 스킵)
# macOS: brew services start mysql
# Linux: sudo systemctl start mysql
# Windows: 서비스 관리자에서 MySQL 시작

# 데이터베이스 생성
mysql -u root -p -e "CREATE DATABASE aihub CHARACTER SET utf8mb4;"

# 마이그레이션 실행
pnpm db:push
```

### 5단계: 개발 서버 실행 (즉시)

```bash
pnpm dev
```

브라우저에서 다음 URL 열기:
```
http://localhost:5173
```

---

## ✅ 확인 사항

개발 서버가 정상 실행되면:

- ✓ 메인 페이지 로드
- ✓ AI 뉴스레터 섹션 표시
- ✓ AI App 섹션 표시
- ✓ 퀵링크 섹션 표시

---

## 🔗 주요 페이지 URL

| 페이지 | URL |
|--------|-----|
| 메인 | http://localhost:5173/ |
| 뉴스레터 상세 | http://localhost:5173/newsletter/1 |
| AI App 상세 | http://localhost:5173/app/1 |
| AI 스쿨 | http://localhost:5173/school |
| FAQ | http://localhost:5173/faq |

---

## 🛠️ Docker로 MySQL 실행 (선택사항)

MySQL을 설치하지 않으려면 Docker 사용:

```bash
# MySQL 컨테이너 실행
docker run --name mysql-aihub \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=aihub \
  -p 3306:3306 \
  -d mysql:8.0

# 환경 변수 업데이트
# DATABASE_URL="mysql://root:password@localhost:3306/aihub"

# 마이그레이션 실행
pnpm db:push
```

---

## 📝 자주 사용하는 명령어

```bash
# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build

# 빌드 결과 미리보기
pnpm preview

# 데이터베이스 마이그레이션
pnpm db:push

# 타입 체크
pnpm type-check

# 린트 확인
pnpm lint
```

---

## ❌ 문제 해결

### 포트 5173이 이미 사용 중

```bash
pnpm dev -- --port 3001
```

### 데이터베이스 연결 실패

```bash
# 1. MySQL 실행 확인
mysql -u root -p -e "SELECT 1"

# 2. 환경 변수 확인
cat .env.local

# 3. 데이터베이스 생성 확인
mysql -u root -p -e "SHOW DATABASES;"
```

### 의존성 설치 실패

```bash
# 캐시 삭제 후 재설치
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

## 📚 다음 단계

1. **코드 탐색**: `client/src/pages/` 폴더의 페이지 확인
2. **컴포넌트 수정**: `client/src/components/` 폴더의 컴포넌트 수정
3. **API 추가**: `server/routers.ts`에서 새로운 API 추가
4. **데이터베이스 확장**: `drizzle/schema.ts`에서 테이블 추가

---

## 📖 상세 가이드

더 자세한 정보는 `SETUP_AND_BUILD_GUIDE.md` 참고

---

**축하합니다! 🎉 AI Hub 프로젝트가 실행 중입니다.**

