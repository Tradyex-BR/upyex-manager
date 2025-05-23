<template>
  <div class="flex flex-row h-full" :class="{ 'flex-col': vertical }" :style="{ gap: `${gap}px` }">
    <template v-if="vertical">
      <div class="flex flex-col gap-2">
        <StatCard v-for="(card, index) in managerListCards" :key="index" :value="card.value" :label="card.label"
          :border="card.border" :class="$attrs.class" :index="index" :animate="true" :isValueCurrency="isValueCurrency" />
      </div>
    </template>
    <template v-else>
      <div class="w-full flex flex-row gap-6">
        <StatCard v-for="(card, index) in (role === 'manager' ? managerCards : affiliateCards)" :key="index"
          :value="card.value" :label="card.label" :border="card.border" :class="$attrs.class" :index="index"
          :isValueCurrency="isValueCurrency" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import StatCard from './StatCard.vue';
import { defineComponent } from 'vue';
import { DashboardResponse } from '@/types/dashboard';

defineComponent({
  name: 'DashboardCards'
})

const props = defineProps<{
  data: DashboardResponse,
  vertical?: boolean,
  border?: boolean,
  gap?: number,
  role?: string,
  isValueCurrency?: boolean
}>();

const managerCards = [
  {
    value: props.data.sales?.cards?.by_status?.paid?.toString() || '0',
    label: 'Vendas Pagas',
    border: false
  },
  {
    value: props.data.customers?.total?.toString() || '0',
    label: 'Total de Clientes',
    border: false
  },
  {
    value: props.data.withdrawals?.by_status?.requested?.toString() || '0',
    label: 'Saques Solicitados',
    border: false
  },
]

const managerListCards = [
  {
    value: props.data.customers?.total?.toString() || '0',
    label: 'Total de Clientes',
    border: true
  },
  {
    value: props.data.customers?.new?.toString() || '0',
    label: 'Novos Clientes',
    border: true
  },
]

const affiliateCards = [
  {
    value: props.data.sales.cards.total_sales?.toString() || '0',
    label: 'Saldo atual',
    border: false
  },
  {
    value: props.data.balance?.next_7_days?.toString() || '0',
    label: 'Saldo a liberar (Proximos 7 dias)',
    border: false
  },
  {
    value: props.data.balance?.future_balance?.toString() || '0',
    label: 'Saldo a liberar',
    border: false
  },
  {
    value: props.data.balance?.current_balance?.toString() || '0',
    label: 'Total de vendas',
    border: false
  },
]

// Adicionar inheritAttrs como false para permitir que as classes sejam passadas para o StatCard
defineOptions({
  inheritAttrs: false
})
</script>

<style scoped>
.stat-card {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.5s ease forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
