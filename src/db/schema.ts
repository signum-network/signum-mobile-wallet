import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Tokens
export const tokens = sqliteTable("tokens", {
  id: text("id").primaryKey(),
  ticker: text("ticker").notNull(),
  description: text("description"),
  decimals: integer("decimals").notNull(),
  issuer: text("issuer").notNull(),
  mintable: integer("mintable", { mode: "boolean" }).notNull(),
});

export type Token = typeof tokens.$inferSelect;
export type InsertToken = typeof tokens.$inferInsert;
export const defaultToken: Token = {
  id: "",
  ticker: "",
  description: "",
  decimals: 0,
  issuer: "",
  mintable: false,
};
