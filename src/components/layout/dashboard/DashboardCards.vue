<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <StatCard
      v-for="(item, key) in data"
      :key="key"
      :value="item.value"
      :label="item.label"
    />
  </div>
</template>

<script setup lang="ts">
import { DashboardResponse } from '@/services/managerService';
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

interface DashboardData {
  paid: DashboardCard;
  customers: DashboardCard;
  withdrawals: DashboardCard;
}

defineProps<{
  data: DashboardData
}>()
</script>
