<!-- BarChart.vue -->

<template>
  <div>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref } from 'vue-property-decorator';
import Chart from 'chart.js';

@Component
export default class BarChart extends Vue {
  @Ref('chartCanvas') private chartCanvas!: HTMLCanvasElement | undefined;

  private chart: Chart | null = null;

  private chartData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Monthly Sales',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        data: [65, 59, 80, 81, 56],
      },
    ],
  };

  private chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  mounted() {
    this.renderChart();
  }

  private renderChart() {
    const ctx = this.chartCanvas?.getContext('2d');
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: this.chartData,
        options: this.chartOptions,
      });
    }
  }
}
</script>
