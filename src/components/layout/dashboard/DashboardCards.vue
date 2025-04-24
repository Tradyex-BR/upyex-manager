<template>
  <div>
    <div class="flex w-full gap-6 flex-wrap max-md:max-w-full">
      <StatCard
        value="R$ 3.456.090"
        label="Total Vendido"
        percent-change="+2.5%"
        :is-positive="true"
      />
      <StatCard
        value="34.560 USDT"
        label="Saldo Carteira Bolsão"
        percent-change="+2.5%"
        :is-positive="true"
      />
      <StatCard
        value="R$ 14.560"
        label="Comissões Pagas"
        percent-change="+2.5%"
        :is-positive="true"
      />
    </div>
    <div class="flex w-full gap-6 flex-wrap mt-6 max-md:max-w-full">
      <StatCard
        value="R$ 2.500"
        label="Saldo Liberado"
        percent-change="+2.5%"
        :is-positive="true"
      />
      <StatCard
        value="R$ 2.500"
        label="Saques Pendentes"
        percent-change="+2.5%"
        :is-positive="true"
      />
      <StatCard
        value="R$ 5.000"
        label="Comissões a Pagar"
        percent-change="+2.5%"
        :is-positive="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import StatCard from './StatCard.vue';
</script>
