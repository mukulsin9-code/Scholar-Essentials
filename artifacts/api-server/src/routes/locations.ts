import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db, accommodationsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/locations", async (_req, res) => {
  const rows = await db
    .select()
    .from(accommodationsTable)
    .orderBy(desc(accommodationsTable.createdAt));
  res.json(
    rows.map((r) => ({
      id: r.id,
      name: r.name,
      address: r.address,
      latitude: r.latitude,
      longitude: r.longitude,
      monthlyRent: Number(r.monthlyRent),
      imageUrl: r.imageUrl,
    })),
  );
});

export default router;
