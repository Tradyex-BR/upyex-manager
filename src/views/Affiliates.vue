<template>
  <div v-if="loading" class="flex w-full h-full items-center justify-center text-gray-400">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
  <div v-else-if="affiliates.length === 0" class="flex w-full h-full items-center justify-center text-gray-400">
    Nenhum afiliado encontrado.
  </div>
  <div v-else class="overflow-hidden">
    <div class="gap-5 flex max-md:flex-col max-md:items-stretch">
      <main class="w-full max-md:w-full max-md:ml-0">
        <div class="w-full max-md:max-w-full">
          <section class=" min-h-[944px] w-full overflow-hidden max-md:max-w-full max-md:px-5">
            <div class="flex justify-between items-center mb-6">
              <p class="text-white text-2xl font-semibold">Afiliados</p>
              <BaseButton @click="handleNewAffiliate" class="bg-[#CF631C] cursor-pointer text-white font-bold py-2 px-4 rounded-lg transition-colors">
                Novo Afiliado
              </BaseButton>
            </div>
            <div>
              <div v-if="loading" class="flex items-center justify-center py-10">
                <span class="text-white text-lg">Carregando afiliados...</span>
              </div>
              <table v-else class="w-full text-white border-collapse">
                <thead>
                  <tr class="bg-[#1A1F3C]">
                    <th class="p-4 text-left">Nome</th>
                    <!-- <th class="p-4 text-left">E-mail</th> -->
                    <th class="p-4 text-left">Código de Integração</th>
                    <th class="p-4 text-left">Data de Cadastro</th>
                    <th class="p-4 text-left">Status</th>
                    <th class="p-4 text-left">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="affiliate in affiliates" :key="affiliate.id" class="border-b border-[#1A1F3C]">
                    <td class="p-4 flex items-center gap-2">
                      <img :src="`https://ui-avatars.com/api/?name=${affiliate.name}&background=random`"
                        :alt="affiliate.name" class="w-10 h-10 rounded-full" />
                      <p class="text-white text-sm font-semibold">{{ affiliate.name }}</p>
                    </td>
                    <!--   <td class="p-4">{{ affiliate.email }}</td> -->
                    <td class="p-4">{{ affiliate.integration_code }}</td>
                    <td class="p-4">{{ new Date(affiliate.created_at).toLocaleDateString() }}</td>
                    <td class="p-4">
                      <span
                        :class="affiliate.is_active ? 'px-2 py-1 rounded-full text-sm bg-green-500/20 text-green-500' : 'px-2 py-1 rounded-full text-sm bg-red-500/20 text-red-500'">
                        {{ affiliate.is_active ? 'Ativo' : 'Inativo' }}
                      </span>
                    </td>
                    <td class="p-4">
                      <div class="relative">
                        <button class="px-3 py-1 bg-[#1A1F3C] rounded-lg hover:bg-[#2A2F4C] transition-colors"
                          @click="toggleDropdown(affiliate.id)">
                          Ações
                        </button>
                        <div v-if="dropdownOpen === affiliate.id"
                          class="absolute right-0 mt-2 w-48 bg-[#1a1a1a] rounded-lg shadow-lg z-10">
                          <button class="w-full text-left px-4 py-2 hover:bg-[#2A2F4C] text-green-500"
                            @click="handleAction(affiliate.id, 'editar')">
                            Editar
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

  <!-- Modal de criação de afiliado -->
  <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div class="bg-[#23263a] rounded-lg p-8 w-full max-w-4xl relative max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-8 border-b border-[#2A2F4C] pb-4">
        <div class="flex items-center gap-3">
          <i class="fas fa-user-plus text-[#CF631C] text-2xl"></i>
          <h2 class="text-2xl font-bold text-white">Criar Afiliado</h2>
        </div>
        <button @click="showCreateModal = false" class="text-gray-400 hover:text-white transition-colors">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <form @submit.prevent="createAffiliate" class="space-y-6">
        <div class="grid grid-cols-2 gap-6">
          <div class="space-y-4">
            <div>
              <label class="block text-white mb-2 font-medium">Nome</label>
              <div class="relative">
                <i class="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input v-model="createForm.name" class="w-full pl-10 pr-3 py-2 rounded bg-[#23263a] text-white border border-[#2A2F4C] focus:border-[#CF631C] focus:outline-none transition-colors" required />
              </div>
            </div>
            <div>
              <label class="block text-white mb-2 font-medium">E-mail</label>
              <div class="relative">
                <i class="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input v-model="createForm.email" type="email" class="w-full pl-10 pr-3 py-2 rounded bg-[#23263a] text-white border border-[#2A2F4C] focus:border-[#CF631C] focus:outline-none transition-colors" required />
              </div>
            </div>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-white mb-2 font-medium">Código de Integração</label>
              <div class="relative">
                <i class="fas fa-code absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input v-model="createForm.integration_code" class="w-full pl-10 pr-3 py-2 rounded bg-[#23263a] text-white border border-[#2A2F4C] focus:border-[#CF631C] focus:outline-none transition-colors" required />
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8">
          <div class="flex items-center gap-3 mb-4">
            <i class="fas fa-mobile-alt text-[#CF631C]"></i>
            <label class="block text-white font-medium">Aplicações</label>
          </div>
          <div v-for="(app, idx) in createForm.applications" :key="idx" class="mb-4 p-4 bg-[#23263a] rounded-lg border border-[#2A2F4C]">
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-xs text-gray-400 mb-1">ID da Aplicação</label>
                <div class="relative">
                  <i class="fas fa-hashtag absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input v-model="app.id" class="w-full pl-10 pr-3 py-2 rounded bg-[#1a1a2a] text-white border border-[#2A2F4C] focus:border-[#CF631C] focus:outline-none transition-colors" required />
                </div>
              </div>
              <div>
                <label class="block text-xs text-gray-400 mb-1">% Comissão</label>
                <div class="relative">
                  <i class="fas fa-percent absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input v-model.number="app.commission_percentage" type="number" step="0.01" min="0" max="1"
                    class="w-full pl-10 pr-3 py-2 rounded bg-[#1a1a2a] text-white border border-[#2A2F4C] focus:border-[#CF631C] focus:outline-none transition-colors" required />
                </div>
              </div>
              <div>
                <label class="block text-xs text-gray-400 mb-1">Dias para Liberação</label>
                <div class="relative">
                  <i class="fas fa-calendar-day absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input v-model.number="app.commission_release_days" type="number" min="0"
                    class="w-full pl-10 pr-3 py-2 rounded bg-[#1a1a2a] text-white border border-[#2A2F4C] focus:border-[#CF631C] focus:outline-none transition-colors" required />
                </div>
              </div>
            </div>
            <button type="button" class="text-red-400 mt-3 text-sm hover:text-red-300 transition-colors flex items-center gap-1" @click="removeApp(idx)">
              <i class="fas fa-trash-alt"></i>
              Remover
            </button>
          </div>
          <button type="button" class="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4 hover:bg-blue-700 transition-colors flex items-center gap-2" @click="addApp">
            <i class="fas fa-plus"></i>
            Adicionar Aplicação
          </button>
        </div>

        <div v-if="createError" class="mt-4 p-3 bg-red-500/20 text-red-500 rounded-lg flex items-center gap-2">
          <i class="fas fa-exclamation-circle"></i>
          {{ createError }}
        </div>

        <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-[#2A2F4C]">
          <button type="button" class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2" @click="showCreateModal = false">
            <i class="fas fa-times"></i>
            Cancelar
          </button>
          <button type="submit" class="px-6 py-2 bg-[#CF631C] text-white rounded-lg hover:bg-[#B5520A] transition-colors flex items-center gap-2" :disabled="createLoading">
            <i class="fas fa-save"></i>
            <span v-if="createLoading">Salvando...</span>
            <span v-else>Criar</span>
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal de visualização/edição de afiliado -->
  <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div class="bg-[#23263a] rounded-lg p-8 w-full max-w-4xl relative max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-8 border-b border-[#2A2F4C] pb-4">
        <div class="flex items-center gap-3">
          <i class="fas fa-user-edit text-[#CF631C] text-2xl"></i>
          <h2 class="text-2xl font-bold text-white">Detalhes do Afiliado</h2>
        </div>
        <button @click="showEditModal = false" class="text-gray-400 hover:text-white transition-colors">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <div class="grid grid-cols-2 gap-8 mb-8">
        <div class="bg-[#1a1a2a] rounded-lg p-6 shadow-lg">
          <div class="flex items-center gap-3 mb-6">
            <i class="fas fa-info-circle text-[#CF631C]"></i>
            <h3 class="text-white text-lg font-semibold">Informações Básicas</h3>
          </div>
          <div class="space-y-6">
            <div class="flex items-center gap-3">
              <i class="fas fa-user text-gray-400 w-5"></i>
              <div>
                <label class="text-gray-400 text-sm block mb-1">Nome</label>
                <p class="text-white font-medium">{{ editingAffiliate?.name }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <i class="fas fa-envelope text-gray-400 w-5"></i>
              <div>
                <label class="text-gray-400 text-sm block mb-1">Email</label>
                <p class="text-white font-medium">{{ editingAffiliate?.email }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <i class="fas fa-code text-gray-400 w-5"></i>
              <div>
                <label class="text-gray-400 text-sm block mb-1">Código de Integração</label>
                <p class="text-white font-medium">{{ editingAffiliate?.integration_code }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <i class="fas fa-toggle-on text-gray-400 w-5"></i>
              <div>
                <label class="text-gray-400 text-sm block mb-1">Status</label>
                <span :class="editingAffiliate?.is_active ? 'px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-500 font-medium' : 'px-3 py-1 rounded-full text-sm bg-red-500/20 text-red-500 font-medium'">
                  {{ editingAffiliate?.is_active ? 'Ativo' : 'Inativo' }}
                </span>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <i class="fas fa-calendar text-gray-400 w-5"></i>
              <div>
                <label class="text-gray-400 text-sm block mb-1">Data de Cadastro</label>
                <p class="text-white font-medium">{{ editingAffiliate?.created_at ? new Date(editingAffiliate.created_at).toLocaleDateString() : '-' }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-[#1a1a2a] rounded-lg p-6 shadow-lg">
          <div class="flex items-center gap-3 mb-6">
            <i class="fas fa-mobile-alt text-[#CF631C]"></i>
            <h3 class="text-white text-lg font-semibold">Aplicações</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-white border-collapse">
              <thead>
                <tr class="bg-[#23263a]">
                  <th class="p-3 text-left text-sm font-medium">ID da Aplicação</th>
                  <th class="p-3 text-left text-sm font-medium">% Comissão</th>
                  <th class="p-3 text-left text-sm font-medium">Dias para Liberação</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="app in editingAffiliate?.applications" :key="app.id" class="border-b border-[#23263a] hover:bg-[#23263a]/50 transition-colors">
                  <td class="p-3">{{ app.id }}</td>
                  <td class="p-3">{{ (app.commission_percentage * 100).toFixed(2) }}%</td>
                  <td class="p-3">{{ app.commission_release_days }} dias</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <form @submit.prevent="saveAffiliateEdits" class="bg-[#1a1a2a] rounded-lg p-6 shadow-lg">
        <div class="flex items-center gap-3 mb-6">
          <i class="fas fa-edit text-[#CF631C]"></i>
          <h3 class="text-white text-lg font-semibold">Editar Afiliado</h3>
        </div>
        <div class="grid grid-cols-2 gap-6">
          <div class="space-y-4">
            <div>
              <label class="block text-white mb-2 font-medium">Nome</label>
              <div class="relative">
                <i class="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input v-model="editForm.name" class="w-full pl-10 pr-3 py-2 rounded bg-[#23263a] text-white border border-[#2A2F4C] focus:border-[#CF631C] focus:outline-none transition-colors" required />
              </div>
            </div>
            <div>
              <label class="block text-white mb-2 font-medium">E-mail</label>
              <div class="relative">
                <i class="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input v-model="editForm.email" type="email" class="w-full pl-10 pr-3 py-2 rounded bg-[#23263a] text-white border border-[#2A2F4C] focus:border-[#CF631C] focus:outline-none transition-colors" required />
              </div>
            </div>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-white mb-2 font-medium">Código de Integração</label>
              <div class="relative">
                <i class="fas fa-code absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input v-model="editForm.integration_code" class="w-full pl-10 pr-3 py-2 rounded bg-[#23263a] text-white border border-[#2A2F4C] focus:border-[#CF631C] focus:outline-none transition-colors" required />
              </div>
            </div>
            <div>
              <label class="block text-white mb-2 font-medium">Status</label>
              <div class="relative">
                <i class="fas fa-toggle-on absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <select v-model="editForm.is_active" class="w-full pl-10 pr-3 py-2 rounded bg-[#23263a] text-white border border-[#2A2F4C] focus:border-[#CF631C] focus:outline-none transition-colors">
                  <option :value="true">Ativo</option>
                  <option :value="false">Inativo</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8">
          <div class="flex items-center gap-3 mb-4">
            <i class="fas fa-mobile-alt text-[#CF631C]"></i>
            <label class="block text-white font-medium">Aplicações</label>
          </div>
          <div v-for="(app, idx) in editForm.applications" :key="app.id" class="mb-4 p-4 bg-[#23263a] rounded-lg border border-[#2A2F4C]">
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-xs text-gray-400 mb-1">ID</label>
                <div class="relative">
                  <i class="fas fa-hashtag absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input v-model="app.id" class="w-full pl-10 pr-3 py-2 rounded bg-[#1a1a2a] text-white border border-[#2A2F4C] focus:border-[#CF631C] focus:outline-none transition-colors" readonly />
                </div>
              </div>
              <div>
                <label class="block text-xs text-gray-400 mb-1">% Comissão</label>
                <div class="relative">
                  <i class="fas fa-percent absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input v-model.number="app.commission_percentage" type="number" step="0.01" min="0" max="1"
                    class="w-full pl-10 pr-3 py-2 rounded bg-[#1a1a2a] text-white border border-[#2A2F4C] focus:border-[#CF631C] focus:outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label class="block text-xs text-gray-400 mb-1">Dias Liberação</label>
                <div class="relative">
                  <i class="fas fa-calendar-day absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input v-model.number="app.commission_release_days" type="number" min="0"
                    class="w-full pl-10 pr-3 py-2 rounded bg-[#1a1a2a] text-white border border-[#2A2F4C] focus:border-[#CF631C] focus:outline-none transition-colors" />
                </div>
              </div>
            </div>
            <button type="button" class="text-red-400 mt-3 text-sm hover:text-red-300 transition-colors flex items-center gap-1" @click="removeEditApp(idx)">
              <i class="fas fa-trash-alt"></i>
              Remover
            </button>
          </div>
          <button type="button" class="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4 hover:bg-blue-700 transition-colors flex items-center gap-2" @click="addEditApp">
            <i class="fas fa-plus"></i>
            Adicionar Aplicação
          </button>
        </div>

        <div v-if="editError" class="mt-4 p-3 bg-red-500/20 text-red-500 rounded-lg flex items-center gap-2">
          <i class="fas fa-exclamation-circle"></i>
          {{ editError }}
        </div>
        
        <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-[#2A2F4C]">
          <button type="button" class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2" @click="showEditModal = false" :disabled="editLoading">
            <i class="fas fa-times"></i>
            Cancelar
          </button>
          <button type="submit" class="px-6 py-2 bg-[#CF631C] text-white rounded-lg hover:bg-[#B5520A] transition-colors flex items-center gap-2" :disabled="editLoading">
            <i class="fas fa-save"></i>
            <span v-if="editLoading">Salvando...</span>
            <span v-else>Salvar</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import { managerService } from '@/services/managerService'
import Sidebar from '@/components/layout/dashboard/Sidebar.vue'
import TopBar from '@/components/layout/dashboard/TopBar.vue'
import BaseButton from '@/components/common/BaseButton.vue'

interface Application {
  id: string;
  commission_percentage: number;
  commission_release_days: number;
}

interface Affiliate {
  id: string;
  name: string;
  email: string;
  integration_code: string;
  is_active: boolean;
  created_at: string;
  applications: Application[];
}

interface EditForm {
  name: string;
  email: string;
  integration_code: string;
  is_active: boolean;
  applications: Application[];
}

interface CreateForm {
  name: string;
  email: string;
  integration_code: string;
  applications: Application[];
}

export default defineComponent({
  props: {
    searchTerm: {
      type: String,
      default: ''
    }
  },
  name: 'Afiliados',
  components: {
    Sidebar,
    TopBar
  },
  setup() {
    const store = useDashboardStore()
    return { store }
  },
  data() {
    return {
      affiliates: [] as Affiliate[],
      dropdownOpen: null as string | null,
      loading: true,
      showEditModal: false,
      showCreateModal: false,
      editingAffiliate: null as Affiliate | null,
      editForm: {
        name: '',
        email: '',
        integration_code: '',
        is_active: true,
        applications: []
      } as EditForm,
      createForm: {
        name: '',
        email: '',
        integration_code: '',
        applications: [
          { id: '', commission_percentage: 0.2, commission_release_days: 7 }
        ]
      } as CreateForm,
      createLoading: false,
      createError: '',
      editLoading: false,
      editError: ''
    }
  },
  async mounted() {
    try {
      const response = await managerService.affiliates.list({
        search: '',
        page: 1,
        per_page: 20,
        sort_by: 'name',
        sort_order: 'asc'
      });
      this.affiliates = (response.data || response) as Affiliate[];
    } catch (e) {
      // Trate erro se necessário
    } finally {
      this.loading = false;
    }
    // Fechar o dropdown quando clicar fora
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      if (!target.closest('.relative')) {
        this.dropdownOpen = null
      }
    })
  },
  beforeUnmount() {
    document.removeEventListener('click', () => { })
  },
  watch: {
    searchTerm(newTerm) {
      if (newTerm) {
        this.handleSearch(newTerm)
      }
    }
  },
  methods: {
    async handleSearch(term: string) {
      this.loading = true;
      try {
        const response = await managerService.affiliates.list({
          search: term,
          page: 1,
          per_page: 20,
          sort_by: 'name',
          sort_order: 'asc'
        });
        this.affiliates = (response.data || response) as Affiliate[];
      } catch (e) {
        // Trate erro se necessário
      } finally {
        this.loading = false;
      }
    },
    getStatusClass(status: string): string {
      const classes = {
        'Aprovado': 'px-2 py-1 rounded-full text-sm bg-green-500/20 text-green-500',
        'Pendente': 'px-2 py-1 rounded-full text-sm bg-yellow-500/20 text-yellow-500',
        'Rejeitado': 'px-2 py-1 rounded-full text-sm bg-red-500/20 text-red-500'
      }
      return classes[status as keyof typeof classes] || ''
    },
    toggleDropdown(id: string) {
      this.dropdownOpen = this.dropdownOpen === id ? null : id
    },
    async handleNewAffiliate() {
      this.editingAffiliate = null
      this.createForm = {
        name: '',
        email: '',
        integration_code: '',
        applications: [
          { id: '', commission_percentage: 0.2, commission_release_days: 7 }
        ]
      }
      this.createError = ''
      this.showCreateModal = true
    },
    async handleAction(id: string, action: string) {
      switch (action) {
        case 'editar': {
          const affiliate = this.affiliates.find(a => a.id === id)
          if (affiliate) {
            this.editingAffiliate = affiliate
            this.editForm = {
              name: affiliate.name,
              email: affiliate.email,
              integration_code: affiliate.integration_code,
              is_active: affiliate.is_active,
              applications: affiliate.applications ? affiliate.applications.map(app => ({ ...app })) : []
            }
            this.showEditModal = true
          }
          break
        }
        case 'bloquear':
          await this.store.blockAffiliate(id)
          break
        case 'excluir':
          await this.store.deleteAffiliate(id)
          break
      }
      this.dropdownOpen = null
    },
    async saveAffiliateEdits() {
      if (!this.editingAffiliate) return
      this.editLoading = true
      this.editError = ''
      try {
        await managerService.affiliates.update(this.editingAffiliate.id, this.editForm)
        const idx = this.affiliates.findIndex(a => a.id === this.editingAffiliate?.id)
        if (idx !== -1 && this.editingAffiliate) {
          this.affiliates[idx] = { ...this.editingAffiliate, ...this.editForm }
        }
        this.showEditModal = false
      } catch (e) {
        this.editError = 'Erro ao atualizar afiliado.'
      } finally {
        this.editLoading = false
      }
    },
    removeEditApp(idx: number) {
      this.editForm.applications.splice(idx, 1)
    },
    addEditApp() {
      this.editForm.applications.push({ id: '', commission_percentage: 0.2, commission_release_days: 7 })
    },
    async createAffiliate() {
      this.createLoading = true
      this.createError = ''
      try {
        const payload = {
          name: this.createForm.name,
          email: this.createForm.email,
          integration_code: this.createForm.integration_code,
          applications: this.createForm.applications.map(app => ({
            id: app.id,
            commission_percentage: app.commission_percentage,
            commission_release_days: app.commission_release_days
          }))
        }
        await managerService.affiliates.create(payload)
        await this.handleSearch('')
        this.showCreateModal = false
      } catch (e) {
        this.createError = 'Erro ao criar afiliado.'
      } finally {
        this.createLoading = false
      }
    },
    addApp() {
      this.createForm.applications.push({ id: '', commission_percentage: 0.2, commission_release_days: 7 })
    },
    removeApp(idx: number) {
      this.createForm.applications.splice(idx, 1)
    }
  }
})
</script>

<style scoped>
/* Estilos específicos para Affiliates.vue */
</style>
