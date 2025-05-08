<template>
  <div class="mt-6 flex items-center justify-start gap-4">
    <button 
      v-for="(item, index) in navigationItems" 
      :key="item.id"
      @click="$emit('update:modelValue', item.id)"
      :class="[
        'nav-btn text-[14px] font-inter leading-[18px] relative px-4 py-2 rounded-lg transition-colors bg-transparent outline-none border-none',
        modelValue === item.id ? 'active' : '',
        role === 'affiliate' && index === 1 ? 'hidden' : ''
      ]"
    >
      {{ item.label }}
      <div v-if="modelValue === item.id" class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[120px]">
        <svg xmlns="http://www.w3.org/2000/svg" width="120" height="33" viewBox="0 0 120 33" fill="none">
          <g filter="url(#filter0_f_73_1252)">
            <ellipse cx="59.8125" cy="32.5" rx="60.9375" ry="2.4375" fill="#397DFF"/>
          </g>
          <path d="M-28.875 32.6875H148.875" stroke="url(#paint0_linear_73_1252)" stroke-width="0.75"/>
          <defs>
            <filter id="filter0_f_73_1252" x="-31.125" y="0.0625" width="181.875" height="64.875" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
              <feFlood flood-opacity="0" result="BackgroundImageFix"/>
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
              <feGaussianBlur stdDeviation="15" result="effect1_foregroundBlur_73_1252"/>
            </filter>
            <linearGradient id="paint0_linear_73_1252" x1="-28.875" y1="33.1875" x2="148.875" y2="33.1875" gradientUnits="userSpaceOnUse">
              <stop offset="0.0628151" stop-color="#111113" stop-opacity="0"/>
              <stop offset="0.555" stop-color="#397DFF"/>
              <stop offset="1" stop-color="#111113" stop-opacity="0"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
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

const role = localStorage.getItem('contextRole')
const navigationItems: NavigationItem[] = [
  { id: 'cards', label: 'Visão Geral' },
  { id: 'list', label: role === 'manager' ? 'Análise' : 'Vendas' }
];
</script>

<style scoped>
.nav-btn {
  transition: color 0.3s ease-in-out;
  cursor: pointer;
  color: #666;
  outline: none;
}

.nav-btn:focus {
  outline: none;
  box-shadow: none;
}

.nav-btn:hover {
  color: #2196f3;
}

.nav-btn.active {
  color: #2196f3;
}

/* Removendo os estilos anteriores do ::after já que agora usamos o SVG */
.nav-btn::after,
.nav-btn.active::after {
  display: none;
}
</style> 