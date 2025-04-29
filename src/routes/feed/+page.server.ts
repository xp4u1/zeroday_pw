import { db } from "$lib/server/db";

export async function load() {
  const solves = await db.query.solves.findMany({
    with: {
      user: true,
      challenge: true,
    },
  });

  return {
    solves: solves,
  };
}
