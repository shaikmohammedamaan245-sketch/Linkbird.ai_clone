import { pgTable, uuid, varchar, timestamp, integer, pgEnum, index } from "drizzle-orm/pg-core";

export const campaignStatusEnum = pgEnum("campaign_status", ["draft", "active", "paused", "completed"]);
export const leadStatusEnum = pgEnum("lead_status", ["pending", "contacted", "responded", "converted"]);

export const campaigns = pgTable("campaigns", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 200 }).notNull(),
  status: campaignStatusEnum("status").notNull().default("draft"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
}, (t) => ({
  statusIdx: index("campaigns_status_idx").on(t.status),
  createdIdx: index("campaigns_created_idx").on(t.createdAt)
}));

export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 200 }).notNull(),
  company: varchar("company", { length: 200 }).notNull(),
  campaignId: uuid("campaign_id").references(() => campaigns.id, { onDelete: "cascade" }).notNull(),
  status: leadStatusEnum("status").notNull().default("pending"),
  lastContactAt: timestamp("last_contact_at", { withTimezone: true }),
  interactionCount: integer("interaction_count").notNull().default(0)
}, (t) => ({
  campaignIdx: index("leads_campaign_idx").on(t.campaignId),
  statusIdx: index("leads_status_idx").on(t.status),
  lastContactIdx: index("leads_last_contact_idx").on(t.lastContactAt)
}));
