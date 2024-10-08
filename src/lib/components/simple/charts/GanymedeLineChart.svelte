<script lang="ts">
  import { Line } from 'svelte-chartjs';
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale,
  } from 'chart.js';
  import { onMount, type ComponentProps } from 'svelte';

  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale
  );

  let background: string | undefined = undefined,
    mounted: boolean = false,
    zoomMounted: boolean = false

  onMount(async () => {
    let style = getComputedStyle(document.body);
    background = style.getPropertyValue('--global-color-background-200');
    mounted = true
  })


  export let data: {
      labels: string[],
      datasets: {
        label: string,
        data: (number | null)[],
        backgroundColor?: string,
        borderColor?: string,
        hoverBackgroundColor?: string[]
        tension?: number,
        spanGaps?: boolean | number | undefined
      }[]
    } = {
      labels: [],
      datasets: []
    },
    horizontal: boolean = false,
    responsive: boolean = true,
    maintainAspectRatio: boolean = true,
    showLegend: boolean = true,
    showYTicks: boolean = false,
    showXTicks: boolean = false,
    displayYGrid: boolean = true,
    lineWidth: number = 1,
    enableZoom: boolean = false,
    resetZoom: boolean = false,
    xTickStepSize: number | undefined = undefined,
    yTickStepSize: number | undefined = undefined,
    xMax: number | undefined = undefined,
    yMax: number | undefined = undefined

  $: gridColor = 'rgb(' + (background || '200, 200, 200') + ', .3)'

  let chart: ComponentProps<Line>['chart']
  $: if(!!chart && !!enableZoom && !!resetZoom) {
    chart.resetZoom()
    resetZoom = false
  }

  $: if(enableZoom && mounted) {
    import('chartjs-plugin-zoom').then(({ default: zoomPlugin }) => {
      ChartJS.register(zoomPlugin)
      zoomMounted = true
    })
  }

  let chartOptions: ComponentProps<Line>['options']
  $: chartOptions = {
      indexAxis: horizontal ? 'y' : 'x',
      responsive: responsive,
      maintainAspectRatio: maintainAspectRatio,
      plugins: {
        legend: {
          display: showLegend
        },
        zoom: {
          pan: {
            enabled: true,
            mode: 'x',
            modifierKey: 'ctrl',
          },
          zoom: {
            drag: {
              enabled: true
            },
            mode: 'x',
          },
        }
      },
      interaction: {
        intersect: false,
      },
      scales: {
        x: {
          max: xMax,
          display: true,
          title: {
            display: true
          },
          grid: {
            display: false
          },
          border: {
            display: false
          },
          ticks: {
            display: showYTicks,
            stepSize: yTickStepSize
          }
        },
        y: {
          max: yMax,
          display: displayYGrid,
          title: {
          },
          grid: {
            lineWidth: lineWidth,
            color: gridColor
          },
          border: {
            dash: [10,10],
            display: false
          },
          ticks: {
            display: showXTicks,
            stepSize: xTickStepSize
          }
        }
      }
    }

  $: realData = data as ComponentProps<Line>['data']
</script>

{#if zoomMounted || !enableZoom}
  <Line 
    bind:data={realData}
    options={chartOptions}
    bind:chart={chart}
  ></Line>
{/if}