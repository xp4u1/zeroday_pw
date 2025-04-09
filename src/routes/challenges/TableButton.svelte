<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import { ExternalLink } from "lucide-svelte";

  // Type check with "svelte-headless-table" breaks with $props
  // when using this component in "createRender".
  export let id: number;
</script>

<Button variant="outline" href={`/challenges/${id}`}>
  <ExternalLink class="h-4 w-4" />
</Button>
