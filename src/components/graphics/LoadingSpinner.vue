<template>
  <div class="flex flex-col items-center justify-center">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    <p v-if="message" class="mt-2 text-gray-400">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message?: string;
}>();

defineOptions({
  name: 'LoadingSpinner'
});
</script>