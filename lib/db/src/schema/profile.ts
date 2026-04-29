import { pgTable, varchar, doublePrecision, pgEnum } from "drizzle-orm/pg-core";
import { usersTable } from "./auth";

export const userTypeEnum = pgEnum("user_type", ["student", "owner"]);

export const userProfilesTable = pgTable("user_profiles", {
  userId: varchar("user_id")
    .primaryKey()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  userType: userTypeEnum("user_type").notNull().default("student"),
  city: varchar("city"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
});

export type UserProfile = typeof userProfilesTable.$inferSelect;
export type InsertUserProfile = typeof userProfilesTable.$inferInsert;
