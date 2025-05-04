<script lang="ts">
  import DataTable from "$lib/components/DataTable.svelte";
  import { createRender, createTable } from "svelte-headless-table";
  import { addSortBy } from "svelte-headless-table/plugins";
  import { readable } from "svelte/store";
  import TableButton from "./TableButton.svelte";

  let { data } = $props();

  const table = createTable(readable(data.challenges), {
    sort: addSortBy(),
  });
  const columns = table.createColumns([
    table.column({
      accessor: "name",
      header: "Name",
    }),
    table.column({
      accessor: "id",
      header: "",
      cell: ({ value }) => {
        return createRender(TableButton, { id: value });
      },
    }),
    table.column({
      accessor: ({ points }) => points,
      header: "Points",
    }),
    table.column({
      accessor: ({ solves }) => solves.length,
      header: "Solves",
    }),
    table.column({
      accessor: ({ category }) => category.name,
      header: "Category",
    }),
  ]);
</script>

<DataTable {table} {columns} />
