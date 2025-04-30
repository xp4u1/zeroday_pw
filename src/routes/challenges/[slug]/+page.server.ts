import { error, fail, redirect, type Actions } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { solves } from "$lib/server/db/schema.js";

export async function load({ params, locals }) {
  const challenge = await db.query.challenges.findFirst({
    where: (challenges, { eq }) => eq(challenges.id, Number(params.slug)),
    columns: {
      id: true,
      name: true,
      description: true,
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
  if (!challenge) error(404, "Challenge not found");

  return {
    challenge: challenge!,
    loggedIn: locals.user !== null,
  };
}

export const actions: Actions = {
  solve: async (event) => {
    if (!event.locals.session) {
      return fail(401);
    }

    const challenge = await db.query.challenges.findFirst({
      where: (challenges, { eq }) =>
        eq(challenges.id, Number(event.params.slug)),
      columns: {
        id: true,
        flag: true,
      },
    });
    if (!challenge) fail(404, { message: "Challenge not found" });

    const formData = await event.request.formData();
    const flag = formData.get("flag");

    if (typeof flag !== "string") {
      return fail(400, {
        message: "Invalid flag format.",
      });
    }

    if (flag !== challenge!.flag) {
      return fail(200, {
        message: "Hmm, that doesn't look like the correct flag.",
      });
    }

    const challengeId = challenge!.id;
    const userId = event.locals.user!.id;
    const solve = await db.query.solves.findFirst({
      where: (solves, { and, eq }) =>
        and(eq(solves.userId, userId), eq(solves.challengeId, challengeId)),
    });

    if (solve) {
      return fail(200, { message: "No need to flex twice — this one's done!" });
    }

    try {
      await db.insert(solves).values({
        challengeId,
        userId,
      });
    } catch (error) {
      console.error("Cannot save solve to the database:");
      console.error(error);

      return fail(500, {
        message: "Internal server error.",
      });
    }

    return redirect(302, "/challenges");
  },
};
