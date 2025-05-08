<template>
  <AuthenticatedLayout :loading="loading">
    <section class="min-h-[944px] w-full overflow-hidden">
      <div class="flex justify-between items-center mb-6">
        <p class="text-white text-2xl font-semibold">Vendas</p>
        <div class="cursor-not-allowed">
          <!--           <MenuIcon />
 -->
        </div>
        <!-- <BaseButton @click="handleNewSale" class="bg-[#CF631C] cursor-pointer text-white font-bold py-2 px-4 rounded-lg transition-colors">
                Nova Venda
              </BaseButton> -->
      </div>
      <div class="flex w-full min-h-[calc(100vh-200px)] justify-center text-gray-400">
        <div v-if="loading" class="flex items-center justify-center py-10">
          <span class="text-white text-lg">Carregando vendas...</span>
        </div>
        <div v-else-if="sales.length === 0"
          class="flex w-full min-h-[200px] items-center justify-center text-gray-400 text-lg">
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
        ]" :items="sales">
          <template #date="{ item }">
            {{ new Date(item.created_at).toLocaleDateString('pt-BR') }}
          </template>

          <template #customer="{ item }">
            {{ item.customer?.name }}
          </template>

          <template #token="{ item }">
            <div class="flex items-center justify-center gap-3">
              <img
                :src="item.customer?.application?.logo_url || `https://ui-avatars.com/api/?name=${item.customer?.application?.name}&background=random`"
                :alt="item.customer?.application?.name" class="w-8 h-8 rounded-full object-cover" />
              <div class="flex flex-col">
                <span class="font-inter text-[14px] font-normal leading-[18px] text-white">
                  {{ item.customer?.application?.name || '-' }}
                </span>
              </div>
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
  </AuthenticatedLayout>

  <SaleDetailsModal v-if="showDetailModal" :show="showDetailModal" :sale="editingSale"
    @close="showDetailModal = false" />

  <NewSaleModal v-if="showCreateModal" :show="showCreateModal" @close="showCreateModal = false"
    @save="handleCreateSale" />

  <EditSaleModal v-if="showEditModal" :show="showEditModal" :sale="editingSale" @close="showEditModal = false"
    @save="handleEditSale" />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useDashboardStore } from '@/stores/dashboard'
import { managerService } from '@/services/managerService'
import { externalService } from '@/services/externalService'
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { useToast } from 'vue-toastification'
import MenuIcon from '@/components/icons/MenuIcon.vue'
import CopyIcon from '@/components/icons/CopyIcon.vue'
import CopyButton from '@/components/common/CopyButton.vue'
import { formatWalletId, formatTransactionId } from '@/utils/formatters'
import BaseTable from '@/components/common/BaseTable.vue'
import SaleDetailsModal from '@/components/sales/SaleDetailsModal.vue'
import NewSaleModal from '@/components/sales/NewSaleModal.vue'
import EditSaleModal from '@/components/sales/EditSaleModal.vue'
import { notificationService } from '@/services/notificationService'

