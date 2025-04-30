import { db } from "$lib/server/db";

export async function load() {
  const solves = await db.query.solves.findMany({
    with: {
      user: {
        columns: {
          name: true,
        },
      },
      challenge: {
        columns: {
          name: true,
        },
      },
    },
  });

  return {
    solves: solves,
  };
}
