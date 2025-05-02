  <template>
    <!-- Adiciona cor de fundo e padding ao container -->
    <div class="w-full h-full">
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
  Filler
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

// Dados de exemplo (usado apenas se não houver dados passados via props)
const mockData = ref<ChartData[]>([
  { date: '2024-04-24 00:00:00', count: 0 },
  { date: '2024-04-24 06:00:00', count: 50 },
  { date: '2024-04-24 12:00:00', count: 120 },
  { date: '2024-04-24 18:00:00', count: 80 },
  { date: '2024-04-25 00:00:00', count: 100 },
  { date: '2024-04-25 06:00:00', count: 180 },
  { date: '2024-04-25 12:00:00', count: 150 },
  { date: '2024-04-25 18:00:00', count: 230 },
  { date: '2024-04-25 20:00:00', count: 245 },
  { date: '2024-04-25 22:00:00', count: 220 },
  { date: '2024-04-26 00:00:00', count: 225 },
  { date: '2024-04-26 06:00:00', count: 230 },
  { date: '2024-04-26 12:00:00', count: 228 }
])

// Cores baseadas na imagem
const chartLineColor = '#F9A825'; // Laranja
const chartGridColor = 'rgba(255, 255, 255, 0.1)'; // Cor suave para ticks
const chartTickColor = '#CCCCCC'; // Cinza claro para os rótulos dos eixos

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

  // Usa os dados das props se disponíveis, senão usa os dados mock
  // const chartData = props.data || mockData.value
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
          max: 250, // Define o máximo como na imagem
          grid: {
            drawBorder: false, // Remove a linha do eixo Y
            // display: false, // Descomente para remover completamente as linhas de grade Y
            drawOnChartArea: true, // Mantem as linhas de grade (se houver) apenas na área do gráfico
            color: chartGridColor, // Cor suave para linhas de grade (se visíveis)
            lineWidth: 1,
            borderDash: [3, 3], // Linhas tracejadas (opcional)
            drawTicks: false, // Não desenha pequenas marcas no eixo
          },
          ticks: {
            color: defaultTextColor, // Aplica a cor padrão
            font: defaultFont,       // Aplica a fonte padrão
            padding: 10,
            // Mostra apenas alguns ticks (pode precisar de ajuste)
            // maxTicksLimit: 3, // Tenta limitar a 0, ~125, 250
            // Ou define explicitamente os valores que você quer mostrar:
            callback: function (value, index, ticks) {
              // Mostra apenas 0 e 250 (ou o valor máximo real se for diferente)
              if (value === 0 || value === 250) {
                return value.toString();
              }
              return ''; // Oculta outros labels
            },
            stepSize: 125 // Ajuda a posicionar o 250 se o max for 250
          }
        },
        // Eixo X - Usando TimeScale
        x: {
          type: 'time', // Define o tipo de escala
          time: {
            unit: 'day', // Agrupa os dados por dia para os rótulos
            // Formato que aparece no eixo
            displayFormats: {
              day: 'dd/MM' // Formato dia/mês
            },
            // Adapta o locale para ptBR (afeta nomes de meses/dias se usados)
            adapters: {
              date: {
                locale: ptBR
              }
            },
            // Formato para o tooltip (se habilitado)
            tooltipFormat: 'dd/MM/yyyy HH:mm'
          },
          grid: {
            display: false, // Remove linhas de grade verticais
            drawBorder: false, // Remove a linha do eixo X
          },
          ticks: {
            color: chartTickColor, // Cor das datas
            padding: 10,
            maxRotation: 0, // Evita rotação das datas
            minRotation: 0,
            // Pode ser necessário ajustar source: 'auto' ou 'labels' ou 'data'
            // source: 'auto',
          }
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