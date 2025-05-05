<template>
  <AuthenticatedLayout :loading="loading">

    <section class=" min-h-[944px] w-full overflow-visible">
      <div class="flex justify-between items-center mb-6">
        <p class="text-white text-2xl font-semibold">Clientes</p>
        <BaseButton class="ml-2" @click="showCreateModal = true">
          Novo Cliente
        </BaseButton>
      </div>
      <div>
        <div v-if="customers.length === 0"
          class="flex w-full min-h-[200px] items-center justify-center text-gray-400 text-lg">
          Nenhum cliente encontrado
        </div>
        <BaseTable 
          v-else
          :headers="[
            { key: 'name', label: 'Nome', align: 'left' },
            { key: 'email', label: 'Email', align: 'center' },
            { key: 'status', label: 'Status', align: 'center' },
            { key: 'created_at', label: 'Data de cadastro', align: 'center' },
            { key: 'last_access', label: 'Último acesso', align: 'center' },
            { key: 'actions', label: 'Ações', align: 'center' }
          ]"
          :items="customers"
        >
          <template #name="{ item }">
            {{ item.nome }}
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
            {{ item.ultimoAcesso }}
          </template>
          
          <template #actions="{ item }">
            <BaseDropdown
              :options="[
                {
                  text: item.status === 'Ativo' ? 'Bloquear' : 'Desbloquear',
                  icon: 'fa-ban',
                  action: 'bloquear'
                },
                {
                  text: 'Editar Permissão',
                  icon: 'fa-key',
                  action: 'editar_permissao'
                },
                {
                  text: 'Resetar Senha',
                  icon: 'fa-key',
                  action: 'resetar_senha'
                },
                {
                  text: 'Excluir',
                  icon: 'fa-trash-alt',
                  action: 'excluir'
                }
              ]"
              :model-value="dropdownOpen === item.id"
              @update:model-value="(value) => dropdownOpen = value ? item.id : null"
              @select="(action) => handleCustomerAction(item.id, action)"
              :top="50"
              class="w-min mx-auto"
            />
          </template>
        </BaseTable>
      </div>
    </section>

    <!-- Modal de visualização/edição de cliente -->
    <CustomerDetailModal 
      :show="showDetailModal" 
      :customer="editingCustomer"
      @close="showDetailModal = false"
      @action="handleCustomerAction"
    />

    <!-- Modal de Criação de Cliente -->
    <CreateCustomerModal :show="showCreateModal" @close="showCreateModal = false" @submit="handleCreateCustomer" />
  </AuthenticatedLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import { managerService } from '@/services/managerService'
import { externalService } from '@/services/externalService'
import Sidebar from '@/components/layout/dashboard/Sidebar.vue'
import TopBar from '@/components/layout/dashboard/TopBar.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout.vue'
import CreateCustomerModal from '@/components/customers/CreateCustomerModal.vue'
import CustomerDetailModal from '@/components/customers/CustomerDetailModal.vue'
import { useRouter } from 'vue-router'
import MenuIcon from '@/components/icons/MenuIcon.vue'
import BaseDropdown from '@/components/common/BaseDropdown.vue'
import BaseTable from '@/components/common/BaseTable.vue'
// Função para gerar ID único
function generateUniqueId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

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
    CreateCustomerModal,
    CustomerDetailModal,
    MenuIcon,
    BaseDropdown,
    BaseTable
  },
  setup() {
    const router = useRouter()

    const navigateToEdit = (customer: Usuario) => {
      router.push(`/customers/${customer.id}/edit`)
    }

    return {
      navigateToEdit
    }
  },
  data() {
    return {
      customers: [] as Usuario[],
      dropdownOpen: null as string | null,
      loading: true,
      showDetailModal: false,
      showCreateModal: false,
      editingCustomer: null as Usuario | null
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
            // Atualiza o status do cliente
            await externalService.customers.update(id, {
              name: customer.nome,
              email: customer.email,
              phone: customer.phone || '',
              document_number: customer.document_number || ''
            });
            await this.loadCustomers();
            break;
          case 'editar_permissao':
            // Implementar lógica de edição de permissão
            break;
          case 'resetar_senha':
            // Implementar lógica de reset de senha
            break;
          case 'excluir':
            if (confirm('Tem certeza que deseja excluir este cliente?')) {
              // Implementar lógica de exclusão
              await this.loadCustomers();
            }
            break;
        }
      } catch (e) {
        console.error(`Erro ao executar ação ${action}:`, e)
      }
    },
    goToCustomerDetail(id: string) {
      const customer = this.customers.find(u => u.id === id)
      if (customer) {
        this.editingCustomer = customer
        this.showDetailModal = true
      }
    },
    async handleCreateCustomer(formData: any) {
      try {
        const payload = {
          id: generateUniqueId(),
          name: formData.nome,
          email: formData.email,
          phone: formData.phone || '',
          document_number: formData.document_number || null,
          affiliate_code: formData.affiliate_code
        };

        await externalService.customers.register(payload);

        // Atualizar a lista de clientes
        await this.loadCustomers();

        this.showCreateModal = false;
      } catch (error) {
        console.error('Erro ao criar cliente:', error);
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
        console.error('Erro ao pesquisar clientes:', e);
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
        console.error('Erro ao carregar clientes:', e);
      } finally {
        this.loading = false;
      }
    },
  }
})
</script>
