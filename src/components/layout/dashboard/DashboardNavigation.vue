<template>
  <div class="mt-4 flex items-center justify-start gap-4">
    <button 
      v-for="item in navigationItems" 
      :key="item.id"
      @click="$emit('update:modelValue', item.id)"
      :class="[
        'px-4 py-2 rounded-lg transition-colors',
        modelValue === item.id 
          ? 'bg-blue-500 text-white' 
          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
      ]"
    >
      {{ item.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface NavigationItem {
  id: string;
  label: string;
}

const props = defineProps<{
  modelValue: string;
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const navigationItems: NavigationItem[] = [
  { id: 'cards', label: 'Dashboard' },
  { id: 'list', label: 'Lista' }
];
</script> 