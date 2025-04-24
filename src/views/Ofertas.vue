<template>
  <div class="bg-[#040D25] overflow-hidden">
    <div class="gap-5 flex max-md:flex-col max-md:items-stretch">
      <Sidebar />
      <main class="w-[81%] ml-5 max-md:w-full max-md:ml-0">
        <div class="w-full max-md:max-w-full">
          <TopBar />
          <section class="bg-[#040D25] min-h-[944px] w-full overflow-hidden pt-8 pb-20 px-8 max-md:max-w-full max-md:px-5">
            <p class="text-white text-2xl font-semibold mb-6">Ofertas</p>
            <div class="overflow-x-auto">
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
                  <tr v-for="oferta in ofertas" :key="oferta.id" class="border-b border-[#1A1F3C]">
                    <td class="p-4">{{ oferta.data }}</td>
                    <td class="p-4">{{ oferta.cliente }}</td>
                    <td class="p-4">{{ oferta.token }}</td>
                    <td class="p-4">
                      <span :class="getStatusClass(oferta.status)">{{ oferta.status }}</span>
                    </td>
                    <td class="p-4">{{ oferta.metodoPagamento }}</td>
                    <td class="p-4">{{ oferta.volume }}</td>
                    <td class="p-4">{{ oferta.valorBRL }}</td>
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
import { defineComponent } from 'vue'
import Sidebar from '@/components/layout/dashboard/Sidebar.vue'
import TopBar from '@/components/layout/dashboard/TopBar.vue'

interface Oferta {
  id: number;
  data: string;
  cliente: string;
  token: string;
  status: string;
  metodoPagamento: string;
  volume: string;
  valorBRL: string;
}

export default defineComponent({
  name: 'Ofertas',
  components: {
    Sidebar,
    TopBar
  },
  data() {
    return {
      ofertas: [] as Oferta[]
    }
  },
  methods: {
    getStatusClass(status: string): string {
      const classes = {
        'Pago': 'px-2 py-1 rounded-full text-sm bg-green-500/20 text-green-500',
        'Pendente': 'px-2 py-1 rounded-full text-sm bg-yellow-500/20 text-yellow-500',
        'Cancelado': 'px-2 py-1 rounded-full text-sm bg-red-500/20 text-red-500'
      }
      return classes[status as keyof typeof classes] || ''
    },
    carregarOfertas() {
      this.ofertas = [
        {
          id: 1,
          data: '01/03/2025',
          cliente: 'Alison Souza',
          token: 'Binance Coin',
          status: 'Pago',
          metodoPagamento: 'PIX',
          volume: '0.45678 $BNB',
          valorBRL: 'R$ 5.90'
        },
        {
          id: 2,
          data: '01/03/2025',
          cliente: 'Juliana Gonçalves',
          token: 'Binance Coin',
          status: 'Pendente',
          metodoPagamento: 'PIX',
          volume: '0.45678 $BNB',
          valorBRL: 'R$ 5.90'
        },
        {
          id: 3,
          data: '01/03/2025',
          cliente: 'Lucas Pereira',
          token: 'Binance Coin',
          status: 'Cancelado',
          metodoPagamento: 'Cartão Crédito',
          volume: '0.45678 $BNB',
          valorBRL: 'R$ 5.90'
        },
        {
          id: 4,
          data: '01/03/2025',
          cliente: 'João Paiva',
          token: 'Binance Coin',
          status: 'Pago',
          metodoPagamento: 'Cartão Crédito',
          volume: '0.45678 $BNB',
          valorBRL: 'R$ 5.90'
        },
        {
          id: 5,
          data: '01/03/2025',
          cliente: 'Anderson Leão',
          token: 'Binance Coin',
          status: 'Pago',
          metodoPagamento: 'PIX',
          volume: '0.45678 $BNB',
          valorBRL: 'R$ 5.90'
        },
        {
          id: 6,
          data: '01/03/2025',
          cliente: 'Marilia Ribeiro',
          token: 'Binance Coin',
          status: 'Pendente',
          metodoPagamento: 'PIX',
          volume: '0.45678 $BNB',
          valorBRL: 'R$ 5.90'
        },
        {
          id: 7,
          data: '01/03/2025',
          cliente: 'Carlos Nunes',
          token: 'Binance Coin',
          status: 'Cancelado',
          metodoPagamento: 'PIX',
          volume: '0.45678 $BNB',
          valorBRL: 'R$ 5.90'
        },
        {
          id: 8,
          data: '01/03/2025',
          cliente: 'Henrique Pontes',
          token: 'Binance Coin',
          status: 'Pendente',
          metodoPagamento: 'PIX',
          volume: '0.45678 $BNB',
          valorBRL: 'R$ 5.90'
        }
      ]
    }
  },
  mounted() {
    this.carregarOfertas()
  }
})
</script> 