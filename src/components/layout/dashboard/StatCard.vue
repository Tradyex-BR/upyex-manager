<template>
  <div class="justify-between items-center bg-[#222A3F] flex min-w-60 flex-1 shrink basis-[0%] p-8 rounded-lg max-md:px-5">
    <div class="self-stretch min-w-60 w-full flex-1 shrink basis-[0%] my-auto">
      <div class="text-white text-[32px] font-semibold leading-none">
        {{ value }}
      </div>
      <div class="flex w-full flex-col items-stretch mt-[9px]">
        <div class="font-inter text-[#B8B8B8] leading-5">
          {{ label }}
        </div>
        <div class="flex items-center gap-2 mt-2">
          <div :class="`items-center self-stretch flex gap-[3px] text-xs text-white font-normal whitespace-nowrap leading-none my-auto px-[5px] py-1 rounded-[5px] ${isPositive ? 'bg-emerald-500' : 'bg-red-500'}`">
            <svg :class="isPositive ? '' : 'rotate-45'" :alt="isPositive ? 'Increase icon' : 'Decrease icon'"  width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.0157 4.74683H9.49378C9.23128 4.74683 9.01253 4.96558 9.01253 5.22808C9.01253 5.49058 9.23128 5.70933 9.49378 5.70933H11.6594L8.8594 7.59058C8.75003 7.67808 8.5969 7.67808 8.46565 7.59058L5.57815 5.68745C5.11878 5.3812 4.55003 5.3812 4.09065 5.68745L0.721905 7.94058C0.503155 8.0937 0.43753 8.39995 0.590655 8.6187C0.678155 8.74995 0.83128 8.83745 1.00628 8.83745C1.09378 8.83745 1.20315 8.81558 1.26878 8.74995L4.6594 6.49683C4.76878 6.40933 4.92191 6.40933 5.05315 6.49683L7.94065 8.42183C8.40003 8.72808 8.96878 8.72808 9.42815 8.42183L12.5125 6.3437V8.77183C12.5125 9.03433 12.7313 9.25308 12.9938 9.25308C13.2563 9.25308 13.475 9.03433 13.475 8.77183V5.22808C13.5188 4.96558 13.2782 4.74683 13.0157 4.74683Z" fill="white"/>
            </svg>
            <div class="text-white font-inter text-[12px] leading-4 self-stretch my-auto">{{ percentChange }}</div>
          </div>
          <div class="text-[#B8B8B8] font-inter font-medium text-[14px] leading-[18px] my-auto">
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
