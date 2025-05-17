<template>
  <BaseModal title="Confirmar Exclusão" :show-footer="false" @close="$emit('update:modelValue', false)" :content-class="'gap-6'">
    <div class="flex flex-col gap-6">
      <div class="flex items-start gap-4">
        <div class="p-2 rounded-full bg-red-500/10">
          <font-awesome-icon icon="exclamation-triangle" class="w-6 h-6 text-red-500" />
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-white font-inter font-light leading-6">
            Tem certeza que deseja excluir o usuário <span class="font-medium text-red-400">{{ props.userName }}</span>?
          </p>
          <p class="text-[#B8B8B8] font-inter font-light leading-6">
            Esta ação não pode ser desfeita e todos os dados associados a este usuário serão permanentemente removidos.
          </p>
        </div>
      </div>

      <div class="flex gap-4 mt-2">
        <BaseButton variant="outline" class="flex-1" @click="$emit('update:modelValue', false)">
          Cancelar
        </BaseButton>
        <BaseButton variant="danger" class="flex-1" @click="$emit('submit')" :loading="loading">
          <font-awesome-icon icon="trash" class="w-4 h-4 mr-2" />
          Sim, excluir usuário
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '@/components/common/BaseModal.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { ref } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faExclamationTriangle, faTrash } from '@fortawesome/free-solid-svg-icons'

library.add(faExclamationTriangle, faTrash)

const props = defineProps<{
  modelValue: boolean
  userId: string
  userName: string
}>()

const loading = ref(false)

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit'): void
}>()
</script> 