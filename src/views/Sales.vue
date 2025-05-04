<template>
  <AuthenticatedLayout :loading="loading">
    <div class="gap-5 flex max-md:flex-col max-md:items-stretch">
      <main class="w-full max-md:w-full max-md:ml-0">
        <div class="w-full max-md:max-w-full">
          <section class="min-h-[944px] w-full overflow-hidden max-md:max-w-full max-md:px-5">
            <div class="flex justify-between items-center mb-6">
              <p class="text-white text-2xl font-semibold">Vendas</p>
              <div class="cursor-not-allowed">
                <MenuIcon />
              </div>
              <!-- <BaseButton @click="handleNewSale" class="bg-[#CF631C] cursor-pointer text-white font-bold py-2 px-4 rounded-lg transition-colors">
                Nova Venda
              </BaseButton> -->
            </div>
            <div>
              <div v-if="loading" class="flex items-center justify-center py-10">
                <span class="text-white text-lg">Carregando vendas...</span>
              </div>
              <div v-else-if="sales.length === 0"
                class="flex w-full min-h-[200px] items-center justify-center text-gray-400 text-lg">
                Nenhuma venda encontrada
              </div>
              <table v-else class="w-full text-white border-collapse">
                <thead>
                  <tr class="bg-[#1A1F3C]">
                    <template v-if="isManager">
                      <th class="p-4 text-left">Data</th>
                      <th class="p-4 text-center">Cliente</th>
                      <th class="p-4 text-center">Token</th>
                      <th class="p-4 text-center">Status</th>
                      <th class="p-4 text-center">Método de Pagamentos</th>
                      <th class="p-4 text-center">Volume</th>
                      <th class="p-4 text-center">Valor BRL</th>
                    </template>
                    <template v-else>
                      <th class="p-4 text-left">Data</th>
                      <th class="p-4 text-center">Token</th>
                      <th class="p-4 text-center">Última Atualização</th>
                      <th class="p-4 text-center">Valor BRL</th>
                      <th class="p-4 text-center">Status</th>
                      <th class="p-4 text-center">Carteira</th>
                      <th class="p-4 text-center">ID Transação</th>
                    </template>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="sale in sales" :key="sale.id" class="border-b border-[#1A1F3C]">
                    <template v-if="isManager">
                      <td class="p-4">{{ new Date(sale.created_at).toLocaleDateString('pt-BR') }}</td>
                      <td class="p-4 text-center">{{ sale.customer?.name }}</td>
                      <td class="p-4 text-center">{{ sale.token || '-' }}</td>
                      <td class="p-4 text-center">
                        <span :class="getStatusClass(sale.status)">{{ mapStatus(sale.status) }}</span>
                      </td>
                      <td class="p-4 text-center">{{ sale.payment_method }}</td>
                      <td class="p-4 text-center">{{ sale.products && sale.products.length ? sale.products[0].amount : '-' }}</td>
                      <td class="p-4 text-center">R$ {{ sale.products && sale.products.length ? sale.products[0].price.toFixed(2) : '-' }}</td>
                    </template>
                    <template v-else>
                      <td class="p-4">{{ new Date(sale.created_at).toLocaleDateString('pt-BR') }}</td>
                      <td class="p-4 text-center">{{ sale.token || '-' }}</td>
                      <td class="p-4 text-center">{{ new Date(sale.updated_at).toLocaleDateString('pt-BR') }}</td>
                      <td class="p-4 text-center">R$ {{ sale.products && sale.products.length ? sale.products[0].price.toFixed(2) : '-' }}</td>
                      <td class="p-4 text-center">
                        <span :class="getStatusClass(sale.status)">{{ mapStatus(sale.status) }}</span>
                      </td>
                      <td class="p-4 text-center">
                        <div class="flex items-center justify-center gap-2">
                          <span>{{ formatWalletId(sale.customer?.external_id) || '-' }}</span>
                          <button v-if="sale.customer?.external_id" @click="copyToClipboard(sale.customer.external_id)"
                            class="p-0 transition-colors bg-transparent border-none outline-none"
                            title="Copiar ID da Carteira">
                            <CopyIcon />
                          </button>
                        </div>
                      </td>
                      <td class="p-4 text-center">
                        <div class="flex items-center justify-center gap-2">
                          <span>{{ formatTransactionId(sale.id) }}</span>
                          <button @click="copyToClipboard(sale.id)"
                            class="p-0 transition-colors bg-transparent border-none outline-none"
                            title="Copiar ID da Transação">
                            <CopyIcon />
                          </button>
                        </div>
                      </td>
                    </template>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  </AuthenticatedLayout>
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
          <input v-model="editForm.email" type="email" class="w-full px-3 py-2 rounded bg-[#181a2a] text-white"
            required />
        </div>
        <div class="mb-4">
          <label class="block text-white mb-1">Código de Integração</label>
          <input v-model="editForm.integration_code" class="w-full px-3 py-2 rounded bg-[#181a2a] text-white"
            required />
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
              <input v-model.number="app.commission_percentage" type="number" step="0.01" min="0" max="1"
                class="w-full px-2 py-1 rounded bg-[#23263a] text-white" />
            </div>
            <div>
              <label class="block text-xs text-gray-400">Dias Liberação</label>
              <input v-model.number="app.commission_release_days" type="number" min="0"
                class="w-full px-2 py-1 rounded bg-[#23263a] text-white" />
            </div>
          </div>
        </div>
        <div v-if="editError" class="text-red-500 mb-2">{{ editError }}</div>
        <div class="flex justify-end gap-2">
          <button type="button" class="px-4 py-2 bg-gray-500 rounded text-white" @click="showEditModal = false"
            :disabled="editLoading">Cancelar</button>
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
    <div class="bg-[#23263a] rounded-lg p-8 w-full max-w-4xl relative max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8 border-b border-[#2A2F4C] pb-4">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-[#CF631C] flex items-center justify-center">
            <i class="fas fa-shopping-cart text-white text-xl"></i>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-white">Venda #{{ editingSale?.id }}</h2>
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
          'px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2',
          editingSale?.status === 'Aprovado'
            ? 'bg-green-500/20 text-green-500'
            : editingSale?.status === 'Pendente'
              ? 'bg-yellow-500/20 text-yellow-500'
              : 'bg-red-500/20 text-red-500'
        ]">
          <i :class="[
            'fas',
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
                <p class="text-gray-400 text-sm">{{ editingSale?.customer?.email }}</p>
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
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-[#23263a] flex items-center justify-center">
                <i class="fas fa-percentage text-[#CF631C]"></i>
              </div>
              <div>
                <label class="text-gray-400 text-sm">Taxa da Plataforma</label>
                <p class="text-white font-medium">{{ editingSale?.platform_fee }}%</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-[#23263a] flex items-center justify-center">
                <i class="fas fa-hand-holding-usd text-[#CF631C]"></i>
              </div>
              <div>
                <label class="text-gray-400 text-sm">Comissão do Afiliado</label>
                <p class="text-white font-medium">{{ editingSale?.affiliate_commission }}%</p>
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
              class="bg-[#23263a] rounded-lg p-4 hover:bg-[#2A2F4C] transition-colors">
              <div class="space-y-3">
                <!-- Nome e ID -->
                <div>
                  <p class="text-white font-medium text-lg">{{ product.name }}</p>
                  <p class="text-gray-400 text-sm">ID: {{ product.id }}</p>
                </div>

                <!-- Valores -->
                <div class="grid grid-cols-3 gap-4">
                  <div class="bg-[#1a1a2a] rounded-lg p-3">
                    <p class="text-gray-400 text-sm mb-1">Preço Unitário</p>
                    <p class="text-[#CF631C] font-bold">R$ {{ product.price.toFixed(2) }}</p>
                  </div>
                  <div class="bg-[#1a1a2a] rounded-lg p-3">
                    <p class="text-gray-400 text-sm mb-1">Quantidade</p>
                    <p class="text-white font-medium">{{ product.amount }}</p>
                  </div>
                  <div class="bg-[#1a1a2a] rounded-lg p-3">
                    <p class="text-gray-400 text-sm mb-1">Subtotal</p>
                    <p class="text-[#CF631C] font-bold">R$ {{ (product.price * product.amount).toFixed(2) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Total -->
            <div class="border-t border-[#2A2F4C] pt-4 mt-4">
              <div class="flex justify-between items-center bg-[#23263a] rounded-lg p-4">
                <div class="flex items-center gap-2">
                  <i class="fas fa-receipt text-[#CF631C]"></i>
                  <p class="text-white font-medium">Total</p>
                </div>
                <p class="text-[#CF631C] font-bold text-xl">
                  R$ {{editingSale?.products?.reduce((acc: number, curr: any) => acc + (curr.price * curr.amount),
                    0).toFixed(2)}}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Ações -->
      <!-- <div class="bg-[#1a1a2a] rounded-xl p-6">
        <h3 class="text-white text-lg font-semibold mb-6 flex items-center gap-2">
          <i class="fas fa-cogs text-[#CF631C]"></i>
          Ações
        </h3>
        <div class="flex gap-4">
          <button v-if="editingSale?.status === 'Pendente'" @click="handleSaleAction(editingSale?.id, 'aprovar')"
            class="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors">
            <i class="fas fa-check"></i>
            Aprovar Venda
          </button>
          <button v-if="editingSale?.status === 'Pendente'" @click="handleSaleAction(editingSale?.id, 'rejeitar')"
            class="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors">
            <i class="fas fa-times"></i>
            Rejeitar Venda
          </button>
          <button v-if="editingSale?.status === 'Aprovado'" @click="handleSaleAction(editingSale?.id, 'estornar')"
            class="flex items-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white font-medium transition-colors">
            <i class="fas fa-undo"></i>
            Estornar Venda
          </button>
        </div>
      </div> -->
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
          <!-- ID da Venda -->
          <div>
            <label class="block text-gray-400 mb-2">ID da Venda</label>
            <input v-model="newSale.id" type="text" required
              class="w-full bg-[#1a1a2a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
          </div>

          <!-- ID do Cliente -->
          <div>
            <label class="block text-gray-400 mb-2">ID do Cliente</label>
            <input v-model="newSale.customer_id" type="text" required
              class="w-full bg-[#1a1a2a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
          </div>

          <!-- Tipo -->
          <div>
            <label class="block text-gray-400 mb-2">Tipo</label>
            <select v-model="newSale.type" required
              class="w-full bg-[#1a1a2a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
              <option value="product">Produto</option>
              <option value="service">Serviço</option>
            </select>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-gray-400 mb-2">Status</label>
            <select v-model="newSale.status" required
              class="w-full bg-[#1a1a2a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
              <option value="awaiting_payment">Aguardando Pagamento</option>
              <option value="paid">Pago</option>
              <option value="refunded">Estornado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>

          <!-- Método de Pagamento -->
          <div>
            <label class="block text-gray-400 mb-2">Método de Pagamento</label>
            <select v-model="newSale.payment_method" required
              class="w-full bg-[#1a1a2a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
              <option value="pix">PIX</option>
              <option value="credit_card">Cartão de Crédito</option>
              <option value="bank_transfer">Transferência Bancária</option>
            </select>
          </div>

          <!-- Taxa da Plataforma -->
          <div>
            <label class="block text-gray-400 mb-2">Taxa da Plataforma</label>
            <input v-model="newSale.platform_fee" type="text" required
              class="w-full bg-[#1a1a2a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
          </div>
        </div>

        <!-- Produtos -->
        <div class="mt-6">
          <label class="block text-gray-400 mb-2">Produtos</label>
          <div class="space-y-4">
            <div v-for="(product, index) in newSale.products" :key="index"
              class="grid grid-cols-4 gap-4 bg-[#1a1a2a] p-4 rounded-lg">
              <div>
                <label class="block text-gray-400 text-sm mb-1">ID do Produto</label>
                <input v-model="product.id" type="text" required
                  class="w-full bg-[#23263a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
              </div>
              <div>
                <label class="block text-gray-400 text-sm mb-1">Nome</label>
                <input v-model="product.name" type="text" required
                  class="w-full bg-[#23263a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
              </div>
              <div>
                <label class="block text-gray-400 text-sm mb-1">Preço</label>
                <input v-model.number="product.price" type="number" step="0.01" required
                  class="w-full bg-[#23263a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
              </div>
              <div>
                <label class="block text-gray-400 text-sm mb-1">Quantidade</label>
                <input v-model.number="product.amount" type="number" min="1" required
                  class="w-full bg-[#23263a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
              </div>
              <button type="button" @click="removeProduct(index)"
                class="col-span-4 text-red-500 hover:text-red-600 transition-colors p-2 text-right">
                <i class="fas fa-trash"></i> Remover Produto
              </button>
            </div>
            <button type="button" @click="addProduct"
              class="w-full py-2 border-2 border-dashed border-[#CF631C] text-[#CF631C] rounded-lg hover:bg-[#CF631C] hover:text-white transition-colors">
              <i class="fas fa-plus mr-2"></i>
              Adicionar Produto
            </button>
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

// Mock de dados para desenvolvimento
const MOCK_SALES = [
  {
    id: "019683a9-6f64-709f-a8c4-532f49082ad5",
    type: "product",
    status: "awaiting_payment",
    payment_method: "pix",
    token: "TOKEN123",
    products: [
      {
        id: "71baa072-df2f-365d-9551-d242dee44e20",
        name: "Produto Premium",
        price: 199.90,
        amount: 1
      }
    ],
    platform_fee: "5.05",
    affiliate_commission: "10.00",
    created_at: "2024-03-20T22:27:21.000000Z",
    updated_at: "2024-03-20T22:27:21.000000Z",
    customer: {
      id: "019683a9-6eb5-7205-9639-cdc0af76c47e",
      external_id: "CLI123456",
      name: "João Silva",
      email: "joao.silva@exemplo.com",
      phone: "(11) 98765-4321",
      document_number: "123.456.789-00"
    }
  },
  {
    id: "019683a9-6f64-709f-a8c4-532f49082ad6",
    type: "product",
    status: "paid",
    payment_method: "credit_card",
    token: "TOKEN456",
    products: [
      {
        id: "71baa072-df2f-365d-9551-d242dee44e21",
        name: "Produto Básico",
        price: 99.90,
        amount: 2
      }
    ],
    platform_fee: "5.05",
    affiliate_commission: "5.00",
    created_at: "2024-03-19T15:30:00.000000Z",
    updated_at: "2024-03-19T15:35:00.000000Z",
    customer: {
      id: "019683a9-6eb5-7205-9639-cdc0af76c47f",
      external_id: "CLI789012",
      name: "Maria Santos",
      email: "maria.santos@exemplo.com",
      phone: "(11) 91234-5678",
      document_number: "987.654.321-00"
    }
  },
  {
    id: "019683a9-6f64-709f-a8c4-532f49082ad7",
    type: "product",
    status: "refunded",
    payment_method: "bank_transfer",
    token: "TOKEN789",
    products: [
      {
        id: "71baa072-df2f-365d-9551-d242dee44e22",
        name: "Produto Enterprise",
        price: 499.90,
        amount: 1
      }
    ],
    platform_fee: "5.05",
    affiliate_commission: "15.00",
    created_at: "2024-03-18T10:15:00.000000Z",
    updated_at: "2024-03-18T11:20:00.000000Z",
    customer: {
      id: "019683a9-6eb5-7205-9639-cdc0af76c480",
      external_id: "CLI345678",
      name: "Pedro Oliveira",
      email: "pedro.oliveira@exemplo.com",
      phone: "(11) 99876-5432",
      document_number: "456.789.123-00"
    }
  }
]

// Função para gerar ID único
function generateUniqueId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
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
    AuthenticatedLayout,
    BaseButton,
    MenuIcon,
    CopyIcon
  },
  setup() {
    const store = useDashboardStore()
    const router = useRouter()
    const authStore = useAuthStore()
    const toast = useToast()
    const loading = ref(true)
    const sales = ref<any[]>([])
    const showCreateModal = ref(false)
    const showDetailsModal = ref(false)
    const selectedSale = ref(null)
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
      showDetailsModal,
      selectedSale,
      searchQuery,
      handleSearch
    }
  },
  data() {
    return {
      customers: [] as any[],
      availableProducts: [] as any[],
      dropdownOpen: null as string | null,
      showEditModal: false,
      showDetailModal: false,
      editingSale: null as any,
      newSale: {
        id: '',
        customer_id: '',
        type: 'product',
        status: 'awaiting_payment',
        payment_method: 'pix',
        products: [] as { id: string; name: string; price: number; amount: number }[],
        platform_fee: '0.00'
      },
      isManager: false,
      useMockData: true // Flag para controlar o uso do mock
    }
  },
  async mounted() {
    this.isManager = localStorage.getItem('role') === 'manager'
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
          response = { data: MOCK_SALES };
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
      const statusMap: { [key: string]: string } = {
        'awaiting_payment': 'px-2 py-1 rounded-full text-sm bg-yellow-500/20 text-yellow-500',
        'paid': 'px-2 py-1 rounded-full text-sm bg-green-500/20 text-green-500',
        'refunded': 'px-2 py-1 rounded-full text-sm bg-gray-500/20 text-gray-500',
        'cancelled': 'px-2 py-1 rounded-full text-sm bg-red-500/20 text-red-500',
        'Pendente': 'px-2 py-1 rounded-full text-sm bg-yellow-500/20 text-yellow-500',
        'Pago': 'px-2 py-1 rounded-full text-sm bg-green-500/20 text-green-500',
        'Estornado': 'px-2 py-1 rounded-full text-sm bg-gray-500/20 text-gray-500',
        'Cancelado': 'px-2 py-1 rounded-full text-sm bg-red-500/20 text-red-500'
      }
      return statusMap[status] || 'px-2 py-1 rounded-full text-sm bg-gray-500/20 text-gray-500'
    },

    handleNewSale() {
      // Resetando o formulário com valores padrão
      this.newSale = {
        id: generateUniqueId(),
        customer_id: '',
        type: 'product',
        status: 'awaiting_payment',
        payment_method: 'pix',
        products: [{
          id: '',
          name: '',
          price: 0,
          amount: 1
        }],
        platform_fee: '0.00'
      };
      this.showCreateModal = true;
    },

    addProduct() {
      this.newSale.products.push({
        id: '',
        name: '',
        price: 0,
        amount: 1
      });
    },

    removeProduct(index: number) {
      if (this.newSale.products.length > 1) {
        this.newSale.products.splice(index, 1);
      }
    },

    async handleCreateSale() {
      try {
        const now = new Date().toISOString();
        const payload = {
          ...this.newSale,
          created_at: now,
          updated_at: now
        };

        await externalService.sales.register(payload);
        await this.loadSales();
        this.showCreateModal = false;
        this.toast.success('Venda registrada com sucesso!');
      } catch (error) {
        console.error('Erro ao criar venda:', error);
        this.toast.error('Erro ao registrar venda');
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
      this.showDetailsModal = true;
      this.dropdownOpen = null;
    },

    async handleSaleAction(saleId: string, newStatus: string) {
      try {
        await externalService.sales.update(saleId, { status: newStatus })
        this.toast.success('Status atualizado com sucesso!')
        this.dropdownOpen = null
        await this.loadSales()
      } catch (error: any) {
        this.toast.error('Erro ao atualizar status: ' + error.message)
      }
    },

    toggleDropdown(saleId: string) {
      this.dropdownOpen = this.dropdownOpen === saleId ? null : saleId;
    },

    async copyToClipboard(text: string) {
      try {
        await navigator.clipboard.writeText(text);
        this.toast.success('ID copiado com sucesso!');
      } catch (err) {
        this.toast.error('Erro ao copiar ID');
        console.error('Erro ao copiar para a área de transferência:', err);
      }
    },

    formatWalletId(id: string | undefined): string {
      if (!id) return '-';
      if (id.length <= 8) return id;
      return `${id.slice(0, 4)}...${id.slice(-6)}`;
    },

    formatTransactionId(id: string): string {
      if (!id) return '-';
      if (id.length <= 8) return id;
      return `${id.slice(0, 8)}...`;
    }
  }
})
</script>