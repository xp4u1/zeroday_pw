import { createContainer } from "$lib/server/docker";
import { generateContainerName } from "$lib/names";
import type { Actions } from "./$types";

export const actions = {
  default: async ({ request }: { request: any }) => {
    const data = await request.formData();

    const name = generateContainerName(data.get("name"));
    const image = data.get("image");

    console.debug(
      `Attempt to create container (name=${name}, image=${image})...`,
    );
    const id = await createContainer(name, image);

    console.debug(`Successfully started container (name=${name}, id=${id})`);
    return { id: id, name: name };
  },
} satisfies Actions;
