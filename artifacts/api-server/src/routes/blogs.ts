import { Router, Request, Response } from "express";
import { db, blogsTable } from "@workspace/db";
import { eq, count, sql, desc, and } from "drizzle-orm";
import { requireAuth, requireRole, EDITOR_ROLES, optionalAuth } from "../middlewares/auth";
import { CreateBlogBody, UpdateBlogBody } from "@workspace/api-zod";

const router = Router();

async function getBlogWithRelations(id: number) {
  return db.query.blogsTable.findFirst({
    where: eq(blogsTable.id, id),
    with: { category: true, author: true },
  });
}

router.get("/", optionalAuth, async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(String(req.query.page ?? "1")));
  const limit = Math.min(100, parseInt(String(req.query.limit ?? "12")));
  const offset = (page - 1) * limit;
  const categoryId = req.query.categoryId ? parseInt(String(req.query.categoryId)) : undefined;
  const currentUser = (req as any).user;
  const publishedParam = req.query.published;

  let publishedFilter: boolean | undefined;
  if (publishedParam === "true") publishedFilter = true;
  else if (publishedParam === "false") {
    if (!currentUser || !["super_admin", "admin", "editor"].includes(currentUser.role)) {
      publishedFilter = true;
    } else {
      publishedFilter = false;
    }
  } else {
    if (!currentUser || !["super_admin", "admin", "editor"].includes(currentUser.role)) {
      publishedFilter = true;
    }
  }

  const conditions: any[] = [];
  if (categoryId !== undefined) conditions.push(eq(blogsTable.categoryId, categoryId));
  if (publishedFilter !== undefined) conditions.push(eq(blogsTable.isPublished, publishedFilter));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [blogs, totalResult] = await Promise.all([
    db.query.blogsTable.findMany({
      where: whereClause,
      with: { category: true, author: true },
      limit,
      offset,
      orderBy: [desc(blogsTable.publishedAt), desc(blogsTable.createdAt)],
    }),
    db.select({ count: count() }).from(blogsTable).where(whereClause),
  ]);

  res.json({ blogs, total: totalResult[0].count, page, limit });
});

router.post("/", requireAuth, requireRole(...EDITOR_ROLES), async (req: Request, res: Response) => {
  const currentUser = (req as any).user;
  const parsed = CreateBlogBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const [blog] = await db.insert(blogsTable).values({
    ...parsed.data,
    authorId: currentUser.id,
    publishedAt: parsed.data.isPublished ? new Date() : null,
  }).returning();

  const blogWithRelations = await getBlogWithRelations(blog.id);
  res.status(201).json(blogWithRelations);
});

router.get("/:id", optionalAuth, async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id));
  const blog = await getBlogWithRelations(id);

  if (!blog) {
    res.status(404).json({ error: "Blog not found" });
    return;
  }

  await db.update(blogsTable)
    .set({ viewCount: sql`${blogsTable.viewCount} + 1` })
    .where(eq(blogsTable.id, id));

  res.json(blog);
});

router.patch("/:id", requireAuth, requireRole(...EDITOR_ROLES), async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id));
  const parsed = UpdateBlogBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const updates: any = { ...parsed.data };
  if (parsed.data.isPublished === true) {
    const [existing] = await db.select({ publishedAt: blogsTable.publishedAt })
      .from(blogsTable).where(eq(blogsTable.id, id)).limit(1);
    if (!existing?.publishedAt) {
      updates.publishedAt = new Date();
    }
  }

  await db.update(blogsTable).set(updates).where(eq(blogsTable.id, id));
  const blog = await getBlogWithRelations(id);

  if (!blog) {
    res.status(404).json({ error: "Blog not found" });
    return;
  }

  res.json(blog);
});

router.delete("/:id", requireAuth, requireRole(...EDITOR_ROLES), async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id));
  await db.delete(blogsTable).where(eq(blogsTable.id, id));
  res.json({ message: "Blog deleted" });
});

router.post("/:id/like", optionalAuth, async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id));

  const [blog] = await db.update(blogsTable)
    .set({ likes: sql`${blogsTable.likes} + 1` })
    .where(eq(blogsTable.id, id))
    .returning({ likes: blogsTable.likes });

  if (!blog) {
    res.status(404).json({ error: "Blog not found" });
    return;
  }

  res.json({ likes: blog.likes, liked: true });
});

export default router;
