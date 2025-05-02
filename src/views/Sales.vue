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
                          class="absolute right-0 mt-2 w-48 bg-[#1a1a1a] rounded-lg shadow-lg z-50">
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
  <!-- Modal de Nova Venda -->
  <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div class="bg-[#23263a] rounded-lg p-8 w-full max-w-4xl relative">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-white">Nova Venda</h2>
        <button @click="showCreateModal = false" class="text-gray-400 hover:text-white transition-colors">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <form @submit.prevent="handleCreateSale" class="space-y-6">
        <div class="grid grid-cols-2 gap-6">
          <!-- Cliente -->
          <div>
            <label class="block text-gray-400 mb-2">Cliente</label>
            <select v-model="newSale.customer_id" required
              class="w-full bg-[#1a1a2a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
              <option value="">Selecione um cliente</option>
              <option v-for="customer in customers" :key="customer.id" :value="customer.external_id">
                {{ customer.name }}
              </option>
            </select>
          </div>

          <!-- Método de Pagamento -->
          <div>
            <label class="block text-gray-400 mb-2">Método de Pagamento</label>
            <select v-model="newSale.method" required
              class="w-full bg-[#1a1a2a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
              <option value="">Selecione um método</option>
              <option value="credit_card">Cartão de Crédito</option>
              <option value="pix">PIX</option>
              <option value="bank_transfer">Transferência Bancária</option>
            </select>
          </div>

          <!-- Produtos -->
          <div class="col-span-2">
            <label class="block text-gray-400 mb-2">Produtos</label>
            <div class="space-y-4">
              <div v-for="(product, index) in newSale.products" :key="index" 
                class="flex gap-4 items-start bg-[#1a1a2a] p-4 rounded-lg">
                <div class="flex-1">
                  <select v-model="product.id" required
                    class="w-full bg-[#23263a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
                    <option value="">Selecione um produto</option>
                    <option v-for="prod in availableProducts" :key="prod.id" :value="prod.id">
                      {{ prod.name }} - R$ {{ prod.price.toFixed(2) }}
                    </option>
                  </select>
                </div>
                <div class="w-32">
                  <label class="block text-gray-400 text-sm mb-1">Quantidade</label>
                  <input v-model.number="product.amount" type="number" min="1" required
                    class="w-full bg-[#23263a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
                </div>
                <button type="button" @click="removeProduct(index)" 
                  class="text-red-500 hover:text-red-600 transition-colors p-2">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
              <button type="button" @click="addProduct" 
                class="w-full py-2 border-2 border-dashed border-[#CF631C] text-[#CF631C] rounded-lg hover:bg-[#CF631C] hover:text-white transition-colors">
                <i class="fas fa-plus mr-2"></i>
                Adicionar Produto
              </button>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-4 mt-6">
          <button type="button" @click="showCreateModal = false"
            class="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors">
            Cancelar
          </button>
          <button type="submit"
            class="px-6 py-2 bg-[#CF631C] hover:bg-[#E67E22] rounded-lg text-white font-medium transition-colors">
            Criar Venda
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal de Edição de Venda -->
  <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div class="bg-[#23263a] rounded-lg p-8 w-full max-w-4xl relative">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-white">Editar Venda</h2>
        <button @click="showEditModal = false" class="text-gray-400 hover:text-white transition-colors">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <form @submit.prevent="handleEditSale" class="space-y-6">
        <div class="grid grid-cols-2 gap-6">
          <!-- Status -->
          <div>
            <label class="block text-gray-400 mb-2">Status</label>
            <select v-model="editingSale.status" required
              class="w-full bg-[#1a1a2a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
              <option value="awaiting_payment">Pendente</option>
              <option value="approved">Aprovado</option>
              <option value="rejected">Rejeitado</option>
              <option value="refunded">Estornado</option>
            </select>
          </div>

          <!-- Método de Pagamento -->
          <div>
            <label class="block text-gray-400 mb-2">Método de Pagamento</label>
            <select v-model="editingSale.payment_method" required
              class="w-full bg-[#1a1a2a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
              <option value="credit_card">Cartão de Crédito</option>
              <option value="pix">PIX</option>
              <option value="bank_transfer">Transferência Bancária</option>
            </select>
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
import { useDashboardStore } from '@/stores/dashboard'
import { managerService } from '@/services/managerService'
import { externalService } from '@/services/externalService'
import Sidebar from '@/components/layout/dashboard/Sidebar.vue'
import TopBar from '@/components/layout/dashboard/TopBar.vue'
import BaseButton from '@/components/common/BaseButton.vue'

