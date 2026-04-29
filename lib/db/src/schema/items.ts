import {
  pgTable,
  serial,
  varchar,
  text,
  numeric,
  pgEnum,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { usersTable } from "./auth";

export const itemConditionEnum = pgEnum("item_condition", [
  "new",
  "like_new",
  "good",
  "fair",
  "used",
]);

export const itemsTable = pgTable(
  "items",
  {
    id: serial("id").primaryKey(),
    sellerId: varchar("seller_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description").notNull().default(""),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    condition: itemConditionEnum("condition").notNull(),
    category: varchar("category"),
    imageUrl: varchar("image_url", { length: 1000 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("IDX_items_seller").on(table.sellerId)],
);

export type Item = typeof itemsTable.$inferSelect;
export type InsertItem = typeof itemsTable.$inferInsert;
