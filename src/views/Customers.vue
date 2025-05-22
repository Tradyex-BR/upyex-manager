<script lang="ts">
import { defineAsyncComponent, defineComponent, ref, watch } from 'vue'
import { managerService } from '@/services/managerService'
import Sidebar from '@/components/layout/dashboard/Sidebar.vue'
import TopBar from '@/components/layout/dashboard/TopBar.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout.vue'
import { useRouter } from 'vue-router'
import MenuIcon from '@/components/icons/MenuIcon.vue'
import BaseDropdown from '@/components/common/BaseDropdown.vue'
import BaseTable from '@/components/common/BaseTable.vue'
import { logger } from '@/config/logger'
import BasePagination from '@/components/common/BasePagination.vue'
import { usePaginationStore } from '@/stores/pagination'
import { useDashboardStore } from '@/stores/dashboard'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import BaseAvatarGroup from '@/components/common/BaseAvatarGroup.vue'

const PenIcon = defineAsyncComponent(() => import('@/components/icons/PenIcon.vue'))
const TrashIcon = defineAsyncComponent(() => import('@/components/icons/TrashIcon.vue'))

interface Usuario {
  id: string;
  nome: string;
  email: string;
  aplicacao: string;
  afiliado: string;
  status: string;
  dataCadastro: string;
  ultimoAcesso: string;
  linkApi: string;
  phone?: string;
  document_number?: string;
}

interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
  links?: any;
}

export default defineComponent({
  name: 'Customers',
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
    BaseModal,
    MenuIcon,
    BaseDropdown,
    BaseTable,
    BasePagination,
    BaseAvatarGroup
  },
  setup() {
    const store = useDashboardStore()
    const router = useRouter()
    const authStore = useAuthStore()
    const toast = useToast()
    const loading = ref(true)
    const customers = ref<any[]>([])
    const searchQuery = ref('')
    const paginationStore = usePaginationStore()
    const pagination = ref<PaginationMeta>({
      current_page: 1,
      from: 1,
      last_page: 1,
      per_page: paginationStore.perPage,
      to: 1,
      total: 0
    })

    watch(() => authStore.isAuthenticated, (isAuthenticated: boolean) => {
      if (!isAuthenticated) {
        router.push('/login')
      }
    })

    watch(() => paginationStore.perPage, (newValue: number) => {
      pagination.value.per_page = newValue
      handleSearch(searchQuery.value, pagination.value.current_page)
    })

    const handleSearch = async (term: string, page: number = 1) => {
      loading.value = true
      try {
        const response = await managerService.customers.list({
          search: term,
          page: page,
          per_page: paginationStore.perPage,
          sort_by: 'created_at',
          sort_order: 'desc'
        })
        customers.value = response.data || []
        if (response.meta) {
          pagination.value = response.meta
        }
      } catch (e) {
        logger.error('Erro ao buscar clientes:', e)
      } finally {
        loading.value = false
      }
    }

    const handlePageChange = async (newPage: number) => {
      await handleSearch(searchQuery.value, newPage)
    }

    const navigateToEdit = (customer: any) => {
      router.push(`/customers/${customer.id}/edit`)
    }

    const dropdownOptions = [
      {
        text: 'Editar',
        action: 'edit',
        icon: PenIcon
      },
      {
        text: 'Excluir',
        action: 'delete',
        icon: TrashIcon
      }
    ]

    return {
      store,
      router,
      authStore,
      toast,
      loading,
      customers,
      searchQuery,
      pagination,
      handleSearch,
      handlePageChange,
      navigateToEdit,
      dropdownOptions
    }
  },
  data() {
    return {
      dropdownOpen: null as string | null,
      showDetailModal: false,
      showCreateModal: false,
      showDeleteModal: false,
      editingCustomer: null as Usuario | null,
      deletingCustomer: null as Usuario | null
    }
  },
  watch: {
    searchTerm(newTerm) {
      this.handleSearch(newTerm);
    }
  },
  async mounted() {
    await this.loadCustomers();
  },
  methods: {
    getStatusClass(status: string): string {
      const baseClass = 'font-inter text-[14px] font-medium leading-[18px] inline-flex h-6 px-2 justify-center items-center gap-1 rounded-[6px] w-fit mx-auto'
      const statusMap: { [key: string]: string } = {
        'Ativo': `${baseClass} bg-green-500/20 text-green-500`,
        'Bloqueado': `${baseClass} bg-red-500/20 text-red-500`,
        'Inativo': `${baseClass} bg-red-500/20 text-red-500`
      }
      return statusMap[status] || `${baseClass} bg-gray-500/20 text-gray-500`
    },
    toggleDropdown(id: string) {
      this.dropdownOpen = this.dropdownOpen === id ? null : id
    },
    async handleCustomerAction(id: string, action: string) {
      try {
        const customer = this.customers.find(c => c.id === id);
        if (!customer) return;

        switch (action) {
          case 'bloquear':

            await this.loadCustomers();
            break;
          case 'editar_permissao':
            // Implementar lógica de edição de permissão
            break;
          case 'resetar_senha':
            // Implementar lógica de reset de senha
            break;
          case 'excluir':
            this.deletingCustomer = customer;
            this.showDeleteModal = true;
            break;
        }
      } catch (e) {
        logger.error(`Erro ao executar ação ${action}:`, e)
      }
    },
    goToCustomerDetail(id: string) {
      const customer = this.customers.find(u => u.id === id)
      if (customer) {
        this.editingCustomer = customer
        this.showDetailModal = true
      }
    },
    async loadCustomers() {
      this.loading = true;
      try {
        const response = await managerService.customers.list({
          search: null,
          page: 1,
          per_page: 10,
          sort_by: 'created_at',
          sort_order: 'desc'
        });
        this.customers = (response.data || []).map((item: any) => ({
          id: item.id,
          nome: item.name || '',
          email: item.email || '',
          application: item.application || null,
          afiliado: item.affiliate?.name || '',
          status: item.application?.is_active ? 'Ativo' : 'Inativo',
          dataCadastro: item.created_at ? new Date(item.created_at).toLocaleDateString('pt-BR') : '-',
          linkApi: item.links?.api || '',
          phone: item.phone || '',
          document_number: item.document_number || ''
        }));
        this.pagination = {
          current_page: response.meta.current_page,
          from: response.meta.from,
          last_page: response.meta.last_page,
          per_page: response.meta.per_page,
          to: response.meta.to,
          total: response.meta.total,
          links: response.meta.links
        };
      } catch (e) {
        logger.error('Erro ao carregar clientes:', e);
      } finally {
        this.loading = false;
      }
    },
    formatApplicationAsProduct(application: any) {
      if (!application) return []
      
      const product = {
        id: application.id,
        name: application.name,
        description: application.description,
        logo_url: application.logo_url,
        base_affiliate_link: application.base_affiliate_link,
        is_active: application.is_active,
        affiliate_count: application.affiliate_count,
        created_at: application.created_at,
        updated_at: application.updated_at,
        links: application.links
      }
      return [product]
    }
  }
})
</script>

