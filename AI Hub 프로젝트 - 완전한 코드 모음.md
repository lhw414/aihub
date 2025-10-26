# AI Hub 프로젝트 - 완전한 코드 모음

## 목차
1. [데이터베이스 스키마](#1-데이터베이스-스키마)
2. [백엔드 API](#2-백엔드-api)
3. [데이터베이스 쿼리](#3-데이터베이스-쿼리)
4. [프론트엔드 페이지](#4-프론트엔드-페이지)
5. [프론트엔드 컴포넌트](#5-프론트엔드-컴포넌트)
6. [설정 파일](#6-설정-파일)

---

## 1. 데이터베이스 스키마

### drizzle/schema.ts


### schema.ts

```typescript
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// AI 뉴스레터 테이블
export const newsletters = mysqlTable("newsletters", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  thumbnailUrl: varchar("thumbnailUrl", { length: 512 }),
  linkUrl: varchar("linkUrl", { length: 512 }),
  pdfUrl: varchar("pdfUrl", { length: 512 }),
  pdfThumbnailUrl: varchar("pdfThumbnailUrl", { length: 512 }),
  order: int("order").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Newsletter = typeof newsletters.$inferSelect;
export type InsertNewsletter = typeof newsletters.$inferInsert;

// AI App 테이블
export const aiApps = mysqlTable("aiApps", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  thumbnailUrl: varchar("thumbnailUrl", { length: 512 }),
  linkUrl: varchar("linkUrl", { length: 512 }),
  order: int("order").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AiApp = typeof aiApps.$inferSelect;
export type InsertAiApp = typeof aiApps.$inferInsert;

// 퀵링크 카테고리 테이블
export const quickLinkCategories = mysqlTable("quickLinkCategories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  order: int("order").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type QuickLinkCategory = typeof quickLinkCategories.$inferSelect;
export type InsertQuickLinkCategory = typeof quickLinkCategories.$inferInsert;

// 퀵링크 테이블
export const quickLinks = mysqlTable("quickLinks", {
  id: int("id").autoincrement().primaryKey(),
  categoryId: int("categoryId").notNull().references(() => quickLinkCategories.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  linkUrl: varchar("linkUrl", { length: 512 }),
  iconUrl: varchar("iconUrl", { length: 512 }),
  order: int("order").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type QuickLink = typeof quickLinks.$inferSelect;
export type InsertQuickLink = typeof quickLinks.$inferInsert;

```

### routers.ts

```typescript
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { getNewsletters, getAiApps, getQuickLinksWithCategories, getNewsletterById, getAiAppById } from "./db";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  newsletter: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().default(4) }).optional())
      .query(async ({ input }) => {
        const limit = input?.limit || 4;
        return await getNewsletters(limit);
      }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getNewsletterById(input.id);
      }),
  }),

  aiApp: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().default(3) }).optional())
      .query(async ({ input }) => {
        const limit = input?.limit || 3;
        return await getAiApps(limit);
      }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getAiAppById(input.id);
      }),
  }),

  quickLink: router({
    listWithCategories: publicProcedure.query(async () => {
      return await getQuickLinksWithCategories();
    }),
  }),
});

export type AppRouter = typeof appRouter;

```

### db.ts

```typescript
import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, newsletters, aiApps, quickLinkCategories, quickLinks } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// 뉴스레터 관련 쿼리
export async function getNewsletters(limit: number = 4) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(newsletters)
    .orderBy((t) => desc(t.order))
    .limit(limit);
}

// AI App 관련 쿼리
export async function getAiApps(limit: number = 3) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(aiApps)
    .orderBy((t) => desc(t.order))
    .limit(limit);
}

// 퀵링크 카테고리와 링크 조회
export async function getQuickLinksWithCategories() {
  const db = await getDb();
  if (!db) return [];
  
  const categories = await db
    .select()
    .from(quickLinkCategories)
    .orderBy((t) => desc(t.order));
  
  const result = [];
  for (const category of categories) {
    const links = await db
      .select()
      .from(quickLinks)
      .where(eq(quickLinks.categoryId, category.id))
      .orderBy((t) => desc(t.order));
    
    result.push({
      ...category,
      links,
    });
  }
  
  return result;
}

// 뉴스레터 상세 조회
export async function getNewsletterById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select()
    .from(newsletters)
    .where(eq(newsletters.id, id))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

// AI App 상세 조회
export async function getAiAppById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select()
    .from(aiApps)
    .where(eq(aiApps.id, id))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}
```

### Home.tsx

```typescript
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import NewsletterCarousel from "@/components/NewsletterCarousel";
import AiAppCarousel from "@/components/AiAppCarousel";
import QuickLinksSection from "@/components/QuickLinksSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Navigation />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Newsletters and AI Apps */}
            <div className="lg:col-span-2 space-y-12">
              {/* AI Newsletters Section */}
              <section className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">AI 뉴스레터</h2>
                  <p className="text-gray-600">최신 AI 관련 뉴스와 인사이트를 만나보세요</p>
                </div>
                <NewsletterCarousel />
              </section>

              {/* AI Apps Section */}
              <section className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">AI 앱</h2>
                  <p className="text-gray-600">삼성리서치의 AI 서비스들을 경험해보세요</p>
                </div>
                <AiAppCarousel />
              </section>
            </div>

            {/* Right Column - Quick Links */}
            <div className="lg:col-span-1">
              <section className="bg-white rounded-2xl shadow-lg p-8 sticky top-24 hover:shadow-xl transition-shadow duration-300">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">퀵링크</h2>
                  <p className="text-gray-600 text-sm">자주 사용하는 링크들</p>
                </div>
                <QuickLinksSection />
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">AI Hub</h3>
              <p className="text-gray-400 text-sm">삼성리서치의 AI 서비스 플랫폼</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">제품</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">AI 앱</a></li>
                <li><a href="#" className="hover:text-white transition">AI 스쿨</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">지원</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition">문의하기</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">회사</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">소개</a></li>
                <li><a href="#" className="hover:text-white transition">블로그</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-400 text-sm text-center">© 2025 Samsung Research. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

```

### NewsletterDetail.tsx

```typescript
import { useState } from "react";
import { useRoute } from "wouter";
import { ArrowLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";
import PdfViewer from "@/components/PdfViewer";

export default function NewsletterDetail() {
  const [, params] = useRoute("/newsletter/:id");
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const id = params?.id ? parseInt(params.id, 10) : null;

  const { data: newsletter, isLoading } = trpc.newsletter.getById.useQuery(
    { id: id || 0 },
    { enabled: !!id }
  );

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">유효하지 않은 뉴스레터입니다.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!newsletter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">뉴스레터를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <a
            href="/"
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            title="뒤로 가기"
          >
            <ArrowLeft className="w-5 h-5" />
          </a>
          <h1 className="text-2xl font-bold text-gray-900">{newsletter.title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Newsletter Info */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Thumbnail */}
              <div className="md:col-span-1">
                {newsletter.pdfThumbnailUrl && (
                  <div className="rounded-lg overflow-hidden shadow-md mb-4">
                    <img
                      src={newsletter.pdfThumbnailUrl}
                      alt={newsletter.title}
                      className="w-full h-auto"
                    />
                  </div>
                )}
                {newsletter.pdfUrl && (
                  <button
                    onClick={() => setShowPdfViewer(true)}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    PDF 보기
                  </button>
                )}
              </div>

              {/* Details */}
              <div className="md:col-span-2">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                      설명
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {newsletter.description || "설명이 없습니다."}
                    </p>
                  </div>

                  {newsletter.linkUrl && (
                    <div>
                      <a
                        href={newsletter.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                      >
                        더 알아보기
                      </a>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                      발행일: {new Date(newsletter.createdAt).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Newsletters */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">다른 뉴스레터</h2>
            <p className="text-gray-500 text-center py-8">
              다른 뉴스레터를 보려면 메인 페이지로 돌아가세요.
            </p>
          </div>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {showPdfViewer && newsletter.pdfUrl && (
        <PdfViewer
          pdfUrl={newsletter.pdfUrl}
          title={newsletter.title}
          onClose={() => setShowPdfViewer(false)}
        />
      )}
    </div>
  );
}

```

### AiAppDetail.tsx

```typescript
import { useRoute } from "wouter";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function AiAppDetail() {
  const [, params] = useRoute("/app/:id");
  const id = params?.id ? parseInt(params.id, 10) : null;

  const { data: app, isLoading } = trpc.aiApp.getById.useQuery(
    { id: id || 0 },
    { enabled: !!id }
  );

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">유효하지 않은 앱입니다.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">앱을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <a
            href="/"
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            title="뒤로 가기"
          >
            <ArrowLeft className="w-5 h-5" />
          </a>
          <h1 className="text-2xl font-bold text-gray-900">{app.name}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* App Info */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Thumbnail */}
              <div className="md:col-span-1">
                {app.thumbnailUrl && (
                  <div className="rounded-lg overflow-hidden shadow-md mb-6">
                    <img
                      src={app.thumbnailUrl}
                      alt={app.name}
                      className="w-full h-auto"
                    />
                  </div>
                )}
                {app.linkUrl && (
                  <a
                    href={app.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    <span>앱 열기</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Details */}
              <div className="md:col-span-2">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                      설명
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {app.description || "설명이 없습니다."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                        앱 이름
                      </h3>
                      <p className="text-gray-900 font-medium">{app.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                        출시일
                      </h3>
                      <p className="text-gray-900 font-medium">
                        {new Date(app.createdAt).toLocaleDateString("ko-KR")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">주요 기능</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-2">고급 AI 기술</h3>
                <p className="text-gray-700 text-sm">
                  최신 AI 기술을 활용한 정확하고 빠른 처리
                </p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <h3 className="font-semibold text-gray-900 mb-2">사용자 친화적</h3>
                <p className="text-gray-700 text-sm">
                  직관적인 인터페이스로 누구나 쉽게 사용 가능
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-gray-900 mb-2">빠른 성능</h3>
                <p className="text-gray-700 text-sm">
                  최적화된 알고리즘으로 빠른 결과 제공
                </p>
              </div>
              <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                <h3 className="font-semibold text-gray-900 mb-2">신뢰성</h3>
                <p className="text-gray-700 text-sm">
                  삼성리서치의 검증된 기술로 높은 신뢰성 보장
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">지금 바로 시작하세요</h2>
            <p className="text-blue-100 mb-6">
              {app.name}을(를) 통해 AI의 강력한 기능을 경험해보세요.
            </p>
            {app.linkUrl && (
              <a
                href={app.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition"
              >
                앱 접속하기
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

```

### AiSchool.tsx

```typescript
import { ArrowLeft, BookOpen, Users, Award } from "lucide-react";

export default function AiSchool() {
  const courses = [
    {
      title: "AI 기초 과정",
      description: "AI와 머신러닝의 기본 개념을 학습합니다.",
      level: "초급",
      duration: "4주",
    },
    {
      title: "딥러닝 심화",
      description: "신경망과 딥러닝 모델을 깊이 있게 학습합니다.",
      level: "중급",
      duration: "6주",
    },
    {
      title: "자연어 처리",
      description: "NLP 기술과 언어 모델을 배웁니다.",
      level: "중급",
      duration: "5주",
    },
    {
      title: "컴퓨터 비전",
      description: "이미지 처리와 객체 인식 기술을 학습합니다.",
      level: "중급",
      duration: "5주",
    },
    {
      title: "생성형 AI",
      description: "최신 생성형 AI 기술을 배웁니다.",
      level: "고급",
      duration: "4주",
    },
    {
      title: "AI 프로젝트 실전",
      description: "실제 프로젝트를 통해 AI를 적용합니다.",
      level: "고급",
      duration: "8주",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <a
            href="/"
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            title="뒤로 가기"
          >
            <ArrowLeft className="w-5 h-5" />
          </a>
          <h1 className="text-2xl font-bold text-gray-900">AI 스쿨</h1>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">AI 기술을 배우세요</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            삼성리서치의 전문가들과 함께 AI의 미래를 만들어가세요.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">체계적인 커리큘럼</h3>
            <p className="text-gray-600">
              기초부터 고급까지 단계별로 구성된 교육 과정
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <Users className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">전문가 강사진</h3>
            <p className="text-gray-600">
              삼성리서치의 경험 많은 AI 전문가들의 직접 강의
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <Award className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">수료증 발급</h3>
            <p className="text-gray-600">
              과정 완료 후 공식 수료증 발급
            </p>
          </div>
        </div>

        {/* Courses */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">모든 과정</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex-1">
                    {course.title}
                  </h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold ml-2">
                    {course.level}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-500">
                    {course.duration}
                  </span>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                    자세히 보기
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">지금 등록하세요</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            AI 기술의 미래를 함께 만들어갈 인재를 찾고 있습니다.
          </p>
          <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition">
            강좌 신청하기
          </button>
        </div>
      </div>
    </div>
  );
}

```

### Faq.tsx

```typescript
import { useState } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  {
    question: "AI Hub는 무엇인가요?",
    answer:
      "AI Hub는 삼성리서치에서 제공하는 AI 기술 플랫폼으로, 다양한 AI 서비스와 교육 자료를 한 곳에서 제공합니다.",
  },
  {
    question: "AI 앱을 어떻게 사용하나요?",
    answer:
      "각 AI 앱의 상세 페이지에서 '앱 열기' 버튼을 클릭하면 해당 서비스를 이용할 수 있습니다. 자세한 사용 방법은 API 문서를 참고하세요.",
  },
  {
    question: "뉴스레터는 어떻게 구독하나요?",
    answer:
      "메인 페이지의 AI 뉴스레터 섹션에서 최신 뉴스레터를 확인할 수 있습니다. 각 뉴스레터를 클릭하면 PDF 형식으로 전체 내용을 볼 수 있습니다.",
  },
  {
    question: "AI 스쿨 과정은 무료인가요?",
    answer:
      "AI 스쿨의 기본 과정은 무료로 제공됩니다. 고급 과정의 경우 별도의 등록이 필요할 수 있습니다.",
  },
  {
    question: "기술 지원은 어떻게 받나요?",
    answer:
      "기술 관련 문제는 FAQ 섹션의 기술 지원 링크를 통해 문의할 수 있습니다. 전문가 팀이 신속하게 도와드립니다.",
  },
  {
    question: "API를 사용하려면 어떻게 해야 하나요?",
    answer:
      "API 문서 페이지에서 상세한 가이드를 확인할 수 있습니다. API 키 발급은 개발자 포털에서 신청하면 됩니다.",
  },
  {
    question: "개인정보는 어떻게 보호되나요?",
    answer:
      "AI Hub는 업계 최고 수준의 보안 표준을 준수하며, 모든 개인정보는 암호화되어 안전하게 보관됩니다.",
  },
  {
    question: "피드백을 어떻게 제출하나요?",
    answer:
      "페이지 하단의 피드백 폼을 통해 의견을 제출할 수 있습니다. 여러분의 의견은 서비스 개선에 큰 도움이 됩니다.",
  },
];

export default function Faq() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <a
            href="/"
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            title="뒤로 가기"
          >
            <ArrowLeft className="w-5 h-5" />
          </a>
          <h1 className="text-2xl font-bold text-gray-900">자주 묻는 질문</h1>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-2">도움이 필요하신가요?</h2>
          <p className="text-blue-100">
            자주 묻는 질문에 대한 답변을 확인하세요.
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqData.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <button
                  onClick={() => toggleExpand(idx)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <h3 className="text-lg font-semibold text-gray-900 text-left">
                    {item.question}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-600 transition-transform ${
                      expandedId === idx ? "transform rotate-180" : ""
                    }`}
                  />
                </button>

                {expandedId === idx && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-16 bg-blue-50 rounded-2xl shadow-lg p-8 text-center border border-blue-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              더 궁금한 점이 있으신가요?
            </h3>
            <p className="text-gray-600 mb-6">
              위의 답변에서 찾을 수 없는 내용이 있다면 언제든지 문의해주세요.
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
              문의하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

```

### Navigation.tsx

```typescript
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { APP_LOGO, APP_TITLE } from "@/const";

interface NavItem {
  label: string;
  items: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    label: "AI App",
    items: [
      { label: "AI 서비스 목록", href: "/" },
      { label: "API 문서", href: "https://api.example.com/docs" },
      { label: "개발자 포털", href: "https://dev.example.com" },
      { label: "SDK 다운로드", href: "https://sdk.example.com/download" },
    ],
  },
  {
    label: "AI 스쿨",
    items: [
      { label: "강좌 목록", href: "/school" },
      { label: "학습 자료", href: "https://learn.example.com" },
      { label: "커뮤니티", href: "https://forum.example.com" },
      { label: "웨비나", href: "https://webinar.example.com" },
    ],
  },
  {
    label: "FAQ",
    items: [
      { label: "자주 묻는 질문", href: "/faq" },
      { label: "기술 지원", href: "https://support.example.com" },
      { label: "문의하기", href: "https://contact.example.com" },
      { label: "피드백", href: "https://feedback.example.com" },
    ],
  },
];

export default function Navigation() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition">
          {APP_LOGO && (
            <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8" />
          )}
          <span className="text-xl font-bold text-gray-900">{APP_TITLE}</span>
        </a>

        {/* Navigation Items */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative group"
              onMouseEnter={() => setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="px-4 py-2 text-gray-700 font-medium hover:text-gray-900 transition flex items-center gap-1 rounded-lg hover:bg-gray-100">
                {item.label}
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute left-0 mt-0 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                {item.items.map((subItem) => (
                  <a
                    key={subItem.label}
                    href={subItem.href}
                    target={subItem.href.startsWith("http") ? "_blank" : undefined}
                    rel={subItem.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                  >
                    {subItem.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}

```

### NewsletterCarousel.tsx

```typescript
import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function NewsletterCarousel() {
  const [currentPage, setCurrentPage] = useState(0);
  const { data: newsletters = [], isLoading } = trpc.newsletter.list.useQuery({ limit: 100 });

  const itemsPerPage = 4;
  const pages = useMemo(() => {
    const result = [];
    for (let i = 0; i < newsletters.length; i += itemsPerPage) {
      result.push(newsletters.slice(i, i + itemsPerPage));
    }
    return result.length > 0 ? result : [[]];
  }, [newsletters]);

  const currentItems = pages[currentPage] || [];
  const maxPages = pages.length;

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : maxPages - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < maxPages - 1 ? prev + 1 : 0));
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-48 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {currentItems.map((item) => (
          <a
            key={item.id}
            href={`/newsletter/${item.id}`}
            className="group cursor-pointer rounded-lg overflow-hidden bg-gray-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105 block"
          >
            {item.thumbnailUrl && (
              <div className="relative h-32 overflow-hidden">
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition">
                {item.title}
              </h3>
              {item.description && (
                <p className="text-sm text-gray-600 line-clamp-2 mt-2">{item.description}</p>
              )}
            </div>
          </a>
        ))}
      </div>

      {/* Navigation Controls */}
      {maxPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex gap-2">
            {pages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentPage ? "bg-blue-600 w-8" : "bg-gray-300"
                }`}
                aria-label={`Go to page ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

```

### AiAppCarousel.tsx

```typescript
import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function AiAppCarousel() {
  const [currentPage, setCurrentPage] = useState(0);
  const { data: aiApps = [], isLoading } = trpc.aiApp.list.useQuery({ limit: 100 });

  const itemsPerPage = 3;
  const pages = useMemo(() => {
    const result = [];
    for (let i = 0; i < aiApps.length; i += itemsPerPage) {
      result.push(aiApps.slice(i, i + itemsPerPage));
    }
    return result.length > 0 ? result : [[]];
  }, [aiApps]);

  const currentItems = pages[currentPage] || [];
  const maxPages = pages.length;

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : maxPages - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < maxPages - 1 ? prev + 1 : 0));
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-48 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {currentItems.map((item) => (
          <a
            key={item.id}
            href={`/app/${item.id}`}
            className="group cursor-pointer rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-blue-100 hover:border-blue-300 block"
          >
            {item.thumbnailUrl && (
              <div className="relative h-40 overflow-hidden bg-gray-200">
                <img
                  src={item.thumbnailUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition">
                {item.name}
              </h3>
              {item.description && (
                <p className="text-sm text-gray-600 line-clamp-2 mt-2">{item.description}</p>
              )}
              <button className="mt-3 w-full px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                자세히 보기
              </button>
            </div>
          </a>
        ))}
      </div>

      {/* Navigation Controls */}
      {maxPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex gap-2">
            {pages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentPage ? "bg-blue-600 w-8" : "bg-gray-300"
                }`}
                aria-label={`Go to page ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

```

### QuickLinksSection.tsx

```typescript
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { HelpCircle } from "lucide-react";

export default function QuickLinksSection() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const { data: categoriesWithLinks = [], isLoading } = trpc.quickLink.listWithCategories.useQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-5 bg-gray-200 rounded animate-pulse w-24" />
            <div className="grid grid-cols-3 gap-2">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="h-12 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {categoriesWithLinks.map((category) => (
        <div key={category.id}>
          <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
            {category.name}
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {category.links.map((link) => (
              <div
                key={link.id}
                className="relative group"
                onMouseEnter={() => setHoveredId(link.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <a
                  href={link.linkUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-12 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200 text-gray-700 font-medium text-xs transition-all duration-200 flex items-center justify-center gap-1 border border-blue-200 hover:border-blue-400 group-hover:shadow-md"
                >
                  {link.iconUrl && (
                    <img src={link.iconUrl} alt="" className="w-4 h-4" />
                  )}
                  <span className="line-clamp-1">{link.title}</span>
                </a>

                {/* Tooltip */}
                {link.description && hoveredId === link.id && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10 whitespace-normal">
                    {link.description}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {categoriesWithLinks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">퀵링크가 없습니다</p>
        </div>
      )}
    </div>
  );
}

```

### PdfViewer.tsx

```typescript
import { X, Download } from "lucide-react";

interface PdfViewerProps {
  pdfUrl: string;
  title?: string;
  onClose?: () => void;
}

export default function PdfViewer({ pdfUrl, title, onClose }: PdfViewerProps) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = title || "document.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-xl font-bold">{title || "PDF 뷰어"}</h2>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleDownload}
            className="p-2 hover:bg-gray-700 rounded-lg transition flex items-center gap-2"
            title="다운로드"
          >
            <Download className="w-5 h-5" />
            <span className="text-sm">다운로드</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition"
              title="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-auto bg-gray-950">
        <iframe
          src={pdfUrl}
          className="w-full h-full border-none"
          title={title || "PDF Viewer"}
        />
      </div>
    </div>
  );
}

```

### App.tsx

```typescript
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

import NewsletterDetail from "./pages/NewsletterDetail";
import AiAppDetail from "./pages/AiAppDetail";
import AiSchool from "./pages/AiSchool";
import Faq from "./pages/Faq";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"\\"} component={Home} />
      <Route path={"/newsletter/:id"} component={NewsletterDetail} />
      <Route path={"/app/:id"} component={AiAppDetail} />
      <Route path={"/school"} component={AiSchool} />
      <Route path={"/faq"} component={Faq} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
```

### const.ts

```typescript
export const COOKIE_NAME = "app_session_id";
export const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;
export const AXIOS_TIMEOUT_MS = 30_000;
export const UNAUTHED_ERR_MSG = 'Please login (10001)';
export const NOT_ADMIN_ERR_MSG = 'You do not have required permission (10002)';
```
