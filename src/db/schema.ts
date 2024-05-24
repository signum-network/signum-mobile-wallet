import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Token
export const token = sqliteTable("diaries", {
  id: text("id").primaryKey(),
  ticker: text("ticker").notNull(),
  description: text("description").notNull(),
  decimals: integer("decimals").notNull(),
  issuerId: text("issuerId").notNull(),
  isMintable: integer("isMintable", { mode: "boolean" }).notNull(),
});

export type Token = typeof token.$inferSelect;
export type InsertToken = typeof token.$inferInsert;
