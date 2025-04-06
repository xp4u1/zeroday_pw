<script lang="ts">
  import { getDomain } from "$lib/names";
  import type { PageProps } from "./$types";

  let { form }: PageProps = $props();
</script>

<form method="POST">
  <label>Challenge name: <input name="name" type="text" /></label>
  <label>Image: <input name="image" type="text" /></label>
  <input type="submit" value="Submit" />
</form>

{#if form?.id}
  <p>Successfully started the container!</p>
  <p>Container ID: {form?.id}</p>
  <p>
    See <a href={`https://${getDomain(form?.name)}`} target="_blank"
      >{getDomain(form?.name)}</a
    >
  </p>
{/if}
