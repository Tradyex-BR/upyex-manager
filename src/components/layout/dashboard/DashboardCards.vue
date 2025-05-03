<template>
  <div class="flex flex-row h-full" :class="{ 'flex-col': vertical }" :style="{ gap: `${gap}px` }">
    <template v-if="Array.isArray(data)">
      <StatCard v-for="(item, index) in data" :key="index" :value="item.value" :label="item.label" :border="border" :class="$attrs.class" :index="index" />
    </template>
    <template v-else-if="isDashboardCard(data)">
      <StatCard 
        :value="data.value" 
        :label="data.label" 
        :border="border"
        :class="$attrs.class"
        :index="0"
      />
    </template>
    <template v-else-if="isCustomerData(data)">
      <StatCard 
        :value="data.total.toString()" 
        label="Total de Clientes" 
        :border="border"
        :class="$attrs.class"
        :index="0"
        :animate="true"
      />
      <StatCard 
        :value="data.new.toString()" 
        label="Novos Clientes" 
        :border="border"
        :class="$attrs.class"
        :index="1"
        :animate="true"
      />
    </template>
    <template v-else>
      <StatCard v-for="(item, index) in Object.values(data || {})" :key="index" :value="item.value" :label="item.label" :border="border" :class="$attrs.class" :index="index" />
    </template>
  </div>
</template>

<script setup lang="ts">
import StatCard from './StatCard.vue';
import { defineComponent, defineOptions, withDefaults } from 'vue';

defineComponent({
  name: 'DashboardCards',
  onMounted() {
    console.log('DashboardCards mounted')
  }
})

interface DashboardCard {
  value: string;
  label: string;
}

interface CustomerData {
  total: number;
  new: number;
}

interface DashboardData {
  paid: DashboardCard;
  customers: CustomerData;
  withdrawals: DashboardCard;
}

const props = withDefaults(defineProps<{
  data: DashboardCard | DashboardData | CustomerData | Record<string, any>,
  vertical?: boolean,
  border?: boolean,
  gap?: number
}>(), {
  vertical: false,
  border: false,
  gap: 24 // 6 * 4 = 24px (equivalente ao gap-6 do Tailwind)
})

// Função para verificar se é DashboardCard
const isDashboardCard = (data: any): data is DashboardCard => {
  return data && typeof data === 'object' && 'value' in data && 'label' in data;
}

// Função para verificar se é CustomerData
const isCustomerData = (data: any): data is CustomerData => {
  return data && typeof data === 'object' && 'total' in data && 'new' in data;
}

// Log para debug
console.log('DashboardCards data:', props.data);

// Adicionar inheritAttrs como false para permitir que as classes sejam passadas para o StatCard
defineOptions({
  inheritAttrs: false
})
</script>
