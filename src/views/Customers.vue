<template>
  <div v-if="loading" class="flex w-full h-full items-center justify-center text-gray-400">
    Carregando...
  </div>
  <div v-else-if="usuarios.length === 0" class="flex w-full h-full items-center justify-center text-gray-400">
    Nenhum cliente encontrado.
  </div>
  <div v-else class="overflow-hidden">
    <div class="gap-5 flex max-md:flex-col max-md:items-stretch">
      <main class="w-full max-md:w-full max-md:ml-0">
        <div class="w-full max-md:max-w-full">
          <section class=" min-h-[944px] w-full overflow-hidden max-md:max-w-full max-md:px-5">
            <div class="flex justify-between items-center mb-6">
              <p class="text-white text-2xl font-semibold">Clientes</p>
              <BaseButton class="ml-2" @click="showCreateModal = true">
                Novo Cliente
              </BaseButton>
            </div>
            <div>
              <table class="w-full text-white border-collapse">
                <thead>
                  <tr class="bg-[#1A1F3C]">
                    <th class="p-4 text-left">Nome</th>
                    <th class="p-4 text-left">Email</th>
                    <th class="p-4 text-left">Aplicação</th>
                    <th class="p-4 text-left">Afiliado</th>
                    <th class="p-4 text-left">Status</th>
                    <th class="p-4 text-left">Data de cadastro</th>
                    <th class="p-4 text-left">Último acesso</th>
                    <th class="p-4 text-left">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="usuario in usuarios" :key="usuario.id" class="border-b border-[#1A1F3C]">
                    <td class="p-4">{{ usuario.nome }}</td>
                    <td class="p-4">{{ usuario.email }}</td>
                    <td class="p-4">{{ usuario.aplicacao }}</td>
                    <td class="p-4">{{ usuario.afiliado }}</td>
                    <td class="p-4">
                      <span :class="getStatusClass(usuario.status)">{{ usuario.status }}</span>
                    </td>
                    <td class="p-4">{{ usuario.dataCadastro }}</td>
                    <td class="p-4">{{ usuario.ultimoAcesso }}</td>
                    <td class="p-4">
                      <div class="relative">
                        <button class="px-3 py-1 bg-[#1A1F3C] rounded-lg hover:bg-[#2A2F4C] transition-colors"
                          @click="toggleDropdown(usuario.id)">
                          Ações
                        </button>
                        <div v-if="dropdownOpen === usuario.id"
                          class="absolute right-0 mt-2 w-48 bg-[#1a1a1a] rounded-lg shadow-lg z-10">
                          <button class="w-full text-left px-4 py-2 hover:bg-[#2A2F4C] text-green-500"
                            @click="goToCustomerDetail(usuario.id)">
                            Visualizar detalhes
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  </div>
  
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
                  <button v-if="editingCustomer?.linkApi" 
                    @click="copyToClipboard(editingCustomer.linkApi)" 
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
          <button @click="openEditModal(editingCustomer)" 
            class="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors">
            <i class="fas fa-edit"></i>
            Editar Cliente
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de Criação de Cliente -->
  <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div class="bg-[#23263a] rounded-lg p-8 w-full max-w-2xl relative">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-white">Novo Cliente</h2>
        <button @click="showCreateModal = false" class="text-gray-400 hover:text-white transition-colors">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <form @submit.prevent="handleCreateCustomer" class="space-y-6">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-gray-400 mb-2">Nome</label>
            <input v-model="newCustomer.name" type="text" required
              class="w-full bg-[#1a1a2a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
          </div>
          <div>
            <label class="block text-gray-400 mb-2">Email</label>
            <input v-model="newCustomer.email" type="email" required
              class="w-full bg-[#1a1a2a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
          </div>
          <div>
            <label class="block text-gray-400 mb-2">Telefone</label>
            <input v-model="newCustomer.phone" type="tel" required
              class="w-full bg-[#1a1a2a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
          </div>
          <div>
            <label class="block text-gray-400 mb-2">CPF/CNPJ</label>
            <input v-model="newCustomer.document_number" type="text"
              class="w-full bg-[#1a1a2a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
          </div>
          <div>
            <label class="block text-gray-400 mb-2">Código do Afiliado</label>
            <input v-model="newCustomer.affiliate_code" type="text" required
              class="w-full bg-[#1a1a2a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
          </div>
        </div>

        <div class="flex justify-end gap-4 mt-6">
          <button type="button" @click="showCreateModal = false"
            class="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors">
            Cancelar
          </button>
          <button type="submit"
            class="px-6 py-2 bg-[#CF631C] hover:bg-[#E67E22] rounded-lg text-white font-medium transition-colors">
            Criar Cliente
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal de Edição de Cliente -->
  <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div class="bg-[#23263a] rounded-lg p-8 w-full max-w-2xl relative">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-white">Editar Cliente</h2>
        <button @click="showEditModal = false" class="text-gray-400 hover:text-white transition-colors">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <form @submit.prevent="handleEditCustomer" class="space-y-6">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-gray-400 mb-2">Nome</label>
            <input v-model="editingCustomer.name" type="text" required
              class="w-full bg-[#1a1a2a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
          </div>
          <div>
            <label class="block text-gray-400 mb-2">Email</label>
            <input v-model="editingCustomer.email" type="email" required
              class="w-full bg-[#1a1a2a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
          </div>
          <div>
            <label class="block text-gray-400 mb-2">Telefone</label>
            <input v-model="editingCustomer.phone" type="tel" required
              class="w-full bg-[#1a1a2a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
          </div>
          <div>
            <label class="block text-gray-400 mb-2">CPF/CNPJ</label>
            <input v-model="editingCustomer.document_number" type="text"
              class="w-full bg-[#1a1a2a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
          </div>
        </div>

        <div class="flex justify-end gap-4 mt-6">
          <button type="button" @click="showEditModal = false"
            class="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors">
            Cancelar
          </button>
          <button type="submit"
            class="px-6 py-2 bg-[#CF631C] hover:bg-[#E67E22] rounded-lg text-white font-medium transition-colors">
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Sidebar from '@/components/layout/dashboard/Sidebar.vue'
import TopBar from '@/components/layout/dashboard/TopBar.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { managerService } from '@/services/managerService';
import { externalService } from '@/services/externalService';

