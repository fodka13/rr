import { Router, Request, Response } from "express";
import { db, usersTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";
import { requireAuth, requireRole, ADMIN_ROLES } from "../middlewares/auth";
import { UpdateUserBody } from "@workspace/api-zod";

const router = Router();

router.get("/", requireAuth, requireRole(...ADMIN_ROLES), async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(String(req.query.page ?? "1")));
  const limit = Math.min(100, parseInt(String(req.query.limit ?? "20")));
  const offset = (page - 1) * limit;
  const role = req.query.role as string | undefined;

  const whereClause = role ? eq(usersTable.role, role as any) : undefined;

  const [users, totalResult] = await Promise.all([
    db.select({
      id: usersTable.id,
      username: usersTable.username,
      email: usersTable.email,
      displayName: usersTable.displayName,
      avatarUrl: usersTable.avatarUrl,
      role: usersTable.role,
      isBanned: usersTable.isBanned,
      createdAt: usersTable.createdAt,
    }).from(usersTable)
      .where(whereClause)
      .limit(limit)
      .offset(offset),
    db.select({ count: count() }).from(usersTable).where(whereClause),
  ]);

  res.json({ users, total: totalResult[0].count, page, limit });
});

router.get("/:id", requireAuth, async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id));
  const [user] = await db.select({
    id: usersTable.id,
    username: usersTable.username,
    email: usersTable.email,
    displayName: usersTable.displayName,
    avatarUrl: usersTable.avatarUrl,
    role: usersTable.role,
    isBanned: usersTable.isBanned,
    createdAt: usersTable.createdAt,
  }).from(usersTable).where(eq(usersTable.id, id)).limit(1);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json(user);
});

router.patch("/:id", requireAuth, requireRole(...ADMIN_ROLES), async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id));
  const currentUser = (req as any).user;
  const parsed = UpdateUserBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  if (parsed.data.role && currentUser.role !== "super_admin") {
    res.status(403).json({ error: "Only super admin can change roles" });
    return;
  }

  const [updated] = await db.update(usersTable)
    .set(parsed.data)
    .where(eq(usersTable.id, id))
    .returning({
      id: usersTable.id,
      username: usersTable.username,
      email: usersTable.email,
      displayName: usersTable.displayName,
      avatarUrl: usersTable.avatarUrl,
      role: usersTable.role,
      isBanned: usersTable.isBanned,
      createdAt: usersTable.createdAt,
    });

  if (!updated) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json(updated);
});

router.post("/:id/ban", requireAuth, requireRole("super_admin", "admin"), async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id));
  await db.update(usersTable).set({ isBanned: true }).where(eq(usersTable.id, id));
  res.json({ message: "User banned" });
});

router.post("/:id/unban", requireAuth, requireRole("super_admin", "admin"), async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id));
  await db.update(usersTable).set({ isBanned: false }).where(eq(usersTable.id, id));
  res.json({ message: "User unbanned" });
});

export default router;
