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
            <h1 class="text-2xl font-bold text-white">Editar Aplicação</h1>
            <p class="text-gray-400">Atualize as informações da aplicação</p>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <span :class="[
            'px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2',
            offer?.is_active 
              ? 'bg-green-500/20 text-green-500' 
              : 'bg-red-500/20 text-red-500'
          ]">
            <i :class="['fas', offer?.is_active ? 'fa-check-circle' : 'fa-ban']"></i>
            {{ offer?.is_active ? 'Ativa' : 'Inativa' }}
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
                <i class="fas fa-tag absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input v-model="form.name" type="text" required
                  class="w-full bg-[#1a1a2a] text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
              </div>
            </div>
            <div>
              <label class="block text-gray-400 mb-2">Status</label>
              <div class="relative">
                <i class="fas fa-toggle-on absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <select v-model="form.is_active"
                  class="w-full bg-[#1a1a2a] text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
                  <option :value="true">Ativa</option>
                  <option :value="false">Inativa</option>
                </select>
              </div>
            </div>
            <div class="md:col-span-2">
              <label class="block text-gray-400 mb-2">Descrição</label>
              <div class="relative">
                <i class="fas fa-align-left absolute left-3 top-3 text-gray-400"></i>
                <textarea v-model="form.description" rows="3" required
                  class="w-full bg-[#1a1a2a] text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]"></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Configurações -->
        <div class="bg-[#23263a] rounded-xl p-6">
          <h2 class="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <i class="fas fa-cogs text-[#CF631C]"></i>
            Configurações
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-gray-400 mb-2">URL do Logo</label>
              <div class="relative">
                <i class="fas fa-image absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input v-model="form.logo_url" type="url"
                  class="w-full bg-[#1a1a2a] text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
              </div>
            </div>
            <div>
              <label class="block text-gray-400 mb-2">Link Base de Afiliado</label>
              <div class="relative">
                <i class="fas fa-link absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input v-model="form.base_affiliate_link" type="url" required
                  class="w-full bg-[#1a1a2a] text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
              </div>
            </div>
          </div>
        </div>

        <!-- Afiliados -->
        <div class="bg-[#23263a] rounded-xl p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold text-white flex items-center gap-2">
              <i class="fas fa-users text-[#CF631C]"></i>
              Afiliados
            </h2>
            <span class="text-gray-400">{{ offer?.affiliates?.length || 0 }} afiliados</span>
          </div>
          <BaseTable 
            :headers="[
              { key: 'name', label: 'Nome', align: 'left' },
              { key: 'email', label: 'Email', align: 'left' },
              { key: 'code', label: 'Código', align: 'left' },
              { key: 'status', label: 'Status', align: 'left' }
            ]"
            :items="offer?.affiliates || []"
          >
            <template #name="{ item }">
              {{ item.name }}
            </template>
            
            <template #email="{ item }">
              {{ item.email }}
            </template>
            
            <template #code="{ item }">
              {{ item.integration_code }}
            </template>
            
            <template #status="{ item }">
              <span :class="[
                'px-2 py-1 rounded-full text-sm',
                item.is_active 
                  ? 'bg-green-500/20 text-green-500' 
                  : 'bg-red-500/20 text-red-500'
              ]">
                {{ item.is_active ? 'Ativo' : 'Inativo' }}
              </span>
            </template>
          </BaseTable>
        </div>

        <!-- Botões de Ação -->
        <div class="flex justify-end gap-4">
          <button type="button" @click="router.back()"
            class="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors flex items-center gap-2">
            <i class="fas fa-times"></i>
            Cancelar
          </button>
          <button type="submit"
            class="px-6 py-3 bg-[#CF631C] hover:bg-[#E67E22] rounded-lg text-white font-medium transition-colors flex items-center gap-2">
            <i class="fas fa-save"></i>
            Salvar Alterações
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
import BaseTable from '@/components/BaseTable.vue'

export default defineComponent({
  name: 'EditOffer',
  components: {
    BaseTable
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const loading = ref(true)
    const offer = ref<any>(null)
    const form = ref({
      name: '',
      description: '',
      logo_url: '',
      base_affiliate_link: '',
      is_active: true
    })

    const loadOffer = async () => {
      try {
        const response = await managerService.applications.get(route.params.id as string)
        offer.value = response
        form.value = {
          name: response.name,
          description: response.description,
          logo_url: response.logo_url,
          base_affiliate_link: response.base_affiliate_link,
          is_active: response.is_active
        }
      } catch (error) {
        console.error('Erro ao carregar oferta:', error)
      } finally {
        loading.value = false
      }
    }

    const handleSubmit = async () => {
      try {
        await managerService.applications.update(route.params.id as string, form.value)
        router.push('/offers')
      } catch (error) {
        console.error('Erro ao atualizar oferta:', error)
      }
    }

    onMounted(loadOffer)

    return {
      loading,
      offer,
      form,
      router,
      handleSubmit
    }
  }
})
</script> 