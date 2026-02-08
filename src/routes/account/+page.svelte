<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageServerData } from "./$types";
  import { Button } from "$lib/components/ui/button/index";
  import * as Card from "$lib/components/ui/card/index";

  let { data }: { data: PageServerData } = $props();
</script>

<Card.Root class="mx-auto max-w-3xl">
  <Card.Header>
    <Card.Title class="font-mono text-3xl font-semibold tracking-tight"
      >Hey {data.user.username}!</Card.Title
    >
  </Card.Header>
  <Card.Content class="flex flex-col gap-5">
    <p>
      Solve challenges to collect flags and earn points. The more you solve, the
      higher you climb on the leaderboard. You have completed <b
        >{data.solves.length}</b
      >
      challenge{data.solves.length > 1 ? "s" : ""} so far{data.solves.length > 0
        ? " — keep going!"
        : "."}
    </p>

    {#if data.solves.length > 0}
      <p>Completed challenges:</p>
      <ul class="list-inside list-disc">
        {#each data.solves as solve (solve.id)}
          <li>{solve.challenge.name}</li>
        {/each}
      </ul>
    {/if}

    <p>Your user ID is <span class="font-mono">{data.user.id}</span>.</p>

    <form method="post" action="?/logout" use:enhance>
      <Button variant="outline" type="submit">Sign out</Button>
    </form>
  </Card.Content>
</Card.Root>
