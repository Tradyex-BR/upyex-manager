  <template>
    <!-- Adiciona cor de fundo e padding ao container -->
    <div class="w-full h-[240px]">
      <canvas ref="chartRef"></canvas>
    </div>
  </template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartType
} from 'chart.js'
// Importa o adaptador e a localidade
import 'chartjs-adapter-date-fns';

// Define a interface para os dados
interface ChartData {
  date: string
  count: number
}

// Define as props
const props = defineProps<{
  data?: ChartData[]
}>()

// Registra os componentes necessários, incluindo TimeScale e Filler
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale, // Registra a escala de tempo
  Title,
  Tooltip,
  Legend,
  Filler
)

const chartRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

// Cores baseadas na imagem
const chartLineColor = '#F9A825'; // Laranja
const chartGridColor = '#F9A825'; // Cor suave para ticks

const axisFontFamily = 'Lato, sans-serif'
const axisFontSize = 14
const axisLabelColor = '#B8B8B8'

// Função para criar ou atualizar o gráfico
const createOrUpdateChart = () => {
  if (!chartRef.value) return

  const ctx = chartRef.value.getContext('2d')
  if (!ctx) return

  // Destrói a instância anterior se existir
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }

  // Usa APENAS os dados das props
  const chartData = props.data || []

  chartInstance = new Chart(ctx, {
    type: 'line' as ChartType,
    data: {
      datasets: [{
        label: 'Contagem',
        data: chartData.map(item => ({
          x: new Date(item.date).valueOf(),
          y: item.count
        })),
        borderColor: chartLineColor,
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 0,
        fill: true,
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return 'rgba(0,0,0,0)';
          }
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, 'rgba(207, 99, 28, 0)');
          gradient.addColorStop(1, 'rgba(207, 99, 28, 0.7)');
          return gradient;
        },
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { // Opcional: melhora a experiência do tooltip se ativado
        mode: 'index',
        intersect: false,
      },
      scales: {
        // Eixo Y
        y: {
          beginAtZero: true,
          max: props.data?.reduce((max, item) => Math.max(max, item.count), 0),
          border: {
            color: '#2C3652'
          },
          grid: {
            display: false,
            drawOnChartArea: false,
            color: chartGridColor,
            lineWidth: 1,
            drawTicks: false,
          },
          ticks: {
            color: axisLabelColor,
            font: {
              family: axisFontFamily,
              size: axisFontSize,
              lineHeight: 1.28,
              weight: 'normal'
            },
            padding: 10,
            maxTicksLimit: 2,
            callback: function (value) {
              if (value === 0 || value === 250) {
                return value.toString();
              }
              return '';
            }
          }
        },
        // Eixo X - Usando TimeScale
        x: {
          type: 'time',
          time: {
            unit: 'day',
            displayFormats: {
              day: 'dd/MM'
            },
            tooltipFormat: 'dd/MM/yyyy'
          },
          grid: {
            display: false,
          },
          border: {
            color: '#2C3652'
          },
          ticks: {
            color: axisLabelColor,
            font: {
              family: axisFontFamily,
              size: axisFontSize,
              lineHeight: 1.28,
              weight: 'normal'
            },
            padding: 10,
            maxRotation: 0,
            minRotation: 0,
            source: 'data'
          },
          min: props.data?.[0]?.date,
          max: props.data?.[props.data.length - 1]?.date
        }
      },
      plugins: {
        legend: {
          display: false // Oculta a legenda
        },
        title: {
          display: false // Oculta o título
        },
        tooltip: {
          enabled: true, // Desabilita tooltips para corresponder à imagem estática
          // Se quiser habilitar e customizar:
          // mode: 'index',
          // intersect: false,
          // backgroundColor: 'rgba(0, 0, 0, 0.7)',
          // titleFont: { size: 12 },
          // bodyFont: { size: 12 },
          // padding: 10,
          // callbacks: { ... } // Para formatar o conteúdo
        }
      }
    }
  })
}

// Watch para atualizar o gráfico quando os dados mudarem
watch(() => props.data, () => {
  createOrUpdateChart()
}, { deep: true })

onMounted(() => {
  createOrUpdateChart()
})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})
</script>