const AFFILIATE_MOCK_DATA = [
  {
    "id": "019683a9-6f64-709f-a8c4-532f49082ad5",
    "type": "product",
    "status": "awaiting_payment",
    "payment_method": "pix",
    "products": [
      {
        "id": "71baa072-df2f-365d-9551-d242dee44e20",
        "name": "ex",
        "price": 32.33,
        "amount": 3
      },
      {
        "id": "4d4e2821-8a4a-3b88-b3a1-dfbddcc1f031",
        "name": "doloribus",
        "price": 6.1,
        "amount": 5
      }
    ],
    "platform_fee": "5.05",
    "affiliate_commission": "0.00",
    "created_at": "2025-04-29T22:27:21.000000Z",
    "updated_at": "2025-04-29T22:27:21.000000Z",
    "customer": {
      "id": "019683a9-6eb5-7205-9639-cdc0af76c47e",
      "name": "Sr. Edilson Juliano Sandoval Neto",
      "email": "valentin58@example.com",
      "phone": "(62) 96839-6248",
      "created_at": "2025-04-29T22:27:21.000000Z",
      "updated_at": "2025-04-29T22:27:21.000000Z",
      "application": {
        "id": "019683a9-6e9a-702f-b2f6-564a3cbe73b9",
        "name": "qui ut et aut pariatur",
        "description": "Est et dolor et odit quo natus.",
        "logo_url": "https://via.placeholder.com/480x480.png/00ccbb?text=business+aut",
        "affiliate_link": "",
        "is_active": true,
        "links": {
          "api": "http://board-api.upyex.test/api/affiliate/applications/019683a9-6e9a-702f-b2f6-564a3cbe73b9",
          "frontend": "http://board.upyex.test/affiliate/applications/019683a9-6e9a-702f-b2f6-564a3cbe73b9"
        }
      },
      "links": {
        "api": "http://board-api.upyex.test/api/affiliate/customers/019683a9-6eb5-7205-9639-cdc0af76c47e",
        "frontend": "http://board.upyex.test/affiliate/customers/019683a9-6eb5-7205-9639-cdc0af76c47e"
      }
    },
    "links": {
      "api": "http://board-api.upyex.test/api/affiliate/sales/019683a9-6f64-709f-a8c4-532f49082ad5",
      "frontend": "http://board.upyex.test/affiliate/sales/019683a9-6f64-709f-a8c4-532f49082ad5"
    }
  },
  {
    "id": "019683a9-6f71-73a0-8056-0aedeac96447",
    "type": "product",
    "status": "awaiting_payment",
    "payment_method": "pix",
    "products": [
      {
        "id": "305117f7-a977-3a22-a7a2-1f25e2fa5af1",
        "name": "vero",
        "price": 29.85,
        "amount": 5
      },
      {
        "id": "f8e3bc8d-f398-314e-b92d-7dfd076d871c",
        "name": "in",
        "price": 55.34,
        "amount": 3
      }
    ],
    "platform_fee": "7.49",
    "affiliate_commission": "0.00",
    "created_at": "2025-04-29T22:27:21.000000Z",
    "updated_at": "2025-04-29T22:27:21.000000Z",
    "customer": {
      "id": "019683a9-6eb5-7205-9639-cdc0af76c47e",
      "name": "Sr. Edilson Juliano Sandoval Neto",
      "email": "valentin58@example.com",
      "phone": "(62) 96839-6248",
      "created_at": "2025-04-29T22:27:21.000000Z",
      "updated_at": "2025-04-29T22:27:21.000000Z",
      "application": {
        "id": "019683a9-6e9a-702f-b2f6-564a3cbe73b9",
        "name": "qui ut et aut pariatur",
        "description": "Est et dolor et odit quo natus.",
        "logo_url": "https://via.placeholder.com/480x480.png/00ccbb?text=business+aut",
        "affiliate_link": "",
        "is_active": true,
        "links": {
          "api": "http://board-api.upyex.test/api/affiliate/applications/019683a9-6e9a-702f-b2f6-564a3cbe73b9",
          "frontend": "http://board.upyex.test/affiliate/applications/019683a9-6e9a-702f-b2f6-564a3cbe73b9"
        }
      },
      "links": {
        "api": "http://board-api.upyex.test/api/affiliate/customers/019683a9-6eb5-7205-9639-cdc0af76c47e",
        "frontend": "http://board.upyex.test/affiliate/customers/019683a9-6eb5-7205-9639-cdc0af76c47e"
      }
    },
    "links": {
      "api": "http://board-api.upyex.test/api/affiliate/sales/019683a9-6f71-73a0-8056-0aedeac96447",
      "frontend": "http://board.upyex.test/affiliate/sales/019683a9-6f71-73a0-8056-0aedeac96447"
    }
  },
]

