<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div class="bg-[#23263a] rounded-lg p-8 w-full max-w-4xl relative">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-white">Editar Venda</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-white transition-colors">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-2 gap-6">
          <!-- Status -->
          <div>
            <label class="block text-gray-400 mb-2">Status</label>
            <select v-model="form.status" required
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
            <select v-model="form.payment_method" required
              class="w-full bg-[#1a1a2a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
              <option value="credit_card">Cartão de Crédito</option>
              <option value="pix">PIX</option>
              <option value="bank_transfer">Transferência Bancária</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end gap-4 mt-6">
          <button type="button" @click="$emit('close')"
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
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'EditSaleModal',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    sale: {
      type: Object,
      required: true
    }
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const form = ref({
      status: '',
      payment_method: ''
    })

    watch(() => props.sale, (newSale) => {
      if (newSale) {
        form.value = {
          status: newSale.status,
          payment_method: newSale.payment_method
        }
      }
    }, { immediate: true })

    const handleSubmit = () => {
      emit('save', form.value)
    }

    return {
      form,
      handleSubmit
    }
  }
})
</script> 