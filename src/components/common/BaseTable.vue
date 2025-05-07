<template>
  <div class="animate-fade-in w-full">
    <table class="w-full text-white border-collapse">
      <thead>
        <tr class="bg-[#1A1F3C]">
          <th v-for="header in headers" :key="header.key" 
              :class="[
                'h-[42px] py-3 px-4 font-inter text-[14px] font-medium leading-[18px] text-white transition-all duration-300 ease-in-out',
                header.align === 'center' ? 'text-center' : 'text-left'
              ]">
            {{ header.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items" :key="index" 
            class="max-h-[60px] border-b border-[#1A1F3C] transition-all duration-300 ease-in-out hover:bg-[#1A1F3C]/50"
            :style="{ animationDelay: `${index * 50}ms` }">
          <td v-for="header in headers" :key="header.key"
              :class="[
                'max-h-[60px] p-3 font-inter text-[14px] font-normal leading-[18px] text-white transition-all duration-300 ease-in-out',
                header.align === 'center' ? 'text-center' : 'text-left'
              ]">
            <slot :name="header.key" :item="item">
              {{ item[header.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
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

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

tr {
  animation: slideIn 0.3s ease-out forwards;
  opacity: 0;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 