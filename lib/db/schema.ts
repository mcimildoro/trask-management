import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"
import { createId } from "@paralleldrive/cuid2"

// Users table
export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: text("created_at").$defaultFn(() => new Date().toISOString()),
})

// Tasks table
export const tasks = sqliteTable("tasks", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text("title").notNull(),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: text("created_at").$defaultFn(() => new Date().toISOString()),
})

