<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content bg-[#181C2F] rounded-[20px] p-10 w-full max-w-[420px] mx-auto shadow-xl relative flex flex-col items-center">
      <!-- Botão voltar -->
      <button type="button" class="absolute top-6 left-6 text-[#8A8FA9] hover:text-white transition-colors" aria-label="Voltar" @click="$emit('close')">
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <!-- Botão fechar -->
      <button type="button" class="absolute top-6 right-6 text-[#8A8FA9] hover:text-white transition-colors" aria-label="Fechar" @click="$emit('close')">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
      <!-- Ícone de sucesso -->
      <div class="flex flex-col items-center justify-center mt-6 mb-8">
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="36" cy="36" r="36" fill="none"/>
          <path d="M24 37.5L33 46.5L48 28.5" stroke="#22C55E" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="flex flex-col items-center text-center mb-8">
        <span class="text-white text-xl font-bold mb-2">Solicitação de saque enviada com sucesso</span>
        <span class="text-[#B0B6C3] text-base">Em até 2 horas o valor será aprovado e possivelmente enviar em sua conta</span>
      </div>
      <div class="w-full border-t border-[#23263a] pt-6 mt-auto">
        <div class="flex items-center justify-center text-[#B0B6C3] text-xs">
          Protected by
          <img src="https://privy.io/assets/privy-logo.svg" alt="privy" class="h-5 ml-2 inline-block align-middle" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Nenhuma lógica extra por enquanto
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
