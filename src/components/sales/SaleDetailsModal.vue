<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div class="bg-[#23263a] rounded-lg p-8 w-full max-w-4xl relative max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8 border-b border-[#2A2F4C] pb-4">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-[#CF631C] flex items-center justify-center">
            <i class="fas fa-shopping-cart text-white text-xl"></i>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-white">Venda #{{ sale?.id }}</h2>
            <p class="text-gray-400 text-sm">{{ new Date(sale?.created_at).toLocaleDateString('pt-BR') }}</p>
          </div>
        </div>
        <button @click="$emit('close')" class="text-gray-400 hover:text-white transition-colors">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <!-- Status Badge -->
      <div class="mb-8">
        <span :class="[
          'px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2',
          sale?.status === 'Aprovado'
            ? 'bg-green-500/20 text-green-500'
            : sale?.status === 'Pendente'
              ? 'bg-yellow-500/20 text-yellow-500'
              : 'bg-red-500/20 text-red-500'
        ]">
          <i :class="[
            'fas',
            sale?.status === 'Aprovado' ? 'fa-check-circle' :
              sale?.status === 'Pendente' ? 'fa-clock' : 'fa-times-circle'
          ]"></i>
          {{ sale?.status }}
        </span>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-2 gap-8 mb-8">
        <!-- Informações da Venda -->
        <div class="bg-[#1a1a2a] rounded-xl p-6">
          <h3 class="text-white text-lg font-semibold mb-6 flex items-center gap-2">
            <i class="fas fa-info-circle text-[#CF631C]"></i>
            Informações da Venda
          </h3>
          <div class="space-y-6">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-[#23263a] flex items-center justify-center">
                <i class="fas fa-user text-[#CF631C]"></i>
              </div>
              <div>
                <label class="text-gray-400 text-sm">Cliente</label>
                <p class="text-white font-medium">{{ sale?.customer?.name }}</p>
                <p class="text-gray-400 text-sm">{{ sale?.customer?.email }}</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-[#23263a] flex items-center justify-center">
                <i class="fas fa-credit-card text-[#CF631C]"></i>
              </div>
              <div>
                <label class="text-gray-400 text-sm">Método de Pagamento</label>
                <p class="text-white font-medium">{{ sale?.payment_method }}</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-[#23263a] flex items-center justify-center">
                <i class="fas fa-percentage text-[#CF631C]"></i>
              </div>
              <div>
                <label class="text-gray-400 text-sm">Taxa da Plataforma</label>
                <p class="text-white font-medium">{{ sale?.platform_fee }}%</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-[#23263a] flex items-center justify-center">
                <i class="fas fa-hand-holding-usd text-[#CF631C]"></i>
              </div>
              <div>
                <label class="text-gray-400 text-sm">Comissão do Afiliado</label>
                <p class="text-white font-medium">{{ sale?.affiliate_commission }}%</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Produtos -->
        <div class="bg-[#1a1a2a] rounded-xl p-6">
          <h3 class="text-white text-lg font-semibold mb-6 flex items-center gap-2">
            <i class="fas fa-box text-[#CF631C]"></i>
            Produtos
          </h3>
          <div class="space-y-4">
            <div v-for="product in sale?.products" :key="product.id"
              class="bg-[#23263a] rounded-lg p-4 hover:bg-[#2A2F4C] transition-colors">
              <div class="space-y-3">
                <!-- Nome e ID -->
                <div>
                  <p class="text-white font-medium text-lg">{{ product.name }}</p>
                  <p class="text-gray-400 text-sm">ID: {{ product.id }}</p>
                </div>

                <!-- Valores -->
                <div class="grid grid-cols-3 gap-4">
                  <div class="bg-[#1a1a2a] rounded-lg p-3">
                    <p class="text-gray-400 text-sm mb-1">Preço Unitário</p>
                    <p class="text-[#CF631C] font-bold">R$ {{ product.price.toFixed(2) }}</p>
                  </div>
                  <div class="bg-[#1a1a2a] rounded-lg p-3">
                    <p class="text-gray-400 text-sm mb-1">Quantidade</p>
                    <p class="text-white font-medium">{{ product.amount }}</p>
                  </div>
                  <div class="bg-[#1a1a2a] rounded-lg p-3">
                    <p class="text-gray-400 text-sm mb-1">Subtotal</p>
                    <p class="text-[#CF631C] font-bold">R$ {{ (product.price * product.amount).toFixed(2) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Total -->
            <div class="border-t border-[#2A2F4C] pt-4 mt-4">
              <div class="flex justify-between items-center bg-[#23263a] rounded-lg p-4">
                <div class="flex items-center gap-2">
                  <i class="fas fa-receipt text-[#CF631C]"></i>
                  <p class="text-white font-medium">Total</p>
                </div>
                <p class="text-[#CF631C] font-bold text-xl">
                  R$ {{sale?.products?.reduce((acc: number, curr: any) => acc + (curr.price * curr.amount),
                    0).toFixed(2)}}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SaleDetailsModal',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    sale: {
      type: Object,
      required: true
    }
  },
  emits: ['close']
})
</script> 