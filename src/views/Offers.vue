<template>
  <div v-if="loading" class="flex w-full h-full items-center justify-center text-gray-400">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
                      <div class="relative">
                        <button class="px-3 py-1 bg-[#1A1F3C] rounded-lg hover:bg-[#2A2F4C] transition-colors"
                          @click="toggleDropdown(offer.id)">
                          Ações
                        </button>
                        <div v-if="dropdownOpen === offer.id"
                          class="absolute right-0 mt-2 w-48 bg-[#1a1a1a] rounded-lg shadow-lg z-10">
                          <button class="w-full text-left px-4 py-2 hover:bg-[#2A2F4C] text-green-500"
                            @click="showOfferDetails(offer)">
                            Visualizar detalhes
                          </button>
                          <button class="w-full text-left px-4 py-2 hover:bg-[#2A2F4C] text-blue-500"
                            @click="copyToClipboard(offer.affiliate_link)">
                            Copiar link
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

  <!-- Modal de Detalhes da Oferta -->
  <div v-if="showDetailsModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div class="bg-[#23263a] rounded-lg p-8 w-full max-w-4xl relative">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8 border-b border-[#1A1F3C] pb-4">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-[#CF631C] flex items-center justify-center">
            <i class="fas fa-box text-white text-xl"></i>
          </div>
          <div>
            <h2 class="text-xl font-bold text-white">{{ selectedOffer?.name }}</h2>
            <p class="text-gray-400 text-sm">{{ selectedOffer?.description }}</p>
          </div>
        </div>
        <button @click="showDetailsModal = false" class="text-gray-400 hover:text-white transition-colors">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <!-- Status Badge -->
      <div class="mb-8">
        <span :class="getStatusClass(selectedOffer?.is_active)">
          <i :class="['fas mr-2', selectedOffer?.is_active ? 'fa-check-circle' : 'fa-ban']"></i>
          {{ selectedOffer?.is_active ? 'Ativa' : 'Inativa' }}
        </span>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-2 gap-8 mb-8">
        <!-- Informações Básicas -->
        <div class="bg-[#1a1a2a] rounded-xl p-6">
          <h3 class="text-white text-lg font-semibold mb-6 flex items-center gap-2">
            <i class="fas fa-info-circle text-[#CF631C]"></i>
            Informações Básicas
          </h3>
          <div class="space-y-6">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-[#23263a] flex items-center justify-center">
                <i class="fas fa-tag text-[#CF631C]"></i>
              </div>
              <div>
                <label class="text-gray-400 text-sm">Nome</label>
                <p class="text-white font-medium">{{ selectedOffer?.name }}</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-[#23263a] flex items-center justify-center">
                <i class="fas fa-align-left text-[#CF631C]"></i>
              </div>
              <div>
                <label class="text-gray-400 text-sm">Descrição</label>
                <p class="text-white font-medium">{{ selectedOffer?.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Links -->
        <div class="bg-[#1a1a2a] rounded-xl p-6">
          <h3 class="text-white text-lg font-semibold mb-6 flex items-center gap-2">
            <i class="fas fa-link text-[#CF631C]"></i>
            Links
          </h3>
          <div class="space-y-6">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-[#23263a] flex items-center justify-center">
                <i class="fas fa-external-link-alt text-[#CF631C]"></i>
              </div>
              <div class="flex-1">
                <label class="text-gray-400 text-sm">Link de Afiliado</label>
                <div class="flex items-center gap-2 bg-[#23263a] rounded-lg p-2">
                  <p class="text-white font-medium truncate flex-1">{{ selectedOffer?.affiliate_link }}</p>
                  <button @click="copyToClipboard(selectedOffer?.affiliate_link)" 
                    class="text-[#CF631C] hover:text-[#E67E22] transition-colors p-1">
                    <i class="fas fa-copy"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-[#23263a] flex items-center justify-center">
                <i class="fas fa-code text-[#CF631C]"></i>
              </div>
              <div class="flex-1">
                <label class="text-gray-400 text-sm">API Link</label>
                <div class="flex items-center gap-2 bg-[#23263a] rounded-lg p-2">
                  <p class="text-white font-medium truncate flex-1">{{ selectedOffer?.links?.api }}</p>
                  <button @click="copyToClipboard(selectedOffer?.links?.api)" 
                    class="text-[#CF631C] hover:text-[#E67E22] transition-colors p-1">
                    <i class="fas fa-copy"></i>
                  </button>
                </div>
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
          <button @click="handleOfferAction(selectedOffer?.id, 'toggle_status')" 
            class="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-colors"
            :class="selectedOffer?.is_active ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'">
            <i :class="['fas', selectedOffer?.is_active ? 'fa-ban' : 'fa-check']"></i>
            {{ selectedOffer?.is_active ? 'Desativar' : 'Ativar' }}
          </button>
          <button v-if="role === 'manager'" @click="handleOfferAction(selectedOffer?.id, 'reset_secret')" 
            class="flex items-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white font-medium transition-colors">
            <i class="fas fa-key"></i>
            Resetar Secret
          </button>
          <button v-if="role === 'manager'" @click="openEditModal(selectedOffer)" 
            class="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors">
            <i class="fas fa-edit"></i>
            Editar Aplicação
          </button>
        </div>
      </div>

      <!-- Informações do Secret (apenas para manager) -->
      <div v-if="role === 'manager'" class="bg-[#1a1a2a] rounded-xl p-6">
        <h3 class="text-white text-lg font-semibold mb-6 flex items-center gap-2">
          <i class="fas fa-shield-alt text-[#CF631C]"></i>
          API Secret
        </h3>
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-lg bg-[#23263a] flex items-center justify-center">
            <i class="fas fa-key text-[#CF631C]"></i>
          </div>
          <div class="flex-1">
            <label class="text-gray-400 text-sm">Secret Key</label>
            <div class="flex items-center gap-2 bg-[#23263a] rounded-lg p-2">
              <p class="text-white font-medium truncate flex-1">{{ selectedOffer?.api_secret }}</p>
              <button @click="copyToClipboard(selectedOffer?.api_secret)" 
                class="text-[#CF631C] hover:text-[#E67E22] transition-colors p-1">
                <i class="fas fa-copy"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de Edição de Aplicação -->
  <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div class="bg-[#23263a] rounded-lg p-8 w-full max-w-2xl relative">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-white">Editar Aplicação</h2>
        <button @click="showEditModal = false" class="text-gray-400 hover:text-white transition-colors">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <form @submit.prevent="handleEditApplication" class="space-y-6">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-gray-400 mb-2">Nome</label>
            <input v-model="editingApplication.name" type="text" required
              class="w-full bg-[#1a1a2a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
          </div>
          <div>
            <label class="block text-gray-400 mb-2">Descrição</label>
            <input v-model="editingApplication.description" type="text" required
              class="w-full bg-[#1a1a2a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
          </div>
          <div>
            <label class="block text-gray-400 mb-2">URL do Logo</label>
            <input v-model="editingApplication.logo_url" type="url"
              class="w-full bg-[#1a1a2a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
          </div>
          <div>
            <label class="block text-gray-400 mb-2">Link Base de Afiliado</label>
            <input v-model="editingApplication.base_affiliate_link" type="url" required
              class="w-full bg-[#1a1a2a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
          </div>
          <div>
            <label class="block text-gray-400 mb-2">Status</label>
            <select v-model="editingApplication.is_active"
              class="w-full bg-[#1a1a2a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CF631C]">
              <option :value="true">Ativa</option>
              <option :value="false">Inativa</option>
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
      showDetailsModal: false,
      showEditModal: false,
      dropdownOpen: null as string | null,
      selectedOffer: null as any,
      editingApplication: {
        name: '',
        description: '',
        logo_url: null,
        base_affiliate_link: '',
        is_active: true
      },
      newApplication: {
        name: '',
        description: '',
        logo_url: null,
        base_affiliate_link: ''
      },
      role: localStorage.getItem('role') || ''
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
    },
    toggleDropdown(id: string) {
      this.dropdownOpen = this.dropdownOpen === id ? null : id;
    },
    showOfferDetails(offer: any) {
      this.selectedOffer = offer;
      this.showDetailsModal = true;
      this.dropdownOpen = null;
    },
    async copyToClipboard(text: string) {
      try {
        await navigator.clipboard.writeText(text);
        this.$toast.success('Link copiado com sucesso!');
      } catch (err) {
        this.$toast.error('Erro ao copiar link');
      }
    },
    async handleOfferAction(id: string, action: string) {
      try {
        switch (action) {
          case 'toggle_status':
            if (this.role === 'manager') {
              await managerService.applications.update(id, {
                ...this.selectedOffer,
                is_active: !this.selectedOffer.is_active
              });
              this.$toast.success('Status atualizado com sucesso!');
              await this.loadOffers();
            }
            break;
          case 'reset_secret':
            if (this.role === 'manager') {
              const response = await managerService.applications.resetSecret(id);
              this.selectedOffer = response;
              this.$toast.success('Secret resetado com sucesso!');
            }
            break;
        }
      } catch (e) {
        console.error(`Erro ao executar ação ${action}:`, e);
        this.$toast.error('Erro ao executar ação');
      }
    },
    openEditModal(offer: any) {
      this.editingApplication = {
        name: offer.name,
        description: offer.description,
        logo_url: offer.logo_url,
        base_affiliate_link: offer.base_affiliate_link,
        is_active: offer.is_active
      };
      this.showEditModal = true;
    },
    async handleEditApplication() {
      try {
        await managerService.applications.update(this.selectedOffer.id, this.editingApplication);
        this.$toast.success('Aplicação atualizada com sucesso!');
        await this.loadOffers();
        this.showEditModal = false;
      } catch (error) {
        console.error('Erro ao editar aplicação:', error);
        this.$toast.error('Erro ao editar aplicação');
      }
    },
    async loadOffers() {
      await this.handleSearch('');
    }
  }
})
</script> 