<script lang="ts">
  let { data } = $props();
</script>

<table class="table-auto border-collapse border border-gray-400 w-full">
  <thead>
    <tr>
      <th class="border border-gray-300 p-2"></th>
      <th class="border border-gray-300 p-2">Name</th>
      <th class="border border-gray-300 p-2">Solves</th>
      <th class="border border-gray-300 p-2">Category</th>
    </tr>
  </thead>
  <tbody>
    {#each data.challenges as { id, name, category, solves }}
      <!-- <tr class={id % 2 == 0 ? "bg-gray-100" : ""}> -->
      <tr>
        <td class="border border-gray-300 p-3">
          <a class="text-gray-500" href={`/challenges/${id}`}>*öffnen icon*</a>
        </td>
        <td class="border border-gray-300 p-3"
          >{name}</td
        >
        <td class="border border-gray-300 p-3">{solves.length}</td>
        <td class="border border-gray-300 p-3">{category.name}</td>
      </tr>
    {/each}
  </tbody>
</table>
