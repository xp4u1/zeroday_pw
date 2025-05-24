<script lang="ts">
  import Apexchart from "$lib/components/Apexchart.svelte";
  import type { ApexOptions } from "apexcharts";
  import DataTable from "$lib/components/DataTable.svelte";
  import { createTable } from "svelte-headless-table";
  import { addSortBy } from "svelte-headless-table/plugins";
  import { readable } from "svelte/store";

  let { data } = $props();

  const series = data.top5.map((user) => ({
    name: user.name,
    data: data.dataSet.get(user.id) ?? [],
  }));

  const options: ApexOptions = {
    chart: {
      type: "line",
      height: 350,
      zoom: { enabled: false },
    },
    stroke: {
      width: 5,
      curve: "straight",
    },
    title: {
      text: "Top 5 User: Punkteverlauf über Zeit",
      align: "left",
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      min: 0,
    },
    tooltip: {
      x: {
        format: "dd.MM.yyyy HH:mm",
      },
    },
    dataLabels: {
      enabled: false,
    },
  };

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

<Apexchart {options} {series} />
<DataTable {table} {columns} />
