<script lang="ts">
  import Badge from "$lib/components/ui/badge/badge.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";

  let { data } = $props();

  // todo: real logic
  let loggedIn = $state(false);
  let activeSession = $state(false);

  setTimeout(() => {
    loggedIn = true;
  }, 5000);
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

    {#if !loggedIn}
      <section class="rounded border p-5">
        <Button variant="ghost" class="w-full cursor-not-allowed"
          >Log in to request session</Button
        >
      </section>
    {:else if activeSession}
      <section class="flex flex-col gap-5 rounded border p-5">
        <p>You have an active session. Connect here:</p>
        <p>
          <a
            class="text-primary font-medium underline underline-offset-4"
            href="https://47c1448354804942b3bef56e371b81f7-intro-web.challenge.zeroday.pw"
            target="_blank"
            >47c1448354804942b3bef56e371b81f7-intro-web.challenge.zeroday.pw
          </a>
        </p>

        <Button
          class="mt-5 w-full cursor-pointer text-white"
          variant="destructive"
          on:click={() => (activeSession = false)}>Terminate session</Button
        >
      </section>
    {:else}
      <section class="rounded border p-5">
        <p class="mb-5">You have no active sessions.</p>

        <Button
          class="w-full cursor-pointer"
          on:click={() => (activeSession = true)}>Request session</Button
        >
      </section>
    {/if}

    <Input disabled={!loggedIn} placeholder="Submit flag" />
  </div>
</div>
