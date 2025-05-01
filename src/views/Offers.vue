<template>
  <div v-if="loading" class="flex w-full h-full items-center justify-center text-gray-400">
    Carregando...
  </div>
  <div v-else-if="offersSuccess" class="overflow-hidden">
    <div class="gap-5 flex max-md:flex-col max-md:items-stretch">
      <main class="w-full max-md:w-full max-md:ml-0">
        <div class="w-full max-md:max-w-full">
          <section class=" min-h-[944px] w-full overflow-hidden max-md:max-w-full max-md:px-5">
            <p class="text-white text-2xl font-semibold mb-6">Offers</p>
            <div>
              <table class="w-full text-white border-collapse">
                <thead>
                  <tr class="bg-[#1A1F3C]">
                    <th class="p-4 text-left">Data</th>
                    <th class="p-4 text-left">Cliente</th>
                    <th class="p-4 text-left">Token</th>
                    <th class="p-4 text-left">Status</th>
                    <th class="p-4 text-left">Método de Pagamento</th>
                    <th class="p-4 text-left">Volume</th>
                    <th class="p-4 text-left">Valor BRL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="offer in offers" :key="offer.id" class="border-b border-[#1A1F3C]">
                    <td class="p-4">{{ offer.date }}</td>
                    <td class="p-4">{{ offer.client }}</td>
                    <td class="p-4 flex items-center gap-2">
                      <img :src="`https://ui-avatars.com/api/?name=${offer.token}&background=random`" :alt="offer.token" class="w-10 h-10 rounded-full" />
                      <p class="text-white text-sm font-semibold">{{ offer.token }}</p>
                    </td>
                    <td class="p-4">
                      <span :class="getStatusClass(offer.status)">{{ offer.status }}</span>
                    </td>
                    <td class="p-4">{{ offer.paymentMethod }}</td>
                    <td class="p-4">{{ offer.volume }}</td>
                    <td class="p-4">{{ offer.valueBRL }}</td>
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
    const offersSuccess = ref(false)
    return { store, loading, offersSuccess }
  },
  computed: {
    offers() {
      return this.store.offers
    }
  },
  async mounted() {
    this.loading = true
    this.offersSuccess = false
    try {
      const response = await managerService.sales.list({
        page: 1,
        per_page: 20
      })
      this.store.offers = response.data.map((sale: any) => {
        const product = (sale.products && sale.products.length > 0) ? sale.products[0] : null;
        return {
          id: sale.id,
          date: sale.created_at ? new Date(sale.created_at).toLocaleString('pt-BR') : '',
          client: sale.customer?.name || '',
          token: product ? product.name : '',
          status: sale.status || '',
          paymentMethod: sale.payment_method || '',
          volume: product ? product.amount : '',
          valueBRL: product ? (Number(product.price) * Number(product.amount)).toFixed(2) : '',
        };
      })
      
      // Considere sucesso se vierem dados (ajuste conforme a API real)
      if (this.store.offers && Array.isArray(this.store.offers) && this.store.offers.length > 0) {
        this.offersSuccess = true
      }
    } catch (e) {
      console.error('Erro ao buscar ofertas:', e)
      // Não faz nada, continua carregando
    } finally {
      if (!this.offersSuccess) {
        this.loading = true // mantém loading se não houver sucesso
      } else {
        this.loading = false
      }
    }
  },
  watch: {
    searchTerm(newTerm) {
      if (newTerm) {
        this.handleSearch(newTerm)
      }
    }
  },
  methods: {
    async handleSearch(term: string) {
      this.loading = true;
      this.offersSuccess = false;
      try {
        const response = await managerService.sales.list({
          search: term,
          page: 1,
          per_page: 20
        });
        this.store.offers = response.data.map((sale: any) => {
          const product = (sale.products && sale.products.length > 0) ? sale.products[0] : null;
          return {
            id: sale.id,
            date: sale.created_at ? new Date(sale.created_at).toLocaleString('pt-BR') : '',
            client: sale.customer?.name || '',
            token: product ? product.name : '',
            status: sale.status || '',
            paymentMethod: sale.payment_method || '',
            volume: product ? product.amount : '',
            valueBRL: product ? (Number(product.price) * Number(product.amount)).toFixed(2) : '',
          };
        });
        if (this.store.offers && Array.isArray(this.store.offers) && this.store.offers.length > 0) {
          this.offersSuccess = true;
        }
      } catch (e) {
        // Trate erro se necessário
      } finally {
        if (!this.offersSuccess) {
          this.loading = true;
        } else {
          this.loading = false;
        }
      }
    },
    getStatusClass(status: string): string {
      const classes = {
        'Pago': 'px-2 py-1 rounded-full text-sm bg-green-500/20 text-green-500',
        'Pendente': 'px-2 py-1 rounded-full text-sm bg-yellow-500/20 text-yellow-500',
        'Cancelado': 'px-2 py-1 rounded-full text-sm bg-red-500/20 text-red-500'
      }
      return classes[status as keyof typeof classes] || ''
    }
  }
})
</script> 