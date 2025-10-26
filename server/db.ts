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
