import { db } from "$lib/server/db";
import { error } from "@sveltejs/kit";

export async function load({ params, locals }) {
  const challenge = await db.query.challenges.findFirst({
    where: (challenges, { eq }) => eq(challenges.id, Number(params.slug)),
    columns: {
      id: true,
      name: true,
      description: true,
    },
    with: {
      category: true,
      solves: true,
    },
  });

  if (!challenge) error(404, "Challenge not found");

  return {
    challenge: challenge!,
    loggedIn: locals.user !== null
  };
}
