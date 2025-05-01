<template>
  <div v-if="loading" class="flex w-full h-full items-center justify-center text-gray-400">
    Carregando...
  </div>
  <div v-else-if="affiliates.length === 0" class="flex w-full h-full items-center justify-center text-gray-400">
    Nenhum afiliado encontrado.
  </div>
  <div v-else class="overflow-hidden">
    <div class="gap-5 flex max-md:flex-col max-md:items-stretch">
      <main class="w-full max-md:w-full max-md:ml-0">
        <div class="w-full max-md:max-w-full">
          <section class=" min-h-[944px] w-full overflow-hidden max-md:max-w-full max-md:px-5">
            <p class="text-white text-2xl font-semibold mb-6">Afiliados</p>
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
                      <img
                        :src="`https://ui-avatars.com/api/?name=${affiliate.name}&background=random`"
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
                        <button
                          class="px-3 py-1 bg-[#1A1F3C] rounded-lg hover:bg-[#2A2F4C] transition-colors"
                          @click="toggleDropdown(affiliate.id)">
                          Ações
                        </button>
                        <div
                          v-if="dropdownOpen === affiliate.id"
                          class="absolute right-0 mt-2 w-48 bg-[#1a1a1a] rounded-lg shadow-lg z-10">
                          <button
                            class="w-full text-left px-4 py-2 hover:bg-[#2A2F4C] text-green-500"
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
  <!-- Modal de edição de afiliado -->
  <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div class="bg-[#23263a] rounded-lg p-8 w-full max-w-lg relative">
      <h2 class="text-xl font-bold mb-4 text-white">Editar Afiliado</h2>
      <form @submit.prevent="saveAffiliateEdits">
        <div class="mb-4">
          <label class="block text-white mb-1">Nome</label>
          <input v-model="editForm.name" class="w-full px-3 py-2 rounded bg-[#181a2a] text-white" required />
        </div>
        <div class="mb-4">
          <label class="block text-white mb-1">E-mail</label>
          <input v-model="editForm.email" type="email" class="w-full px-3 py-2 rounded bg-[#181a2a] text-white" required />
        </div>
        <div class="mb-4">
          <label class="block text-white mb-1">Código de Integração</label>
          <input v-model="editForm.integration_code" class="w-full px-3 py-2 rounded bg-[#181a2a] text-white" required />
        </div>
        <div class="mb-4">
          <label class="block text-white mb-1">Ativo?</label>
          <select v-model="editForm.is_active" class="w-full px-3 py-2 rounded bg-[#181a2a] text-white">
            <option :value="true">Sim</option>
            <option :value="false">Não</option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-white mb-1">Aplicações</label>
          <div v-for="(app, idx) in editForm.applications" :key="app.id" class="mb-2 p-2 bg-[#1a1a2a] rounded">
            <div class="mb-1">
              <label class="block text-xs text-gray-400">ID</label>
              <input v-model="app.id" class="w-full px-2 py-1 rounded bg-[#23263a] text-white" readonly />
            </div>
            <div class="mb-1">
              <label class="block text-xs text-gray-400">% Comissão</label>
              <input v-model.number="app.commission_percentage" type="number" step="0.01" min="0" max="1" class="w-full px-2 py-1 rounded bg-[#23263a] text-white" />
            </div>
            <div>
              <label class="block text-xs text-gray-400">Dias Liberação</label>
              <input v-model.number="app.commission_release_days" type="number" min="0" class="w-full px-2 py-1 rounded bg-[#23263a] text-white" />
            </div>
          </div>
        </div>
        <div v-if="editError" class="text-red-500 mb-2">{{ editError }}</div>
        <div class="flex justify-end gap-2">
          <button type="button" class="px-4 py-2 bg-gray-500 rounded text-white" @click="showEditModal = false" :disabled="editLoading">Cancelar</button>
          <button type="submit" class="px-4 py-2 bg-green-600 rounded text-white" :disabled="editLoading">
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
      affiliates: [] as any[],
      dropdownOpen: null as number | null,
      loading: true,
      showEditModal: false,
      editingAffiliate: null,
      editForm: {
        name: '',
        email: '',
        integration_code: '',
        is_active: true,
        applications: []
      },
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
      this.affiliates = response.data || response; // ajuste conforme o retorno real
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
        this.affiliates = response.data || response;
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
    toggleDropdown(id: number) {
      this.dropdownOpen = this.dropdownOpen === id ? null : id
    },
    async handleAction(id: number, action: string) {
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
        const url = `/manager/affiliates/${this.editingAffiliate.id}`
        await managerService.affiliates.update(this.editingAffiliate.id, this.editForm)
        const idx = this.affiliates.findIndex(a => a.id === this.editingAffiliate.id)
        if (idx !== -1) this.affiliates[idx] = { ...this.editingAffiliate, ...this.editForm }
        this.showEditModal = false
      } catch (e) {
        this.editError = 'Erro ao atualizar afiliado.'
      } finally {
        this.editLoading = false
      }
    }
  }
})
</script>

<style scoped>
/* Estilos específicos para Affiliates.vue */
</style>
