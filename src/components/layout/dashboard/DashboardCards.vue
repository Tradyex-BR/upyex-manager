<template>
  <div>
    <div class="flex w-full gap-6 flex-wrap max-md:max-w-full">
      <StatCard :value="String(data?.cards?.by_status?.paid ?? 0)" label="Pagos" percent-change="0%"
        :is-positive="true" />
      <StatCard :value="String(data?.cards?.by_status?.awaiting_payment ?? 0)" label="Aguardando Pagamento"
        percent-change="0%" :is-positive="false" />
      <StatCard :value="String(data?.cards?.by_status?.refunded ?? 0)" label="Reembolsados" percent-change="0%"
        :is-positive="false" />
      <StatCard :value="String(data?.cards?.by_status?.cancelled ?? 0)" label="Cancelados" percent-change="0%"
        :is-positive="false" />
      <StatCard :value="String(data?.cards?.by_status?.failed ?? 0)" label="Falhados" percent-change="0%"
        :is-positive="false" />
    </div>
    <div class="flex w-full gap-6 flex-wrap mt-6 max-md:max-w-full">
      <StatCard :value="String(data?.cards?.by_payment_method?.pix ?? 0)" label="Via Pix" percent-change="0%"
        :is-positive="true" />
      <StatCard :value="String(data?.cards?.by_payment_method?.credit_card ?? 0)" label="Cartão Crédito"
        percent-change="0%" :is-positive="true" />
      <StatCard :value="String(data?.cards?.by_payment_method?.debit_card ?? 0)" label="Cartão Débito"
        percent-change="0%" :is-positive="true" />
      <StatCard :value="String(data?.cards?.by_payment_method?.bank_transfer ?? 0)" label="Transferência Bancária"
        percent-change="0%" :is-positive="true" />
      <StatCard :value="String(data?.cards?.by_payment_method?.payment_link ?? 0)" label="Link de Pagamento"
        percent-change="0%" :is-positive="true" />
    </div>
    <div class="flex w-full gap-6 flex-wrap mt-6 max-md:max-w-full">
      <StatCard :value="String(data?.withdrawals?.by_status?.requested ?? 0)" label="Saques Solicitados"
        percent-change="0%" :is-positive="true" />
      <StatCard :value="String(data?.withdrawals?.by_status?.approved ?? 0)" label="Saques Aprovados"
        percent-change="0%" :is-positive="true" />
      <StatCard :value="String(data?.withdrawals?.by_status?.processing ?? 0)" label="Saques Processando"
        percent-change="0%" :is-positive="true" />
      <StatCard :value="String(data?.withdrawals?.by_status?.processed ?? 0)" label="Saques Processados"
        percent-change="0%" :is-positive="true" />
      <StatCard :value="String(data?.withdrawals?.by_status?.rejected ?? 0)" label="Saques Rejeitados"
        percent-change="0%" :is-positive="false" />
    </div>
    <div class="flex w-full gap-6 flex-wrap mt-6 max-md:max-w-full">
      <StatCard :value="String(data?.customers?.total ?? 0)" label="Total de Clientes" percent-change="0%"
        :is-positive="true" />
      <StatCard :value="String(data?.customers?.new ?? 0)" label="Novos Clientes" percent-change="0%"
        :is-positive="true" />
    </div>
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

defineProps<{
  data: DashboardResponse
}>()
</script>
