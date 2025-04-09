import { db } from "$lib/server/db";
import { error } from "@sveltejs/kit";

export async function load({ params }) {
  const challenge = await db.query.challenges.findFirst({
    where: (challenges, { eq }) => eq(challenges.id, Number(params.slug)),
    with: {
      category: true,
      solves: true,
    },
  });

  if (!challenge) error(404, "Challenge not found");

  return {
    challenge: challenge!,
  };
}
