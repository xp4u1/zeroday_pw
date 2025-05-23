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

    // Fallback: falls keine options übergeben wurden
    if (!props.options) {
      console.error(
        "Apexchart: 'options' ist undefined. Übergib mindestens chart: { type: ... } und series.",
      );
      return;
    }

    const finalOptions: ApexOptions = {
      ...props.options,
      series: props.series ?? props.options.series ?? [],
    };

    if (!finalOptions.chart) {
      console.error("Apexchart: 'chart' fehlt in den Optionen.");
      return;
    }

    const chart = new ApexCharts(chartContainer, finalOptions);
    chart.render();
  });
</script>

<div bind:this={chartContainer} {...props}></div>
