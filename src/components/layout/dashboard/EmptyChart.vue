<script setup lang="ts">
import EmptyIcon from '@/components/icons/EmptyIcon.vue'
</script>

<template>
  <div class="flex flex-col gap-4 items-center justify-center w-full h-full min-h-[240px]">
    <div class="empty-icon">
      <EmptyIcon />
    </div>
    <p class="text-[#586CA2] font-inter text-[14px] font-medium leading-[18px]">Sem dados disponíveis</p>
  </div>
</template>

<style scoped>
.empty-icon {
  animation: subtleShake 1s ease-in-out;
}

@keyframes subtleShake {
  0% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-2px);
  }
  40% {
    transform: translateX(2px);
  }
  60% {
    transform: translateX(-1px);
  }
  80% {
    transform: translateX(1px);
  }
  100% {
    transform: translateX(0);
  }
}
</style>