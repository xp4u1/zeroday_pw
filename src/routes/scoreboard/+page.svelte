<script lang="ts">
  export let data;
  const { players } = data;
</script>

<h1 class="mb-4 text-3xl font-bold">Scoreboard</h1>

{#if players.length > 0}
  <table class="mb-8 min-w-full table-auto">
    <thead>
      <tr>
        <th class="border-b-2 px-4 py-2">Platz</th>
        <th class="border-b-2 px-4 py-2">Spieler</th>
        <th class="border-b-2 px-4 py-2">Punkte</th>
      </tr>
    </thead>
    <tbody>
      {#each players as player, index}
        <tr class="text-center">
          <td class="border-b px-4 py-2">{index + 1}</td>
          <td class="border-b px-4 py-2">{player.name}</td>
          <td class="border-b px-4 py-2">{player.points ?? 0}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{:else}
  <p class="text-gray-500">Keine Spieler vorhanden.</p>
{/if}
