# AI Hub 프로젝트 - 주요 코드 요약

## 1. 데이터베이스 스키마 (drizzle/schema.ts)

```typescript
// 5개의 주요 테이블 정의:
// - users: 사용자 정보
// - newsletters: AI 뉴스레터 (PDF 저장)
// - aiApps: AI 애플리케이션
// - quickLinkCategories: 퀵링크 카테고리
// - quickLinks: 퀵링크 항목
```

## 2. 백엔드 API (server/routers.ts)

```typescript
// tRPC 라우터 정의:
// - newsletter.list: 뉴스레터 목록 조회
// - newsletter.getById: 뉴스레터 상세 조회
// - aiApp.list: AI 앱 목록 조회
// - aiApp.getById: AI 앱 상세 조회
// - quickLink.listWithCategories: 카테고리별 퀵링크 조회
// - auth.me: 현재 사용자 정보
// - auth.logout: 로그아웃
```

## 3. 데이터베이스 쿼리 헬퍼 (server/db.ts)

```typescript
// 주요 함수:
// - getNewsletters(): 뉴스레터 목록 조회
// - getNewsletterById(id): 뉴스레터 상세 조회
// - getAiApps(): AI 앱 목록 조회
// - getAiAppById(id): AI 앱 상세 조회
// - getQuickLinksWithCategories(): 카테고리별 퀵링크 조회
```

## 4. 프론트엔드 페이지

### Home.tsx (메인 페이지)
- 상단 네비게이션 바
- AI 뉴스레터 섹션 (2x2 그리드 + 캐러셀)
- AI App 섹션 (3개 일렬 + 캐러셀)
- 퀵링크 섹션 (우측 사이드바)
- 하단 푸터

### NewsletterDetail.tsx (뉴스레터 상세 페이지)
- 뉴스레터 정보 표시
- PDF 뷰어 (iframe 기반)
- 다운로드 버튼

### AiAppDetail.tsx (AI App 상세 페이지)
- 앱 정보 표시
- 앱 링크 (외부 연결)
- 앱 설명 및 기능

### AiSchool.tsx (AI 스쿨 페이지)
- 강좌 목록 (난이도별)
- 강좌 정보 (기간, 설명)
- 수강신청 버튼

### Faq.tsx (FAQ 페이지)
- 아코디언 형식의 Q&A
- 자주 묻는 질문 8개
- 문의하기 버튼

## 5. 프론트엔드 컴포넌트

### Navigation.tsx
- 고정 상단 네비게이션
- 드롭다운 메뉴 (AI App, AI 스쿨, FAQ)
- 실제 외부 링크 연결

### NewsletterCarousel.tsx
- 뉴스레터 2x2 그리드 표시
- 캐러셀 기능
- 클릭 시 상세 페이지로 이동

### AiAppCarousel.tsx
- AI 앱 3개 일렬 표시
- 캐러셀 기능
- 클릭 시 상세 페이지로 이동

### QuickLinksSection.tsx
- 카테고리별 퀵링크 표시
- 호버 시 설명 툴팁
- 외부 링크 새 탭 열기

### PdfViewer.tsx
- iframe 기반 PDF 표시
- 다운로드 기능

## 6. 데이터 구조

### Newsletter 객체
```typescript
{
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  linkUrl: string;
  pdfUrl: string;
  pdfThumbnailUrl: string;
  order: number;
}
```

### AiApp 객체
```typescript
{
  id: number;
  name: string;
  description: string;
  thumbnailUrl: string;
  linkUrl: string;
  order: number;
}
```

### QuickLink 객체
```typescript
{
  id: number;
  categoryId: number;
  title: string;
  description: string;
  linkUrl: string;
  iconUrl: string;
  order: number;
}
```

## 7. 기술 스택

### 프론트엔드
- React 19 + TypeScript
- Tailwind CSS 4 (스타일링)
- Vite (번들러)
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

## 8. 주요 기능

1. **PDF 기반 뉴스레터**
   - 더미 PDF 파일 생성
   - PDF 첫 페이지 자동 썸네일 추출
   - 뉴스레터 상세 페이지에서 PDF 뷰어 제공

2. **AI App 관리**
   - 다양한 AI 애플리케이션 소개
   - 각 앱의 상세 정보 페이지
   - 외부 서비스 링크

3. **교육 플랫폼**
   - AI 스쿨 강좌 목록
   - 강좌별 난이도 및 기간
   - 수강신청 기능

4. **커뮤니티**
   - FAQ 페이지 (아코디언)
   - 자주 묻는 질문 8개
   - 기술 지원 링크

5. **퀵링크 시스템**
   - 카테고리별 빠른 접근 링크
   - 호버 시 설명 표시
   - 외부 링크 새 탭 열기

## 9. 데이터베이스 샘플 데이터

### 뉴스레터 (6개)
- AI 최신 트렌드
- 머신러닝 기초
- 딥러닝 심화
- NLP 기술
- 컴퓨터 비전
- 생성형 AI

### AI App (3개)
- AI 텍스트 분석
- AI 이미지 처리
- AI 음성 인식

### 퀵링크 카테고리 (3개)
- AI App (6개 링크)
- AI 스쿨 (5개 링크)
- FAQ (4개 링크)

## 10. 배포 정보

- 프로젝트는 Manus 플랫폼에 배포 준비 완료
- Management UI의 Publish 버튼으로 배포 가능
- 자동 SSL 인증서 적용
- CDN을 통한 글로벌 배포

