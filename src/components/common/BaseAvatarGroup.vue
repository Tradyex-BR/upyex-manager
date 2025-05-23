<template>
  <div class="flex -space-x-4 overflow-visible justify-center" style="overflow: visible !important;">
    <template v-for="(product, idx) in displayedProducts" :key="product.id">
      <div class="relative group" :style="hoveredIdx === idx ? 'z-index: 999;' : 'z-index: 10;'"
        @mouseenter="showTooltip(idx)" @mouseleave="hideTooltip" :ref="el => setAvatarRef(el, idx)">
        <img :src="getImageUrl(product.name)" :alt="product.name"
          class="w-[32px] h-[32px] rounded-full shadow object-cover cursor-pointer"
          @error="(e) => handleImageError(e, product.name)" />
      </div>
    </template>
    <div v-if="data.length > maxAvatars"
      class="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white text-xs font-semibold shadow">
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
        <div v-if="tooltip.product?.price">Preço: R$ {{ tooltip.product?.price?.toFixed(2) }}</div>
        <div v-if="tooltip.product?.amount">Qtd: {{ tooltip.product?.amount }}</div>
        <div v-if="tooltip.product?.description">{{ tooltip.product?.description }}</div>
        <div v-if="tooltip.product?.affiliate_count">Afiliados: {{ tooltip.product?.affiliate_count }}</div>
        <div v-if="tooltip.product?.is_active !== undefined">
          Status: {{ tooltip.product?.is_active ? 'Ativo' : 'Inativo' }}
        </div>
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
  price?: number
  amount?: number
  description?: string
  logo_url?: string | null
  base_affiliate_link?: string
  api_secret?: string
  is_active?: boolean
  affiliate_count?: number
  created_at?: string
  updated_at?: string
  links?: {
    api: string
    frontend: string
  }
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

    const showTooltip = async (idx: number) => {
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