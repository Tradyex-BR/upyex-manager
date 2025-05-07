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
          <p class="text-white text-2xl font-semibold">Aplicações</p>
          <!-- <BaseButton class="ml-2" @click="handleGenerateLink">
            Gerar link genérico
          </BaseButton> -->
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
<!--     <OfferDetailsModal
      :show="showDetailsModal"
      :offer="selectedOffer"
      @close="showDetailsModal = false"
    /> -->

    <!-- Modal de Criação de Aplicação -->
    <GenerateLinkModal
      v-if="showCreateModal"
      :show="showCreateModal"
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
import OfferDetailsModal from '@/components/offers/OfferDetailsModal.vue'
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
    OfferDetailsModal,
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
      selectedOffer: null as any
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
    showOfferDetails(offer: any) {
      this.selectedOffer = offer;
      this.showDetailsModal = true;
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