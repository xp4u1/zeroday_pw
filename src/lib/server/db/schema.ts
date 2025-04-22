import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text().primaryKey(),
  name: text().unique().notNull(),
  passwordHash: text("password_hash").notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  solves: many(solves),
  activeContainers: many(activeContainers),
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
  dockerImage: text("docker_image").notNull(),
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

export const activeContainers = sqliteTable("active_containers", {
  id: integer().primaryKey(),
  dockerId: text("docker_id").notNull(),
  address: text().notNull(),
  userId: text("user_id").notNull(),
  challengeId: integer("challenge_id").notNull(),
  timestamp: text().default(sql`(CURRENT_TIMESTAMP)`),
});

export const activeContainersRelations = relations(
  activeContainers,
  ({ one }) => ({
    user: one(users, {
      fields: [activeContainers.userId],
      references: [users.id],
    }),
    challenge: one(challenges, {
      fields: [activeContainers.challengeId],
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
export type ActiveContainer = typeof categories.$inferSelect;
export type Session = typeof sessions.$inferSelect;
