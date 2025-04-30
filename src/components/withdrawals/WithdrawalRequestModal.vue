<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content bg-[#181C2F] rounded-[20px] p-10 w-full max-w-[420px] mx-auto shadow-xl relative">
      <button type="button" class="absolute top-6 right-6 text-[#8A8FA9] hover:text-white transition-colors" aria-label="Fechar" @click="$emit('close')">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
      <h2 class="text-[22px] font-bold text-white mb-8 tracking-tight">Solicitar saque</h2>
      <form class="flex flex-col gap-6" @submit.prevent="$emit('submit', { amount, pixKey })">
        <div class="flex flex-col gap-2">
          <label class="text-[#8A8FA9] text-sm font-medium">Valor do saque</label>
          <input v-model="amount" type="number" min="1" step="any" class="w-full rounded-lg px-4 py-3 bg-[#23284A] text-white outline-none border border-transparent focus:border-[#6C63FF] transition-all text-base placeholder-[#8A8FA9]" placeholder="Digite o valor" required />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-[#8A8FA9] text-sm font-medium">Chave Pix</label>
          <input v-model="pixKey" type="text" class="w-full rounded-lg px-4 py-3 bg-[#23284A] text-white outline-none border border-transparent focus:border-[#6C63FF] transition-all text-base placeholder-[#8A8FA9]" placeholder="Digite sua chave Pix" required />
        </div>
        <div class="flex justify-end gap-3 mt-2">
          <button type="button" class="px-5 py-2.5 rounded-lg border border-[#353A5A] bg-transparent text-[#8A8FA9] font-semibold hover:bg-[#23284A] hover:text-white transition-colors" @click="$emit('close')">Cancelar</button>
          <button type="submit" class="px-5 py-2.5 rounded-lg bg-[#6C63FF] text-white font-bold hover:bg-[#5548c8] transition-colors">Solicitar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const amount = ref('')
const pixKey = ref('')
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(24, 28, 47, 0.75); /* Mais escuro e fiel ao Figma */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  backdrop-filter: blur(2px);
}
</style>
