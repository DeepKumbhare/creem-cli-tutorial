import {
  boolean,
  integer,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const orderTable = pgTable("order", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  customerId: varchar({ length: 255 }).notNull(),
  productId: varchar({ length: 255 }).notNull(),
  amount: integer().notNull(),
  status: varchar({ length: 50 }).notNull(),
});

export const subscriptionTable = pgTable("subscription", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  customerId: varchar({ length: 255 }).notNull(),
  productId: varchar({ length: 255 }).notNull(),
  creemSubscriptionId: varchar({ length: 255 }).unique(),
  status: varchar({ length: 50 }).notNull(), // active, cancelled, paused, expired
  currentPeriodStart: timestamp().notNull(),
  currentPeriodEnd: timestamp().notNull(),
  autoRenew: boolean().default(true).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
  cancelledAt: timestamp(),
});
