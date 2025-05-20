/**
 * Generate a unique, k8s-compliant sandbox identifier using the name of a challenge.
 * @param challengeName Name of the challenge
 * @returns Unique sandbox name
 */
export const generateSandboxName = (challengeName: string) => {
  const uuid = crypto.randomUUID().replaceAll("-", "");
  const name = challengeName.toLowerCase().replaceAll(" ", "-");

  return `${name}-${uuid}`;
};

/**
 * Get the external domain of a challenge sandbox using its name.
 * @param name Name of the sandbox
 * @returns Domain that includes the sandbox's name
 */
export const getDomain = (sandboxId: string) => {
  return `${sandboxId}.challenge.zeroday.pw`;
};
