import { z } from "zod/v4";
import { TRPCError } from "@trpc/server";
import { eq, desc, and } from "drizzle-orm";
import { protectedProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { scans, alerts } from "../drizzle/schema";
import { invokeLLM } from "./_core/llm";
import { storagePut } from "./storage";
import { notifyOwner } from "./_core/notification";

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

async function createAlertIfNeeded(
  userId: number,
  scanId: number,
  findings: {
    breathingRate?: number;
    rhythmScore?: number;
    depthScore?: number;
    oxygenEstimate?: number;
  }
) {
  const db = await getDb();
  if (!db) return;

  const newAlerts = [];

  if (findings.oxygenEstimate && findings.oxygenEstimate < 94) {
    newAlerts.push({
      userId,
      scanId,
      type: "low_oxygen" as const,
      severity:
        findings.oxygenEstimate < 90
          ? ("critical" as const)
          : ("warning" as const),
      title: "Low oxygen saturation detected",
      message: `Estimated SpO₂ of ${findings.oxygenEstimate.toFixed(1)}% is below the normal threshold of 94%. Consider consulting a healthcare professional.`,
    });
  }

  if (findings.breathingRate && findings.breathingRate > 25) {
    newAlerts.push({
      userId,
      scanId,
      type: "high_breathing_rate" as const,
      severity: "warning" as const,
      title: "Elevated breathing rate",
      message: `Your breathing rate of ${findings.breathingRate.toFixed(0)} breaths/min exceeds the normal range (12–20). This may indicate respiratory stress.`,
    });
  }

  if (findings.breathingRate && findings.breathingRate < 8) {
    newAlerts.push({
      userId,
      scanId,
      type: "low_breathing_rate" as const,
      severity: "warning" as const,
      title: "Low breathing rate",
      message: `Your breathing rate of ${findings.breathingRate.toFixed(0)} breaths/min is below the normal range (12–20).`,
    });
  }

  if (findings.rhythmScore !== undefined && findings.rhythmScore < 50) {
    newAlerts.push({
      userId,
      scanId,
      type: "irregular_rhythm" as const,
      severity:
        findings.rhythmScore < 30
          ? ("critical" as const)
          : ("warning" as const),
      title: "Irregular breathing rhythm",
      message: `Rhythm score of ${findings.rhythmScore.toFixed(0)}/100 suggests irregular breathing patterns. Consider a deeper evaluation.`,
    });
  }

  if (findings.depthScore !== undefined && findings.depthScore < 40) {
    newAlerts.push({
      userId,
      scanId,
      type: "shallow_breathing" as const,
      severity: "info" as const,
      title: "Shallow breathing detected",
      message: `Depth score of ${findings.depthScore.toFixed(0)}/100 suggests shallow breathing, which can reduce oxygen intake over time.`,
    });
  }

  for (const alert of newAlerts) {
    await db.insert(alerts).values(alert);
  }

  // Notify owner if critical alert
  const criticalAlerts = newAlerts.filter(a => a.severity === "critical");
  if (criticalAlerts.length > 0) {
    await notifyOwner({
      title: `⚠️ Critical breath alert for user ${userId}`,
      content: criticalAlerts.map(a => `${a.title}: ${a.message}`).join("\n"),
    }).catch(console.warn);
  }
}

async function analyzeWithAI(input: {
  audioUrl?: string | null;
  imageUrl?: string | null;
  notes?: string | null;
  durationSeconds?: number | null;
}) {
  const contentParts: Array<{ type: string; [key: string]: unknown }> = [];

  contentParts.push({
    type: "text",
    text: `You are a medical AI assistant specialized in respiratory analysis. Analyze the provided breath scan data and return a structured JSON response.

${input.notes ? `Patient notes: ${input.notes}` : ""}
${input.durationSeconds ? `Recording duration: ${input.durationSeconds}s` : ""}

Respond ONLY with a JSON object (no markdown, no explanation) with this exact structure:
{
  "breathingRate": <number: breaths per minute, e.g. 16>,
  "rhythmScore": <number: 0-100, regularity of breathing pattern>,
  "depthScore": <number: 0-100, depth/quality of each breath>,
  "oxygenEstimate": <number: estimated SpO2 percentage, e.g. 97.5>,
  "patternType": <string: one of "normal", "shallow", "rapid", "slow", "irregular", "hyperventilation", "apnea_risk">,
  "summary": <string: 2-3 sentence plain-language summary for the patient>,
  "findings": [
    { "label": <string>, "value": <string>, "status": <"normal"|"warning"|"critical"> }
  ]
}`,
  });

  if (input.imageUrl) {
    contentParts.push({
      type: "image_url",
      image_url: { url: input.imageUrl, detail: "high" },
    });
  }

  if (input.audioUrl) {
    contentParts.push({
      type: "file_url",
      file_url: { url: input.audioUrl, mime_type: "audio/mpeg" },
    });
  }

  const result = await invokeLLM({
    messages: [{ role: "user", content: contentParts as any }],
    maxTokens: 1024,
  });

  const raw = result.choices[0]?.message?.content;
  const text = typeof raw === "string" ? raw : JSON.stringify(raw);

  // Strip markdown fences if present
  const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleaned);
}

