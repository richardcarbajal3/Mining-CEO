import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const blocks = pgTable("blocks", {
  id: varchar("id").primaryKey(),
  number: integer("number").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("pending"),
  progress: integer("progress").notNull().default(0),
});

export const insertBlockSchema = createInsertSchema(blocks).omit({
  id: true,
});

export type InsertBlock = z.infer<typeof insertBlockSchema>;
export type Block = typeof blocks.$inferSelect;

export const checklistItems = pgTable("checklist_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  blockId: varchar("block_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  completed: boolean("completed").notNull().default(false),
  category: text("category"),
  order: integer("order").notNull().default(0),
});

export const insertChecklistItemSchema = createInsertSchema(checklistItems).omit({
  id: true,
});

export type InsertChecklistItem = z.infer<typeof insertChecklistItemSchema>;
export type ChecklistItem = typeof checklistItems.$inferSelect;

export const evidences = pgTable("evidences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  blockId: varchar("block_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(),
  status: text("status").notNull().default("pending"),
  documentUrl: text("document_url"),
  notes: text("notes"),
});

export const insertEvidenceSchema = createInsertSchema(evidences).omit({
  id: true,
});

export type InsertEvidence = z.infer<typeof insertEvidenceSchema>;
export type Evidence = typeof evidences.$inferSelect;

export const stakeholders = pgTable("stakeholders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  role: text("role").notNull(),
  type: text("type").notNull(),
  email: text("email"),
  phone: text("phone"),
  avatar: text("avatar"),
});

export const insertStakeholderSchema = createInsertSchema(stakeholders).omit({
  id: true,
});

export type InsertStakeholder = z.infer<typeof insertStakeholderSchema>;
export type Stakeholder = typeof stakeholders.$inferSelect;

export const stakeholderParticipation = pgTable("stakeholder_participation", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  stakeholderId: varchar("stakeholder_id").notNull(),
  blockId: varchar("block_id").notNull(),
  participationLevel: text("participation_level").notNull(),
  commitmentStatus: text("commitment_status").notNull().default("pending"),
  notes: text("notes"),
});

export const insertStakeholderParticipationSchema = createInsertSchema(stakeholderParticipation).omit({
  id: true,
});

export type InsertStakeholderParticipation = z.infer<typeof insertStakeholderParticipationSchema>;
export type StakeholderParticipation = typeof stakeholderParticipation.$inferSelect;

export const kpis = pgTable("kpis", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  blockId: varchar("block_id").notNull(),
  name: text("name").notNull(),
  value: integer("value").notNull(),
  target: integer("target").notNull(),
  unit: text("unit").notNull(),
  trend: text("trend").notNull().default("stable"),
});

export const insertKpiSchema = createInsertSchema(kpis).omit({
  id: true,
});

export type InsertKpi = z.infer<typeof insertKpiSchema>;
export type Kpi = typeof kpis.$inferSelect;

export const procedures = pgTable("procedures", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  category: text("category").notNull(),
  content: text("content").notNull(),
  normative: text("normative"),
});

export const insertProcedureSchema = createInsertSchema(procedures).omit({
  id: true,
});

export type InsertProcedure = z.infer<typeof insertProcedureSchema>;
export type Procedure = typeof procedures.$inferSelect;

export const shareholderMetrics = pgTable("shareholder_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  metricName: text("metric_name").notNull(),
  value: integer("value").notNull(),
  description: text("description"),
  trend: text("trend").notNull().default("stable"),
});

export const insertShareholderMetricSchema = createInsertSchema(shareholderMetrics).omit({
  id: true,
});

export type InsertShareholderMetric = z.infer<typeof insertShareholderMetricSchema>;
export type ShareholderMetric = typeof shareholderMetrics.$inferSelect;

export const demographicData = pgTable("demographic_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: text("category").notNull(),
  title: text("title").notNull(),
  value: text("value").notNull(),
  description: text("description"),
});

export const insertDemographicDataSchema = createInsertSchema(demographicData).omit({
  id: true,
});

export type InsertDemographicData = z.infer<typeof insertDemographicDataSchema>;
export type DemographicData = typeof demographicData.$inferSelect;

export const contracts = pgTable("contracts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  contractNumber: text("contract_number"),
  blockId: varchar("block_id"),
  contractor: text("contractor").notNull(),
  contractorContact: text("contractor_contact"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  value: integer("value"),
  currency: text("currency").default("USD"),
  billingType: text("billing_type"),
  billingFrequency: text("billing_frequency"),
  status: text("status").notNull().default("draft"),
  closingDate: text("closing_date"),
  closingNotes: text("closing_notes"),
  notes: text("notes"),
});

export const insertContractSchema = createInsertSchema(contracts).omit({
  id: true,
});

export type InsertContract = z.infer<typeof insertContractSchema>;
export type Contract = typeof contracts.$inferSelect;
