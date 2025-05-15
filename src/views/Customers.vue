<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue'
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

const XIcon = defineAsyncComponent(() => import('@/components/icons/XIcon.vue'))
const PenIcon = defineAsyncComponent(() => import('@/components/icons/PenIcon.vue'))
const KeyIcon = defineAsyncComponent(() => import('@/components/icons/KeyIcon.vue'))
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
  },
  setup() {
    const router = useRouter()

    const navigateToEdit = (customer: Usuario) => {
      router.push(`/customers/${customer.id}/edit`)
    }

    const dropdownOptions = [
      {
        text: 'Bloquear',
        action: 'bloquear',
        icon: XIcon
      },
      {
        text: 'Editar Permissão',
        action: 'editar_permissao',
        icon: PenIcon
      },
      {
        text: 'Resetar Senha',
        action: 'resetar_senha',
        icon: KeyIcon
      },
      {
        text: 'Excluir',
        action: 'excluir',
        icon: TrashIcon
      }
    ]

    return {
      navigateToEdit,
      dropdownOptions
    }
  },
  data() {
    return {
      customers: [] as Usuario[],
      dropdownOpen: null as string | null,
      loading: true,
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
    async handleSearch(term: string) {
      this.loading = true;
      try {
        const response = await managerService.customers.list({
          search: term,
          page: 1,
          per_page: 10,
          sort_by: 'created_at',
          sort_order: 'desc'
        });
        this.customers = (response.data || []).map((item: any) => ({
          id: item.id,
          nome: item.name || '',
          email: item.email || '',
          aplicacao: item.application?.name || '',
          afiliado: item.affiliate?.name || '',
          status: item.application?.is_active ? 'Ativo' : 'Inativo',
          dataCadastro: item.created_at ? new Date(item.created_at).toLocaleDateString('pt-BR') : '-',
          ultimoAcesso: item.updated_at ? new Date(item.updated_at).toLocaleDateString('pt-BR') : '-',
          linkApi: item.links?.api || '',
          phone: item.phone || '',
          document_number: item.document_number || ''
        }));
      } catch (e) {
        logger.error('Erro ao pesquisar clientes:', e);
      } finally {
        this.loading = false;
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
          aplicacao: item.application?.name || '',
          afiliado: item.affiliate?.name || '',
          status: item.application?.is_active ? 'Ativo' : 'Inativo',
          dataCadastro: item.created_at ? new Date(item.created_at).toLocaleDateString('pt-BR') : '-',
          ultimoAcesso: item.updated_at ? new Date(item.updated_at).toLocaleDateString('pt-BR') : '-',
          linkApi: item.links?.api || '',
          phone: item.phone || '',
          document_number: item.document_number || ''
        }));
      } catch (e) {
        logger.error('Erro ao carregar clientes:', e);
      } finally {
        this.loading = false;
      }
    },
  }
})
</script>

<template>
  <AuthenticatedLayout :loading="loading">

    <section class=" min-h-[944px] w-full overflow-visible">
      <div class="flex justify-between items-center mb-6">
        <p class="text-white text-2xl font-semibold">Clientes</p>
        <!--
        
        <BaseButton class="ml-2" @click="showCreateModal = true">
          Novo Cliente
        </BaseButton>
        -->
      </div>
      <div>
        <div class="flex w-full min-h-[calc(100vh-200px)] justify-center text-gray-400">
          <div v-if="customers.length === 0"
            class="flex w-full min-h-[200px] items-center justify-center text-gray-400 text-lg">
            Nenhum cliente encontrado
          </div>
          <BaseTable v-else :headers="[
            { key: 'name', label: 'Nome', align: 'left' },
            { key: 'email', label: 'Email', align: 'center' },
            { key: 'status', label: 'Status', align: 'center' },
            { key: 'created_at', label: 'Data de cadastro', align: 'center' },
            { key: 'last_access', label: 'Último acesso', align: 'center' },
/*             { key: 'actions', label: 'Ações', align: 'center' }
 */          ]" :items="customers">
            <template #name="{ item }">
              {{ item.nome || "-" }}
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

            <!-- <template #actions="{ item }">
              <BaseDropdown :options="dropdownOptions" :model-value="dropdownOpen === item.id"
                @update:model-value="(value) => dropdownOpen = value ? item.id : null"
                @select="(action) => handleCustomerAction(item.id, action)" :top="50" class="w-min mx-auto" />
            </template> -->
          </BaseTable>
        </div>
      </div>
    </section>
  </AuthenticatedLayout>
</template>
