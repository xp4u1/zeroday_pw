<script lang="ts">
  import { page } from "$app/state";
  import { Flag } from "lucide-svelte";

  import "../app.css";

  const { children, data } = $props();

  const links = [
    {
      name: "Scoreboard",
      href: "/scoreboard",
    },
    {
      name: "Challenges",
      href: "/challenges",
    },
    {
      name: "Feed",
      href: "/feed",
    },
  ];
</script>

<div class="flex min-h-screen w-full flex-col">
  <header
    class="bg-background sticky top-0 flex h-16 items-center gap-4 border-b px-4 md:px-6"
  >
    <nav
      class="flex w-full flex-row items-center justify-between text-sm font-medium"
    >
      <div class="flex flex-row items-center gap-5 lg:gap-6">
        <a
          href="/"
          class="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Flag class="h-6 w-6" />
          <span class="sr-only">zeroday.pw</span>
        </a>

        {#each links as { name, href }}
          <a
            {href}
            class={`${page.url.pathname.startsWith(href) ? "text-foreground" : "text-muted-foreground"} hover:text-foreground transition-colors`}
          >
            {name}
          </a>
        {/each}
      </div>

      <a
        href="/account"
        class="text-muted-foreground hover:text-foreground transition-colors"
      >
        {#if data.user}
          {data.user.username}
        {:else}
          Login
        {/if}
      </a>
    </nav>
  </header>

  <main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
    {@render children()}
  </main>
</div>
