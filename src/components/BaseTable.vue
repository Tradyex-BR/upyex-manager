<template>
  <table class="w-full text-white border-collapse">
    <thead>
      <tr class="bg-[#1A1F3C]">
        <th v-for="header in headers" :key="header.key" 
            :class="[
              'p-4 font-inter text-[14px] font-medium leading-[18px] text-white',
              header.align === 'center' ? 'text-center' : 'text-left'
            ]">
          {{ header.label }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in items" :key="index" class="border-b border-[#1A1F3C]">
        <td v-for="header in headers" :key="header.key"
            :class="[
              'p-4 font-inter text-[14px] font-normal leading-[18px] text-white',
              header.align === 'center' ? 'text-center' : 'text-left'
            ]">
          <slot :name="header.key" :item="item">
            {{ item[header.key] }}
          </slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
interface Header {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
}

defineProps<{
  headers: Header[];
  items: any[];
}>();
</script> 