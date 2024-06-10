import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Tokens
export const tokens = sqliteTable("tokens", {
  id: text("id").primaryKey(),
  ticker: text("ticker").notNull(),
  description: text("description"),
  decimals: integer("decimals").notNull(),
  account: text("account").notNull(),
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
  account: "",
  issuer: "",
  mintable: false,
};

// Tokens Transacional Data
export const tokensTransactionalData = sqliteTable(
  "tokens-transactional-data",
  {
    id: text("id").references(() => tokens.id, { onDelete: "cascade" }),
    priceNQT: text("priceNQT").notNull(),
    lastUpdated: text("lastUpdated").notNull(),
  }
);

export type TokenTransactionalData =
  typeof tokensTransactionalData.$inferSelect;
export type InsertTokenTransactionalData =
  typeof tokensTransactionalData.$inferInsert;
export const defaultTokenTransactionalData: TokenTransactionalData = {
  id: "",
  priceNQT: "0",
  lastUpdated: "",
};

// Distribution Amounts of a "distribute to holders" transaction per account
export const distributionAmounts = sqliteTable("distribution-amounts", {
  id: text("id").primaryKey(), // The id of a distribution transaction
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
