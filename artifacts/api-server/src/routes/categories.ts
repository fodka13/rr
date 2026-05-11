import { Router, Request, Response } from "express";
import { db, categoriesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { requireAuth, requireRole, EDITOR_ROLES } from "../middlewares/auth";
import { CreateCategoryBody, UpdateCategoryBody, ReorderCategoriesBody } from "@workspace/api-zod";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const type = req.query.type as string | undefined;

  const whereClause = type && type !== "all" ? eq(categoriesTable.type, type as any) : undefined;

  const categories = await db.select().from(categoriesTable)
    .where(whereClause)
    .orderBy(asc(categoriesTable.sortOrder), asc(categoriesTable.id));

  res.json(categories);
});

router.post("/", requireAuth, requireRole(...EDITOR_ROLES), async (req: Request, res: Response) => {
  const parsed = CreateCategoryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const [category] = await db.insert(categoriesTable).values(parsed.data).returning();
  res.status(201).json(category);
});

router.patch("/reorder", requireAuth, requireRole(...EDITOR_ROLES), async (req: Request, res: Response) => {
  const parsed = ReorderCategoriesBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  await Promise.all(
    parsed.data.ids.map((id, index) =>
      db.update(categoriesTable).set({ sortOrder: index }).where(eq(categoriesTable.id, id))
    )
  );

  res.json({ message: "Reordered successfully" });
});

router.get("/:id", async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id));
  const [category] = await db.select().from(categoriesTable).where(eq(categoriesTable.id, id)).limit(1);

  if (!category) {
    res.status(404).json({ error: "Category not found" });
    return;
  }

  res.json(category);
});

router.patch("/:id", requireAuth, requireRole(...EDITOR_ROLES), async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id));
  const parsed = UpdateCategoryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const [updated] = await db.update(categoriesTable)
    .set(parsed.data)
    .where(eq(categoriesTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Category not found" });
    return;
  }

  res.json(updated);
});

router.delete("/:id", requireAuth, requireRole(...EDITOR_ROLES), async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id));
  await db.delete(categoriesTable).where(eq(categoriesTable.id, id));
  res.json({ message: "Category deleted" });
});

export default router;
