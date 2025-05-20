import { generateSandboxName, getDomain } from "$lib/names.js";
import { db } from "$lib/server/db/index.js";
import { activeSandboxes } from "$lib/server/db/schema.js";
import { createSandbox, stopSandbox } from "$lib/server/kubernetes.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export const POST = async ({ request, locals }) => {
  if (locals.user === null)
    return json({ message: "User not logged in" }, { status: 403 });

  const { action, challengeId } = await request.json();

  const sandbox = await db.query.activeSandboxes.findFirst({
    where: (activeSandboxes, { and, eq }) =>
      and(
        eq(activeSandboxes.challengeId, challengeId),
        eq(activeSandboxes.userId, locals.user!.id),
      ),
  });

  switch (action) {
    case "request":
      return sandbox
        ? json({
            address: sandbox.address,
          })
        : await createSession(challengeId, locals.user.id);

    case "terminate":
      console.debug(`terminate for challenge: ${challengeId}`);

      if (!sandbox)
        return json({ message: "No active session found" }, { status: 404 });

      await stopSandbox(sandbox.helmName);
      await db
        .delete(activeSandboxes)
        .where(eq(activeSandboxes.id, sandbox.id));
      return json({ message: "Stopped sandbox" });

    default:
      return json({ message: "Unknown method" }, { status: 400 });
  }
};

const createSession = async (challengeId: string, userId: string) => {
  const challenge = await db.query.challenges.findFirst({
    where: (challenges, { eq }) => eq(challenges.id, Number(challengeId)),
  });
  if (!challenge)
    return json({ message: "Challenge not found" }, { status: 404 });

  const sandboxName = generateSandboxName(challenge.name);
  await createSandbox(
    sandboxName,
    challenge.helmValues.replaceAll("\\n", "\n"),
  );
  const address = "https://" + getDomain(sandboxName);

  await db.insert(activeSandboxes).values({
    helmName: sandboxName,
    address: address,
    userId: userId,
    challengeId: challenge.id,
  });

  return json({ address });
};
