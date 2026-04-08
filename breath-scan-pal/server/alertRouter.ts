import { z } from "zod/v4";
import { TRPCError } from "@trpc/server";
import { eq, and, desc, sql } from "drizzle-orm";
import { protectedProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { alerts } from "../drizzle/schema";

export const alertRouter = router({
  /** List alerts for the current user, newest first */
  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(30),
        offset: z.number().default(0),
        onlyUnread: z.boolean().default(false),
      })
    )
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database unavailable",
        });

      const conditions = [eq(alerts.userId, ctx.user.id)];
      if (input.onlyUnread) conditions.push(eq(alerts.read, false));

      const rows = await db
        .select()
        .from(alerts)
        .where(and(...conditions))
        .orderBy(desc(alerts.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return rows;
    }),

  /** Count of unread alerts */
  unreadCount: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { count: 0 };

    const [row] = await db
      .select({ count: sql<number>`count(*)` })
      .from(alerts)
      .where(and(eq(alerts.userId, ctx.user.id), eq(alerts.read, false)));

    return { count: Number(row?.count ?? 0) };
  }),

  /** Mark a single alert as read */
  markRead: protectedProcedure
    .input(z.object({ alertId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database unavailable",
        });

      await db
        .update(alerts)
        .set({ read: true, readAt: new Date() })
        .where(
          and(eq(alerts.id, input.alertId), eq(alerts.userId, ctx.user.id))
        );

      return { success: true };
    }),

  /** Mark all alerts as read */
  markAllRead: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database unavailable",
      });

    await db
      .update(alerts)
      .set({ read: true, readAt: new Date() })
      .where(and(eq(alerts.userId, ctx.user.id), eq(alerts.read, false)));

    return { success: true };
  }),
});
