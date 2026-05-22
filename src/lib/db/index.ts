import "server-only";
import { drizzle } from "drizzle-orm/libsql/web";
import { createClient } from "@libsql/client/web";
import * as schema from "./schema";

// Singleton pattern — module-level, not inside handler.
// Per PITFALLS.md Performance section: avoids connection pool exhaustion.
const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export const db = drizzle({ client, schema });
