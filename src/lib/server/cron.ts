import { eq, lt, sql } from "drizzle-orm";
import schedule from "node-schedule";
import { DateTime } from "luxon";
import { db } from "./db";
import * as schema from "./db/schema";
import { stopSandbox } from "./kubernetes";
import { calculatePoints } from "./points";

/**
 * Remove all existing cronjobs and create a new one
 * to remove unused sandboxes and update points.
 */
export const setupCron = async () => {
  await schedule.gracefulShutdown();
  schedule.scheduleJob("0 */6 * * * *", garbageCollector);
  schedule.scheduleJob("*/2 * * * * *", updateChallengePoints);
};

/**
 * Removes all sandboxes that were created more than
 * three hours ago.
 */
export const garbageCollector = async () => {
  const timestamp = DateTime.now().minus({ hours: 3 }).toJSDate();

  const oldSandboxes = await db
    .delete(schema.activeSandboxes)
    .where(lt(schema.activeSandboxes.timestamp, timestamp))
    .returning();

  if (oldSandboxes.length == 0) return;

  await Promise.all(
    oldSandboxes.map((sandbox) => stopSandbox(sandbox.helmName)),
  );

  console.log(`[Garbage Collector] Removed ${oldSandboxes.length} sandboxes.`);
};

let lastSolvesCount = 0;
let lastUsersCount = 0;

/**
 * Update the points for all challenges and users based on
 * the current number of solves and total number of users.
 *
 * This function checks if the total count of solves and users
 * has changed since the last update. If there is no change,
 * it returns early to avoid unnecessary database queries.
 */
export const updateChallengePoints = async () => {
  const solvesCount = await db.$count(schema.solves);
  const usersCount = await db.$count(schema.users);

  if (solvesCount === lastSolvesCount && usersCount === lastUsersCount) return;
  lastSolvesCount = solvesCount;
  lastUsersCount = usersCount;

  const challenges = await db
    .select({
      id: schema.challenges.id,
      solvesCount: sql<number>`count(${schema.solves.id})::int`,
    })
    .from(schema.challenges)
    .leftJoin(
      schema.solves,
      eq(schema.challenges.id, schema.solves.challengeId),
    )
    .groupBy(schema.challenges.id);

  await Promise.all(
    challenges.map((challenge) =>
      db
        .update(schema.challenges)
        .set({
          points: calculatePoints(usersCount, challenge.solvesCount),
        })
        .where(eq(schema.challenges.id, challenge.id)),
    ),
  );

  const users = await db
    .select({
      id: schema.users.id,
      totalPoints: sql<number>`SUM(${schema.challenges.points})`,
    })
    .from(schema.users)
    .leftJoin(schema.solves, eq(schema.users.id, schema.solves.userId))
    .leftJoin(
      schema.challenges,
      eq(schema.challenges.id, schema.solves.challengeId),
    )
    .groupBy(schema.users.id);

  await Promise.all(
    users.map((user) =>
      db
        .update(schema.users)
        .set({
          points: user.totalPoints || 0,
        })
        .where(eq(schema.users.id, user.id)),
    ),
  );
};
