import { generateContainerName, getDomain } from "$lib/names.js";
import { db } from "$lib/server/db/index.js";
import { activeContainers } from "$lib/server/db/schema.js";
import { createContainer, stopContainer } from "$lib/server/docker.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export const POST = async ({ request }) => {
  // todo: authentication
  const { action, challengeId } = await request.json();

  // todo: filter containers by user, not just by challenge!
  const container = await db.query.activeContainers.findFirst({
    where: (activeContainers, { eq }) =>
      eq(activeContainers.challengeId, challengeId),
  });

  switch (action) {
    case "request":
      return container
        ? json({
            address: container.address,
          })
        : await createSession(challengeId);

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

const createSession = async (challengeId: string) => {
  const challenge = await db.query.challenges.findFirst({
    where: (challenges, { eq }) => eq(challenges.id, Number(challengeId)),
  });
  if (!challenge) json({ message: "Challenge not found" }, { status: 404 });

  const containerName = generateContainerName(challenge!.name);
  const containerId = await createContainer(
    containerName,
    challenge!.dockerImage,
  );
  const address = "https://" + getDomain(containerName);

  await db.insert(activeContainers).values({
    dockerId: containerId,
    address: address,
    userId: 1, // todo: real user id
    challengeId: challenge!.id,
  });

  return json({ address });
};
