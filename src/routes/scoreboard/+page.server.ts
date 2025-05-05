import { db } from "$lib/server/db";
import { users } from "$lib/server/db/schema";
import { desc } from "drizzle-orm";

export async function load() {
  const participants = await db
    .select({
      name: users.name,
      points: users.points,
    })
    .from(users)
    .orderBy(desc(users.points));

  return {
    participants: participants
      .entries()
      .map(([index, participant]) => ({
        placement: index + 1,
        ...participant,
      }))
      .toArray(),
  };
}
