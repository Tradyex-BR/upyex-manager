<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content bg-[#181C2F] rounded-[20px] p-10 w-full max-w-[420px] mx-auto shadow-xl relative flex flex-col">
      <button type="button" class="absolute top-6 right-6 text-[#8A8FA9] hover:text-white transition-colors" aria-label="Fechar" @click="$emit('close')">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
      <h2 class="text-[20px] font-semibold text-white mb-6 tracking-tight">Solicitar saque</h2>
      <div class="flex flex-col items-center mb-8">
        <span class="text-white text-[48px] font-bold leading-none">{{ displayAmount }}</span>
        <span class="text-[#B0B6C3] text-base mt-2">Saldo disponível: {{ displayBalance }}</span>
      </div>
      <form class="flex flex-col gap-6 flex-1" @submit.prevent="$emit('submit', { amount: amount || suggestedAmount, pixKey })">
        <div class="flex flex-col gap-2">
          <label class="text-[#8A8FA9] text-sm font-medium">Chave Pix</label>
          <div class="flex items-center bg-[#23284A] rounded-lg px-4 py-3 border border-transparent focus-within:border-[#CF631C]">
            <svg class="mr-2 text-[#CF631C]" width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" stroke="currentColor" stroke-width="1.5"/><path d="M8 11h8M8 15h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <input v-model="pixKey" type="text" class="w-full bg-transparent text-white outline-none text-base placeholder-[#8A8FA9]" placeholder="Digite a chave pix, email, cpf ou telefone" required />
          </div>
        </div>
        <button type="submit" class="w-full px-5 py-3 rounded-lg bg-[#E67E22] text-white font-bold text-lg hover:bg-[#cf631c] transition-colors">Solicitar saque</button>
      </form>
      <div class="mt-8 text-center text-[#B0B6C3] text-xs">
        By logging in I agree to the <span class="underline cursor-pointer">Terms of Service</span>
        <div class="flex items-center justify-center mt-2">
          <span class="mr-1">Protected by</span>
          <img src="https://privy.io/assets/privy-logo.svg" alt="privy" class="h-5 inline-block align-middle" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
const props = defineProps({
  suggestedAmount: {
    type: [String, Number],
    default: ''
  },
  availableBalance: {
    type: [String, Number],
    default: ''
  }
})
const amount = ref('')
const pixKey = ref('')
const displayAmount = computed(() => {
  if (props.suggestedAmount) {
    return Number(props.suggestedAmount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }
  return 'R$ 0,00'
})
const displayBalance = computed(() => {
  if (props.availableBalance) {
    return Number(props.availableBalance).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }
  return 'R$ 0,00'
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(24, 28, 47, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  backdrop-filter: blur(2px);
}
</style>