// Função para gerar ID único
function generateUniqueId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

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
      customers: [] as any[],
      availableProducts: [] as any[],
      dropdownOpen: null as number | null,
      loading: true,
      showCreateModal: false,
      showEditModal: false,
      showDetailModal: false,
      editingSale: null as any,
      newSale: {
        id: '',
        customer_id: '',
        type: 'sale',
        status: 'awaiting_payment',
        method: '',
        products: [] as { id: string; amount: number }[],
        platform_fee: 0
      }
    }
  },
  async mounted() {
    await this.loadSales();
    await this.loadCustomers();
    await this.loadProducts();
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
        const response = await managerService.sales.list({
          search: '',
          page: 1,
          per_page: 20,
          sort_by: 'created_at',
          sort_order: 'desc'
        });
        
        // Ajustando o mapeamento dos dados
        this.sales = (response.data || []).map((sale: any) => ({
          id: sale.id,
          type: sale.type,
          status: this.mapStatus(sale.status),
          payment_method: this.mapPaymentMethod(sale.payment_method),
          products: sale.products || [],
          platform_fee: sale.platform_fee,
          affiliate_commission: sale.affiliate_commission,
          created_at: sale.created_at,
          updated_at: sale.updated_at,
          customer: sale.customer ? {
            id: sale.customer.id,
            name: sale.customer.name,
            email: sale.customer.email,
            phone: sale.customer.phone,
            document_number: sale.customer.document_number
          } : null
        }));
      } catch (e) {
        console.error('Erro ao carregar vendas:', e);
      } finally {
        this.loading = false;
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
      const classes = {
        'Pago': 'px-2 py-1 rounded-full text-sm bg-green-500/20 text-green-500',
        'Pendente': 'px-2 py-1 rounded-full text-sm bg-yellow-500/20 text-yellow-500',
        'Cancelado': 'px-2 py-1 rounded-full text-sm bg-red-500/20 text-red-500',
        'Estornado': 'px-2 py-1 rounded-full text-sm bg-gray-500/20 text-gray-500'
      }
      return classes[status as keyof typeof classes] || ''
    },

    async loadCustomers() {
      try {
        const response = await managerService.customers.list({
          search: null,
          page: 1,
          per_page: 100,
          sort_by: 'name',
          sort_order: 'asc'
        });
        this.customers = response.data || [];
      } catch (e) {
        console.error('Erro ao carregar clientes:', e);
      }
    },

    async loadProducts() {
      try {
        const response = await managerService.products.list({
          search: null,
          page: 1,
          per_page: 100,
          sort_by: 'name',
          sort_order: 'asc'
        });
        this.availableProducts = response.data || [];
      } catch (e) {
        console.error('Erro ao carregar produtos:', e);
      }
    },

    handleNewSale() {
      this.newSale = {
        id: generateUniqueId(),
        customer_id: '',
        type: 'sale',
        status: 'awaiting_payment',
        method: '',
        products: [],
        platform_fee: 0
      };
      this.showCreateModal = true;
    },

    addProduct() {
      this.newSale.products.push({
        id: '',
        amount: 1
      });
    },

    removeProduct(index: number) {
      this.newSale.products.splice(index, 1);
    },

    async handleCreateSale() {
      try {
        const payload = {
          ...this.newSale,
          products: this.newSale.products.map(product => {
            const selectedProduct = this.availableProducts.find(p => p.id === product.id);
            return {
              id: product.id,
              name: selectedProduct?.name || '',
              price: selectedProduct?.price || 0,
              amount: product.amount
            };
          })
        };

        await externalService.sales.register(payload);
        await this.loadSales();
        this.showCreateModal = false;
      } catch (error) {
        console.error('Erro ao criar venda:', error);
      }
    },

    async handleEditSale() {
      if (!this.editingSale) return;

      try {
        const payload = {
          status: this.editingSale.status
        };

        await externalService.sales.update(this.editingSale.id, payload);
        await this.loadSales();
        this.showEditModal = false;
      } catch (error) {
        console.error('Erro ao editar venda:', error);
      }
    },

    showSaleDetails(sale: any) {
      this.editingSale = { ...sale };
      this.showDetailModal = true;
      this.dropdownOpen = null;
    },

    async handleSaleAction(saleId, newStatus) {
      try {
        await externalService.sales.update(saleId, { status: newStatus });
        this.$toast.success('Status atualizado com sucesso!');
        this.dropdownOpen = null;
        await this.loadSales();
      } catch (error) {
        this.$toast.error('Erro ao atualizar status: ' + error.message);
      }
    },

    toggleDropdown(saleId: string) {
      this.dropdownOpen = this.dropdownOpen === saleId ? null : saleId;
    }
  }
})
</script>