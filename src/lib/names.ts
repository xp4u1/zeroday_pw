/**
 * Generate a unique container name using the name of a challenge.
 * @param challengeName Name of the challenge
 * @returns Unique container name
 */
export const generateContainerName = (challengeName: string) => {
  const uuid = crypto.randomUUID().replaceAll("-", "");
  const name = challengeName.toLowerCase().replaceAll(" ", "-");

  return `${uuid}-${name}`;
};

/**
 * Get the external domain of a Docker container using its name.
 * @param name Name of the container
 * @returns Domain that includes the container's name
 */
export const getDomain = (containerName: string) => {
  return `${containerName}.challenge.zeroday.pw`;
};
