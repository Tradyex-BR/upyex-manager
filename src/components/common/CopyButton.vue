<template>
  <button @click="handleCopy"
    class="p-0 transition-colors bg-transparent border-none outline-none focus:outline-none focus:ring-0 ring-0 w-[25px] h-[25px] flex items-center justify-center"
    :title="alt ? `Copiar ${alt}` : 'Copiar'"
  >
    <CopyIcon v-if="!copied" class="w-[25px] h-[25px]" />
    <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-[25px] h-[25px] text-green-500" viewBox="0 0 20 20"
      fill="currentColor">
      <path fill-rule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clip-rule="evenodd" />
    </svg>
  </button>
</template>
<script setup lang="ts">
import CopyIcon from '@/components/icons/CopyIcon.vue'
import { notificationService } from '@/services/notificationService'
import { ref } from 'vue'
import { logger } from '@/config/logger'

const copied = ref(false)

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(props.stringToCopy)
    copied.value = true
    notificationService.success(`${props.alt ? props.alt : 'ID'} copiado com sucesso!`)

    // Resetar o estado após 2 segundos
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    logger.error('Erro ao copiar para a área de transferência:', err)
    notificationService.error('Erro ao copiar para a área de transferência')
  }
}

const props = defineProps<{
  stringToCopy: string
  alt?: string  
}>()
</script>
