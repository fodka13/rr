import { pgTable, text, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { categoriesTable } from "./categories";
import { usersTable } from "./users";
import { relations } from "drizzle-orm";

export const blogsTable = pgTable("blogs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  categoryId: integer("category_id").references(() => categoriesTable.id, { onDelete: "set null" }),
  authorId: integer("author_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  isPublished: boolean("is_published").notNull().default(false),
  likes: integer("likes").notNull().default(0),
  viewCount: integer("view_count").notNull().default(0),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const blogsRelations = relations(blogsTable, ({ one }) => ({
  category: one(categoriesTable, {
    fields: [blogsTable.categoryId],
    references: [categoriesTable.id],
  }),
  author: one(usersTable, {
    fields: [blogsTable.authorId],
    references: [usersTable.id],
  }),
}));

export const insertBlogSchema = createInsertSchema(blogsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBlog = z.infer<typeof insertBlogSchema>;
export type Blog = typeof blogsTable.$inferSelect;
