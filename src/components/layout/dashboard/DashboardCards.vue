<template>
  <div class="flex flex-row gap-6" :class="{ 'flex-col': vertical }">
    <template v-if="Array.isArray(data)">
      <StatCard v-for="(item, key) in data" :key="key" :value="item.value" :label="item.label" :border="border" />
    </template>
    <template v-else-if="isDashboardCard(data)">
      <StatCard 
        :value="data.value" 
        :label="data.label" 
        :border="border" 
      />
    </template>
    <template v-else-if="isCustomerData(data)">
      <StatCard 
        :value="data.total.toString()" 
        label="Total de Clientes" 
        :border="border" 
      />
      <StatCard 
        :value="data.new.toString()" 
        label="Novos Clientes" 
        :border="border" 
      />
    </template>
    <template v-else>
      <StatCard v-for="(item, key) in Object.values(data || {})" :key="key" :value="item.value" :label="item.label" :border="border" />
    </template>
  </div>
</template>

<script setup lang="ts">
import StatCard from './StatCard.vue';
import { defineComponent } from 'vue';

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

const props = defineProps<{
  data: DashboardCard | DashboardData | CustomerData | Record<string, any>,
  vertical?: boolean,
  border?: boolean
}>()

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
</script>
