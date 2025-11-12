import { defineConfig } from "drizzle-kit";

export default defineConfig({
  driver: "expo",
  dialect: "sqlite",
  schema: "./src/db/schema.ts",
  out: "./src/db/drizzle",
});
