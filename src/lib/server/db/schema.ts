import { relations } from "drizzle-orm";
import { pgTable, text, integer, serial, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text().primaryKey(),
  name: text().unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  points: integer().notNull().default(0),
});

export const usersRelations = relations(users, ({ many }) => ({
  solves: many(solves),
  activeSandboxes: many(activeSandboxes),
}));

export const categories = pgTable("categories", {
  id: serial().primaryKey(),
  name: text().unique().notNull(),
});

export const challenges = pgTable("challenges", {
  id: serial().primaryKey(),
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

export const solves = pgTable("solves", {
  id: serial().primaryKey(),
  userId: text("user_id").notNull(),
  challengeId: integer("challenge_id").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
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

export const activeSandboxes = pgTable("active_sandboxes", {
  id: serial().primaryKey(),
  helmName: text("helm_name").notNull(),
  address: text().notNull(),
  userId: text("user_id").notNull(),
  challengeId: integer("challenge_id").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
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

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export type User = typeof users.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Challenge = typeof challenges.$inferSelect;
export type Solve = typeof solves.$inferSelect;
export type ActiveSandbox = typeof activeSandboxes.$inferSelect;
export type Session = typeof sessions.$inferSelect;
