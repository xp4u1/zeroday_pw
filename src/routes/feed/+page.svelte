<script lang="ts">
  import DataTable from "$lib/components/DataTable.svelte";
  import { createTable } from "svelte-headless-table";
  import { addSortBy } from "svelte-headless-table/plugins";
  import { readable } from "svelte/store";

  let { data } = $props();

  const table = createTable(readable(data.solves), {
    sort: addSortBy(),
  });
  const columns = table.createColumns([
    table.column({
      accessor: "timestamp",
      header: "Timestamp",
    }),
    table.column({
      accessor: ({ challenge }) => challenge.name,
      header: "Challenge",
    }),
    table.column({
      accessor: ({ user }) => user.name,
      header: "User",
    }),
  ]);
</script>

<DataTable {table} {columns} />
