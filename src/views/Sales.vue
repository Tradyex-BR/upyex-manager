<template>
  <div v-if="loading" class="flex w-full h-full items-center justify-center text-gray-400">
    Carregando...
  </div>
  <div v-else-if="sales.length === 0" class="flex w-full h-full items-center justify-center text-gray-400">
    Nenhuma venda encontrada.
  </div>
  <div v-else class="overflow-hidden">
    <div class="gap-5 flex max-md:flex-col max-md:items-stretch">
      <main class="w-full max-md:w-full max-md:ml-0">
        <div class="w-full max-md:max-w-full">
          <section class=" min-h-[944px] w-full overflow-hidden max-md:max-w-full max-md:px-5">
            <div class="flex justify-between items-center mb-6">
              <p class="text-white text-2xl font-semibold">Vendas</p>
              <BaseButton @click="handleNewSale" class="bg-[#CF631C] cursor-pointer text-white font-bold py-2 px-4 rounded-lg transition-colors">
                Nova Venda
              </BaseButton>
            </div>
            <div>
              <div v-if="loading" class="flex items-center justify-center py-10">
                <span class="text-white text-lg">Carregando afiliados...</span>
              </div>
              <table v-else class="w-full text-white border-collapse">
                <thead>
                  <tr class="bg-[#1A1F3C]">
                    <th class="p-4 text-left">ID</th>
                    <th class="p-4 text-left">Cliente</th>
                    <th class="p-4 text-left">Produto</th>
                    <th class="p-4 text-left">Valor</th>
                    <th class="p-4 text-left">Status</th>
                    <th class="p-4 text-left">Método</th>
                    <th class="p-4 text-left">Data</th>
                    <th class="p-4 text-left">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="sale in sales" :key="sale.id" class="border-b border-[#1A1F3C]">
                    <td class="p-4">{{ sale.id }}</td>
                    <td class="p-4">{{ sale.customer?.name }}</td>
                    <td class="p-4">{{ sale.products && sale.products.length ? sale.products[0].name : '-' }}</td>
                    <td class="p-4">R$ {{ sale.products && sale.products.length ? sale.products[0].price.toFixed(2) : '-' }}</td>
                    <td class="p-4">
                      <span :class="getStatusClass(sale.status)">{{ sale.status }}</span>
                    </td>
                    <td class="p-4">{{ sale.payment_method }}</td>
                    <td class="p-4">{{ new Date(sale.created_at).toLocaleDateString('pt-BR') }}</td>
                    <td class="p-4">
                      <div class="relative">
                        <button class="px-3 py-1 bg-[#1A1F3C] rounded-lg hover:bg-[#2A2F4C] transition-colors"
                          @click="toggleDropdown(sale.id)">
                          Ações
                        </button>
                        <div v-if="dropdownOpen === sale.id"
                          class="absolute right-0 mt-2 w-48 bg-[#1a1a1a] rounded-lg shadow-lg z-10">
                          <button class="w-full text-left px-4 py-2 hover:bg-[#2A2F4C] text-green-500"
                            @click="showSaleDetails(sale)">
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
  <!-- Modal de visualização de venda -->
  <div v-if="showDetailModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div class="bg-[#23263a] rounded-lg p-8 w-full max-w-4xl relative">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8 border-b border-[#1A1F3C] pb-4">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-[#CF631C] flex items-center justify-center">
            <i class="fas fa-shopping-cart text-white text-xl"></i>
          </div>
          <div>
            <h2 class="text-xl font-bold text-white">Venda #{{ editingSale?.id }}</h2>
            <p class="text-gray-400 text-sm">{{ new Date(editingSale?.created_at).toLocaleDateString('pt-BR') }}</p>
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
          editingSale?.status === 'Aprovado' 
            ? 'bg-green-500/20 text-green-500' 
            : editingSale?.status === 'Pendente'
            ? 'bg-yellow-500/20 text-yellow-500'
            : 'bg-red-500/20 text-red-500'
        ]">
          <i :class="[
            'fas mr-2',
            editingSale?.status === 'Aprovado' ? 'fa-check-circle' : 
            editingSale?.status === 'Pendente' ? 'fa-clock' : 'fa-times-circle'
          ]"></i>
          {{ editingSale?.status }}
        </span>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-2 gap-8 mb-8">
        <!-- Informações da Venda -->
        <div class="bg-[#1a1a2a] rounded-xl p-6">
          <h3 class="text-white text-lg font-semibold mb-6 flex items-center gap-2">
            <i class="fas fa-info-circle text-[#CF631C]"></i>
            Informações da Venda
          </h3>
          <div class="space-y-6">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-[#23263a] flex items-center justify-center">
                <i class="fas fa-user text-[#CF631C]"></i>
              </div>
              <div>
                <label class="text-gray-400 text-sm">Cliente</label>
                <p class="text-white font-medium">{{ editingSale?.customer?.name }}</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-[#23263a] flex items-center justify-center">
                <i class="fas fa-credit-card text-[#CF631C]"></i>
              </div>
              <div>
                <label class="text-gray-400 text-sm">Método de Pagamento</label>
                <p class="text-white font-medium">{{ editingSale?.payment_method }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Produtos -->
        <div class="bg-[#1a1a2a] rounded-xl p-6">
          <h3 class="text-white text-lg font-semibold mb-6 flex items-center gap-2">
            <i class="fas fa-box text-[#CF631C]"></i>
            Produtos
          </h3>
          <div class="space-y-4">
            <div v-for="product in editingSale?.products" :key="product.id" 
              class="bg-[#23263a] rounded-lg p-4">
              <div class="flex justify-between items-start">
                <div>
                  <p class="text-white font-medium">{{ product.name }}</p>
                  <p class="text-gray-400 text-sm">ID: {{ product.id }}</p>
                </div>
                <p class="text-[#CF631C] font-bold">R$ {{ product.price.toFixed(2) }}</p>
              </div>
            </div>
            <div class="border-t border-[#1A1F3C] pt-4 mt-4">
              <div class="flex justify-between items-center">
                <p class="text-white font-medium">Total</p>
                <p class="text-[#CF631C] font-bold text-xl">
                  R$ {{ editingSale?.products?.reduce((acc, curr) => acc + curr.price, 0).toFixed(2) }}
                </p>
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
          <button v-if="editingSale?.status === 'Pendente'"
            @click="handleSaleAction(editingSale?.id, 'aprovar')" 
            class="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors">
            <i class="fas fa-check"></i>
            Aprovar Venda
          </button>
          <button v-if="editingSale?.status === 'Pendente'"
            @click="handleSaleAction(editingSale?.id, 'rejeitar')" 
            class="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors">
            <i class="fas fa-times"></i>
            Rejeitar Venda
          </button>
          <button v-if="editingSale?.status === 'Aprovado'"
            @click="handleSaleAction(editingSale?.id, 'estornar')" 
            class="flex items-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white font-medium transition-colors">
            <i class="fas fa-undo"></i>
            Estornar Venda
          </button>
        </div>
      </div>
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

export default defineComponent({
  props: {
    searchTerm: {
      type: String,
      default: ''
    }
  },
  name: 'Sales',
  components: {
    Sidebar,
    TopBar,
    BaseButton
  },
  setup() {
    const store = useDashboardStore()
    return { store }
  },
  data() {
    return {
      sales: [] as any[],
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
      editError: '',
      showDetailModal: false,
      editingSale: null as any
    }
  },
  async mounted() {
    try {
      const response = await managerService.sales.list({
  search: '',
  page: 1,
  per_page: 20,
  sort_by: 'name',
  sort_order: 'asc'
});
      this.sales = response.data || response; // ajuste conforme o retorno real
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
      console.log('Termo recebido do search:', term);
      this.loading = true;
      try {
        const response = await managerService.sales.list({
          search: term,
          page: 1,
          per_page: 20,
          sort_by: 'name',
          sort_order: 'asc'
        });
        this.sales = response.data || response;
      } catch (e) {
        // Trate erro se necessário
      } finally {
        this.loading = false;
      }
    },
    handleNewSale() {
      // Implementar lógica para criar nova venda
      console.log('Criar nova venda')
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
        // Substitua {{api_base_url}} pelo real baseURL do seu serviço
        const url = `/manager/affiliates/${this.editingAffiliate.id}`
        await managerService.affiliates.update(this.editingAffiliate.id, this.editForm)
        // Atualiza localmente
        const idx = this.affiliates.findIndex(a => a.id === this.editingAffiliate.id)
        if (idx !== -1) this.affiliates[idx] = { ...this.editingAffiliate, ...this.editForm }
        this.showEditModal = false
      } catch (e) {
        this.editError = 'Erro ao atualizar afiliado.'
      } finally {
        this.editLoading = false
      }
    },
    showSaleDetails(sale: any) {
      this.editingSale = sale
      this.showDetailModal = true
      this.dropdownOpen = null
    },
    async handleSaleAction(id: number, action: string) {
      try {
        switch (action) {
          case 'aprovar':
            // Implementar lógica de aprovação
            break
          case 'rejeitar':
            // Implementar lógica de rejeição
            break
          case 'estornar':
            // Implementar lógica de estorno
            break
        }
      } catch (e) {
        console.error(`Erro ao executar ação ${action}:`, e)
      }
    }
  }
})
</script>