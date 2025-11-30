import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const categorySchema = z.enum(["feature", "improvement", "fix"]);
export type CategoryType = z.infer<typeof categorySchema>;

export const changeItemSchema = z.object({
  text: z.string(),
  category: categorySchema,
});
export type ChangeItem = z.infer<typeof changeItemSchema>;

export const changelogEntrySchema = z.object({
  version: z.string(),
  date: z.string(),
  title: z.string(),
  description: z.string().optional(),
  changes: z.array(changeItemSchema),
});
export type ChangelogEntry = z.infer<typeof changelogEntrySchema>;

export const changelogDataSchema = z.object({
  entries: z.array(changelogEntrySchema),
});
export type ChangelogData = z.infer<typeof changelogDataSchema>;

export const insertChangelogEntrySchema = changelogEntrySchema;
export type InsertChangelogEntry = z.infer<typeof insertChangelogEntrySchema>;
