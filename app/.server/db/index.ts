import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { relations } from "./schema";

const globalForDb = globalThis as typeof globalThis & {
  postgresClient?: ReturnType<typeof postgres>;
};

const client = globalForDb.postgresClient ?? postgres(process.env.DATABASE_URL);

globalForDb.postgresClient = client;

export const db = drizzle({ client, relations });
