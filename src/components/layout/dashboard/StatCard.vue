<template>
  <div
    class="justify-between items-center bg-[#222A3F] flex min-w-60 flex-1 shrink basis-[0%] p-8 rounded-lg max-md:px-5">
    <div class="self-stretch min-w-60 w-full flex-1 shrink basis-[0%] my-auto">
      <div class="text-white text-[32px] font-semibold leading-none">
        {{ value }}
      </div>
      <div class="flex w-full flex-col items-stretch mt-[9px]">
        <div class="font-inter text-[#B8B8B8] leading-5">
          {{ label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  value: string;
  label: string;
}

withDefaults(defineProps<Props>(), {
  isPositive: true,
  period: 'Última semana'
});
</script>
