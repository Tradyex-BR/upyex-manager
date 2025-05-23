<template>
  <!-- Adiciona cor de fundo e padding ao container -->
  <div class="w-[200px] h-[200px]">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, computed } from 'vue'
import {
    Chart,
    DoughnutController,
    ArcElement,
    Legend,
    Tooltip,
    type FontSpec,
    type LegendItem,
    type PointStyle
} from 'chart.js';

// Registra apenas os componentes necessários para Doughnut
Chart.register(
    DoughnutController,
    ArcElement,
    Legend,
    Tooltip
);

// Define a interface para os dados de entrada
interface ChartDataItem {
  label: string
  value: number
}

interface ChartInputData {
  status?: string // Status geral (opcional, não usado diretamente no gráfico)
  data: ChartDataItem[]
}

// Define as props
const props = defineProps<{
  data: ChartInputData
}>()

const chartRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

  // --- Estilos Padrão ---
  const defaultTextColor = '#B8B8B8';
const defaultFont: Partial<FontSpec> = { // Usa Partial<FontSpec> para tipagem
  family: "'Inter', sans-serif", // Nome da fonte (coloque fallbacks)
  size: 14,                      // Tamanho da fonte
  lineHeight: 1.28,              // Aproximação de 18px / 14px
  weight: 'normal'             // Peso da fonte (ajuste se necessário)
};

// Cores baseadas na imagem de referência (Ajuste conforme necessário)
const chartColors = [
  '#A0522D', // Marrom Escuro (Aguardando Pagamento)
  '#CD853F', // Laranja/Marrom Médio (Pago)
  '#DAA520', // Amarelo Ouro/Marrom Claro (Reembolsado)
  '#F5DEB3', // Bege Claro (Cancelado)
  '#FFF8DC'  // Bege Muito Claro (Falha)
];

// Função para formatar labels (ex: 'awaiting_payment' -> 'Awaiting Payment')
const formatLabel = (label: string) => {
  if (!label) return '';
  return label
    .replace(/_/g, ' ') // Substitui underscore por espaço
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitaliza cada palavra
    .join(' ')
}

// Computa os dados formatados para o gráfico
const chartConfigData = computed(() => {
    const labels = props.data.data.map(item => formatLabel(item.label));
    const values = props.data.data.map(item => item.value);
    
    // Calcula o total para porcentagens
    const total = values.reduce((sum, value) => sum + value, 0);
    const percentages = total > 0 // <-- CONDIÇÃO CHAVE
        ? values.map(value => Math.round((value / total) * 100)) // <-- Cálculo normal
        : values.map(() => 0); // <-- Fallback para 0% quando total é zero

    // Garante que temos cores suficientes, repetindo se necessário
    const backgroundColors = values.map((_, index) => chartColors[index % chartColors.length]);

    return {
        labels,
        datasets: [{
            label: 'Status',
            data: percentages,
            backgroundColor: backgroundColors,
            borderWidth: 0,
            hoverBorderColor: '#2C2E3E'
        }]
    };
});

// Função para criar ou atualizar o gráfico
const createOrUpdateChart = () => {
  if (!chartRef.value) return

  const ctx = chartRef.value.getContext('2d')
  if (!ctx) return

  // Destrói a instância anterior
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }

  const config = {
    type: 'doughnut' as const,
    data: chartConfigData.value,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '90%',
      plugins: {
        legend: {
          display: false,
          position: 'right' as const,
          align: 'center' as const,
          labels: {
            color: defaultTextColor,
            font: defaultFont,
            padding: 20,
            usePointStyle: true,
            pointStyle: 'circle' as PointStyle,
            generateLabels: (chart: Chart) => {
              const data = chart.data;
              if (data.labels && data.datasets.length) {
                const dataset = data.datasets[0];
                return data.labels.map((label, i) => {
                  const meta = chart.getDatasetMeta(0);
                  const style = meta.controller.getStyle(i, false);
                  const value = dataset.data[i] as number;

                  return {
                    text: `${label}   ${value}%`,
                    fillStyle: style.backgroundColor,
                    strokeStyle: style.borderColor,
                    lineWidth: style.borderWidth,
                    hidden: !chart.isDatasetVisible(0) || isNaN(value),
                    index: i,
                    fontColor: defaultTextColor,
                    pointStyle: 'circle' as PointStyle
                  } as LegendItem;
                });
              }
              return [];
            }
          }
        },
        tooltip: {
          enabled: true
        }
      }
    }
  }

  chartInstance = new Chart(ctx, config)
}

// Observa mudanças nos dados das props para atualizar
watch(() => props.data, () => {
  createOrUpdateChart();
}, { deep: true })

onMounted(() => {
  // Garante que os dados iniciais existam antes de criar
  if (props.data && props.data.data) {
      createOrUpdateChart()
  }
})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})
</script>

<style scoped>
/* Garante que o container use flex para centralizar o canvas se necessário */
/* A classe 'flex items-center justify-center' no template faz isso */
canvas {
  max-width: 100%; /* Garante que o canvas não estoure */
  max-height: 100%;
}
</style>