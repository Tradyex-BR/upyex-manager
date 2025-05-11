<template>
  <div class="w-full h-full bg-[#222A3F] p-8 rounded-lg">
    <div class="flex justify-between items-center">
      <div class="mb-8 gap-1 flex flex-col">
        <h3 class="text-white text-[20px] font-semibold leading-6">{{ title }}</h3>
        <p class="text-[#B8B8B8] font-inter text-[14px] leading-[18px]">{{ description }}</p>
      </div>
      <div>
        <slot name="actions"></slot>
      </div>
    </div>
    <div class="w-full h-[calc(100%-4rem)] flex items-center justify-center">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>

<style scoped>
.bg-\[\#2C2E3E\] {
  background-color: #2C2E3E;
}
</style>