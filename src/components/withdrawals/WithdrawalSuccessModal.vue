<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content bg-[#181C2F] rounded-xl p-8 w-full max-w-md mx-auto flex flex-col items-center">
      <svg class="mb-4" width="56" height="56" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="28" cy="28" r="28" fill="#22C55E" fill-opacity="0.15"/><path d="M18 29.5L25 36.5L38 23.5" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <h2 class="text-2xl font-bold text-white mb-2">Saque solicitado!</h2>
      <p class="text-white mb-6 text-center">Seu pedido de saque foi enviado com sucesso.<br/>Aguarde a confirmação do pagamento.</p>
      <button @click="$emit('close')" class="px-4 py-2 rounded bg-primary text-white font-bold hover:bg-primary-dark">Fechar</button>
    </div>
  </div>
</template>

<script setup lang="ts">
// Apenas modal de exibição
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}
</style>
