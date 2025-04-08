<script lang="ts">
  let { children } = $props();
</script>

<div class="w-full p-5 flex justify-center">
  <div class="w-full max-w-3xl">
    {@render children()}
  </div>
</div>
