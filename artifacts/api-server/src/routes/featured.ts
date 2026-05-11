import { Router, Request, Response } from "express";
import { db, worksTable, commentsTable } from "@workspace/db";
import { eq, inArray } from "drizzle-orm";
import { requireAuth, requireRole, EDITOR_ROLES } from "../middlewares/auth";
import { SetFeaturedLogosBody } from "@workspace/api-zod";

const router = Router();

router.get("/logos", async (_req: Request, res: Response) => {
  const logos = await db.query.worksTable.findMany({
    where: eq(worksTable.isFeaturedLogo, true),
    with: { category: true },
    limit: 6,
  });
  res.json(logos);
});

router.put("/logos", requireAuth, requireRole(...EDITOR_ROLES), async (req: Request, res: Response) => {
  const parsed = SetFeaturedLogosBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { workIds } = parsed.data;
  if (workIds.length > 6) {
    res.status(400).json({ error: "Maximum 6 featured logos allowed" });
    return;
  }

  await db.update(worksTable).set({ isFeaturedLogo: false });
  if (workIds.length > 0) {
    await db.update(worksTable).set({ isFeaturedLogo: true }).where(inArray(worksTable.id, workIds));
  }

  res.json({ message: "Featured logos updated" });
});

router.get("/projects", async (_req: Request, res: Response) => {
  const projects = await db.query.worksTable.findMany({
    where: eq(worksTable.isFeatured, true),
    with: { category: true },
    limit: 12,
  });
  res.json(projects);
});

router.get("/comments", async (_req: Request, res: Response) => {
  const comments = await db.query.commentsTable.findMany({
    where: eq(commentsTable.isFeatured, true),
    with: { author: true },
    limit: 12,
  });
  res.json(comments);
});

export default router;
