import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text().primaryKey(),
  name: text().unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  points: integer().notNull().default(0),
});

export const usersRelations = relations(users, ({ many }) => ({
  solves: many(solves),
  activeSandboxes: many(activeSandboxes),
}));

export const categories = sqliteTable("categories", {
  id: integer().primaryKey(),
  name: text().unique().notNull(),
});

export const challenges = sqliteTable("challenges", {
  id: integer().primaryKey(),
  name: text().unique().notNull(),
  description: text().notNull(),
  flag: text().notNull(),
  points: integer().notNull().default(500),
  helmValues: text("helm_values").notNull(),
  categoryId: integer("category_id").notNull(),
});

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  category: one(categories, {
    fields: [challenges.categoryId],
    references: [categories.id],
  }),
  solves: many(solves),
}));

export const solves = sqliteTable("solves", {
  id: integer().primaryKey(),
  userId: text("user_id").notNull(),
  challengeId: integer("challenge_id").notNull(),
  timestamp: text().default(sql`(CURRENT_TIMESTAMP)`),
});

export const solvesRelations = relations(solves, ({ one }) => ({
  user: one(users, {
    fields: [solves.userId],
    references: [users.id],
  }),
  challenge: one(challenges, {
    fields: [solves.challengeId],
    references: [challenges.id],
  }),
}));

export const activeSandboxes = sqliteTable("active_sandboxes", {
  id: integer().primaryKey(),
  helmName: text("helm_name").notNull(),
  address: text().notNull(),
  userId: text("user_id").notNull(),
  challengeId: integer("challenge_id").notNull(),
  timestamp: text().default(sql`(CURRENT_TIMESTAMP)`),
});

export const activeSandboxesRelations = relations(
  activeSandboxes,
  ({ one }) => ({
    user: one(users, {
      fields: [activeSandboxes.userId],
      references: [users.id],
    }),
    challenge: one(challenges, {
      fields: [activeSandboxes.challengeId],
      references: [challenges.id],
    }),
  }),
);

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
});

export type User = typeof users.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Challenge = typeof challenges.$inferSelect;
export type Solve = typeof solves.$inferSelect;
export type ActiveSandbox = typeof activeSandboxes.$inferSelect;
export type Session = typeof sessions.$inferSelect;
