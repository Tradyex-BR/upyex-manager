<template>
  <AuthenticatedLayout :loading="loading">
    <div v-if="loading" class="flex items-center justify-center py-10">
      <span class="text-white text-lg">Carregando ofertas...</span>
    </div>
    <div v-else-if="offers.length === 0" class="flex w-full min-h-[200px] items-center justify-center text-gray-400 text-lg">
      Nenhuma oferta encontrada
    </div>
    <div v-else class="overflow-visible">
      <section class="min-h-[944px] w-full overflow-visible">
        <div class="flex justify-between items-center mb-6">
          <p class="text-white text-2xl font-semibold">Ofertas</p>
          <BaseButton class="ml-2" @click="handleGenerateLink">
            Gerar link genérico
          </BaseButton>
        </div>
        <div>
          <BaseTable 
            :headers="[
              { key: 'name', label: 'Nome', align: 'left' },
              { key: 'status', label: 'Status', align: 'center' },
              { key: 'link', label: 'Link direto', align: 'center' }
            ]"
            :items="offers"
          >
            <template #name="{ item }">
              <div class="flex items-center gap-3">
                <img 
                  :src="item.logo_url || `https://ui-avatars.com/api/?name=${item.name}&background=random`"
                  :alt="item.name" 
                  class="w-8 h-8 rounded-full object-cover" 
                />
                <div class="flex flex-col">
                  <span class="font-inter text-[14px] font-normal leading-[18px] text-white">{{ item.name }}</span>
                  <span class="font-inter text-[14px] font-normal leading-[18px] text-white">{{ item.description }}</span>
                </div>
              </div>
            </template>
            
            <template #status="{ item }">
              <span :class="getStatusClass(item.is_active)">
                {{ item.is_active ? 'Ativa' : 'Inativa' }}
              </span>
            </template>
            
            <template #link="{ item }">
              <div class="flex items-center justify-center gap-2">
                <span class="font-inter text-[14px] font-normal leading-[18px] text-white truncate max-w-[200px]">
                  {{ formatLink(item.affiliate_link) }}
                </span>
                <CopyButton :stringToCopy="item.affiliate_link" />
              </div>
            </template>
          </BaseTable>
        </div>
      </section>
    </div>  

    <!-- Modal de Detalhes da Oferta -->
    <div v-if="showDetailsModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div class="bg-[#23263a] rounded-lg p-8 w-full max-w-4xl relative max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8 border-b border-[#2A2F4C] pb-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-[#CF631C] flex items-center justify-center">
              <i class="fas fa-box text-white text-xl"></i>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-white">{{ selectedOffer?.name }}</h2>
              <p class="text-2xl font-bold text-white">{{ selectedOffer?.description }}</p>
            </div>
          </div>
          <button @click="showDetailsModal = false" class="text-gray-400 hover:text-white transition-colors">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <!-- Status Badge -->
        <div class="mb-8">
          <span :class="[
            'px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2',
            selectedOffer?.is_active
              ? 'bg-green-500/20 text-green-500'
              : 'bg-red-500/20 text-red-500'
          ]">
            <i :class="['fas', selectedOffer?.is_active ? 'fa-check-circle' : 'fa-ban']"></i>
            {{ selectedOffer?.is_active ? 'Ativa' : 'Inativa' }}
          </span>
        </div>

        <!-- Main Content -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-lg bg-[#23263a] flex items-center justify-center">
                  <i class="fas fa-image text-[#CF631C]"></i>
                </div>
                <div>
                  <label class="text-gray-400 text-sm">URL do Logo</label>
                  <p class="text-white font-medium">{{ selectedOffer?.logo_url || 'Não definido' }}</p>
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
              <div>
                <label class="text-gray-400 text-sm mb-2 block">Link de Afiliado</label>
                <div class="flex items-center gap-2 bg-[#23263a] rounded-lg p-3">
                  <p class="text-white font-medium break-all">{{ selectedOffer?.affiliate_link }}</p>
                  <CopyButton :stringToCopy="selectedOffer?.affiliate_link" />
                </div>
              </div>
              <div>
                <label class="text-gray-400 text-sm mb-2 block">API Link</label>
                <div class="flex items-center gap-2 bg-[#23263a] rounded-lg p-3">
                  <p class="text-white font-medium break-all">{{ selectedOffer?.links?.api }}</p>
                  <CopyButton :stringToCopy="selectedOffer?.links?.api" />
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
          </div>
        </div>

        <!-- Informações do Secret (apenas para manager) -->
        <div v-if="role === 'manager'" class="bg-[#1a1a2a] rounded-xl p-6 mt-8">
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
              <div class="flex items-center gap-2 bg-[#23263a] rounded-lg p-3">
                <p class="text-white font-medium truncate flex-1">{{ selectedOffer?.api_secret }}</p>
                <CopyButton :stringToCopy="selectedOffer?.api_secret" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Criação de Aplicação -->
    <GenerateLinkModal
      v-if="showCreateModal"
      :role="role"
      :application-id="selectedOffer?.id"
      @close="showCreateModal = false"
      @submit="handleCreateApplication"
    />
  </AuthenticatedLayout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import GenerateLinkModal from '@/components/offers/GenerateLinkModal.vue'
import { managerService } from '@/services/managerService'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import CopyButton from '@/components/common/CopyButton.vue'
import { formatLink } from '@/utils/formatters'
import BaseTable from '@/components/common/BaseTable.vue'

export default defineComponent({
  props: {
    searchTerm: {
      type: String,
      default: ''
    }
  },
  name: 'Offers',
  components: {
    AuthenticatedLayout,
    BaseButton,
    CopyButton,
    GenerateLinkModal,
    BaseTable
  },
  setup() {
    const store = useDashboardStore()
    const loading = ref(true)
    const router = useRouter()
    const toast = useToast()
    return { store, loading, router, toast }
  },
  data() {
    return {
      offers: [] as any[],
      loading: true,
      showCreateModal: false,
      showDetailsModal: false,
      dropdownOpen: null as string | null,
      selectedOffer: null as any,
      role: localStorage.getItem('role') || '',
      genericLink: ''
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
    formatLink(link: string): string {
      return formatLink(link);
    },
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
      const baseClass = 'font-inter text-[14px] font-medium leading-[18px] inline-flex h-6 px-2 justify-center items-center gap-1 rounded-[6px] w-fit mx-auto'
      return isActive
        ? `${baseClass} bg-green-500/20 text-green-500`
        : `${baseClass} bg-red-500/20 text-red-500`
    },
    async handleCreateApplication(formData: any) {
      try {
        await managerService.applications.create(formData);
        await this.handleSearch('');
        this.showCreateModal = false;
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
        this.toast.success('Link copiado com sucesso!');
      } catch (err) {
        this.toast.error('Erro ao copiar link');
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
              this.toast.success('Status atualizado com sucesso!');
              await this.loadOffers();
            }
            break;
          case 'reset_secret':
            if (this.role === 'manager') {
              const response = await managerService.applications.resetSecret(id);
              this.selectedOffer = response;
              this.toast.success('Secret resetado com sucesso!');
            }
            break;
        }
      } catch (e) {
        console.error(`Erro ao executar ação ${action}:`, e);
        this.toast.error('Erro ao executar ação');
      }
    },
    navigateToEdit(offer: any) {
      this.router.push(`/offers/${offer.id}/edit`);
    },
    async loadOffers() {
      await this.handleSearch('');
    },
    handleGenerateLink(offer: any) {
      this.selectedOffer = offer
      this.showCreateModal = true
    }
  }
})
</script>