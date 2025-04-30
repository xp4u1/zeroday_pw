import { db } from "$lib/server/db";

export async function load() {
  const challenges = await db.query.challenges.findMany({
    columns: {
      id: true,
      name: true,
    },
    with: {
      category: {
        columns: {
          name: true,
        },
      },
      solves: {
        columns: {
          timestamp: true,
        },
      },
    },
  });

  return {
    challenges: challenges,
  };
}
