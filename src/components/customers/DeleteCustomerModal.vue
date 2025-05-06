<template>
  <BaseModal title="Excluir Cliente" @close="$emit('close')">
    <div class="flex flex-col items-center gap-6 py-4">
      <div class="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
        <FontAwesomeIcon icon="exclamation-triangle" class="text-red-500 text-2xl" />
      </div>
      
      <div class="text-center">
        <h3 class="text-white text-lg font-medium mb-2">Confirmação de exclusão</h3>
        <p class="text-gray-300 text-base">
          Tem certeza que deseja excluir este cliente?
        </p>
        <p class="text-gray-400 text-sm mt-2">
          Esta ação não poderá ser desfeita.
        </p>
      </div>
      
      <div v-if="clientInfo" class="w-full p-4 bg-[#131836] rounded-lg border border-[#1e2642]">
        <div class="flex flex-col gap-1">
          <div class="flex justify-between">
            <span class="text-gray-400 text-sm">Nome:</span>
            <span class="text-white text-sm font-medium">{{ clientInfo.nome }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400 text-sm">Email:</span>
            <span class="text-white text-sm font-medium">{{ clientInfo.email }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400 text-sm">ID:</span>
            <span class="text-white text-sm font-medium">{{ clientInfo.id }}</span>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-5 mt-4">
        <button 
          type="button" 
          @click="$emit('close')"
          class="px-5 py-3 h-12 bg-[#131836] border border-[#1e2642] hover:bg-[#1e2642] rounded-lg text-white font-medium transition-colors">
          Cancelar
        </button>
        <button 
          type="button" 
          @click="$emit('confirm')"
          class="px-5 py-3 h-12 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors">
          Excluir Cliente
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import BaseModal from '@/components/common/BaseModal.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

defineProps({
  clientInfo: {
    type: Object,
    default: null
  }
});

defineEmits(['close', 'confirm']);
</script> 