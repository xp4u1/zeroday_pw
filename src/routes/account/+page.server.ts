import * as auth from "$lib/server/auth";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { stopSandbox } from "$lib/server/kubernetes";
import { activeSandboxes } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) {
    return redirect(302, "/account/login");
  }

  const solves = await db.query.solves.findMany({
    where: (solves, { eq }) => eq(solves.userId, event.locals.user!.id),
    with: {
      challenge: {
        columns: {
          name: true,
        },
      },
    },
  });

  return { user: event.locals.user, solves };
};

export const actions: Actions = {
  logout: async (event) => {
    if (!event.locals.session) {
      return fail(401);
    }

    const sandboxes = await db
      .delete(activeSandboxes)
      .where(eq(activeSandboxes.userId, event.locals.user!.id))
      .returning();
    await Promise.all(
      sandboxes.map((sandbox) => stopSandbox(sandbox.helmName)),
    );

    await auth.invalidateSession(event.locals.session.id);
    auth.deleteSessionTokenCookie(event);

    return redirect(302, "/account/login");
  },
};
