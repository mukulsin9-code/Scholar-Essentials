import { Router, type IRouter } from "express";
import { and, desc, eq, ilike, lte, or } from "drizzle-orm";
import { db, accommodationsTable, usersTable } from "@workspace/db";
import {
  CreateAccommodationBody,
  ListAccommodationsQueryParams,
  UpdateAccommodationBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

type AccommodationRow = typeof accommodationsTable.$inferSelect;
type UserRow = typeof usersTable.$inferSelect;

function serialize(
  acc: AccommodationRow,
  owner?: Pick<UserRow, "firstName" | "lastName" | "email"> | null,
) {
  const ownerName = owner
    ? [owner.firstName, owner.lastName].filter(Boolean).join(" ").trim() ||
      owner.email ||
      null
    : null;
  return {
    id: acc.id,
    ownerId: acc.ownerId,
    ownerName: ownerName || null,
    ownerEmail: owner?.email ?? null,
    name: acc.name,
    address: acc.address,
    description: acc.description,
    monthlyRent: Number(acc.monthlyRent),
    latitude: acc.latitude,
    longitude: acc.longitude,
    genderPreference: acc.genderPreference,
    amenities: acc.amenities ?? [],
    imageUrl: acc.imageUrl,
    createdAt: acc.createdAt.toISOString(),
  };
}

router.get("/accommodations", async (req, res) => {
  const parsed = ListAccommodationsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { q, maxRent } = parsed.data;
  const filters = [];
  if (q && q.trim().length > 0) {
    const like = `%${q.trim()}%`;
    filters.push(
      or(
        ilike(accommodationsTable.name, like),
        ilike(accommodationsTable.address, like),
      )!,
    );
  }
  if (maxRent !== undefined && maxRent !== null) {
    filters.push(lte(accommodationsTable.monthlyRent, String(maxRent)));
  }
  const where = filters.length > 0 ? and(...filters) : undefined;
  const rows = await db
    .select({ acc: accommodationsTable, owner: usersTable })
    .from(accommodationsTable)
    .leftJoin(usersTable, eq(accommodationsTable.ownerId, usersTable.id))
    .where(where)
    .orderBy(desc(accommodationsTable.createdAt));
  res.json(rows.map((r) => serialize(r.acc, r.owner)));
});

router.get("/accommodations/mine", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const rows = await db
    .select({ acc: accommodationsTable, owner: usersTable })
    .from(accommodationsTable)
    .leftJoin(usersTable, eq(accommodationsTable.ownerId, usersTable.id))
    .where(eq(accommodationsTable.ownerId, req.user.id))
    .orderBy(desc(accommodationsTable.createdAt));
  res.json(rows.map((r) => serialize(r.acc, r.owner)));
});

router.get("/accommodations/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const rows = await db
    .select({ acc: accommodationsTable, owner: usersTable })
    .from(accommodationsTable)
    .leftJoin(usersTable, eq(accommodationsTable.ownerId, usersTable.id))
    .where(eq(accommodationsTable.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(serialize(row.acc, row.owner));
});

router.post("/accommodations", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const parsed = CreateAccommodationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const d = parsed.data;
  const inserted = await db
    .insert(accommodationsTable)
    .values({
      ownerId: req.user.id,
      name: d.name,
      address: d.address,
      description: d.description ?? null,
      monthlyRent: String(d.monthlyRent),
      latitude: d.latitude,
      longitude: d.longitude,
      genderPreference: d.genderPreference ?? null,
      amenities: d.amenities ?? [],
      imageUrl: d.imageUrl ?? null,
    })
    .returning();
  const acc = inserted[0]!;
  const ownerRows = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, req.user.id))
    .limit(1);
  res.status(201).json(serialize(acc, ownerRows[0]));
});

router.put("/accommodations/:id", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parsed = UpdateAccommodationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const existingRows = await db
    .select()
    .from(accommodationsTable)
    .where(eq(accommodationsTable.id, id))
    .limit(1);
  const existing = existingRows[0];
  if (!existing) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  if (existing.ownerId !== req.user.id) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  const updates: Record<string, unknown> = {};
  const d = parsed.data;
  if (d.name !== undefined) updates.name = d.name;
  if (d.address !== undefined) updates.address = d.address;
  if (d.description !== undefined) updates.description = d.description;
  if (d.monthlyRent !== undefined) updates.monthlyRent = String(d.monthlyRent);
  if (d.latitude !== undefined) updates.latitude = d.latitude;
  if (d.longitude !== undefined) updates.longitude = d.longitude;
  if (d.genderPreference !== undefined)
    updates.genderPreference = d.genderPreference;
  if (d.amenities !== undefined) updates.amenities = d.amenities;
  if (d.imageUrl !== undefined) updates.imageUrl = d.imageUrl;
  if (Object.keys(updates).length > 0) {
    await db
      .update(accommodationsTable)
      .set(updates)
      .where(eq(accommodationsTable.id, id));
  }
  const rows = await db
    .select({ acc: accommodationsTable, owner: usersTable })
    .from(accommodationsTable)
    .leftJoin(usersTable, eq(accommodationsTable.ownerId, usersTable.id))
    .where(eq(accommodationsTable.id, id))
    .limit(1);
  res.json(serialize(rows[0]!.acc, rows[0]!.owner));
});

router.delete("/accommodations/:id", async (req, res) => {
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
    .from(accommodationsTable)
    .where(eq(accommodationsTable.id, id))
    .limit(1);
  const existing = existingRows[0];
  if (!existing) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  if (existing.ownerId !== req.user.id) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  await db.delete(accommodationsTable).where(eq(accommodationsTable.id, id));
  res.status(204).end();
});

export default router;
