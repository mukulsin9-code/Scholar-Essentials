import {
  pgTable,
  serial,
  varchar,
  text,
  numeric,
  doublePrecision,
  timestamp,
  index,
  jsonb,
} from "drizzle-orm/pg-core";
import { usersTable } from "./auth";

export const accommodationsTable = pgTable(
  "accommodations",
  {
    id: serial("id").primaryKey(),
    ownerId: varchar("owner_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 200 }).notNull(),
    address: text("address").notNull(),
    description: text("description"),
    monthlyRent: numeric("monthly_rent", { precision: 10, scale: 2 }).notNull(),
    latitude: doublePrecision("latitude").notNull(),
    longitude: doublePrecision("longitude").notNull(),
    genderPreference: varchar("gender_preference"),
    amenities: jsonb("amenities").$type<string[]>().notNull().default([]),
    imageUrl: varchar("image_url", { length: 1000 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("IDX_accommodations_owner").on(table.ownerId)],
);

export type Accommodation = typeof accommodationsTable.$inferSelect;
export type InsertAccommodation = typeof accommodationsTable.$inferInsert;
