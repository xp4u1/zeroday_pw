import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer().primaryKey(),
  name: text().unique(),
  // todo: authentication
});
export const usersRelations = relations(users, ({ many }) => ({
  solves: many(solves),
}));

export const categories = sqliteTable("categories", {
  id: integer().primaryKey(),
  name: text().unique(),
});

export const challenges = sqliteTable("challenges", {
  id: integer().primaryKey(),
  name: text().unique(),
  flag: text(),
  difficulty: text(),
  categoryId: integer("category_id"),
});
export const challengesRelations = relations(challenges, ({ one }) => ({
  category: one(categories, {
    fields: [challenges.categoryId],
    references: [categories.id],
  }),
}));

export const solves = sqliteTable("solves", {
  id: integer().primaryKey(),
  userId: integer("user_id"),
  challengeId: integer("challenge_id"),
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
