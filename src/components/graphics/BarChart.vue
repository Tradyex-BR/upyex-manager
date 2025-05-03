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
  label: string // Expecting labels like "Solicitado", "Aprovado", etc.
  value: number
}

// Updated interface: Removed optional 'status' as it wasn't used
interface ChartInputData {
  data: ChartDataItem[]
}

// Define as props
const props = defineProps<{
  data: ChartInputData
}>()

const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

// Color Constants based on the reference image
const barColor = '#CF631C' // Solid orange/brown color for all bars
const axisColor = '#B8B8B8' // Light color for axes and labels
const axisFontFamily = 'Lato, sans-serif' // Defina a família da fonte desejada

const createOrUpdateChart = () => {
  if (!chartCanvas.value || !props.data || !props.data.data) return

  // Use labels directly from props - assuming they are already correct
  const labels = props.data.data.map(item => item.label)
  const values = props.data.data.map(item => item.value)

  console.log("DATA:", props.data.data)

  const chartData = {
    labels: labels,
    datasets: [{
      label: '', // Remove dataset label to clean up tooltips
      data: values,
      backgroundColor: barColor, // Use the single color for all bars
      borderColor: barColor, // Use the same color for border
      borderWidth: 1
    }]
  }

  const config: ChartConfiguration = {
    type: 'bar',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false, // Allow chart to fill container height better
      barPercentage: 0.2, // Controla a largura das barras (0.4 = 40% do espaço disponível)
      categoryPercentage: 0.8, // Controla o espaçamento entre as barras
      plugins: {
        legend: {
          display: false // Hide the legend
        },
        tooltip: {
          // Optional: Customize tooltips if needed
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 250, // Set explicit max value for Y-axis
          grid: {
            display: false,
          },
          ticks: {
            color: axisColor,
            padding: 10,
            stepSize: 250,
            font: { // Estilização da fonte para os labels do eixo Y
              size: 12,
              weight: 'normal',
              family: axisFontFamily,
              lineHeight: '24px',

            }
          },
          border: { // Estilização da linha do eixo Y
            display: true,
            color: axisColor, // <-- VÍRGULA ADICIONADA AQUI
            width: 1 // Espessura da linha do eixo em pixels
          }
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: axisColor,
            padding: 10,
            font: { // Estilização da fonte para os labels do eixo X
              size: 11,
              weight: 'normal',
              family: axisFontFamily
            }
          },
          border: { // Estilização da linha do eixo X
            display: true,
            color: axisColor, // <-- VÍRGULA ADICIONADA AQUI
            width: 1 // Espessura da linha do eixo em pixels
          }
        }
      }
    }
  }

  // Destroy previous chart instance if it exists
  if (chart) {
    chart.destroy()
  }

  // Create new chart instance
  chart = new Chart(chartCanvas.value, config)
}

// Watch for changes in props data to update the chart
watch(() => props.data, () => {
  createOrUpdateChart()
}, { deep: true })

// Create the chart when the component is mounted
onMounted(() => {
  createOrUpdateChart()
})

// Clean up the chart instance when the component is unmounted
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
  height: 300px;
  min-height: 250px;
  /* background-color: #202A3B; */
  /* Removido background para teste ou ajuste */
  padding: 15px;
  border-radius: 4px;
  box-sizing: border-box;
}

canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
</style>