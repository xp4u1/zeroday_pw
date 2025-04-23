import { generateContainerName, getDomain } from "$lib/names.js";
import { db } from "$lib/server/db/index.js";
import { activeContainers } from "$lib/server/db/schema.js";
import { createContainer, stopContainer } from "$lib/server/docker.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export const POST = async ({ request, locals }) => {
  if (locals.user === null)
    return json({ message: "User not logged in" }, { status: 403 });

  const { action, challengeId } = await request.json();

  const container = await db.query.activeContainers.findFirst({
    where: (activeContainers, { and, eq }) =>
      and(
        eq(activeContainers.challengeId, challengeId),
        eq(activeContainers.userId, locals.user!.id),
      ),
  });

  switch (action) {
    case "request":
      return container
        ? json({
            address: container.address,
          })
        : await createSession(challengeId, locals.user.id);

    case "terminate":
      console.debug(`terminate for challenge: ${challengeId}`);

      if (!container)
        return json({ message: "No active session found" }, { status: 404 });

      await stopContainer(container.dockerId);
      await db
        .delete(activeContainers)
        .where(eq(activeContainers.id, container.id));
      return json({ message: "Stopped container" });

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

  const containerName = generateContainerName(challenge!.name);
  const containerId = await createContainer(
    containerName,
    challenge!.dockerImage,
  );
  const address = "https://" + getDomain(containerName);

  await db.insert(activeContainers).values({
    dockerId: containerId,
    address: address,
    userId: userId,
    challengeId: challenge!.id,
  });

  return json({ address });
};
