<template>
  <div class="min-h-screen bg-[#1a1a2a] p-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div class="flex items-center gap-4">
          <button @click="router.back()" class="text-gray-400 hover:text-white transition-colors">
            <i class="fas fa-arrow-left text-xl"></i>
          </button>
          <div>
            <h1 class="text-2xl font-bold text-white">Editar Afiliado</h1>
            <p class="text-gray-400">Atualize as informações do afiliado</p>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <span :class="[
            'px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2',
            affiliate?.is_active 
              ? 'bg-green-500/20 text-green-500' 
              : 'bg-red-500/20 text-red-500'
          ]">
            <i :class="['fas', affiliate?.is_active ? 'fa-check-circle' : 'fa-ban']"></i>
            {{ affiliate?.is_active ? 'Ativo' : 'Inativo' }}
          </span>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#CF631C]"></div>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="space-y-8">
        <!-- Informações Básicas -->
        <div class="bg-[#23263a] rounded-xl p-6">
          <h2 class="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <i class="fas fa-info-circle text-[#CF631C]"></i>
            Informações Básicas
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-gray-400 mb-2">Nome</label>
              <div class="relative">
                <i class="fas fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input v-model="form.name" type="text" required
                  class="w-full bg-[#1a1a2a] text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
              </div>
            </div>
            <div>
              <label class="block text-gray-400 mb-2">Email</label>
              <div class="relative">
                <i class="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input v-model="form.email" type="email" required
                  class="w-full bg-[#1a1a2a] text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
              </div>
            </div>
            <div>
              <label class="block text-gray-400 mb-2">Código de afiliado</label>
              <div class="relative">
                <i class="fas fa-code absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input v-model="form.integration_code" type="text" required
                  class="w-full bg-[#1a1a2a] text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
              </div>
            </div>
            <div>
              <label class="block text-gray-400 mb-2">Status</label>
              <div class="relative">
                <i class="fas fa-toggle-on absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <select v-model="form.is_active"
                  class="w-full bg-[#1a1a2a] text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
                  <option :value="true">Ativo</option>
                  <option :value="false">Inativo</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Aplicações -->
        <div class="bg-[#23263a] rounded-xl p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold text-white flex items-center gap-2">
              <i class="fas fa-mobile-alt text-[#CF631C]"></i>
              Aplicações
            </h2>
            <button type="button" @click="addApplication" 
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors flex items-center gap-2">
              <i class="fas fa-plus"></i>
              Adicionar Aplicação
            </button>
          </div>

          <div class="space-y-4">
            <div v-for="(app, index) in form.applications" :key="index" 
              class="bg-[#1a1a2a] rounded-lg p-4 border border-[#2A2F4C]">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-gray-400 text-sm mb-1">ID da Aplicação</label>
                  <div class="relative">
                    <i class="fas fa-hashtag absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input v-model="app.id" type="text" required
                      class="w-full bg-[#23263a] text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
                  </div>
                </div>
                <div>
                  <label class="block text-gray-400 text-sm mb-1">% Comissão</label>
                  <div class="relative">
                    <i class="fas fa-percent absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input v-model.number="app.commission_percentage" type="number" step="0.01" min="0" max="1" required
                      class="w-full bg-[#23263a] text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
                  </div>
                </div>
                <div>
                  <label class="block text-gray-400 text-sm mb-1">Dias para Liberação</label>
                  <div class="relative">
                    <i class="fas fa-calendar-day absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input v-model.number="app.commission_release_days" type="number" min="0" required
                      class="w-full bg-[#23263a] text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
                  </div>
                </div>
              </div>
              <button type="button" @click="removeApplication(index)"
                class="mt-3 text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 text-sm">
                <i class="fas fa-trash-alt"></i>
                Remover Aplicação
              </button>
            </div>
          </div>
        </div>

        <!-- Botões de Ação -->
        <div class="flex justify-end gap-4">
          <button type="button" @click="router.back()"
            class="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors flex items-center gap-2">
            <i class="fas fa-times"></i>
            Cancelar
          </button>
          <button type="submit" :disabled="loading"
            class="px-6 py-3 bg-[#CF631C] hover:bg-[#E67E22] rounded-lg text-white font-medium transition-colors flex items-center gap-2">
            <i class="fas fa-save"></i>
            <span v-if="loading">Salvando...</span>
            <span v-else>Salvar Alterações</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { managerService } from '@/services/managerService'
import { logger } from '@/config/logger'
import { notificationService } from '@/services/notificationService'

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

export default defineComponent({
  name: 'EditAffiliate',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const loading = ref(true)
    const affiliate = ref<Affiliate | null>(null)
    const form = ref({
      name: '',
      email: '',
      integration_code: '',
      is_active: true,
      applications: [] as Application[]
    })

    const loadAffiliate = async () => {
      try {
        const response = await managerService.affiliates.get(route.params.id as string)
        affiliate.value = response as Affiliate
        form.value = {
          name: response.name,
          email: response.email,
          integration_code: response.integration_code,
          is_active: response.is_active,
          applications: response.applications ? response.applications.map(app => ({ ...app })) : []
        }
      } catch (error) {
        logger.error('Erro ao carregar afiliado:', error)
        notificationService.error('Erro ao carregar dados do afiliado')
      } finally {
        loading.value = false
      }
    }

    const handleSubmit = async () => {
      loading.value = true
      try {
        await managerService.affiliates.update(route.params.id as string, form.value)
        notificationService.success('Afiliado atualizado com sucesso')
        router.push('/affiliates')
      } catch (error) {
        logger.error('Erro ao atualizar afiliado:', error)
        notificationService.error('Erro ao atualizar afiliado')
      } finally {
        loading.value = false
      }
    }

    const addApplication = () => {
      form.value.applications.push({
        id: '',
        commission_percentage: 0.2,
        commission_release_days: 7
      })
    }

    const removeApplication = (index: number) => {
      form.value.applications.splice(index, 1)
    }

    onMounted(loadAffiliate)

    return {
      loading,
      affiliate,
      form,
      router,
      handleSubmit,
      addApplication,
      removeApplication
    }
  }
})
</script> 