// ──────────────────────────────────────────────
// Router
// ──────────────────────────────────────────────

export const scanRouter = router({
  /** Upload audio/image and create a pending scan record */
  create: protectedProcedure
    .input(
      z.object({
        audioBase64: z.string().optional(),
        imageBase64: z.string().optional(),
        durationSeconds: z.number().optional(),
        notes: z.string().max(2000).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database unavailable",
        });

      let audioUrl: string | undefined;
      let imageUrl: string | undefined;

      // Upload audio if provided
      if (input.audioBase64) {
        const buf = Buffer.from(input.audioBase64, "base64");
        const key = `scans/${ctx.user.id}/${Date.now()}.mp3`;
        const result = await storagePut(key, buf, "audio/mpeg");
        audioUrl = result.url;
      }

      // Upload image if provided
      if (input.imageBase64) {
        const buf = Buffer.from(input.imageBase64, "base64");
        const key = `scans/${ctx.user.id}/${Date.now()}.jpg`;
        const result = await storagePut(key, buf, "image/jpeg");
        imageUrl = result.url;
      }

      const [inserted] = await db
        .insert(scans)
        .values({
          userId: ctx.user.id,
          audioUrl,
          imageUrl,
          durationSeconds: input.durationSeconds,
          notes: input.notes,
          status: "pending",
        })
        .$returningId();

      return { scanId: inserted.id };
    }),

  /** Run AI analysis on an existing scan */
  analyze: protectedProcedure
    .input(z.object({ scanId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database unavailable",
        });

      const [scan] = await db
        .select()
        .from(scans)
        .where(and(eq(scans.id, input.scanId), eq(scans.userId, ctx.user.id)))
        .limit(1);

      if (!scan)
        throw new TRPCError({ code: "NOT_FOUND", message: "Scan not found" });
      if (scan.status === "processing")
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Scan already processing",
        });
      if (scan.status === "done")
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Scan already analyzed",
        });

      // Mark as processing
      await db
        .update(scans)
        .set({ status: "processing" })
        .where(eq(scans.id, scan.id));

      try {
        const analysis = await analyzeWithAI({
          audioUrl: scan.audioUrl,
          imageUrl: scan.imageUrl,
          notes: scan.notes,
          durationSeconds: scan.durationSeconds,
        });

        await db
          .update(scans)
          .set({
            status: "done",
            breathingRate: analysis.breathingRate,
            rhythmScore: analysis.rhythmScore,
            depthScore: analysis.depthScore,
            oxygenEstimate: analysis.oxygenEstimate,
            patternType: analysis.patternType,
            aiSummary: analysis.summary,
            aiFindings: analysis.findings,
          })
          .where(eq(scans.id, scan.id));

        // Create alerts for anomalies
        await createAlertIfNeeded(ctx.user.id, scan.id, {
          breathingRate: analysis.breathingRate,
          rhythmScore: analysis.rhythmScore,
          depthScore: analysis.depthScore,
          oxygenEstimate: analysis.oxygenEstimate,
        });

        return { status: "done" as const, analysis };
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        await db
          .update(scans)
          .set({ status: "error", errorMessage: msg })
          .where(eq(scans.id, scan.id));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Analysis failed: ${msg}`,
        });
      }
    }),

  /** List scans for the current user */
  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
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

      const rows = await db
        .select()
        .from(scans)
        .where(eq(scans.userId, ctx.user.id))
        .orderBy(desc(scans.recordedAt))
        .limit(input.limit)
        .offset(input.offset);

      return rows;
    }),

  /** Get a single scan by id */
  get: protectedProcedure
    .input(z.object({ scanId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database unavailable",
        });

      const [scan] = await db
        .select()
        .from(scans)
        .where(and(eq(scans.id, input.scanId), eq(scans.userId, ctx.user.id)))
        .limit(1);

      if (!scan)
        throw new TRPCError({ code: "NOT_FOUND", message: "Scan not found" });
      return scan;
    }),

  /** Delete a scan */
  delete: protectedProcedure
    .input(z.object({ scanId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database unavailable",
        });

      await db
        .delete(scans)
        .where(and(eq(scans.id, input.scanId), eq(scans.userId, ctx.user.id)));
      return { success: true };
    }),
});
