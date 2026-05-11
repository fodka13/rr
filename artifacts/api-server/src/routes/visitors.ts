import { Router, Request, Response } from "express";
import { db, visitorsTable } from "@workspace/db";

const router = Router();

router.post("/track", async (req: Request, res: Response) => {
  try {
    const ipAddress = String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown").split(",")[0].trim();
    const userAgent = req.headers["user-agent"] ?? null;
    const path = req.body?.path ?? "/";

    await db.insert(visitorsTable).values({
      ipAddress,
      userAgent,
      path,
    });
  } catch {
    // Silently fail tracking errors
  }

  res.json({ message: "Tracked" });
});

export default router;