// Função para gerar ID único
function generateUniqueId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
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
    BaseButton
  },
  data() {
    return {
      usuarios: [] as Usuario[],
      dropdownOpen: null as string | null,
      loading: true,
      showDetailModal: false,
      showCreateModal: false,
      showEditModal: false,
      editingCustomer: null as Usuario | null,
      newCustomer: {
        id: '',
        name: '',
        email: '',
        phone: '',
        document_number: '',
        affiliate_code: ''
      }
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
      this.usuarios = (response.data || []).map((item: any) => ({
        id: item.id.toString(),
        nome: item.name || '',
        email: item.email || '',
        aplicacao: item.application?.name || '-',
        afiliado: item.affiliate?.name || '-',
        status: item.status || (item.affiliate?.is_active === false ? 'Bloqueado' : 'Ativo'),
        dataCadastro: item.created_at ? new Date(item.created_at).toLocaleDateString('pt-BR') : '-',
        ultimoAcesso: item.updated_at ? new Date(item.updated_at).toLocaleDateString('pt-BR') : '-',
        linkApi: item.links?.api || '',
        phone: item.phone || '',
        document_number: item.document_number || ''
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
      const classes = {
        'Ativo': 'px-2 py-1 rounded-full text-sm bg-green-500/20 text-green-500',
        'Bloqueado': 'px-2 py-1 rounded-full text-sm bg-red-500/20 text-red-500'
      }
      return classes[status as keyof typeof classes] || ''
    },
    toggleDropdown(id: string) {
      this.dropdownOpen = this.dropdownOpen === id ? null : id
    },
    async handleCustomerAction(id: string, action: string) {
      try {
        switch (action) {
          case 'bloquear':
            // Implementar lógica de bloqueio/desbloqueio
            break;
          case 'resetar_senha':
            // Implementar lógica de reset de senha
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
      const customer = this.usuarios.find(u => u.id === id)
      if (customer) {
        this.editingCustomer = customer
        this.showDetailModal = true
      }
    },
    async handleCreateCustomer() {
      try {
        const payload = {
          ...this.newCustomer,
          id: generateUniqueId()
        };
        
        await externalService.customers.register(payload);
        
        // Atualizar a lista de clientes
        await this.loadCustomers();
        
        this.showCreateModal = false;
        this.newCustomer = {
          id: '',
          name: '',
          email: '',
          phone: '',
          document_number: '',
          affiliate_code: ''
        };
      } catch (error) {
        console.error('Erro ao criar cliente:', error);
      }
    },

    async handleEditCustomer() {
      if (!this.editingCustomer) return;

      try {
        const payload = {
          name: this.editingCustomer.nome,
          email: this.editingCustomer.email,
          phone: this.editingCustomer.phone || '',
          document_number: this.editingCustomer.document_number || ''
        };

        await externalService.customers.update(this.editingCustomer.id, payload);
        
        // Atualizar a lista de clientes
        await this.loadCustomers();
        
        this.showEditModal = false;
      } catch (error) {
        console.error('Erro ao editar cliente:', error);
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
        this.usuarios = (response.data || []).map((item: any) => ({
          id: item.id.toString(),
          nome: item.name || '',
          email: item.email || '',
          aplicacao: item.application?.name || '-',
          afiliado: item.affiliate?.name || '-',
          status: item.status || (item.affiliate?.is_active === false ? 'Bloqueado' : 'Ativo'),
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

    openEditModal(customer: Usuario) {
      this.editingCustomer = { ...customer };
      this.showEditModal = true;
    }
  }
})
</script>
