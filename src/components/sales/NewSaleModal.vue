<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div class="bg-[#23263a] rounded-lg p-8 w-full max-w-4xl relative">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-white">Nova Venda</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-white transition-colors">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-2 gap-6">
          <!-- ID da Venda -->
          <div>
            <label class="block text-gray-400 mb-2">ID da Venda</label>
            <input v-model="form.id" type="text" required
              class="w-full bg-[#1a1a2a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
          </div>

          <!-- ID do Cliente -->
          <div>
            <label class="block text-gray-400 mb-2">ID do Cliente</label>
            <input v-model="form.customer_id" type="text" required
              class="w-full bg-[#1a1a2a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
          </div>

          <!-- Tipo -->
          <div>
            <label class="block text-gray-400 mb-2">Tipo</label>
            <select v-model="form.type" required
              class="w-full bg-[#1a1a2a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
              <option value="product">Produto</option>
              <option value="service">Serviço</option>
            </select>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-gray-400 mb-2">Status</label>
            <select v-model="form.status" required
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
            <select v-model="form.payment_method" required
              class="w-full bg-[#1a1a2a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
              <option value="pix">PIX</option>
              <option value="credit_card">Cartão de Crédito</option>
              <option value="bank_transfer">Transferência Bancária</option>
            </select>
          </div>

          <!-- Taxa da Plataforma -->
          <div>
            <label class="block text-gray-400 mb-2">Taxa da Plataforma</label>
            <input v-model="form.platform_fee" type="text" required
              class="w-full bg-[#1a1a2a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
          </div>
        </div>

        <!-- Produtos -->
        <div class="mt-6">
          <label class="block text-gray-400 mb-2">Produtos</label>
          <div class="space-y-4">
            <div v-for="(product, index) in form.products" :key="index"
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
          <button type="button" @click="$emit('close')"
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
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'NewSaleModal',
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  emits: ['close', 'save'],
  setup(_, { emit }) {
    const form = ref({
      id: '',
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
    })

    const addProduct = () => {
      form.value.products.push({
        id: '',
        name: '',
        price: 0,
        amount: 1
      })
    }

    const removeProduct = (index: number) => {
      if (form.value.products.length > 1) {
        form.value.products.splice(index, 1)
      }
    }

    const handleSubmit = () => {
      emit('save', form.value)
    }

    return {
      form,
      addProduct,
      removeProduct,
      handleSubmit
    }
  }
})
</script> 