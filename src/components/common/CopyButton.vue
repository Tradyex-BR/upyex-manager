<template>
  <button @click="handleCopy" class="p-0 transition-colors bg-transparent border-none outline-none"
    title="Copiar ID da Transação">
    <CopyIcon />
  </button>
</template>
<script setup lang="ts">
import CopyIcon from '@/components/icons/CopyIcon.vue'
import { useToast } from 'vue-toastification'

const toast = useToast()

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(props.stringToCopy)
    toast.success('ID copiado com sucesso!')
  } catch (err) {
    toast.error('Erro ao copiar ID')
    console.error('Erro ao copiar para a área de transferência:', err)
  }
}

const props = defineProps<{
  stringToCopy: string
}>()
</script>
