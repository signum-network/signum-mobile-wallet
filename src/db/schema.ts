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

// Distribution Amounts of a distribute to holders transaction per account
export const distributionAmounts = sqliteTable("distribution-amounts", {
  id: text("id").primaryKey(), // The id of a distribution transaction or multiple payout
  account: text("account").notNull(), // The account identifier
  amountNQT: text("amountNQT").notNull(), // SIGNA amount
  quantityQNT: text("quantityQNT"), // Optional AssetToDistribute quantity
});

export type DistributionAmount = typeof distributionAmounts.$inferSelect;
export type InsertDistributionAmount = typeof distributionAmounts.$inferInsert;
export const defaultDistributionAmount: DistributionAmount = {
  id: "",
  account: "",
  amountNQT: "0",
  quantityQNT: "0",
};
