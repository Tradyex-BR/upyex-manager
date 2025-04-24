<template>
  <DashboardLayout>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-900">Dashboard</h2>
      </div>

      <!-- Cards de Resumo -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900">Total de Vendas</h3>
          <p class="mt-2 text-3xl font-bold text-primary">R$ 0,00</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900">Pedidos</h3>
          <p class="mt-2 text-3xl font-bold text-primary">0</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900">Clientes</h3>
          <p class="mt-2 text-3xl font-bold text-primary">0</p>
        </div>
      </div>

      <!-- Lista de Atividades Recentes -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg font-medium text-gray-900">Atividades Recentes</h3>
        </div>
        <div class="border-t border-gray-200">
          <div class="px-4 py-5 sm:p-6">
            <p class="text-gray-500 text-center">Nenhuma atividade recente</p>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
</script> 