<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'bg-[#CF631C] text-white font-bold py-2 px-4 rounded-lg transition-colors',
      'disabled:opacity-50',
      customClass
    ]"
    @click="$emit('click', $event)"
  >
    <slot v-if="!loading" />
    <span v-else>Carregando...</span>
  </button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  type?: 'button' | 'reset' | 'submit',
  disabled?: boolean,
  loading?: boolean,
  customClass?: string
}>()

defineEmits(['click'])
</script>
