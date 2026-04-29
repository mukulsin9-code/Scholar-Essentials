import { Router, type IRouter } from "express";
import { sql, desc } from "drizzle-orm";
import {
  db,
  accommodationsTable,
  itemsTable,
  usersTable,
} from "@workspace/db";

const router: IRouter = Router();

router.get("/dashboard/summary", async (_req, res) => {
  const [itemsAgg] = await db
    .select({
      count: sql<number>`count(*)::int`,
      avg: sql<string | null>`avg(${itemsTable.price})`,
    })
    .from(itemsTable);
  const [accAgg] = await db
    .select({
      count: sql<number>`count(*)::int`,
      avg: sql<string | null>`avg(${accommodationsTable.monthlyRent})`,
    })
    .from(accommodationsTable);
  const [userAgg] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(usersTable);

  res.json({
    totalItems: itemsAgg?.count ?? 0,
    totalAccommodations: accAgg?.count ?? 0,
    totalUsers: userAgg?.count ?? 0,
    averageItemPrice: itemsAgg?.avg ? Number(itemsAgg.avg) : 0,
    averageMonthlyRent: accAgg?.avg ? Number(accAgg.avg) : 0,
  });
});

router.get("/dashboard/recent-activity", async (_req, res) => {
  const recentItems = await db
    .select()
    .from(itemsTable)
    .orderBy(desc(itemsTable.createdAt))
    .limit(8);
  const recentAcc = await db
    .select()
    .from(accommodationsTable)
    .orderBy(desc(accommodationsTable.createdAt))
    .limit(8);
  const merged = [
    ...recentItems.map((i) => ({
      id: `item-${i.id}`,
      kind: "item" as const,
      title: i.title,
      subtitle: `${i.condition.replace("_", " ")} · ₹${Number(i.price).toFixed(0)}`,
      imageUrl: i.imageUrl,
      createdAt: i.createdAt.toISOString(),
    })),
    ...recentAcc.map((a) => ({
      id: `accommodation-${a.id}`,
      kind: "accommodation" as const,
      title: a.name,
      subtitle: `${a.address} · ₹${Number(a.monthlyRent).toFixed(0)}/mo`,
      imageUrl: a.imageUrl,
      createdAt: a.createdAt.toISOString(),
    })),
  ];
  merged.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  res.json(merged.slice(0, 12));
});

router.get("/dashboard/condition-breakdown", async (_req, res) => {
  const rows = await db
    .select({
      condition: itemsTable.condition,
      count: sql<number>`count(*)::int`,
    })
    .from(itemsTable)
    .groupBy(itemsTable.condition);
  res.json(rows.map((r) => ({ condition: r.condition, count: r.count })));
});

router.get("/dashboard/rent-stats", async (_req, res) => {
  const [agg] = await db
    .select({
      min: sql<string | null>`min(${accommodationsTable.monthlyRent})`,
      max: sql<string | null>`max(${accommodationsTable.monthlyRent})`,
      avg: sql<string | null>`avg(${accommodationsTable.monthlyRent})`,
      count: sql<number>`count(*)::int`,
    })
    .from(accommodationsTable);
  res.json({
    min: agg?.min ? Number(agg.min) : 0,
    max: agg?.max ? Number(agg.max) : 0,
    avg: agg?.avg ? Number(agg.avg) : 0,
    count: agg?.count ?? 0,
  });
});

export default router;
