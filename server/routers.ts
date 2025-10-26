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

