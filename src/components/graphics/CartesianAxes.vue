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
  TimeScale, // Importa a escala de tempo!
  Title,
  Tooltip,
  Legend,
  Filler,
  FontSpec
} from 'chart.js'
// Importa o adaptador e a localidade
import 'chartjs-adapter-date-fns';
import { ptBR } from 'date-fns/locale';

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

// Dados mockados para visualização
const mockData = ref<ChartData[]>([
  { date: '2024-03-18', count: 120 },
  { date: '2024-03-19', count: 180 },
  { date: '2024-03-20', count: 150 },
  { date: '2024-03-21', count: 200 },
  { date: '2024-03-22', count: 220 },
  { date: '2024-03-23', count: 190 },
  { date: '2024-03-24', count: 160 }
])

// Cores baseadas na imagem
const chartLineColor = '#F9A825'; // Laranja
const chartGridColor = '#F9A825'; // Cor suave para ticks
const chartTickColor = '#B8B8B8'; // Cinza claro para os rótulos dos eixos

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
  const chartData = mockData.value

  // --- Estilos Padrão ---
const defaultTextColor = '#B8B8B8';
const defaultFont: Partial<FontSpec> = { // Usa Partial<FontSpec> para tipagem
  family: "'Inter', sans-serif", // Nome da fonte (coloque fallbacks)
  size: 14,                      // Tamanho da fonte
  lineHeight: 1.28,              // Aproximação de 18px / 14px
  weight: 'normal'             // Peso da fonte (ajuste se necessário)
};

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      // Para TimeScale, é melhor passar objetos {x, y}
      datasets: [{
        label: 'Contagem', // Mesmo que a legenda esteja oculta, é bom ter um label
        data: chartData.map(item => ({
          x: new Date(item.date).valueOf(), // Passa como timestamp (ou objeto Date)
          y: item.count
        })),
        borderColor: chartLineColor,
        borderWidth: 2, // Linha mais fina
        tension: 0.4,   // Linha suavizada
        pointRadius: 0, // Oculta os pontos na linha
        pointHoverRadius: 0, // Oculta os pontos no hover também
        fill: true,     // Habilita o preenchimento
        backgroundColor: (context: any) => { // Gradiente para o preenchimento
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return 'rgba(0,0,0,0)'; // Fallback transparente
          }
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          // Começa mais transparente/escuro em baixo
          gradient.addColorStop(0, 'rgba(207, 99, 28, 0)'); // Cor do fundo com alpha ou outra cor escura
          // Fica mais opaco perto da linha com a cor da linha
          gradient.addColorStop(1, 'rgba(207, 99, 28, 0.7)'); // Cor da linha com alpha
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
          max: 250,
          border: {
            color: '#2C3652'
          },
          grid: {
            display: false,
            drawBorder: false,
            drawOnChartArea: false,
            color: chartGridColor,
            lineWidth: 1,
            borderDash: [3, 3],
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
            adapters: {
              date: {
                locale: ptBR
              }
            },
            tooltipFormat: 'dd/MM/yyyy'
          },
          grid: {
            display: false,
            drawBorder: false,
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

<style scoped>
/* Estilos adicionais se necessários */
</style>