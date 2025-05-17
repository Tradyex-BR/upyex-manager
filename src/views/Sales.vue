<template>
  <AuthenticatedLayout :loading="loading">
    <section class="w-full overflow-visible">
      <div class="flex justify-between items-center mb-6">
        <p class="text-white text-2xl font-semibold">Vendas</p>
      </div>
      <div class="flex w-full justify-center text-gray-400">
        <div v-if="loading" class="flex items-center justify-center py-10">
          <span class="text-white text-lg">Carregando vendas...</span>
        </div>
        <div v-else-if="sales.length === 0"
          class="flex w-full min-h-[642.50px] items-center justify-center text-gray-400 text-lg">
          Nenhuma venda encontrada
        </div>
        <BaseTable v-else :headers="isManager ? [
          { key: 'date', label: 'Data', align: 'left' },
          { key: 'customer', label: 'Cliente', align: 'center' },
          { key: 'token', label: 'Token', align: 'center' },
          { key: 'status', label: 'Status', align: 'center' },
          { key: 'payment_method', label: 'Método de Pagamentos', align: 'center' },
          { key: 'volume', label: 'Volume', align: 'center' },
          { key: 'value', label: 'Valor BRL', align: 'center' }
        ] : [
          { key: 'date', label: 'Data', align: 'left' },
          { key: 'token', label: 'Token', align: 'center' },
          { key: 'updated_at', label: 'Última Atualização', align: 'center' },
          { key: 'value', label: 'Valor BRL', align: 'center' },
          { key: 'status', label: 'Status', align: 'center' },
          { key: 'wallet_id', label: 'Carteira', align: 'center' },
          { key: 'transaction_id', label: 'ID Transação', align: 'center' }
        ]" :items="sales" class="overflow-y-visible">
          <template #date="{ item }">
            {{ new Date(item.created_at).toLocaleDateString('pt-BR') }}
          </template>

          <template #customer="{ item }">
            {{ item.customer?.name || '-'	 }}
          </template>

          <template #token="{ item }">
            <div class="flex items-center justify-center gap-3">
                <BaseAvatarGroup :data="item.products" />
            </div>
          </template>

          <template #status="{ item }">
            <span :class="getStatusClass(item.status)">{{ mapStatus(item.status) }}</span>
          </template>

          <template #payment_method="{ item }">
            {{ mapPaymentMethod(item.payment_method) }}
          </template>

          <template #volume="{ item }">
            {{ item.products && item.products.length ? item.products[0].amount : '-' }}
          </template>

          <template #value="{ item }">
            {{ item.products && item.products.length ? `R$ ${item.products[0].price.toFixed(2)}` : '-' }}
          </template>

          <template #updated_at="{ item }">
            {{ new Date(item.updated_at).toLocaleDateString('pt-BR') }}
          </template>

          <template #wallet_id="{ item }">
            <div class="flex items-center justify-center gap-2">
              {{ formatWalletId(item.customer?.application?.id) || '-' }}
              <CopyButton :stringToCopy="item.customer?.application?.id" />
            </div>
          </template>

          <template #transaction_id="{ item }">
            <div class="flex items-center justify-center gap-2">
              {{ formatTransactionId(item.id) || '-' }}
              <CopyButton :stringToCopy="item.id" />
            </div>
          </template>
        </BaseTable>
      </div>
    </section>
    <BasePagination :meta="pagination" @page-change="handlePageChange" />
  </AuthenticatedLayout>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useDashboardStore } from '@/stores/dashboard'
import { usePaginationStore } from '@/stores/pagination'
import { managerService } from '@/services/managerService'
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { useToast } from 'vue-toastification'
import MenuIcon from '@/components/icons/MenuIcon.vue'
import CopyIcon from '@/components/icons/CopyIcon.vue'
import CopyButton from '@/components/common/CopyButton.vue'
import { formatWalletId, formatTransactionId } from '@/utils/formatters'
import BaseTable from '@/components/common/BaseTable.vue'
import { CONTEXT_ROLE_KEY } from '@/config/constants'
import { logger } from '@/config/logger'
import BasePagination from '@/components/common/BasePagination.vue'
import BaseAvatarGroup from '@/components/common/BaseAvatarGroup.vue'

