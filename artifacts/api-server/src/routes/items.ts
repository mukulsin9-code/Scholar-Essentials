import { Router, type IRouter } from "express";
import { and, desc, eq, ilike, or } from "drizzle-orm";
import { db, itemsTable, usersTable } from "@workspace/db";
import {
  CreateItemBody,
  ListItemsQueryParams,
  UpdateItemBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

type ItemRow = typeof itemsTable.$inferSelect;
type UserRow = typeof usersTable.$inferSelect;

function serializeItem(
  item: ItemRow,
  seller?: Pick<UserRow, "firstName" | "lastName" | "email"> | null,
) {
  const sellerName = seller
    ? [seller.firstName, seller.lastName].filter(Boolean).join(" ").trim() ||
      seller.email ||
      null
    : null;
  return {
    id: item.id,
    sellerId: item.sellerId,
    sellerName: sellerName || null,
    sellerEmail: seller?.email ?? null,
    title: item.title,
    description: item.description,
    price: Number(item.price),
    condition: item.condition,
    category: item.category,
    imageUrl: item.imageUrl,
    createdAt: item.createdAt.toISOString(),
  };
}

router.get("/items", async (req, res) => {
  const parsed = ListItemsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { q, condition } = parsed.data;
  const filters = [];
  if (q && q.trim().length > 0) {
    const like = `%${q.trim()}%`;
    filters.push(
      or(
        ilike(itemsTable.title, like),
        ilike(itemsTable.description, like),
      )!,
    );
  }
  if (condition) {
    filters.push(eq(itemsTable.condition, condition));
  }
  const where = filters.length > 0 ? and(...filters) : undefined;
  const rows = await db
    .select({ item: itemsTable, seller: usersTable })
    .from(itemsTable)
    .leftJoin(usersTable, eq(itemsTable.sellerId, usersTable.id))
    .where(where)
    .orderBy(desc(itemsTable.createdAt));
  res.json(rows.map((r) => serializeItem(r.item, r.seller)));
});

router.get("/items/mine", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const rows = await db
    .select({ item: itemsTable, seller: usersTable })
    .from(itemsTable)
    .leftJoin(usersTable, eq(itemsTable.sellerId, usersTable.id))
    .where(eq(itemsTable.sellerId, req.user.id))
    .orderBy(desc(itemsTable.createdAt));
  res.json(rows.map((r) => serializeItem(r.item, r.seller)));
});

router.get("/items/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const rows = await db
    .select({ item: itemsTable, seller: usersTable })
    .from(itemsTable)
    .leftJoin(usersTable, eq(itemsTable.sellerId, usersTable.id))
    .where(eq(itemsTable.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(serializeItem(row.item, row.seller));
});

router.post("/items", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const parsed = CreateItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { title, description, price, condition, category, imageUrl } =
    parsed.data;
  const inserted = await db
    .insert(itemsTable)
    .values({
      sellerId: req.user.id,
      title,
      description: description ?? "",
      price: String(price),
      condition,
      category: category ?? null,
      imageUrl: imageUrl ?? null,
    })
    .returning();
  const item = inserted[0]!;
  const sellerRows = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, req.user.id))
    .limit(1);
  res.status(201).json(serializeItem(item, sellerRows[0]));
});

router.put("/items/:id", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parsed = UpdateItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const existingRows = await db
    .select()
    .from(itemsTable)
    .where(eq(itemsTable.id, id))
    .limit(1);
  const existing = existingRows[0];
  if (!existing) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  if (existing.sellerId !== req.user.id) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  const updates: Record<string, unknown> = {};
  const d = parsed.data;
  if (d.title !== undefined) updates.title = d.title;
  if (d.description !== undefined) updates.description = d.description;
  if (d.price !== undefined) updates.price = String(d.price);
  if (d.condition !== undefined) updates.condition = d.condition;
  if (d.category !== undefined) updates.category = d.category;
  if (d.imageUrl !== undefined) updates.imageUrl = d.imageUrl;
  if (Object.keys(updates).length > 0) {
    await db.update(itemsTable).set(updates).where(eq(itemsTable.id, id));
  }
  const rows = await db
    .select({ item: itemsTable, seller: usersTable })
    .from(itemsTable)
    .leftJoin(usersTable, eq(itemsTable.sellerId, usersTable.id))
    .where(eq(itemsTable.id, id))
    .limit(1);
  res.json(serializeItem(rows[0]!.item, rows[0]!.seller));
});

router.delete("/items/:id", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const existingRows = await db
    .select()
    .from(itemsTable)
    .where(eq(itemsTable.id, id))
    .limit(1);
  const existing = existingRows[0];
  if (!existing) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  if (existing.sellerId !== req.user.id) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  await db.delete(itemsTable).where(eq(itemsTable.id, id));
  res.status(204).end();
});

export default router;
