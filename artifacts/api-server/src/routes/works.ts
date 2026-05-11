import { Router, Request, Response } from "express";
import { db, worksTable } from "@workspace/db";
import { eq, count, sql, asc, desc, and } from "drizzle-orm";
import { requireAuth, requireRole, EDITOR_ROLES, optionalAuth } from "../middlewares/auth";
import { CreateWorkBody, UpdateWorkBody } from "@workspace/api-zod";

const router = Router();

async function getWorkWithCategory(id: number) {
  return db.query.worksTable.findFirst({
    where: eq(worksTable.id, id),
    with: { category: true },
  });
}

router.get("/", async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(String(req.query.page ?? "1")));
  const limit = Math.min(100, parseInt(String(req.query.limit ?? "20")));
  const offset = (page - 1) * limit;
  const categoryId = req.query.categoryId ? parseInt(String(req.query.categoryId)) : undefined;
  const featured = req.query.featured === "true" ? true : req.query.featured === "false" ? false : undefined;

  const conditions: any[] = [];
  if (categoryId !== undefined) conditions.push(eq(worksTable.categoryId, categoryId));
  if (featured !== undefined) conditions.push(eq(worksTable.isFeatured, featured));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [works, totalResult] = await Promise.all([
    db.query.worksTable.findMany({
      where: whereClause,
      with: { category: true },
      limit,
      offset,
      orderBy: [asc(worksTable.sortOrder), desc(worksTable.createdAt)],
    }),
    db.select({ count: count() }).from(worksTable).where(whereClause),
  ]);

  res.json({ works, total: totalResult[0].count, page, limit });
});

router.post("/", requireAuth, requireRole(...EDITOR_ROLES), async (req: Request, res: Response) => {
  const parsed = CreateWorkBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const [work] = await db.insert(worksTable).values({
    ...parsed.data,
    tags: parsed.data.tags ?? [],
  }).returning();

  const workWithCategory = await getWorkWithCategory(work.id);
  res.status(201).json(workWithCategory);
});

router.get("/:id", async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id));
  const work = await getWorkWithCategory(id);

  if (!work) {
    res.status(404).json({ error: "Work not found" });
    return;
  }

  res.json(work);
});

router.patch("/:id", requireAuth, requireRole(...EDITOR_ROLES), async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id));
  const parsed = UpdateWorkBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  await db.update(worksTable).set(parsed.data).where(eq(worksTable.id, id));
  const work = await getWorkWithCategory(id);

  if (!work) {
    res.status(404).json({ error: "Work not found" });
    return;
  }

  res.json(work);
});

router.delete("/:id", requireAuth, requireRole(...EDITOR_ROLES), async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id));
  await db.delete(worksTable).where(eq(worksTable.id, id));
  res.json({ message: "Work deleted" });
});

router.post("/:id/like", optionalAuth, async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id));

  const [work] = await db.update(worksTable)
    .set({ likes: sql`${worksTable.likes} + 1` })
    .where(eq(worksTable.id, id))
    .returning({ likes: worksTable.likes });

  if (!work) {
    res.status(404).json({ error: "Work not found" });
    return;
  }

  res.json({ likes: work.likes, liked: true });
});

export default router;
