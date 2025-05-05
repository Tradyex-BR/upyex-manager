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
    <div v-if="showDetailModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div class="bg-[#23263a] rounded-lg p-8 w-full max-w-4xl relative">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8 border-b border-[#1A1F3C] pb-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-[#CF631C] flex items-center justify-center">
              <i class="fas fa-user text-white text-xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-bold text-white">{{ editingCustomer?.nome }}</h2>
              <p class="text-gray-400 text-sm">{{ editingCustomer?.email }}</p>
            </div>
          </div>
          <button @click="showDetailModal = false" class="text-gray-400 hover:text-white transition-colors">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <!-- Status Badge -->
        <div class="mb-8">
          <span :class="[
            'px-4 py-2 rounded-full text-sm font-medium',
            editingCustomer?.status === 'Ativo'
              ? 'bg-green-500/20 text-green-500'
              : 'bg-red-500/20 text-red-500'
          ]">
            <i :class="[
              'fas mr-2',
              editingCustomer?.status === 'Ativo' ? 'fa-check-circle' : 'fa-ban'
            ]"></i>
            {{ editingCustomer?.status }}
          </span>
        </div>

        <!-- Main Content -->
        <div class="grid grid-cols-2 gap-8 mb-8">
          <!-- Informações Básicas -->
          <div class="bg-[#1a1a2a] rounded-xl p-6">
            <h3 class="text-white text-lg font-semibold mb-6 flex items-center gap-2">
              <i class="fas fa-info-circle text-[#CF631C]"></i>
              Informações Básicas
            </h3>
            <div class="space-y-6">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-lg bg-[#23263a] flex items-center justify-center">
                  <i class="fas fa-building text-[#CF631C]"></i>
                </div>
                <div>
                  <label class="text-gray-400 text-sm">Aplicação</label>
                  <p class="text-white font-medium">{{ editingCustomer?.aplicacao }}</p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-lg bg-[#23263a] flex items-center justify-center">
                  <i class="fas fa-handshake text-[#CF631C]"></i>
                </div>
                <div>
                  <label class="text-gray-400 text-sm">Afiliado</label>
                  <p class="text-white font-medium">{{ editingCustomer?.afiliado }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Informações de Acesso -->
          <div class="bg-[#1a1a2a] rounded-xl p-6">
            <h3 class="text-white text-lg font-semibold mb-6 flex items-center gap-2">
              <i class="fas fa-clock text-[#CF631C]"></i>
              Informações de Acesso
            </h3>
            <div class="space-y-6">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-lg bg-[#23263a] flex items-center justify-center">
                  <i class="fas fa-calendar-plus text-[#CF631C]"></i>
                </div>
                <div>
                  <label class="text-gray-400 text-sm">Data de Cadastro</label>
                  <p class="text-white font-medium">{{ editingCustomer?.dataCadastro }}</p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-lg bg-[#23263a] flex items-center justify-center">
                  <i class="fas fa-history text-[#CF631C]"></i>
                </div>
                <div>
                  <label class="text-gray-400 text-sm">Último Acesso</label>
                  <p class="text-white font-medium">{{ editingCustomer?.ultimoAcesso }}</p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-lg bg-[#23263a] flex items-center justify-center">
                  <i class="fas fa-link text-[#CF631C]"></i>
                </div>
                <div class="flex-1">
                  <label class="text-gray-400 text-sm">Link da API</label>
                  <div class="flex items-center gap-2 bg-[#23263a] rounded-lg p-2">
                    <p class="text-white font-medium truncate flex-1">{{ editingCustomer?.linkApi }}</p>
                    <button v-if="editingCustomer?.linkApi" @click="copyToClipboard(editingCustomer.linkApi)"
                      class="text-[#CF631C] hover:text-[#E67E22] transition-colors p-1">
                      <i class="fas fa-copy"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Ações -->
        <div class="bg-[#1a1a2a] rounded-xl p-6">
          <h3 class="text-white text-lg font-semibold mb-6 flex items-center gap-2">
            <i class="fas fa-cogs text-[#CF631C]"></i>
            Ações
          </h3>
          <div class="flex gap-4">
            <button @click="handleCustomerAction(editingCustomer?.id, 'bloquear')"
              class="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-colors"
              :class="editingCustomer?.status === 'Ativo' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'">
              <i :class="['fas', editingCustomer?.status === 'Ativo' ? 'fa-ban' : 'fa-unlock']"></i>
              {{ editingCustomer?.status === 'Ativo' ? 'Bloquear' : 'Desbloquear' }}
            </button>
            <button @click="handleCustomerAction(editingCustomer?.id, 'resetar_senha')"
              class="flex items-center gap-2 px-6 py-3 bg-[#CF631C] hover:bg-[#E67E22] rounded-lg text-white font-medium transition-colors">
              <i class="fas fa-key"></i>
              Resetar Senha
            </button>
          </div>
        </div>
      </div>
    </div>

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
  components: {
    Sidebar,
    TopBar,
    BaseButton,
    AuthenticatedLayout,
    BaseModal,
    CreateCustomerModal,
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
  async mounted() {
    this.loading = true
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
        status: item.application?.is_active ? 'Ativo' : 'Inativo',
        dataCadastro: item.created_at ? new Date(item.created_at).toLocaleDateString('pt-BR') : '-',
        ultimoAcesso: item.updated_at ? new Date(item.updated_at).toLocaleDateString('pt-BR') : '-',
        linkApi: item.links?.api || '',
        phone: item.phone || '',
        document_number: item.document_number || '',
        application: item.application || null,
        affiliate: item.affiliate || null
      }));
    } catch (e) {
      console.error('Erro ao carregar clientes:', e)
    } finally {
      this.loading = false
    }
  },

  beforeUnmount() {
    document.removeEventListener('click', () => { })
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
        switch (action) {
          case 'bloquear':
            await managerService.customers.toggleStatus(id);
            await this.loadCustomers();
            break;
          case 'editar_permissao':
            // Implementar lógica de edição de permissão
            break;
          case 'resetar_senha':
            await managerService.customers.resetPassword(id);
            break;
          case 'excluir':
            if (confirm('Tem certeza que deseja excluir este cliente?')) {
              await managerService.customers.delete(id);
              await this.loadCustomers();
            }
            break;
        }
      } catch (e) {
        console.error(`Erro ao executar ação ${action}:`, e)
      }
    },
    async copyToClipboard(text: string) {
      try {
        await navigator.clipboard.writeText(text)
        // Aqui você pode adicionar uma notificação de sucesso se desejar
      } catch (e) {
        console.error('Erro ao copiar para a área de transferência:', e)
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
          ...formData,
          id: generateUniqueId()
        };

        await externalService.customers.register(payload);

        // Atualizar a lista de clientes
        await this.loadCustomers();

        this.showCreateModal = false;
      } catch (error) {
        console.error('Erro ao criar cliente:', error);
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
          status: item.application?.is_active ? 'Ativo' : 'Inativo',
          dataCadastro: item.created_at ? new Date(item.created_at).toLocaleDateString('pt-BR') : '-',
          ultimoAcesso: item.updated_at ? new Date(item.updated_at).toLocaleDateString('pt-BR') : '-',
          linkApi: item.links?.api || '',
          phone: item.phone || '',
          document_number: item.document_number || '',
          application: item.application || null,
          affiliate: item.affiliate || null
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
