<template>
  <div class="min-h-screen bg-[#0F0F1A] text-white p-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-4">
        <button @click="router.back()" class="text-gray-400 hover:text-white transition-colors">
          <i class="fas fa-arrow-left text-xl"></i>
        </button>
        <h1 class="text-2xl font-bold">Editar Cliente</h1>
      </div>
      <div class="flex items-center gap-4">
        <span :class="[
          'px-4 py-2 rounded-full text-sm font-medium',
          customer?.status === 'Ativo' 
            ? 'bg-green-500/20 text-green-500' 
            : 'bg-red-500/20 text-red-500'
        ]">
          <i :class="[
            'fas mr-2',
            customer?.status === 'Ativo' ? 'fa-check-circle' : 'fa-ban'
          ]"></i>
          {{ customer?.status }}
        </span>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-10">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#CF631C]"></div>
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="handleSubmit" class="max-w-4xl mx-auto space-y-8">
      <!-- Informações Básicas -->
      <div class="bg-[#1a1a2a] rounded-xl p-6">
        <h2 class="text-xl font-semibold mb-6 flex items-center gap-2">
          <i class="fas fa-user text-[#CF631C]"></i>
          Informações Básicas
        </h2>
        <div class="grid grid-cols-2 gap-6">
          <div>
            <label class="block text-gray-400 mb-2">Nome</label>
            <input v-model="form.name" type="text" required
              class="w-full bg-[#23263a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
          </div>
          <div>
            <label class="block text-gray-400 mb-2">Email</label>
            <input v-model="form.email" type="email" required
              class="w-full bg-[#23263a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
          </div>
          <div>
            <label class="block text-gray-400 mb-2">Telefone</label>
            <input v-model="form.phone" type="tel" required
              class="w-full bg-[#23263a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
          </div>
          <div>
            <label class="block text-gray-400 mb-2">CPF/CNPJ</label>
            <input v-model="form.document_number" type="text"
              class="w-full bg-[#23263a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
          </div>
        </div>
      </div>

      <!-- Informações de Acesso -->
      <div class="bg-[#1a1a2a] rounded-xl p-6">
        <h2 class="text-xl font-semibold mb-6 flex items-center gap-2">
          <i class="fas fa-lock text-[#CF631C]"></i>
          Informações de Acesso
        </h2>
        <div class="grid grid-cols-2 gap-6">
          <div>
            <label class="block text-gray-400 mb-2">Status</label>
            <select v-model="form.status" required
              class="w-full bg-[#23263a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
              <option value="Ativo">Ativo</option>
              <option value="Bloqueado">Bloqueado</option>
            </select>
          </div>
          <div>
            <label class="block text-gray-400 mb-2">Link da API</label>
            <div class="flex items-center gap-2 bg-[#23263a] rounded-lg p-2">
              <p class="text-white font-medium truncate flex-1">{{ customer?.links?.api }}</p>
              <button v-if="customer?.links?.api" 
                @click="copyToClipboard(customer.links.api)" 
                class="text-[#CF631C] hover:text-[#E67E22] transition-colors p-1">
                <i class="fas fa-copy"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Ações -->
      <div class="bg-[#1a1a2a] rounded-xl p-6">
        <h2 class="text-xl font-semibold mb-6 flex items-center gap-2">
          <i class="fas fa-cogs text-[#CF631C]"></i>
          Ações
        </h2>
        <div class="flex gap-4">
          <button type="button" @click="handleResetPassword"
            class="flex items-center gap-2 px-6 py-3 bg-[#CF631C] hover:bg-[#E67E22] rounded-lg text-white font-medium transition-colors">
            <i class="fas fa-key"></i>
            Resetar Senha
          </button>
        </div>
      </div>

      <!-- Botões de Ação -->
      <div class="flex justify-end gap-4 pt-6 border-t border-[#2A2F4C]">
        <button type="button" @click="router.back()"
          class="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors">
          Cancelar
        </button>
        <button type="submit" :disabled="loading"
          class="px-6 py-2 bg-[#CF631C] hover:bg-[#E67E22] rounded-lg text-white font-medium transition-colors">
          <span v-if="loading">Salvando...</span>
          <span v-else>Salvar Alterações</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { managerService, Customer, ListCustomersParams } from '@/services/managerService'
import { externalService, UpdateCustomerPayload } from '@/services/externalService'

export default defineComponent({
  name: 'EditCustomer',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const loading = ref(false)
    const customer = ref<Customer | null>(null)
    const form = ref<UpdateCustomerPayload & { status: string }>({
      name: '',
      email: '',
      phone: '',
      document_number: '',
      status: 'Ativo'
    })

    const loadCustomer = async () => {
      loading.value = true
      try {
        const response = await managerService.customers.list({ 
          id: route.params.id as string,
          search: null,
          page: 1,
          per_page: 1,
          sort_by: 'name',
          sort_order: 'asc'
        } as ListCustomersParams)
        const customerData = response.data[0]
        customer.value = customerData
        form.value = {
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
          document_number: customerData.document_number,
          status: customerData.status
        }
      } catch (error) {
        console.error('Erro ao carregar cliente:', error)
      } finally {
        loading.value = false
      }
    }

    const handleSubmit = async () => {
      loading.value = true
      try {
        await externalService.customers.update(customer.value?.id as string, form.value)
        router.back()
      } catch (error) {
        console.error('Erro ao atualizar cliente:', error)
      } finally {
        loading.value = false
      }
    }

    const handleResetPassword = async () => {
      try {
        await externalService.customers.update(customer.value?.id as string, {
          ...form.value,
          reset_password: true
        } as UpdateCustomerPayload & { reset_password: boolean })
        // Adicionar notificação de sucesso
      } catch (error) {
        console.error('Erro ao resetar senha:', error)
      }
    }

    const copyToClipboard = async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        // Adicionar notificação de sucesso
      } catch (error) {
        console.error('Erro ao copiar para a área de transferência:', error)
      }
    }

    onMounted(loadCustomer)

    return {
      loading,
      customer,
      form,
      router,
      handleSubmit,
      handleResetPassword,
      copyToClipboard
    }
  }
})
</script> 