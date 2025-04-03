import Docker from "dockerode";
import randomName from "@scaleway/random-name";
import { v4 as uuidv4 } from "uuid";

let docker = new Docker();

const name = randomName(uuidv4());
const subdomain = `${name}.challenge.zeroday.pw`;

docker
  .createContainer({
    name: name,
    Image: "traefik/whoami",
    Labels: {
      ["traefik.enable"]: "true",
      [`traefik.http.routers.${name}.rule`]: `Host(\`${subdomain}\`)`,
      [`traefik.http.routers.${name}.entrypoints`]: "websecure",
      [`traefik.http.routers.${name}.tls.certresolver`]: "letsencrypt",
      [`traefik.http.services.${name}.loadbalancer.server.port`]: "80",
    },
    ExposedPorts: {
      "80/tcp": {},
    },
    NetworkingConfig: {},
  })
  .then(async (container) => {
    console.log(`Starting ${name}...`);
    await container.start();

    console.log(`See https://${subdomain}`);

    setTimeout(async () => {
      console.log(`Removing ${name}...`);
      await container.stop();
      await container.remove();
    }, 2 * 60 * 1000);
  })
  .catch((err) => console.error(err));
