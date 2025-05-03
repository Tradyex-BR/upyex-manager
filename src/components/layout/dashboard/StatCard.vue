<template>
  <div
    class="justify-between items-center bg-[#222A3F] flex min-w-60 flex-1 shrink basis-[0%] p-8 rounded-lg h-full"
    :class="{ 'border border-[#2C3652]': border }">
    <div class="self-stretch min-w-60 w-full flex-1 shrink basis-[0%] my-auto">
      <div class="flex w-full flex-col gap-[9px] items-stretch">
        <div class="font-inter text-[#B8B8B8] text-[14px] font-medium leading-[18px]">
          {{ label }}
        </div>
        <div class="text-white text-[24px] font-semibold leading-8">
          {{ value }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  value: string;
  label: string;
  border?: boolean;
}

withDefaults(defineProps<Props>(), {
  isPositive: true,
  period: 'Última semana',
  border: false
});
</script>
