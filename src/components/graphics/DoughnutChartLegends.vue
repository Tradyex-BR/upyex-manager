<template>
  <div v-for="item in props.data.data" :key="item.label" class="w-[240px] flex items-center justify-between">
    <div class="flex items-center gap-2">
      <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: getItemColor(item.label) }"></div>
      <span class="text-white font-inter text-[14px] leading-[18px]">{{ translateLabel(item.label) }}</span>
    </div>
    <span class="text-[#B8B8B8] font-lato font-bold text-[14px] leading-[18px]">
      {{ calculatePercentage(item.value) }}%
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, computed } from 'vue'

// Define a interface para os dados de entrada
interface ChartDataItem {
  label: string
  value: number
}

interface ChartInputData {
  status?: string
  data: ChartDataItem[]
}

// Define as props
const props = defineProps<{
  data: ChartInputData
}>()

// Cores baseadas na imagem de referência
const chartColors = [
  '#A0522D', // Marrom Escuro (Aguardando Pagamento)
  '#CD853F', // Laranja/Marrom Médio (Pago)
  '#DAA520', // Amarelo Ouro/Marrom Claro (Reembolsado)
  '#F5DEB3', // Bege Claro (Cancelado)
  '#FFF8DC'  // Bege Muito Claro (Falha)
]

const getItemColor = (label: string) => {
  const index = props.data.data.findIndex(item => item.label === label)
  return chartColors[index % chartColors.length]
}

// Função para calcular a porcentagem
const calculatePercentage = (value: number): number => {
  const total = props.data.data.reduce((sum, item) => sum + item.value, 0)
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

// Objeto de tradução dos labels
const labelTranslations: Record<string, string> = {
  'awaiting_payment': 'Aguardando Pagamento',
  'paid': 'Pago',
  'refunded': 'Reembolsado',
  'cancelled': 'Cancelado',
  'failed': 'Falha no Pagamento'
}

// Função para traduzir o label
const translateLabel = (label: string): string => {
  return labelTranslations[label] || label
}

// Observa mudanças nos dados das props para atualizar
watch(() => props.data, () => {
  // No need to call createOrUpdateChart here, as the legend component doesn't need to update the chart
}, { deep: true })

onMounted(() => {
  // Garante que os dados iniciais existam antes de criar
  if (props.data && props.data.data) {
    // No need to call createOrUpdateChart here, as the legend component doesn't need to update the chart
  }
})

onBeforeUnmount(() => {
  // No need to destroy any chart instance, as the legend component doesn't manage any chart
})
</script>

<style scoped>
  
</style>