// Mock de dados para desenvolvimento
const MOCK_SALES = [
  {
    "id": "019683a9-6f64-709f-a8c4-532f49082ad5",
    "type": "product",
    "status": "awaiting_payment",
    "payment_method": "pix",
    "products": [
      {
        "id": "71baa072-df2f-365d-9551-d242dee44e20",
        "name": "ex",
        "price": 32.33,
        "amount": 3
      },
      {
        "id": "4d4e2821-8a4a-3b88-b3a1-dfbddcc1f031",
        "name": "doloribus",
        "price": 6.1,
        "amount": 5
      }
    ],
    "platform_fee": "5.05",
    "affiliate_commission": "0.00",
    "created_at": "2025-04-29T22:27:21.000000Z",
    "updated_at": "2025-04-29T22:27:21.000000Z",
    "customer": {
      "id": "019683a9-6eb5-7205-9639-cdc0af76c47e",
      "external_id": "a65e1db9-0639-38eb-bd62-aa4a2bce0a49",
      "name": "Sr. Edilson Juliano Sandoval Neto",
      "email": "valentin58@example.com",
      "phone": "(62) 96839-6248",
      "document_number": "30089750826",
      "created_at": "2025-04-29T22:27:21.000000Z",
      "updated_at": "2025-04-29T22:27:21.000000Z",
      "application": {
        "id": "019683a9-6e9a-702f-b2f6-564a3cbe73b9",
        "name": "qui ut et aut pariatur",
        "description": "Est et dolor et odit quo natus.",
        "logo_url": "https://via.placeholder.com/480x480.png/00ccbb?text=business+aut",
        "base_affiliate_link": null,
        "api_secret": "cNfvbz8eSkAUjsmXN4KlwM05xtB1y554BgycAl3aa5yAUYKbRepzEJjiwJcMJ5TP",
        "is_active": true,
        "created_at": "2025-04-29T22:27:21.000000Z",
        "updated_at": "2025-04-29T22:27:21.000000Z",
        "links": {
          "api": "http://board-api.upyex.test/api/manager/applications/019683a9-6e9a-702f-b2f6-564a3cbe73b9",
          "frontend": "http://board.upyex.test/manager/applications/019683a9-6e9a-702f-b2f6-564a3cbe73b9"
        }
      },
      "affiliate": null,
      "links": {
        "api": "http://board-api.upyex.test/api/manager/customers/019683a9-6eb5-7205-9639-cdc0af76c47e",
        "frontend": "http://board.upyex.test/manager/customers/019683a9-6eb5-7205-9639-cdc0af76c47e"
      }
    },
    "links": {
      "api": "http://board-api.upyex.test/api/manager/sales/019683a9-6f64-709f-a8c4-532f49082ad5",
      "frontend": "http://board.upyex.test/manager/sales/019683a9-6f64-709f-a8c4-532f49082ad5"
    }
  },
  {
    "id": "019683a9-6f71-73a0-8056-0aedeac96447",
    "type": "product",
    "status": "awaiting_payment",
    "payment_method": "pix",
    "products": [
      {
        "id": "305117f7-a977-3a22-a7a2-1f25e2fa5af1",
        "name": "vero",
        "price": 29.85,
        "amount": 5
      },
      {
        "id": "f8e3bc8d-f398-314e-b92d-7dfd076d871c",
        "name": "in",
        "price": 55.34,
        "amount": 3
      }
    ],
    "platform_fee": "7.49",
    "affiliate_commission": "0.00",
    "created_at": "2025-04-29T22:27:21.000000Z",
    "updated_at": "2025-04-29T22:27:21.000000Z",
    "customer": {
      "id": "019683a9-6ee2-71f4-934c-dcf91c812e89",
      "external_id": "9f0df1de-880c-389c-bd3c-60fc1b772642",
      "name": "Francisco Santana",
      "email": "meireles.alicia@example.com",
      "phone": "(74) 4455-2041",
      "document_number": "18893364986",
      "created_at": "2025-04-29T22:27:21.000000Z",
      "updated_at": "2025-04-29T22:27:21.000000Z",
      "application": {
        "id": "019683a9-6eda-736b-9eb6-0e554ae4f5f6",
        "name": "ut distinctio itaque accusantium",
        "description": "Voluptate suscipit aspernatur reprehenderit enim corrupti et dolorum natus.",
        "logo_url": "https://via.placeholder.com/480x480.png/002266?text=business+magnam",
        "base_affiliate_link": null,
        "api_secret": "LMFE83vXgPY61hMgBr2vqDhVaUMFuUPuSVSwi80zpIKZ4lbt2z0V5Q3WFsZyUXXC",
        "is_active": true,
        "created_at": "2025-04-29T22:27:21.000000Z",
        "updated_at": "2025-04-29T22:27:21.000000Z",
        "links": {
          "api": "http://board-api.upyex.test/api/manager/applications/019683a9-6eda-736b-9eb6-0e554ae4f5f6",
          "frontend": "http://board.upyex.test/manager/applications/019683a9-6eda-736b-9eb6-0e554ae4f5f6"
        }
      },
      "affiliate": null,
      "links": {
        "api": "http://board-api.upyex.test/api/manager/customers/019683a9-6ee2-71f4-934c-dcf91c812e89",
        "frontend": "http://board.upyex.test/manager/customers/019683a9-6ee2-71f4-934c-dcf91c812e89"
      }
    },
    "links": {
      "api": "http://board-api.upyex.test/api/manager/sales/019683a9-6f71-73a0-8056-0aedeac96447",
      "frontend": "http://board.upyex.test/manager/sales/019683a9-6f71-73a0-8056-0aedeac96447"
    }
  },
]

