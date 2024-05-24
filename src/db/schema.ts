import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Tokens
export const tokens = sqliteTable("tokens", {
  id: text("id").primaryKey(),
  ticker: text("ticker").notNull(),
  description: text("description").notNull(),
  decimals: integer("decimals").notNull(),
  issuerId: text("issuerId").notNull(),
  isMintable: integer("isMintable", { mode: "boolean" }).notNull(),
});

export type Token = typeof tokens.$inferSelect;
export type InsertToken = typeof tokens.$inferInsert;
