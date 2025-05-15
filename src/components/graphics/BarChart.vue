<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import Chart, { ChartConfiguration } from 'chart.js/auto'
import { logger } from '@/config/logger'

// Define a interface para os dados de entrada
interface ChartDataItem {
  label: string
  value: number
}

interface ChartInputData {
  data: ChartDataItem[]
}

// Define as props
const props = defineProps<{
  data: ChartInputData
}>()

const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

// --- NOVAS CONSTANTES DE COR ---
const barColor = '#CF631C'
const axisLineColor = '#2C3652' // Cor para as linhas dos eixos (ex: cinza mais escuro)
const axisFontFamily = 'Lato, sans-serif'
const axisFontSize = 14
const axisLabelColor = '#B8B8B8'

const createOrUpdateChart = () => {
  if (!chartCanvas.value) return

  // Usa os dados das props se disponíveis, senão usa o mock
  const chartInput = props.data;

  const labels = chartInput.data.map(item => item.label)
  const values = chartInput.data.map(item => item.value)

  logger.info("DATA:", chartInput.data)

  const chartData = {
    labels: labels,
    datasets: [{
      label: '',
      data: values,
      backgroundColor: barColor,
      borderColor: barColor,
      borderWidth: 1
    }]
  }

  const config: ChartConfiguration = {
    type: 'bar',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          // Optional: Customize tooltips if needed
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: props.data.data.reduce((max, item) => Math.max(max, item.value), 0),
          grid: {
            display: false,
          },
          ticks: {
            color: axisLabelColor,
            padding: 10,
            stepSize: 250,
            font: {
              size: axisFontSize,
              weight: 'normal',
              family: axisFontFamily,
              lineHeight: '18px',
            }
          },
          border: {
            display: true,
            color: axisLineColor,
            width: 1
          }
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: axisLabelColor,
            padding: 10,
            font: {
              size: axisFontSize,
              weight: 'normal',
              family: axisFontFamily,
              lineHeight: '18px',
            }
          },
          border: {
            display: true,
            color: axisLineColor,
            width: 1
          }
        }
      },
      datasets: {
        bar: {
          barPercentage: 0.2,
          categoryPercentage: 0.8
        }
      }
    }
  }

  if (chart) {
    chart.destroy()
  }

  chart = new Chart(chartCanvas.value, config)
}

watch(() => props.data, (newData) => {
  if (newData) {
    logger.info("DATA:", newData)
    createOrUpdateChart()
  }
}, { deep: true })

onMounted(() => {
  createOrUpdateChart()
})

onBeforeUnmount(() => {
  if (chart) {
    chart.destroy()
    chart = null
  }
})

</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 240px;
  /* background-color: #202A3B; */
  border-radius: 4px;
  box-sizing: border-box;
}

canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
</style>
