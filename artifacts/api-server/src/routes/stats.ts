import { Router, Request, Response } from "express";
import { db, worksTable, blogsTable, commentsTable, categoriesTable, visitorsTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const [
    visitorResult,
    worksResult,
    topClientsResult,
    blogsResult,
    categoriesResult,
  ] = await Promise.all([
    db.select({ count: count() }).from(visitorsTable),
    db.select({ count: count() }).from(worksTable),
    db.select({ count: count() }).from(commentsTable).where(eq(commentsTable.isFeatured, true)),
    db.select({ count: count() }).from(blogsTable).where(eq(blogsTable.isPublished, true)),
    db.select({ count: count() }).from(categoriesTable),
  ]);

  res.json({
    visitorCount: visitorResult[0].count,
    worksCount: worksResult[0].count,
    topClientsCount: topClientsResult[0].count,
    partnersCount: 12,
    blogsCount: blogsResult[0].count,
    categoriesCount: categoriesResult[0].count,
  });
});

export default router;