export default defineComponent({
  name: 'Sales',
  components: {
    AuthenticatedLayout,
    BaseButton,
    MenuIcon,
    CopyIcon,
    CopyButton,
    BaseTable,
    BasePagination,
    BaseAvatarGroup
  },
  props: {
    searchTerm: {
      type: String,
      default: ''
    }
  },
  setup() {
    const store = useDashboardStore()
    const router = useRouter()
    const authStore = useAuthStore()
    const toast = useToast()
    const loading = ref(true)
    const sales = ref<any[]>([])
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
        const response = await managerService.sales.list({
          search: term,
          page: page,
          per_page: paginationStore.perPage,
          sort_by: 'created_at',
          sort_order: 'desc'
        })
        sales.value = response.data || []
        if (response.meta) {
          pagination.value = response.meta
        }
      } catch (e) {
        logger.error('Erro ao buscar vendas:', e)
      } finally {
        loading.value = false
      }
    }

    const handlePageChange = async (newPage: number) => {
      await handleSearch(searchQuery.value, newPage)
    }

    const loadInitialData = async () => {
      await handleSearch('', 1)
    }

    const loadMockData = async () => {
      loading.value = true
      try {
        sales.value = []
        pagination.value = {
          current_page: 1,
          from: 1,
          last_page: 1,
          per_page: 20,
          to: 1,
          total: 0
        }
      } finally {
        loading.value = false
      }
    }

    return {
      store,
      router,
      authStore,
      toast,
      loading,
      sales,
      searchQuery,
      pagination,
      handleSearch,
      handlePageChange,
      loadInitialData,
      loadMockData,
      formatWalletId,
      formatTransactionId
    }
  },
  data() {
    return {
      isManager: false,
      useMockData: false
    }
  },
  mounted() {
    this.isManager = localStorage.getItem(CONTEXT_ROLE_KEY) === 'manager'
    if (this.useMockData) {
      this.loadMockData()
    } else {
      this.loadInitialData()
    }
  },
  methods: {
    mapStatus(status: string): string {
      const statusMap: { [key: string]: string } = {
        'awaiting_payment': 'Pendente',
        'paid': 'Pago',
        'refunded': 'Estornado',
        'cancelled': 'Cancelado',
        'failed': 'Falha',
      };
      return statusMap[status] || status;
    },

    mapPaymentMethod(method: string): string {
      const methodMap: { [key: string]: string } = {
        'credit_card': 'Cartão de Crédito',
        'debit_card': 'Cartão de Débito',
        'pix': 'PIX',
        'payment_link': 'Link de Pagamento',
        'bank_transfer': 'Transferência Bancária'
      };
      return methodMap[method] || method;
    },

    getStatusClass(status: string): string {
      const baseClass = 'font-inter text-[14px] font-medium leading-[18px] inline-flex h-6 px-2 justify-center items-center gap-1 rounded-[6px] w-fit mx-auto'
      const statusMap: { [key: string]: string } = {
        'awaiting_payment': `${baseClass} bg-yellow-500/20 text-yellow-500`,
        'paid': `${baseClass} bg-green-500/20 text-green-500`,
        'refunded': `${baseClass} bg-gray-500/20 text-gray-500`,
        'cancelled': `${baseClass} bg-red-500/20 text-red-500`,
        'Pendente': `${baseClass} bg-yellow-500/20 text-yellow-500`,
        'Pago': `${baseClass} bg-green-500/20 text-green-500`,
        'Estornado': `${baseClass} bg-gray-500/20 text-gray-500`,
        'Cancelado': `${baseClass} bg-red-500/20 text-red-500`
      }
      return statusMap[status] || `${baseClass} bg-gray-500/20 text-gray-500`
    }
  },
  watch: {
    searchTerm(newTerm) {
      this.handleSearch(newTerm);
    }
  }
})
</script>