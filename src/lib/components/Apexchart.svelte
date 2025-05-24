<script lang="ts" module>
  import type { ApexOptions } from "apexcharts";
  import type { HTMLAttributes } from "svelte/elements";
</script>

<script lang="ts">
  import { onMount } from "svelte";

  const props = $props<
    {
      options?: ApexOptions;
      series?: ApexOptions["series"];
    } & HTMLAttributes<HTMLDivElement>
  >();

  let chartContainer: HTMLDivElement;

  onMount(async () => {
    const ApexCharts = (await import("apexcharts")).default;

    if (!props.options) {
      throw new Error(
        "Missing 'options'. You need to specify a configuration for ApexCharts",
      );
    }

    const finalOptions: ApexOptions = {
      ...props.options,
      series: props.series ?? props.options.series ?? [],
    };

    if (!finalOptions.chart) {
      throw new Error("Missing 'chart' configuration in options");
    }

    const chart = new ApexCharts(chartContainer, finalOptions);
    chart.render();
  });
</script>

<div bind:this={chartContainer} {...props}></div>
