<template>
  <button :type="type" :disabled="disabled || loading" :class="[
    'flex items-center justify-center gap-3',
    'py-2 px-4 rounded',
    'font-inter text-sm font-bold leading-6',
    'transition-all duration-200',
    'disabled:bg-[#444c5a] disabled:opacity-50 disabled:cursor-not-allowed',
    sizeClasses[size || 'md'],
    variantClasses[variant || 'primary'],
    customClass
  ]" @click="$emit('click', $event)">
    <slot name="icon" />
    <slot v-if="!loading" />
    <div v-else class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-current"></div>
  </button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
type ButtonSize = 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{
  type?: 'button' | 'reset' | 'submit',
  disabled?: boolean,
  loading?: boolean,
  customClass?: string,
  variant?: ButtonVariant,
  size?: ButtonSize
}>(), {
  type: 'button',
  disabled: false,
  loading: false,
  variant: 'primary',
  size: 'md'
})

const variantClasses = {
  primary: 'bg-[#CF631C] text-[#F7F7F8] hover:bg-[#B5520A] active:bg-[#A34709]',
  secondary: 'bg-[#162F65] text-[#F7F7F8] hover:bg-[#1A3A7A] active:bg-[#1E448F]',
  outline: 'text-white bg-[#131836] hover:bg-[#1e2642] active:bg-[#162F65]/20',
  ghost: 'text-[#F7F7F8] hover:bg-white/5 active:bg-white/10',
  danger: 'bg-red-600 text-[#F7F7F8] hover:bg-red-700 active:bg-red-800',
  success: 'bg-green-600 text-[#F7F7F8] hover:bg-green-700 active:bg-green-800'
}

const sizeClasses = {
  sm: 'text-xs py-1.5 px-3',
  md: 'text-sm py-2 px-4',
  lg: 'text-base py-2.5 px-5'
}

defineEmits(['click'])
</script>
