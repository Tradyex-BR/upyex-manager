<template>
  <!-- Adiciona cor de fundo e padding ao container -->
  <div class="w-full h-full">
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
    type FontSpec // Importa FontSpec para tipagem
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
    // Garante que temos cores suficientes, repetindo se necessário
    const backgroundColors = values.map((_, index) => chartColors[index % chartColors.length]);

    return {
        labels,
        datasets: [{
            label: 'Status', // Label do dataset (pode aparecer no tooltip se ativado)
            data: values,
            backgroundColor: backgroundColors,
            borderWidth: 0, // Remove borda padrão
            spacing: 2,     // Adiciona um pequeno espaço entre segmentos
            hoverOffset: 4, // Efeito ao passar o mouse (se tooltips/hover ativados)
            hoverBorderColor: '#2C2E3E' // Cor da borda no hover (cor do fundo)
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
    data: chartConfigData.value, // Usa os dados computados
    options: {
      responsive: true,
      maintainAspectRatio: false, // Permite que o gráfico se ajuste ao container
      cutout: '75%', // Ajusta o tamanho do buraco central (experimente valores como '70%' a '85%')

      plugins: {
        legend: {
          display: true, // Mantém a legenda visível
          position: 'right' as const, // Posiciona a legenda à direita
          align: 'center' as const, // Centraliza os itens verticalmente na legenda
          labels: {
            color: defaultTextColor, // Aplica a cor padrão do texto
            font: defaultFont,       // Aplica a fonte padrão
            boxWidth: 14,            // Largura da caixa/ponto de cor
            padding: 15,             // Espaçamento entre os itens da legenda
            usePointStyle: true,     // Usa 'circle' ou outro estilo de ponto
            pointStyle: 'circle',    // Define o estilo do ponto como círculo

            // --- Geração customizada dos labels da legenda ---
            generateLabels: (chart: Chart) => {
              const data = chart.data;
              if (data.labels && data.datasets.length) {
                const dataset = data.datasets[0];
                return data.labels.map((label, i) => {
                  const meta = chart.getDatasetMeta(0);
                  const style = meta.controller.getStyle(i);
                  const value = dataset.data[i] as number; // Pega o valor

                  return {
                    text: `${label}   ${value}%`, // Combina label e valor com espaço
                    fillStyle: style.backgroundColor,
                    strokeStyle: style.borderColor,
                    lineWidth: style.borderWidth,
                    hidden: !chart.isDatasetVisible(0) || isNaN(value),
                    index: i,
                    // Propriedades adicionadas para garantir estilo
                    fontColor: defaultTextColor,
                    pointStyle: 'circle',
                  };
                });
              }
              return [];
            }
          }
        },
        tooltip: {
          enabled: true // Desabilita os tooltips como na imagem
          // Se precisar habilitar e estilizar:
          // callbacks: {
          //      label: function(context) {
          //          let label = context.label || '';
          //          if (label) {
          //              label += ': ';
          //          }
          //          if (context.parsed !== null) {
          //              label += context.parsed + '%';
          //          }
          //          return label;
          //      }
          //  },
          // backgroundColor: 'rgba(0, 0, 0, 0.8)',
          // titleFont: defaultFont,
          // titleColor: defaultTextColor,
          // bodyFont: defaultFont,
          // bodyColor: defaultTextColor,
          // padding: 10,
          // cornerRadius: 4,
          // usePointStyle: true,
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