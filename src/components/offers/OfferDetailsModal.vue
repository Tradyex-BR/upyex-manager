<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div class="bg-[#23263a] rounded-lg p-8 w-full max-w-4xl relative max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8 border-b border-[#2A2F4C] pb-4">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-[#CF631C] flex items-center justify-center">
            <i class="fas fa-box text-white text-xl"></i>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-white">{{ offer?.name }}</h2>
            <p class="text-2xl font-bold text-white">{{ offer?.description }}</p>
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
          offer?.is_active
            ? 'bg-green-500/20 text-green-500'
            : 'bg-red-500/20 text-red-500'
        ]">
          <i :class="['fas', offer?.is_active ? 'fa-check-circle' : 'fa-ban']"></i>
          {{ offer?.is_active ? 'Ativa' : 'Inativa' }}
        </span>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Informações Básicas -->
        <div class="bg-[#1a1a2a] rounded-xl p-6">
          <h3 class="text-white text-lg font-semibold mb-6 flex items-center gap-2">
            <i class="fas fa-info-circle text-[#CF631C]"></i>
            Informações Básicas
          </h3>
          <div class="space-y-6">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-[#23263a] flex items-center justify-center">
                <i class="fas fa-tag text-[#CF631C]"></i>
              </div>
              <div>
                <label class="text-gray-400 text-sm">Nome</label>
                <p class="text-white font-medium">{{ offer?.name }}</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-[#23263a] flex items-center justify-center">
                <i class="fas fa-align-left text-[#CF631C]"></i>
              </div>
              <div>
                <label class="text-gray-400 text-sm">Descrição</label>
                <p class="text-white font-medium">{{ offer?.description }}</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-[#23263a] flex items-center justify-center">
                <i class="fas fa-image text-[#CF631C]"></i>
              </div>
              <div>
                <label class="text-gray-400 text-sm">URL do Logo</label>
                <p class="text-white font-medium">{{ offer?.logo_url || 'Não definido' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Links -->
        <div class="bg-[#1a1a2a] rounded-xl p-6">
          <h3 class="text-white text-lg font-semibold mb-6 flex items-center gap-2">
            <i class="fas fa-link text-[#CF631C]"></i>
            Links
          </h3>
          <div class="space-y-6">
            <div>
              <label class="text-gray-400 text-sm mb-2 block">Link de Afiliado</label>
              <div class="flex items-center gap-2 bg-[#23263a] rounded-lg p-3">
                <p class="text-white font-medium break-all">{{ offer?.affiliate_link }}</p>
                <CopyButton :stringToCopy="offer?.affiliate_link" />
              </div>
            </div>
            <div>
              <label class="text-gray-400 text-sm mb-2 block">API Link</label>
              <div class="flex items-center gap-2 bg-[#23263a] rounded-lg p-3">
                <p class="text-white font-medium break-all">{{ offer?.links?.api }}</p>
                <CopyButton :stringToCopy="offer?.links?.api" />
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
import CopyButton from '@/components/common/CopyButton.vue'

export default defineComponent({
  name: 'OfferDetailsModal',
  components: {
    CopyButton
  },
  props: {
    show: {
      type: Boolean,
      required: true
    },
    offer: {
      type: Object,
      required: true
    }
  },
  emits: ['close']
})
</script> 