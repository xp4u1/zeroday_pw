import { getDomain } from "$lib/names";
import Docker from "dockerode";

let docker = new Docker();

/**
 * Start a Docker container and create a route using Traefik.
 * The name must only contain:
 * - Letters (a-z, A-Z)
 * - Numbers (0-9)
 * - Hyphens (-)
 * @param containerName Name of the new container. Will be a part of the subdomain.
 * @param image Name of the Docker image to run.
 * @returns ID of the new container
 */
export const createContainer = async (containerName: string, image: string) => {
  if (!/^[a-zA-Z0-9-]+$/.test(containerName))
    throw new Error(`Invalid container name: ${containerName}`);

  const subdomain = getDomain(containerName);
  const container = await docker.createContainer({
    name: containerName,
    Image: image,
    Labels: {
      ["traefik.enable"]: "true",
      [`traefik.http.routers.${containerName}.rule`]: `Host(\`${subdomain}\`)`,
      [`traefik.http.routers.${containerName}.entrypoints`]: "websecure",
      [`traefik.http.routers.${containerName}.tls.certresolver`]: "letsencrypt",
      [`traefik.http.services.${containerName}.loadbalancer.server.port`]: "80",
    },
    ExposedPorts: {
      "80/tcp": {},
    },
    NetworkingConfig: {},
  });

  await container.start();
  return container.id;
};

/**
 * Stop and remove a Docker container.
 * @param containerId ID of the Docker container
 */
export const stopContainer = async (containerId: string) => {
  const container = docker.getContainer(containerId);
  await container.stop();
  await container.remove();
};
