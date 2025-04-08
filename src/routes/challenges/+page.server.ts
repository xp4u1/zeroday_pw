import { db } from "$lib/server/db";

export async function load() {
  const challenges = await db.query.challenges.findMany({
    with: {
      category: true,
      solves: true,
    },
  });

  return {
    challenges: challenges,
  };
}
