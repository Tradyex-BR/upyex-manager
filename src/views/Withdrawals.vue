<script lang="ts">
import { defineAsyncComponent, defineComponent, ref, watch, computed, onMounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import { managerService } from '@/services/managerService'
import { logger } from '@/config/logger'
import Sidebar from '@/components/layout/dashboard/Sidebar.vue'
import TopBar from '@/components/layout/dashboard/TopBar.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout.vue'
import WithdrawalRequestModal from '@/components/withdrawals/WithdrawalRequestModal.vue'
import WithdrawalSuccessModal from '@/components/withdrawals/WithdrawalSuccessModal.vue'
import RedirectIcon from '@/components/icons/RedirectIcon.vue'
import MenuIcon from '@/components/icons/MenuIcon.vue'
import BaseDropdown from '@/components/common/BaseDropdown.vue'
import BaseTable from '@/components/common/BaseTable.vue'
import BasePagination from '@/components/common/BasePagination.vue'
import { notificationService } from '@/services/notificationService'
import { usePaginationStore } from '@/stores/pagination'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

import { ListWithdrawalsResponse } from '@/services/managerService'
import { CONTEXT_ROLE_KEY, PAGINATION } from '@/config/constants'

const CheckIcon = defineAsyncComponent(() => import('@/components/icons/CheckIcon.vue'))
const XIcon = defineAsyncComponent(() => import('@/components/icons/XIcon.vue'))

// Dados mockados para testes
const MOCK_WITHDRAWALS: ListWithdrawalsResponse = {
  data: [],
  total: 0,
  page: 1,
  per_page: PAGINATION.DEFAULT_PAGE_SIZE,
  links: {
    first: '',
    last: '',
    prev: null,
    next: null
  },
  meta: {
    current_page: 1,
    from: 1,
    last_page: 1,
    path: '',
    to: 1,
    total: 0,
    links: [],
    per_page: PAGINATION.DEFAULT_PAGE_SIZE
  }
}

// Flag para controlar se usa dados mockados
const USE_MOCK_DATA = false

export default defineComponent({
  name: 'Withdrawals',
  props: {
    searchTerm: {
      type: String,
      default: ''
    }
  },
  components: {
    Sidebar,
    TopBar,
    BaseButton,
    AuthenticatedLayout,
    WithdrawalRequestModal,
    WithdrawalSuccessModal,
    RedirectIcon,
    MenuIcon,
    BaseDropdown,
    BaseTable,
    BasePagination,
    BaseModal: defineAsyncComponent(() => import('@/components/common/BaseModal.vue')),
    BaseInput: defineAsyncComponent(() => import('@/components/common/BaseInput.vue'))
  },
  setup() {
    const store = useDashboardStore()
    const router = useRouter()
    const authStore = useAuthStore()
    const toast = useToast()
    const loading = ref(true)
    const withdrawals = ref<any[]>([])
    const searchQuery = ref('')
    const paginationStore = usePaginationStore()
    const pagination = ref({
      current_page: 1,
      from: 1,
      last_page: 1,
      per_page: paginationStore.perPage,
      to: 1,
      total: 0
    })

    watch(() => authStore.isAuthenticated, (isAuthenticated) => {
      if (!isAuthenticated) {
        router.push('/login')
      }
    })

    watch(() => paginationStore.perPage, (newValue) => {
      pagination.value.per_page = newValue
      handleSearch(searchQuery.value, pagination.value.current_page)
    })

    const handleSearch = async (term: string, page: number = 1) => {
      loading.value = true
      try {
        const response = await managerService.withdrawals.list({
          search: term,
          page: page,
          per_page: paginationStore.perPage,
          sort_by: 'created_at',
          sort_order: 'desc',
          start_date: '',
          end_date: '',
          status: null,
          method: null
        })
        withdrawals.value = response.data || []
        if (response.meta) {
          pagination.value = response.meta
        }
      } catch (e) {
        logger.error('Erro ao buscar saques:', e)
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      handleSearch('')
      if (role.value === "affiliate") {
        loadWithdrawalInfo()
      }
    })

    const role = ref(localStorage.getItem(CONTEXT_ROLE_KEY))
    const showRequestModal = ref(false)
    const showSuccessModal = ref(false)
    const lastWithdrawalAmount = ref('')
    const lastWithdrawalPixKey = ref('')
    const withdrawalInfo = ref({
      minimum_amount: 0,
      maximum_amount: 0,
      daily_limit: 0,
      withdrawals_today: 0,
      current_balance: 0
    })
    const dropdownOptions = ref([
      {
        text: 'Aprovar',
        action: 'aprovar',
        role: 'manager'
      },
      {
        text: 'Bloquear',
        action: 'bloquear',
        role: 'manager'
      },
      {
        text: 'Cancelar',
        action: 'cancelar',
        role: 'affiliate'
      }
    ])
    const withdrawalAmount = ref('')
    const selectedMethod = ref('')
    const destination = ref('')
    const showModal = ref(false)

    const filteredDropdownOptions = computed(() => {
      if (!role.value) return []
      return dropdownOptions.value.filter(option => option.role === role.value)
    })

    const handleWithdrawalRequest = async (data: { amount: string, pixKey: string }) => {
      try {
        lastWithdrawalAmount.value = data.amount
        lastWithdrawalPixKey.value = data.pixKey

        await managerService.withdrawals.request({
          amount: Number(lastWithdrawalAmount.value.replace(/[^0-9]/g, '')) / 100,
          method: 'pix',
          destination: lastWithdrawalPixKey.value
        })

        showRequestModal.value = false
        showSuccessModal.value = true
        await handleSearch(searchQuery.value)
      } catch (error) {
        logger.error('Erro ao solicitar saque:', error)
      }
    }

    const getStatusClass = (status: string): string => {
      const baseClass = 'font-inter text-[14px] font-medium leading-[18px] inline-flex h-6 px-2 justify-center items-center gap-1 rounded-[6px] w-fit mx-auto'
      switch (status) {
        case 'Aprovado':
          return `${baseClass} bg-green-500/20 text-green-500`
        case 'Rejeitado':
          return `${baseClass} bg-red-500/20 text-red-500`
        case 'Processado':
          return `${baseClass} bg-green-500/20 text-green-500`
        case 'Cancelado':
          return `${baseClass} bg-red-500/20 text-red-500`
        case 'Processando':
          return `${baseClass} bg-blue-500/20 text-blue-500`
        default: // Solicitação
          return `${baseClass} bg-yellow-500/20 text-yellow-500`
      }
    }

    const handleAction = async (action: string, id: string) => {
      try {
        if (action === 'aprovar') {
          logger.info('Aprovando saque:', id)
          await managerService.withdrawals.approve(id)
        } else if (action === 'bloquear') {
          logger.info('Rejeitando saque:', id)
          await managerService.withdrawals.reject(id)
        } else if (action === 'cancelar') {
          logger.info('Cancelando saque:', id)
          await managerService.withdrawals.cancel(id)
        }

        await handleSearch(searchQuery.value)
      } catch (error) {
        logger.error('Erro ao executar ação no saque:', error)
      }
    }

    const goToPageByUrl = (url: string) => {
      // Extrai o número da página da URL e chama goToPage
      const match = url && url.match(/page=(\d+)/)
      if (match && match[1]) {
        goToPage(Number(match[1]))
      }
    }

    const goToPage = async (page: number) => {
      if (page < 1 || page > pagination.value.last_page) return
      pagination.value.current_page = page
      await handleSearch(searchQuery.value, page)
    }

    const translateStatus = (status: string): string => {
      const statusMap: { [key: string]: string } = {
        'requested': 'Solicitado',
        'approved': 'Aprovado',
        'rejected': 'Rejeitado',
        'processing': 'Processando',
        'processed': 'Processado',
        'cancelled': 'Cancelado'
      }
      return statusMap[status] || status
    }

    const handleDropdownAction = (action: string, id: string) => {
      handleAction(action, id)
    }

    const getBalance = async () => {
      const response = await managerService.withdrawals.information()
      return Number(response.message) || 0
    }

    const loadWithdrawalInfo = async () => {
      try {
        const response = await managerService.withdrawals.information()
        withdrawalInfo.value = {
          minimum_amount: response.minimum_amount || 0,
          maximum_amount: response.maximum_amount || 0,
          daily_limit: response.daily_limit || 0,
          withdrawals_today: response.withdrawals_today || 0,
          current_balance: response.current_balance || 0
        }
      } catch (error) {
        logger.error('Erro ao carregar informações de saque:', error)
      }
    }

    const handlePageChange = async (page: number) => {
      await goToPage(page)
    }

    const requestWithdrawal = async () => {
      try {
        await managerService.withdrawals.request({
          amount: Number(withdrawalAmount.value),
          method: selectedMethod.value,
          destination: destination.value
        })
        notificationService.success('Saque solicitado com sucesso')
        showModal.value = false
      } catch (error) {
        logger.error('Erro ao solicitar saque:', error)
        notificationService.error('Erro ao solicitar saque')
      }
    }

    return {
      store,
      showRequestModal,
      showSuccessModal,
      lastWithdrawalAmount,
      lastWithdrawalPixKey,
      loading,
      withdrawalInfo,
      withdrawals,
      pagination,
      role,
      dropdownOptions,
      withdrawalAmount,
      selectedMethod,
      destination,
      showModal,
      filteredDropdownOptions,
      handleWithdrawalRequest,
      getStatusClass,
      handleAction,
      goToPageByUrl,
      goToPage,
      translateStatus,
      handleDropdownAction,
      getBalance,
      loadWithdrawalInfo,
      handlePageChange,
      requestWithdrawal
    }
  }
})
</script>

<template>
  <AuthenticatedLayout :loading="loading">
    <section class="w-full overflow-hidden">
      <div class="flex justify-between items-center mb-6">
        <p class="text-white text-2xl font-semibold">Saques</p>
        <BaseButton v-if="role === 'affiliate'" class="ml-2" @click="showRequestModal = true">
          Novo Saque
        </BaseButton>
      </div>

      <!-- Modais -->
      <WithdrawalRequestModal v-if="showRequestModal" @close="showRequestModal = false"
        @submit="handleWithdrawalRequest" :show-footer="false" :withdrawal-info="withdrawalInfo" />
      <WithdrawalSuccessModal v-if="showSuccessModal" :amount="lastWithdrawalAmount" :pix-key="lastWithdrawalPixKey"
        @close="showSuccessModal = false" :show-footer="false" />

      <div class="flex w-full justify-center text-gray-400">
        <div v-if="loading" class="flex items-center justify-center py-10">
          <span class="text-white text-lg">Carregando saques...</span>
        </div>
        <div v-else-if="withdrawals.length === 0"
          class="flex w-full min-h-[642.50px] items-center justify-center text-gray-400 text-lg">
          Nenhum saque encontrado
        </div>
        <BaseTable v-else :headers="[
          { key: 'date', label: 'Data', align: 'left' },
          { key: 'value', label: 'Valor BRL', align: 'center' },
          { key: 'destination', label: 'Destino (Chave Pix)', align: 'center' },
          { key: 'type', label: 'Tipo', align: 'center' },
          { key: 'status', label: 'Status', align: 'center' },
          { key: 'actions', label: 'Ações', align: 'center' }
        ]" :items="withdrawals">
          <template #date="{ item }">
            {{ item.date }}
          </template>

          <template #value="{ item }">
            {{ item.valueBRL }}
          </template>

          <template #destination="{ item }">
            {{ item.destination }}
          </template>

          <template #type="{ item }">
            {{ item.type }}
          </template>

          <template #status="{ item }">
            <span :class="getStatusClass(item.status)">{{ item.status }}</span>
          </template>

          <template #actions="{ item }">
            <BaseDropdown :options="filteredDropdownOptions" @select="handleDropdownAction($event, item.id)" :top="50"
              class="w-min mx-auto" />
          </template>
        </BaseTable>
      </div>
    </section>
    <BasePagination :meta="pagination" @page-change="handlePageChange" />
  </AuthenticatedLayout>
</template>
