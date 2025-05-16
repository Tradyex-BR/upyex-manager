<template>
  <div v-if="meta" class="h-[42px] flex items-center justify-between mt-[12px] py-3" role="navigation" aria-label="Paginação">
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="font-inter text-[14px] font-medium leading-[18px] text-white">
          Mostrando
          <span class="font-medium">{{ meta.from }}</span>
          até
          <span class="font-medium">{{ meta.to }}</span>
          de
          <span class="font-medium">{{ meta.total }}</span>
          resultados
        </p>
      </div>
      <div>
        <nav class="inline-flex gap-1 -space-x-px rounded-md shadow-sm isolate" aria-label="Navegação de páginas">
          <!-- Botão Anterior -->
          <button
            v-if="meta.current_page > 1"
            @click="handlePageChange(meta.current_page - 1)"
            class="relative inline-flex items-center px-4 py-2 font-inter text-[14px] font-medium leading-[18px] text-white bg-[#1A1F3C] border border-[#1A1F3C] rounded-l-md hover:bg-[#1A1F3C]/50 transition-all duration-300 ease-in-out outline-none focus:outline-none focus:ring-0"
            aria-label="Página anterior"
          >
            Anterior
          </button>

          <!-- Números de Página -->
          <template v-for="(page, index) in getPageNumbers" :key="index">
            <button
              v-if="page !== '...'"
              @click="handlePageChange(Number(page))"
              :class="[
                'relative rounded-lg cursor-pointer inline-flex items-center px-4 py-2 font-inter text-[14px] font-medium leading-[18px] border transition-all duration-300 ease-in-out outline-none focus:outline-none focus:ring-0',
                page === meta.current_page
                  ? 'z-10 border-indigo-500 bg-indigo-600 text-white'
                  : 'border-[#1A1F3C] bg-[#1A1F3C] text-white hover:bg-[#1A1F3C]/50'
              ]"
              :aria-current="page === meta.current_page ? 'page' : undefined"
            >
              {{ page }}
            </button>
            <span
              v-else
              class="relative rounded-lg cursor-default inline-flex items-center px-4 py-2 font-inter text-[14px] font-medium leading-[18px] text-white border border-[#1A1F3C] bg-[#1A1F3C]"
            >
              ...
            </span>
          </template>

          <!-- Botão Próximo -->
          <button
            v-if="meta.current_page < meta.last_page"
            @click="handlePageChange(meta.current_page + 1)"
            class="relative inline-flex items-center px-4 py-2 font-inter text-[14px] font-medium leading-[18px] text-white bg-[#1A1F3C] border border-[#1A1F3C] rounded-r-md hover:bg-[#1A1F3C]/50 transition-all duration-300 ease-in-out outline-none focus:outline-none focus:ring-0"
            aria-label="Próxima página"
          >
            Próximo
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'

interface PaginationLink {
  url: string | null
  label: string
  active: boolean
}

interface PaginationMeta {
  current_page: number
  from: number
  last_page: number
  links?: PaginationLink[]
  path?: string
  per_page: number
  to: number
  total: number
}

const BasePagination = defineComponent({
  name: 'BasePagination',
  props: {
    meta: {
      type: Object as PropType<PaginationMeta>,
      required: true
    }
  },
  emits: ['page-change'],
  setup(props, { emit }) {
    const getPageNumbers = computed(() => {
      const pages: (number | string)[] = []
      const currentPage = props.meta.current_page
      const lastPage = props.meta.last_page
      const adjacentPages = 1 // Número de páginas adjacentes a mostrar

      // Sempre incluir primeira página
      pages.push(1)

      // Lógica para páginas antes da atual
      if (currentPage > 2 + adjacentPages) {
        pages.push('...')
      }
      for (let i = Math.max(2, currentPage - adjacentPages); i < currentPage; i++) {
        pages.push(i)
      }

      // Página atual
      if (currentPage !== 1 && currentPage !== lastPage) {
        pages.push(currentPage)
      }

      // Lógica para páginas depois da atual
      for (let i = currentPage + 1; i <= Math.min(lastPage - 1, currentPage + adjacentPages); i++) {
        pages.push(i)
      }
      if (currentPage < lastPage - adjacentPages - 1) {
        pages.push('...')
      }

      // Sempre incluir última página
      if (lastPage > 1) {
        pages.push(lastPage)
      }

      return pages
    })

    const handlePageChange = (page: number) => {
      emit('page-change', page)
    }

    return {
      getPageNumbers,
      handlePageChange
    }
  }
})

export default BasePagination
</script> 