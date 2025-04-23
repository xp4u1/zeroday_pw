import { lt } from "drizzle-orm";
import schedule from "node-schedule";
import { db } from "./db";
import { activeContainers } from "./db/schema";
import { stopContainer } from "./docker";

/**
 * Remove all existing cronjobs and create a new one
 * to remove unused Docker containers.
 */
export const setupCron = async () => {
  await schedule.gracefulShutdown();
  schedule.scheduleJob("0 */6 * * * *", garbageCollector);
};

/**
 * Removes all Docker containers that were created more than
 * three hours ago.
 */
export const garbageCollector = async () => {
  const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
  const timestamp = sqliteTimestamp(threeHoursAgo);

  const oldContainers = await db
    .delete(activeContainers)
    .where(lt(activeContainers.timestamp, timestamp))
    .returning();

  if (oldContainers.length == 0) return;

  await Promise.all(
    oldContainers.map((container) => stopContainer(container.dockerId)),
  );

  console.log(
    `[Garbage Collector] Removed ${oldContainers.length} containers.`,
  );
};

/**
 * Convert a JS date to the sqlite format:
 * `YYYY-MM-DD HH:MM:SS`
 * @param date Date you want to convert
 * @returns ISO-like string in UTC time
 */
export const sqliteTimestamp = (date: Date): string => {
  return date.toISOString().replace("T", " ").slice(0, 19);
};
