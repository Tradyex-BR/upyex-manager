<template>
  <div v-if="formattedData.length > 0" class="grid grid-cols-1 gap-4">
    <div v-for="(item, index) in formattedData" :key="index" class="bg-[#2C2E3E] rounded-lg p-4">
      <div class="flex items-center gap-2 mb-3">
        <div class="w-8 h-8 flex items-center justify-center">
          <svg v-if="item.icon" class="w-6 h-6 text-white" :class="item.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="item.icon === 'card'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            <path v-if="item.icon === 'pix'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path v-if="item.icon === 'bank'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            <path v-if="item.icon === 'other'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </div>
        <h3 class="text-white text-sm font-medium">{{ item.label }}</h3>
      </div>
      <div class="flex items-center gap-3">
        <div class="flex-1 overflow-hidden h-2 text-xs flex rounded bg-[#1A1B26]">
          <div :style="{ width: item.percentage + '%' }" 
               class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500"
               :class="item.barColor">
          </div>
        </div>
        <span class="text-xs font-semibold text-white whitespace-nowrap">
          {{ item.percentage }}%
        </span>
      </div>
    </div>
  </div>
  <div v-else class="flex items-center justify-center h-full text-gray-400">
    Nenhum dado disponível
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface ChartDataItem {
  label: string
  value: number
  icon: string
  iconColor: string
  barColor: string
}

interface ChartInputData {
  status?: string
  data: {
    methods: ChartDataItem[]
    totalPaid: number
  }
}

const props = defineProps<{
  data: ChartInputData
}>()

const formattedData = computed(() => {
  if (!props.data?.data?.methods) return []
  
  const totalPaid = props.data.data.totalPaid || 0  

  return props.data.data.methods.map(item => ({
    ...item,
    percentage: totalPaid > 0 ? Math.round((item.value / totalPaid) * 100) : 0
  }))
})
</script> 