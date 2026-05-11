import { pgTable, text, serial, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { categoriesTable } from "./categories";
import { relations } from "drizzle-orm";

export type WorkMediaItem = {
  url: string;
  caption: string;
  type: "image" | "video";
};

export const worksTable = pgTable("works", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  categoryId: integer("category_id").references(() => categoriesTable.id, { onDelete: "set null" }),
  images: jsonb("images").$type<WorkMediaItem[]>().notNull().default([]),
  tags: text("tags").array().notNull().default([]),
  isFeatured: boolean("is_featured").notNull().default(false),
  isFeaturedLogo: boolean("is_featured_logo").notNull().default(false),
  likes: integer("likes").notNull().default(0),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const worksRelations = relations(worksTable, ({ one }) => ({
  category: one(categoriesTable, {
    fields: [worksTable.categoryId],
    references: [categoriesTable.id],
  }),
}));

export const insertWorkSchema = createInsertSchema(worksTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertWork = z.infer<typeof insertWorkSchema>;
export type Work = typeof worksTable.$inferSelect;
