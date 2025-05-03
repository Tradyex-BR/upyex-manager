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
    <div v-else class="flex items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
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
