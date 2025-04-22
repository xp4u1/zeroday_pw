<script lang="ts">
  import { enhance } from "$app/forms";
  import Badge from "$lib/components/ui/badge/badge.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";

  let { data, form } = $props();

  let loading = $state(false);
  let containerAddress = $state(null);

  const apiRequest = async (action: string) => {
    const response = await fetch("/api/session", {
      method: "POST",
      credentials: "same-origin",
      body: JSON.stringify({
        action: action,
        challengeId: data.challenge.id,
      }),
    });

    if (response.status != 200) {
      console.error(await response.json());
      throw "Request failed";
    }

    return response.json();
  };

  const requestSession = async () => {
    loading = true;
    containerAddress = (await apiRequest("request")).address;
    loading = false;
  };

  const terminateSession = async () => {
    loading = true;
    await apiRequest("terminate");
    containerAddress = null;
    loading = false;
  };
</script>

<div class="flex w-full justify-center">
  <div class="flex w-full max-w-4xl flex-col gap-5">
    <section class="flex flex-col gap-5 rounded border p-5">
      <h2
        class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
      >
        {data.challenge.name}
      </h2>

      <p>
        {data.challenge.description}
      </p>

      <p>
        <Badge>{data.challenge.category.name}</Badge>
        <Badge variant="secondary">{data.challenge.solves.length} Solves</Badge>
      </p>
    </section>

    {#if !data.loggedIn}
      <section class="rounded border p-5">
        <Button variant="ghost" class="w-full cursor-not-allowed"
          >Log in to request session</Button
        >
      </section>
    {:else if containerAddress}
      <section class="flex flex-col gap-5 rounded border p-5">
        <p>You have an active session. Connect here:</p>
        <p>
          <a
            class="text-primary font-medium underline underline-offset-4"
            href={containerAddress}
            target="_blank"
            >{containerAddress}
          </a>
        </p>

        <Button
          class="mt-5 w-full cursor-pointer text-white"
          variant="destructive"
          on:click={() => terminateSession()}>Terminate session</Button
        >
      </section>
    {:else}
      <section class="rounded border p-5">
        <p class="mb-5">You have no active sessions.</p>

        <Button
          disabled={loading}
          class="w-full cursor-pointer"
          on:click={() => requestSession()}>Request session</Button
        >
      </section>
    {/if}

    <form method="post" action="?/solve" use:enhance>
      <div class="flex flex-row gap-5">
        <Input
          name="flag"
          disabled={!data.loggedIn}
          placeholder="Submit flag"
        />
        <Button disabled={!data.loggedIn} variant="outline" type="submit"
          >Solve</Button
        >
      </div>

      {#if form?.message}
        <p class="mt-5 text-red-500">
          {form?.message ?? ""}
        </p>
      {/if}
    </form>
  </div>
</div>
