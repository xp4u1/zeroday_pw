import { db } from "$lib/server/db";
import { users } from "$lib/server/db/schema";
import { desc } from "drizzle-orm";
import { error } from "@sveltejs/kit";

export async function load({ locals }) {
  const participants = await db
    .select({
      name: users.name,
      points: users.points,
    })
    .from(users)
    .orderBy(desc(users.points));

  if (!participants || participants.length === 0) {
    throw error(404, "Players not found");
  }

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
