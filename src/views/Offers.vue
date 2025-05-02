<template>
  <div v-if="loading" class="flex w-full h-full items-center justify-center text-gray-400">
    Carregando...
  </div>
  <div v-else-if="offers.length === 0" class="flex w-full h-full items-center justify-center text-gray-400">
    Nenhuma oferta encontrada.
  </div>
  <div v-else class="overflow-hidden">
    <div class="gap-5 flex max-md:flex-col max-md:items-stretch">
      <main class="w-full max-md:w-full max-md:ml-0">
        <div class="w-full max-md:max-w-full">
          <section class="min-h-[944px] w-full overflow-hidden max-md:max-w-full max-md:px-5">
            <div class="flex justify-between items-center mb-6">
              <p class="text-white text-2xl font-semibold">Offers</p>
              <BaseButton class="ml-2" @click="showCreateModal = true" v-if="role === 'manager'">
                Nova Aplicação
              </BaseButton>
            </div>
            <div>
              <table class="w-full text-white border-collapse">
                <thead>
                  <tr class="bg-[#1A1F3C]">
                    <th class="p-4 text-left">Token</th>
                    <th class="p-4 text-left">Status</th>
                    <th class="p-4 text-left">Link direto</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="offer in offers" :key="offer.id" class="border-b border-[#1A1F3C]">
                    <td class="p-4">
                      <div class="flex items-center gap-3">
                        <img 
                          :src="`https://ui-avatars.com/api/?name=${offer.name}&background=random`" 
                          :alt="offer.name" 
                          class="w-10 h-10 rounded-full"
                        />
                        <div class="flex flex-col">
                          <span class="font-semibold">{{ offer.name }}</span>
                          <span class="text-sm text-gray-400">${{ offer.name.toUpperCase() }}</span>
                        </div>
                      </div>
                    </td>
                    <td class="p-4">
                      <span :class="getStatusClass(offer.is_active)">{{ offer.is_active ? 'Ativa' : 'Inativa' }}</span>
                    </td>
                    <td class="p-4">
                      <a :href="offer.affiliate_link" target="_blank" class="text-blue-400 hover:text-blue-300">
                        {{ offer.affiliate_link }}
                      </a>
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

  <!-- Modal de Criação de Aplicação -->
  <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div class="bg-[#23263a] rounded-lg p-8 w-full max-w-2xl relative">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-white">Nova Aplicação</h2>
        <button @click="showCreateModal = false" class="text-gray-400 hover:text-white transition-colors">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <form @submit.prevent="handleCreateApplication" class="space-y-6">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-gray-400 mb-2">Nome</label>
            <input v-model="newApplication.name" type="text" required
              class="w-full bg-[#1a1a2a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
          </div>
          <div>
            <label class="block text-gray-400 mb-2">Descrição</label>
            <input v-model="newApplication.description" type="text" required
              class="w-full bg-[#1a1a2a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
          </div>
          <div>
            <label class="block text-gray-400 mb-2">URL do Logo</label>
            <input v-model="newApplication.logo_url" type="url"
              class="w-full bg-[#1a1a2a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
          </div>
          <div>
            <label class="block text-gray-400 mb-2">Link Base de Afiliado</label>
            <input v-model="newApplication.base_affiliate_link" type="url" required
              class="w-full bg-[#1a1a2a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
          </div>
        </div>

        <div class="flex justify-end gap-4 mt-6">
          <button type="button" @click="showCreateModal = false"
            class="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors">
            Cancelar
          </button>
          <button type="submit"
            class="px-6 py-2 bg-[#CF631C] hover:bg-[#E67E22] rounded-lg text-white font-medium transition-colors">
            Criar Aplicação
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import Sidebar from '@/components/layout/dashboard/Sidebar.vue'
import TopBar from '@/components/layout/dashboard/TopBar.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { managerService } from '@/services/managerService'

export default defineComponent({
  props: {
    searchTerm: {
      type: String,
      default: ''
    }
  },
  name: 'Offers',
  components: {
    Sidebar,
    TopBar,
    BaseButton
  },
  setup() {
    const store = useDashboardStore()
    const loading = ref(true)
    return { store, loading }
  },
  data() {
    return {
      offers: [] as any[],
      loading: true,
      showCreateModal: false,
      newApplication: {
        name: '',
        description: '',
        logo_url: null,
        base_affiliate_link: ''
      }
    }
  },
  async mounted() {
    await this.handleSearch('');
  },
  watch: {
    searchTerm(newTerm) {
      this.handleSearch(newTerm);
    }
  },
  methods: {
    async handleSearch(term: string) {
      this.loading = true;
      try {
        const response = await managerService.applications.list({
          search: term,
          page: 1,
          per_page: 20,
          sort_by: 'created_at',
          sort_order: 'desc'
        });
        this.offers = response.data;
      } catch (e) {
        // Trate erro se necessário
      } finally {
        this.loading = false;
      }
    },
    getStatusClass(isActive: boolean): string {
      return isActive 
        ? 'px-2 py-1 rounded-full text-sm bg-green-500/20 text-green-500'
        : 'px-2 py-1 rounded-full text-sm bg-red-500/20 text-red-500'
    },
    async handleCreateApplication() {
      try {
        await managerService.applications.create(this.newApplication);
        
        // Atualizar a lista de aplicações
        await this.handleSearch('');
        
        this.showCreateModal = false;
        this.newApplication = {
          name: '',
          description: '',
          logo_url: null,
          base_affiliate_link: ''
        };
      } catch (error) {
        console.error('Erro ao criar aplicação:', error);
      }
    }
  }
})
</script> 