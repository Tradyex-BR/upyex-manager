<template>
  <button 
    type="button" 
    :aria-label="isVisible ? 'Ocultar senha' : 'Mostrar senha'"
    class="p-0 bg-transparent border-none outline-none transition-all duration-300 focus:outline-none focus:ring-0 ring-0"
    @click="$emit('toggle')"
  >
    <FontAwesomeIcon 
      :icon="isVisible ? 'eye-slash' : 'eye'"
      class="text-[#B8B8B8] text-lg"
    />
  </button>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@/plugins/fontawesome'

defineProps<{
  isVisible: boolean
}>()

defineEmits<{
  (e: 'toggle'): void
}>()
</script> 