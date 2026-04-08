import {
  mysqlTable,
  int,
  varchar,
  text,
  timestamp,
  float,
  mysqlEnum,
  boolean,
  json,
} from "drizzle-orm/mysql-core";
import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";

// ──────────────────────────────────────────────
// Users
// ──────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("open_id", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  loginMethod: varchar("login_method", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "doctor"]).default("user"),
  lastSignedIn: timestamp("last_signed_in"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export type User = InferSelectModel<typeof users>;
export type InsertUser = InferInsertModel<typeof users>;

// ──────────────────────────────────────────────
// Breath Scans
// ──────────────────────────────────────────────
export const scans = mysqlTable("scans", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),

  // Raw data
  audioUrl: varchar("audio_url", { length: 1024 }),
  imageUrl: varchar("image_url", { length: 1024 }),
  durationSeconds: float("duration_seconds"),

  // AI analysis results
  status: mysqlEnum("status", ["pending", "processing", "done", "error"])
    .default("pending")
    .notNull(),
  breathingRate: float("breathing_rate"), // breaths per minute
  rhythmScore: float("rhythm_score"), // 0-100
  depthScore: float("depth_score"), // 0-100
  oxygenEstimate: float("oxygen_estimate"), // % SpO2 estimate
  patternType: varchar("pattern_type", { length: 64 }), // e.g. "normal", "shallow", "irregular"
  aiSummary: text("ai_summary"),
  aiFindings: json("ai_findings"), // structured JSON findings
  errorMessage: text("error_message"),

  // Metadata
  notes: text("notes"), // patient/doctor notes
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Scan = InferSelectModel<typeof scans>;
export type InsertScan = InferInsertModel<typeof scans>;

// ──────────────────────────────────────────────
// Alerts
// ──────────────────────────────────────────────
export const alerts = mysqlTable("alerts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  scanId: int("scan_id"), // nullable: alert may not be tied to a scan

  type: mysqlEnum("type", [
    "low_oxygen",
    "irregular_rhythm",
    "shallow_breathing",
    "high_breathing_rate",
    "low_breathing_rate",
    "system",
  ]).notNull(),

  severity: mysqlEnum("severity", ["info", "warning", "critical"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false).notNull(),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Alert = InferSelectModel<typeof alerts>;
export type InsertAlert = InferInsertModel<typeof alerts>;

// ──────────────────────────────────────────────
// Doctor–Patient relationships
// ──────────────────────────────────────────────
export const doctorPatients = mysqlTable("doctor_patients", {
  id: int("id").autoincrement().primaryKey(),
  doctorId: int("doctor_id").notNull(),
  patientId: int("patient_id").notNull(),
  assignedAt: timestamp("assigned_at").defaultNow().notNull(),
});

export type DoctorPatient = InferSelectModel<typeof doctorPatients>;
export type InsertDoctorPatient = InferInsertModel<typeof doctorPatients>;
