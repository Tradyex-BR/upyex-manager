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
            <p class="text-white text-2xl font-semibold mb-6">Offers</p>
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
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import Sidebar from '@/components/layout/dashboard/Sidebar.vue'
import TopBar from '@/components/layout/dashboard/TopBar.vue'
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
    TopBar
  },
  setup() {
    const store = useDashboardStore()
    const loading = ref(true)
    return { store, loading }
  },
  data() {
    return {
      offers: [] as any[],
      loading: true
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
          per_page: 20
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
    }
  }
})
</script> 