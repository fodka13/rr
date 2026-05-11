import { Router, Request, Response } from "express";
import { db, commentsTable } from "@workspace/db";
import { eq, count, and } from "drizzle-orm";
import { requireAuth, requireRole, MODERATOR_ROLES } from "../middlewares/auth";
import { CreateCommentBody } from "@workspace/api-zod";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(String(req.query.page ?? "1")));
  const limit = Math.min(100, parseInt(String(req.query.limit ?? "20")));
  const offset = (page - 1) * limit;
  const targetType = req.query.targetType as "blog" | "work" | undefined;
  const targetId = req.query.targetId ? parseInt(String(req.query.targetId)) : undefined;
  const featured = req.query.featured === "true" ? true : req.query.featured === "false" ? false : undefined;

  const conditions: any[] = [];
  if (targetType) conditions.push(eq(commentsTable.targetType, targetType));
  if (targetId !== undefined) conditions.push(eq(commentsTable.targetId, targetId));
  if (featured !== undefined) conditions.push(eq(commentsTable.isFeatured, featured));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [comments, totalResult] = await Promise.all([
    db.query.commentsTable.findMany({
      where: whereClause,
      with: { author: true },
      limit,
      offset,
    }),
    db.select({ count: count() }).from(commentsTable).where(whereClause),
  ]);

  res.json({ comments, total: totalResult[0].count, page, limit });
});

router.post("/", requireAuth, async (req: Request, res: Response) => {
  const currentUser = (req as any).user;
  const parsed = CreateCommentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const [comment] = await db.insert(commentsTable).values({
    ...parsed.data,
    authorId: currentUser.id,
  }).returning();

  const commentWithAuthor = await db.query.commentsTable.findFirst({
    where: eq(commentsTable.id, comment.id),
    with: { author: true },
  });

  res.status(201).json(commentWithAuthor);
});

router.delete("/:id", requireAuth, requireRole(...MODERATOR_ROLES), async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id));
  await db.delete(commentsTable).where(eq(commentsTable.id, id));
  res.json({ message: "Comment deleted" });
});

router.post("/:id/feature", requireAuth, requireRole(...MODERATOR_ROLES), async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id));

  const [existing] = await db.select({ isFeatured: commentsTable.isFeatured })
    .from(commentsTable).where(eq(commentsTable.id, id)).limit(1);

  if (!existing) {
    res.status(404).json({ error: "Comment not found" });
    return;
  }

  await db.update(commentsTable)
    .set({ isFeatured: !existing.isFeatured })
    .where(eq(commentsTable.id, id));

  const commentWithAuthor = await db.query.commentsTable.findFirst({
    where: eq(commentsTable.id, id),
    with: { author: true },
  });

  res.json(commentWithAuthor);
});

export default router;
