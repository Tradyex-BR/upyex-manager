<template>
  <div class="flex flex-col gap-1 w-full">
    <label v-if="label" class="flex items-center gap-0.5 text-sm font-medium" :class="[
      variant === 'dark' || variant === 'darker' ? 'text-white' : 'text-[rgba(4,13,37,1)]'
    ]">
      <span :class="variant === 'dark' || variant === 'darker' ? 'text-white' : 'text-[#040D25]'" class="text-[14px] font-medium leading-5">{{ label }}</span>
      <span v-if="required" class="text-[#BE3E37] font-inter text-[14px] leading-5 font-medium">*</span>
    </label>
    <div 
      class="flex items-center border gap-2 px-3 py-4 rounded-lg"
      :class="[
        variant === 'dark' 
          ? 'bg-[#131836] border-[#1e2642] focus-within:border-[#3b4167]' 
          : variant === 'darker'
            ? 'bg-[#0a0e1c] border-[#1e2642] focus-within:border-[#3b4167]'
            : 'border-solid border-[#B8B8B8]',
        { 'border-red-500': error },
        customClass
      ]"
    >
      <slot name="prefix"></slot>
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :type="type"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :class="[
          'flex-1 outline-none font-inter leading-5',
          variant === 'dark' || variant === 'darker'
            ? 'bg-transparent text-white placeholder:text-[#CACACA]' 
            : 'bg-transparent text-[#222A3F]'
        ]"
      />
      <slot name="suffix"></slot>
    </div>
    <span v-if="error" class="text-red-500 text-sm">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'light',
    validator: (value: string) => ['light', 'dark', 'darker'].includes(value)
  },
  customClass: {
    type: String,
    default: 'h-[56px]'
  }
})

defineEmits(['update:modelValue'])
</script> 