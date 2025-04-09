<script lang="ts">
  import { page } from "$app/state";
</script>

<div class="mt-10 w-full text-center">
  <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight">
    {page.error!.message} ({page.status})
  </h1>

  <div class="mt-5">
    <p>The CTF site was down today,</p>
    <p>No puzzles left, no flags to play.</p>
    <p>The hacker sighed, his work on hold,</p>
    <p>A silent screen, a story told.</p>
  </div>
</div>
