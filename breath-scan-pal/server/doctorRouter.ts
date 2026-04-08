import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, and, desc } from "drizzle-orm";
import { protectedProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { users, scans, doctorPatients, alerts } from "../drizzle/schema";

/** Only users with role 'doctor' or 'admin' may use these procedures */
const doctorProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user.role !== "doctor" && ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Doctor access required",
    });
  }
  return next({ ctx });
});

export const doctorRouter = router({
  /** List patients assigned to this doctor */
  myPatients: doctorProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database unavailable",
      });

    const rows = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        assignedAt: doctorPatients.assignedAt,
      })
      .from(doctorPatients)
      .innerJoin(users, eq(users.id, doctorPatients.patientId))
      .where(eq(doctorPatients.doctorId, ctx.user.id));

    return rows;
  }),

  /** Assign a patient to this doctor by email */
  assignPatient: doctorProcedure
    .input(z.object({ patientEmail: z.string().email() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database unavailable",
        });

      const [patient] = await db
        .select()
        .from(users)
        .where(eq(users.email, input.patientEmail))
        .limit(1);
      if (!patient)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Patient not found",
        });

      const [existing] = await db
        .select()
        .from(doctorPatients)
        .where(
          and(
            eq(doctorPatients.doctorId, ctx.user.id),
            eq(doctorPatients.patientId, patient.id)
          )
        )
        .limit(1);
      if (!existing) {
        await db
          .insert(doctorPatients)
          .values({ doctorId: ctx.user.id, patientId: patient.id });
      }

      return { success: true };
    }),

  /** Get scans for a patient under this doctor */
  patientScans: doctorProcedure
    .input(
      z.object({
        patientId: z.number(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database unavailable",
        });

      // Verify this doctor has access to this patient
      const [rel] = await db
        .select()
        .from(doctorPatients)
        .where(
          and(
            eq(doctorPatients.doctorId, ctx.user.id),
            eq(doctorPatients.patientId, input.patientId)
          )
        )
        .limit(1);

      if (!rel)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this patient",
        });

      const rows = await db
        .select()
        .from(scans)
        .where(eq(scans.userId, input.patientId))
        .orderBy(desc(scans.recordedAt))
        .limit(input.limit)
        .offset(input.offset);

      return rows;
    }),

  /** Get alerts for a patient under this doctor */
  patientAlerts: doctorProcedure
    .input(z.object({ patientId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database unavailable",
        });

      const [rel] = await db
        .select()
        .from(doctorPatients)
        .where(
          and(
            eq(doctorPatients.doctorId, ctx.user.id),
            eq(doctorPatients.patientId, input.patientId)
          )
        )
        .limit(1);

      if (!rel)
        throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });

      return db
        .select()
        .from(alerts)
        .where(eq(alerts.userId, input.patientId))
        .orderBy(desc(alerts.createdAt))
        .limit(50);
    }),
});