<template>
  <AuthenticatedLayout :loading="loading">
    <section class="w-full overflow-hidden">
      <div class="flex justify-between items-center mb-6">
        <p class="text-white text-2xl font-semibold">Clientes</p>
      </div>
      <div class="flex w-full justify-center text-gray-400">
        <div v-if="loading" class="flex items-center justify-center py-10">
          <span class="text-white text-lg">Carregando clientes...</span>
        </div>
        <div v-else-if="customers.length === 0"
          class="flex w-full min-h-[642.50px] items-center justify-center text-gray-400 text-lg">
          Nenhum cliente encontrado
        </div>
        <div v-else class="overflow-visible w-full">
          <BaseTable :headers="[
            { key: 'name', label: 'Nome', align: 'left' },
            { key: 'application_name', label: 'Aplicação', align: 'center' },
            { key: 'email', label: 'Email', align: 'center' },
            { key: 'status', label: 'Status', align: 'center' },
            { key: 'created_at', label: 'Data de cadastro', align: 'center' },
          ]" :items="customers">
            <template #name="{ item }">
              {{ item.nome || "-" }}
            </template>

            <template #application_name="{ item }">
              <BaseAvatarGroup :data="formatApplicationAsProduct(item.application)" />
            </template>

            <template #email="{ item }">
              {{ item.email }}
            </template>

            <template #status="{ item }">
              <span :class="getStatusClass(item.status)">{{ item.status }}</span>
            </template>

            <template #created_at="{ item }">
              {{ item.dataCadastro }}
            </template>

            <template #last_access="{ item }">
              {{ item.affiliate?.latest_login_at ? new Date(item.affiliate.latest_login_at).toLocaleString('pt-BR', {
                day: '2-digit', month: '2-digit',
                year: 'numeric', hour: '2-digit', minute: '2-digit'
              }) : '-' }}
            </template>
          </BaseTable>
        </div>
      </div>
    </section>
    <BasePagination :meta="pagination" @page-change="handlePageChange" />
  </AuthenticatedLayout>
</template>
