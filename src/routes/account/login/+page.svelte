<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData } from "./$types";
  import { Button } from "$lib/components/ui/button/index";
  import * as Card from "$lib/components/ui/card/index";
  import { Input } from "$lib/components/ui/input/index";
  import { Label } from "$lib/components/ui/label/index";

  let { form }: { form: ActionData } = $props();

  let mode: "login" | "register" = $state("login");
</script>

<Card.Root class="mx-auto max-w-sm">
  <Card.Header>
    {#if mode == "login"}
      <Card.Title class="text-2xl">Login</Card.Title>
      <Card.Description
        >Enter your username below to login to your account</Card.Description
      >
    {:else}
      <Card.Title class="text-2xl">Register</Card.Title>
      <Card.Description
        >Create an account below to take part in the competition.</Card.Description
      >
    {/if}
  </Card.Header>
  <Card.Content>
    <form method="post" action="?/login" use:enhance class="grid gap-4">
      <div class="grid gap-2">
        <Label for="username">Username</Label>
        <Input
          id="username"
          name="username"
          placeholder="your hackername"
          required
        />
      </div>
      <div class="grid gap-2">
        <div class="flex items-center">
          <Label for="password">Password</Label>
        </div>
        <Input id="password" name="password" type="password" required />
      </div>

      {#if mode == "login"}
        <Button type="submit" class="w-full">Login</Button>
      {:else}
        <Button formaction="?/register" type="submit" class="w-full"
          >Register</Button
        >
      {/if}
    </form>
    <div class="mt-4 flex flex-col gap-3 text-center text-sm">
      {#if mode == "login"}
        <p>
          Don&apos;t have an account?
          <a
            href="."
            onclick={(event) => {
              event.preventDefault();
              mode = "register";
            }}
            class="underline">Sign up</a
          >
        </p>
      {:else}
        <p>
          Already have an account?
          <a
            href="."
            onclick={(event) => {
              event.preventDefault();
              mode = "login";
            }}
            class="underline">Sign in</a
          >
        </p>
      {/if}

      {#if form?.message}
        <p class="text-red-500">
          {form?.message ?? ""}
        </p>
      {/if}
    </div>
  </Card.Content>
</Card.Root>
