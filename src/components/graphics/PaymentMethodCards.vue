<template>
  <div v-if="formattedData.length > 0" class="grid grid-cols-1 gap-2">
    <div v-for="(item, index) in formattedData" :key="index" class="h-[70px] bg-transparent rounded-lg border border-[#2C3652] p-3">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-[46px] h-[46px] rounded-full flex items-center justify-center"  style="background-color: rgba(4, 13, 37, 0.16)">
          <component :is="icons[item.icon]" />
        </div>
        <div class="w-full flex flex-col gap-1">
          <h3 class="text-white font-inter text-[14px] leading-[18px] font-medium">{{ item.label }}</h3>
          <div class="flex items-center gap-3">
            <div class="flex-1 overflow-hidden h-1 text-xs flex rounded bg-[#1A1B26]">
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
    </div>
  </div>
  <div v-else class="flex items-center justify-center h-full text-gray-400">
    Nenhum dado disponível
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CardIcon from '@/components/icons/CardIcon.vue'
import BoletusIcon from '@/components/icons/BoletusIcon.vue'
import PixIcon from '@/components/icons/PixIcon.vue'
import OthersIcon from '@/components/icons/OthersIcon.vue'

const icons = {
  card: CardIcon,
  pix: PixIcon,
  bank: BoletusIcon,
  other: OthersIcon
}

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