export default defineComponent({
  props: {
    searchTerm: {
      type: String,
      default: ''
    }
  },
  name: 'Sales',
  components: {
    AuthenticatedLayout,
    BaseButton,
    MenuIcon,
    CopyIcon,
    CopyButton,
    BaseTable,
    SaleDetailsModal,
    NewSaleModal,
    EditSaleModal
  },
  setup() {
    const store = useDashboardStore()
    const router = useRouter()
    const authStore = useAuthStore()
    const toast = useToast()
    const loading = ref(true)
    const sales = ref<any[]>([])
    const showCreateModal = ref(false)
    const showDetailModal = ref(false)
    const showEditModal = ref(false)
    const editingSale = ref<any>(null)
    const searchQuery = ref('')

    // Adiciona watcher para monitorar o estado de autenticação
    watch(() => authStore.isAuthenticated, (isAuthenticated) => {
      if (!isAuthenticated) {
        router.push('/login')
      }
    })

    const handleSearch = async (term: string) => {
      loading.value = true
      try {
        const response = await managerService.sales.list({
          search: term,
          page: 1,
          per_page: 20,
          sort_by: 'created_at',
          sort_order: 'desc'
        })
        sales.value = response.data || []
      } catch (e) {
        console.error('Erro ao buscar vendas:', e)
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
      showCreateModal,
      showDetailModal,
      showEditModal,
      editingSale,
      searchQuery,
      handleSearch,
      formatWalletId,
      formatTransactionId
    }
  },
  data() {
    return {
      customers: [] as any[],
      availableProducts: [] as any[],
      dropdownOpen: null as string | null,
      isManager: false,
      useMockData: false // Alterado para false para usar a API real
    }
  },
  async mounted() {
    this.isManager = localStorage.getItem('contextRole') === 'manager'
    await this.loadSales()
  },
  watch: {
    searchTerm(newTerm) {
      if (newTerm) {
        this.handleSearch(newTerm)
      }
    }
  },
  methods: {
    async loadSales() {
      try {
        let response;

        if (this.useMockData) {
          // Usa os dados mockados
          response = {}

          if (this.isManager) {
            response = { data: MOCK_SALES }
          } else {
            // Mock para afiliado com campos adicionais
            response = {
              data: AFFILIATE_MOCK_DATA.map(sale => ({
                ...sale,
                wallet_id: `WALLET-${sale.id.slice(0, 8)}`,
                transaction_id: `TRANS-${sale.id.slice(0, 8)}`,
                token: `TOKEN-${sale.id.slice(0, 8)}`
              }))
            }
          }
        } else {
          // Faz a chamada real à API
          response = await managerService.sales.list({
            search: '',
            page: 1,
            per_page: 20,
            sort_by: 'created_at',
            sort_order: 'desc'
          });
        }

        this.sales = (response.data || []).map((sale: any) => ({
          ...sale,
          customer: sale.customer ? {
            ...sale.customer,
            external_id: sale.customer.external_id || '-'
          } : null
        }));
      } catch (e) {
        console.error('Erro ao carregar vendas:', e)
      } finally {
        this.loading = false
      }
    },

    mapStatus(status: string): string {
      const statusMap: { [key: string]: string } = {
        'awaiting_payment': 'Pendente',
        'paid': 'Pago',
        'refunded': 'Estornado',
        'cancelled': 'Cancelado'
      };
      return statusMap[status] || status;
    },

    mapPaymentMethod(method: string): string {
      const methodMap: { [key: string]: string } = {
        'credit_card': 'Cartão de Crédito',
        'pix': 'PIX',
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
    },

    handleNewSale() {
      this.showCreateModal = true;
    },

    async handleCreateSale(saleData: any) {
      try {
        const now = new Date().toISOString();
        const payload = {
          ...saleData,
          created_at: now,
          updated_at: now
        };

        await externalService.sales.register(payload);
        await this.loadSales();
        this.showCreateModal = false;
        notificationService.success('Venda registrada com sucesso!');
      } catch (error) {
        console.error('Erro ao criar venda:', error);
        notificationService.error('Erro ao registrar venda');
      }
    },

    async handleEditSale(saleData: any) {
      if (!this.editingSale) return;

      try {
        const payload = {
          status: saleData.status,
          payment_method: saleData.payment_method
        };

        await externalService.sales.update(this.editingSale.id, payload);
        await this.loadSales();
        this.showEditModal = false;
        notificationService.success('Venda atualizada com sucesso!');
      } catch (error) {
        console.error('Erro ao editar venda:', error);
        notificationService.error('Erro ao atualizar venda');
      }
    },

    showSaleDetails(sale: any) {
      this.editingSale = { ...sale };
      this.showDetailModal = true;
      this.dropdownOpen = null;
    },
  }
})
</script>