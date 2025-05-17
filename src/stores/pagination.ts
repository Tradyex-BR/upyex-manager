import { defineStore } from 'pinia'
import { ref, onMounted, onBeforeUnmount } from 'vue'

export const usePaginationStore = defineStore('pagination', () => {
  const windowHeight = ref(window.innerHeight)
  const perPage = ref(10)

  const calculateItemsPerPage = () => {
    // Altura aproximada de cada linha da tabela (em pixels)
    const rowHeight = 60
    // Altura do cabeçalho da tabela
    const tableHeaderHeight = 42
    // Altura do título da página
    const pageTitleHeight = 48
    // Altura da paginação
    const paginationHeight = 48
    // Altura do TopBar
    const topBarHeight = 80
    // Padding do main (32px em cima e 32px embaixo)
    const mainPadding = 64
    // Margem entre elementos
    const margins = 24
    // Altura disponível para a tabela
    const availableHeight = windowHeight.value - 
      topBarHeight - 
      tableHeaderHeight - 
      pageTitleHeight - 
      paginationHeight - 
      mainPadding - 
      margins

    // Calcula quantas linhas cabem na tela
    const rowsPerPage = Math.floor(availableHeight / rowHeight)
    // Define um mínimo de 5 e máximo de 50 itens por página
    perPage.value = Math.max(5, Math.min(50, rowsPerPage))
  }

  const handleResize = () => {
    windowHeight.value = window.innerHeight
    calculateItemsPerPage()
  }

  onMounted(() => {
    calculateItemsPerPage()
    window.addEventListener('resize', handleResize)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
  })

  return {
    perPage
  }
}) 