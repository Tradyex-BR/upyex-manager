<template>
  <div class="flex -space-x-4 overflow-visible" style="overflow: visible !important;">
    <template v-for="(product, idx) in displayedProducts" :key="product.id">
      <div class="relative group" :style="hoveredIdx === idx ? 'z-index: 999;' : 'z-index: 10;'"
        @mouseenter="showTooltip(idx, $event)" @mouseleave="hideTooltip" :ref="el => setAvatarRef(el, idx)">
        <img :src="getImageUrl(product.name)" :alt="product.name"
          class="w-[32px] h-[32px] rounded-full shadow object-cover cursor-pointer"
          @error="(e) => handleImageError(e, product.name)" />
      </div>
    </template>
    <div v-if="data.length > maxAvatars"
      class="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white text-xs font-semibold shadow">
      +{{ data.length - maxAvatars }}
    </div>
    <teleport to="body">
      <div v-if="tooltip.visible" :style="{
        position: 'fixed',
        top: tooltip.y + 'px',
        left: tooltip.x + 'px',
        minWidth: '120px',
        zIndex: 2000,
        pointerEvents: 'none',
      }" class="px-3 py-2 rounded bg-gray-900 text-white text-xs whitespace-nowrap shadow-lg transition opacity-100">
        <div><span class="font-semibold">{{ tooltip.product?.name }}</span></div>
        <div>Preço: R$ {{ tooltip.product?.price.toFixed(2) }}</div>
        <div>Qtd: {{ tooltip.product?.amount }}</div>
      </div>
    </teleport>
  </div>
</template>

<script lang="ts">
import { getImageUrl, handleImageError } from '@/utils/imageUtils'
import { defineComponent, computed, PropType, ref, nextTick } from 'vue'
import type { ComponentPublicInstance } from 'vue'

interface Product {
  id: string
  name: string
  price: number
  amount: number
}

export default defineComponent({
  name: 'BaseAvatarGroup',
  props: {
    data: {
      type: Array as PropType<Product[]>,
      required: true
    }
  },
  setup(props) {
    const maxAvatars = 5
    const displayedProducts = computed(() => props.data.slice(0, maxAvatars))
    const hoveredIdx = ref<number | null>(null)
    const avatarRefs = ref<HTMLElement[]>([])
    const setAvatarRef = (el: Element | ComponentPublicInstance | null, idx: number) => {
      if (el instanceof HTMLElement) avatarRefs.value[idx] = el
    }
    const tooltip = ref({
      visible: false,
      x: 0,
      y: 0,
      product: null as Product | null
    })

    const showTooltip = async (idx: number, event: MouseEvent) => {
      hoveredIdx.value = idx
      await nextTick()
      const el = avatarRefs.value[idx]
      if (el) {
        const rect = el.getBoundingClientRect()
        tooltip.value = {
          visible: true,
          x: rect.left + rect.width / 2,
          y: rect.bottom + 8, // 8px abaixo do avatar
          product: displayedProducts.value[idx]
        }
      }
    }
    const hideTooltip = () => {
      tooltip.value.visible = false
      hoveredIdx.value = null
    }

    return { displayedProducts, maxAvatars, hoveredIdx, avatarRefs, setAvatarRef, tooltip, showTooltip, hideTooltip, getImageUrl, handleImageError }
  }
})
</script>

<style scoped>
.group:hover .group-hover\:opacity-100 {
  opacity: 1 !important;
}
</style>