<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content bg-[#181C2F] rounded-xl p-8 w-full max-w-md mx-auto">
      <h2 class="text-2xl font-bold text-white mb-6">Solicitar Saque</h2>
      <form @submit.prevent="$emit('submit', { amount, pixKey })">
        <div class="mb-4">
          <label class="block text-white mb-2">Valor do Saque</label>
          <input v-model="amount" type="number" min="1" step="any" class="w-full rounded-md px-3 py-2 bg-[#23284A] text-white outline-none" placeholder="Digite o valor" required />
        </div>
        <div class="mb-6">
          <label class="block text-white mb-2">Chave Pix</label>
          <input v-model="pixKey" type="text" class="w-full rounded-md px-3 py-2 bg-[#23284A] text-white outline-none" placeholder="Digite sua chave Pix" required />
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" @click="$emit('close')" class="px-4 py-2 rounded bg-[#23284A] text-white hover:bg-[#2A2F4C]">Cancelar</button>
          <button type="submit" class="px-4 py-2 rounded bg-primary text-white font-bold hover:bg-primary-dark">Solicitar</button>
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
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}
</style>
