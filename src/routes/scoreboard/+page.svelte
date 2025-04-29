<script lang="ts">
  import DataTable from "$lib/components/DataTable.svelte";
  import { createTable } from "svelte-headless-table";
  import { addSortBy } from "svelte-headless-table/plugins";
  import { readable } from "svelte/store";

  let { data } = $props();

  const table = createTable(readable(data.participants), {
    sort: addSortBy(),
  });
  const columns = table.createColumns([
    table.column({
      accessor: "placement",
      header: "Placement",
    }),
    table.column({
      accessor: "name",
      header: "Name",
    }),
    table.column({
      accessor: "points",
      header: "Points",
    }),
  ]);
</script>

<DataTable {table} {columns} />
