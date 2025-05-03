<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import Chart, { ChartConfiguration } from 'chart.js/auto'

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
const labelColor = '#B8B8B8' // Cor para os textos dos labels (ex: cinza claro)
const axisLineColor = '#2C3652' // Cor para as linhas dos eixos (ex: cinza mais escuro)
const axisFontFamily = 'Lato, sans-serif'

const createOrUpdateChart = () => {
  if (!chartCanvas.value || !props.data || !props.data.data) return

  const labels = props.data.data.map(item => item.label)
  const values = props.data.data.map(item => item.value)

  console.log("DATA:", props.data.data)

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
      barPercentage: 0.2,
      categoryPercentage: 0.8,
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
          max: 250,
          grid: {
            display: false,
          },
          ticks: {
            color: labelColor, // <--- Usar a cor do label aqui
            padding: 10,
            stepSize: 250,
            font: {
              size: 12,
              weight: 'normal',
              family: axisFontFamily,
              lineHeight: '24px',
            }
          },
          border: {
            display: true,
            color: axisLineColor, // <--- Usar a cor da linha do eixo aqui
            width: 1
          }
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: labelColor, // <--- Usar a cor do label aqui
            padding: 10,
            font: {
              size: 11,
              weight: 'normal',
              family: axisFontFamily
            }
          },
          border: {
            display: true,
            color: axisLineColor, // <--- Usar a cor da linha do eixo aqui
            width: 1
          }
        }
      }
    }
  }

  if (chart) {
    chart.destroy()
  }

  chart = new Chart(chartCanvas.value, config)
}

watch(() => props.data, () => {
  createOrUpdateChart()
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
