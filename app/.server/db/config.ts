import { defineConfig } from "drizzle-kit";

export default defineConfig({
  strict: true,
  schema: `${__dirname}/schema.ts`,
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
