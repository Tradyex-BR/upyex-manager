<template>
  <div class="justify-between items-center bg-[#222A3F] flex min-w-60 flex-1 shrink basis-[0%] p-8 rounded-lg max-md:px-5">
    <div class="self-stretch min-w-60 w-full flex-1 shrink basis-[0%] my-auto">
      <div class="text-white text-[32px] font-semibold leading-none">
        {{ value }}
      </div>
      <div class="flex w-full flex-col items-stretch mt-[9px]">
        <div class="text-[#B8B8B8] text-base font-medium leading-none">
          {{ label }}
        </div>
        <div class="flex items-center gap-2 mt-2">
          <div class="items-center bg-emerald-500 self-stretch flex gap-[3px] text-xs text-white font-normal whitespace-nowrap leading-none my-auto px-[5px] py-1 rounded-[5px]">
            <img
              :src="isPositive ? 'https://cdn.builder.io/api/v1/image/assets/7f72b52c1e064ab59dcec351fcad2273/7bcf96ecbe4c8df02cc9f803822fda5fbd0d2cac?placeholderIfAbsent=true' : 'https://cdn.builder.io/api/v1/image/assets/7f72b52c1e064ab59dcec351fcad2273/00cdf3990045db1d91fb232fa1dcd26b380aabec?placeholderIfAbsent=true'"
              class="aspect-[1] object-contain w-3.5 self-stretch shrink-0 my-auto"
              :alt="isPositive ? 'Increase icon' : 'Decrease icon'"
            />
            <div class="self-stretch my-auto">{{ percentChange }}</div>
          </div>
          <div class="text-[#B8B8B8] text-sm font-medium leading-none self-stretch my-auto">
            {{ period }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  value: string;
  label: string;
  percentChange: string;
  isPositive?: boolean;
  period?: string;
}

withDefaults(defineProps<Props>(), {
  isPositive: true,
  period: 'Última semana'
});
</script>
