<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div class="bg-[#23263a] rounded-lg p-8 w-full max-w-4xl relative">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8 border-b border-[#1A1F3C] pb-4">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-[#CF631C] flex items-center justify-center">
            <i class="fas fa-user text-white text-xl"></i>
          </div>
          <div>
            <h2 class="text-xl font-bold text-white">{{ customer?.nome }}</h2>
            <p class="text-gray-400 text-sm">{{ customer?.email }}</p>
          </div>
        </div>
        <button @click="$emit('close')" class="text-gray-400 hover:text-white transition-colors">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <!-- Status Badge -->
      <div class="mb-8">
        <span :class="[
          'px-4 py-2 rounded-full text-sm font-medium',
          customer?.status === 'Ativo'
            ? 'bg-green-500/20 text-green-500'
            : 'bg-red-500/20 text-red-500'
        ]">
          <i :class="[
            'fas mr-2',
            customer?.status === 'Ativo' ? 'fa-check-circle' : 'fa-ban'
          ]"></i>
          {{ customer?.status }}
        </span>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-2 gap-8 mb-8">
        <!-- Informações Básicas -->
        <div class="bg-[#1a1a2a] rounded-xl p-6">
          <h3 class="text-white text-lg font-semibold mb-6 flex items-center gap-2">
            <i class="fas fa-info-circle text-[#CF631C]"></i>
            Informações Básicas
          </h3>
          <div class="space-y-6">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-[#23263a] flex items-center justify-center">
                <i class="fas fa-building text-[#CF631C]"></i>
              </div>
              <div>
                <label class="text-gray-400 text-sm">Aplicação</label>
                <p class="text-white font-medium">{{ customer?.aplicacao }}</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-[#23263a] flex items-center justify-center">
                <i class="fas fa-handshake text-[#CF631C]"></i>
              </div>
              <div>
                <label class="text-gray-400 text-sm">Afiliado</label>
                <p class="text-white font-medium">{{ customer?.afiliado }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Informações de Acesso -->
        <div class="bg-[#1a1a2a] rounded-xl p-6">
          <h3 class="text-white text-lg font-semibold mb-6 flex items-center gap-2">
            <i class="fas fa-clock text-[#CF631C]"></i>
            Informações de Acesso
          </h3>
          <div class="space-y-6">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-[#23263a] flex items-center justify-center">
                <i class="fas fa-calendar-plus text-[#CF631C]"></i>
              </div>
              <div>
                <label class="text-gray-400 text-sm">Data de Cadastro</label>
                <p class="text-white font-medium">{{ customer?.dataCadastro }}</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-[#23263a] flex items-center justify-center">
                <i class="fas fa-history text-[#CF631C]"></i>
              </div>
              <div>
                <label class="text-gray-400 text-sm">Último Acesso</label>
                <p class="text-white font-medium">{{ customer?.ultimoAcesso }}</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-[#23263a] flex items-center justify-center">
                <i class="fas fa-link text-[#CF631C]"></i>
              </div>
              <div class="flex-1">
                <label class="text-gray-400 text-sm">Link da API</label>
                <div class="flex items-center gap-2 bg-[#23263a] rounded-lg p-2">
                  <p class="text-white font-medium truncate flex-1">{{ customer?.linkApi }}</p>
                  <button v-if="customer?.linkApi" @click="copyToClipboard(customer.linkApi)"
                    class="text-[#CF631C] hover:text-[#E67E22] transition-colors p-1">
                    <i class="fas fa-copy"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Ações -->
      <div class="bg-[#1a1a2a] rounded-xl p-6">
        <h3 class="text-white text-lg font-semibold mb-6 flex items-center gap-2">
          <i class="fas fa-cogs text-[#CF631C]"></i>
          Ações
        </h3>
        <div class="flex gap-4">
          <button @click="$emit('action', { type: 'bloquear', id: customer?.id })"
            class="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-colors"
            :class="customer?.status === 'Ativo' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'">
            <i :class="['fas', customer?.status === 'Ativo' ? 'fa-ban' : 'fa-unlock']"></i>
            {{ customer?.status === 'Ativo' ? 'Bloquear' : 'Desbloquear' }}
          </button>
          <button @click="$emit('action', { type: 'resetar_senha', id: customer?.id })"
            class="flex items-center gap-2 px-6 py-3 bg-[#CF631C] hover:bg-[#E67E22] rounded-lg text-white font-medium transition-colors">
            <i class="fas fa-key"></i>
            Resetar Senha
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface Usuario {
  id: string;
  nome: string;
  email: string;
  aplicacao: string;
  afiliado: string;
  status: string;
  dataCadastro: string;
  ultimoAcesso: string;
  linkApi: string;
  phone?: string;
  document_number?: string;
}

export default defineComponent({
  name: 'CustomerDetailModal',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    customer: {
      type: Object as () => Usuario | null,
      required: true
    }
  },
  emits: ['close', 'action'],
  methods: {
    async copyToClipboard(text: string) {
      try {
        await navigator.clipboard.writeText(text)
      } catch (e) {
        console.error('Erro ao copiar para a área de transferência:', e)
      }
    }
  }
})
</script> 