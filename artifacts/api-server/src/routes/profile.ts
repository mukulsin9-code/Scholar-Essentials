import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable, userProfilesTable } from "@workspace/db";
import { UpdateProfileBody } from "@workspace/api-zod";

const router: IRouter = Router();

async function ensureProfile(userId: string) {
  const existing = await db
    .select()
    .from(userProfilesTable)
    .where(eq(userProfilesTable.userId, userId))
    .limit(1);
  if (existing.length > 0) return existing[0]!;
  const inserted = await db
    .insert(userProfilesTable)
    .values({ userId, userType: "student" })
    .returning();
  return inserted[0]!;
}

async function profileResponse(userId: string) {
  const profile = await ensureProfile(userId);
  const userRows = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);
  const user = userRows[0];
  return {
    id: userId,
    email: user?.email ?? null,
    firstName: user?.firstName ?? null,
    lastName: user?.lastName ?? null,
    profileImageUrl: user?.profileImageUrl ?? null,
    userType: profile.userType,
    latitude: profile.latitude,
    longitude: profile.longitude,
    city: profile.city,
  };
}

router.get("/profile", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const data = await profileResponse(req.user.id);
  res.json(data);
});

router.put("/profile", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const parsed = UpdateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  await ensureProfile(req.user.id);
  const updates: Record<string, unknown> = {};
  if (parsed.data.userType !== undefined) updates.userType = parsed.data.userType;
  if (parsed.data.latitude !== undefined) updates.latitude = parsed.data.latitude;
  if (parsed.data.longitude !== undefined) updates.longitude = parsed.data.longitude;
  if (parsed.data.city !== undefined) updates.city = parsed.data.city;
  if (Object.keys(updates).length > 0) {
    await db
      .update(userProfilesTable)
      .set(updates)
      .where(eq(userProfilesTable.userId, req.user.id));
  }
  const data = await profileResponse(req.user.id);
  res.json(data);
});

export default router;
