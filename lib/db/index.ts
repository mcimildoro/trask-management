// lib/db/index.ts
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

const connectionString = process.env.DATABASE_URL!

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in environment variables")
}

const client = postgres(connectionString, { ssl: 'require' }) // 'require' evita errores en Vercel
export const db = drizzle(client, { schema })
