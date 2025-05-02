<template>
  <div class="mx-auto  py-6">
    <div class="mb-6">
      <button @click="goBack" class="flex items-center text-sm text-gray-600 hover:text-primary-600">
        <span class="mr-2">←</span>
        Voltar para a lista
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="mb-4">
      <div class="mb-4">
        <div class="animate-pulse bg-gray-200 rounded h-8 w-48 mb-2"></div>
        <div class="animate-pulse bg-gray-200 rounded h-4 w-64"></div>
      </div>
      <div class="grid gap-6 md:grid-cols-2">
        <div v-for="n in 6" :key="n" class="space-y-2">
          <div class="animate-pulse bg-gray-200 rounded h-5 w-24"></div>
          <div class="animate-pulse bg-gray-200 rounded h-6 w-full"></div>
        </div>
      </div>
    </div>

    <!-- Erro ou não encontrado -->
    <div v-else-if="!customer" class=" p-6 flex flex-col items-center justify-center py-12">
      <p class="text-gray-500 text-center mb-4">
        Cliente não encontrado ou ocorreu um erro ao carregar os dados.
      </p>
    </div>

    <!-- Detalhes do cliente -->
    <div v-else class="bg-[#23263a] p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold">{{ customer.name }}</h2>
          <p class="text-gray-500">Cliente registrado em {{ formatDate(customer.created_at) }}</p>
        </div>
        <button @click="openExternal(customer.links.frontend)" class="border px-4 py-2 rounded text-gray-700 hover:bg-gray-50 flex items-center gap-2">
          <span class="inline-block">🔗</span>
          Abrir no painel
        </button>
      </div>

      <div class="grid gap-6 md:grid-cols-2">
        <!-- Informações Pessoais -->
        <div class="space-y-2">
          <div class="text-sm font-medium text-gray-500 flex items-center gap-2">
            <span>👤</span> Informações Pessoais
          </div>
          <hr class="my-2 border-gray-200">
          <div class="grid grid-cols-[120px_1fr] gap-1">
            <div class="text-sm font-medium">ID:</div>
            <div class="text-sm">{{ customer.id }}</div>
            <div class="text-sm font-medium">ID Externo:</div>
            <div class="text-sm">{{ customer.external_id }}</div>
            <div class="text-sm font-medium">Email:</div>
            <div class="text-sm flex items-center gap-2">
              {{ customer.email }}
              <button @click="mailto(customer.email)" class="ml-1 text-blue-600 hover:underline" title="Enviar e-mail">✉️</button>
            </div>
            <div class="text-sm font-medium">Telefone:</div>
            <div class="text-sm flex items-center gap-2">
              {{ customer.phone }}
              <button @click="tel(customer.phone)" class="ml-1 text-blue-600 hover:underline" title="Ligar">📞</button>
            </div>
          </div>
        </div>
        <!-- Aplicação -->
        <div class="space-y-2">
          <div class="text-sm font-medium text-gray-500 flex items-center gap-2">
            <span>🏢</span> Aplicação
          </div>
          <hr class="my-2 border-gray-200">
          <div class="grid grid-cols-[120px_1fr] gap-1">
            <div class="text-sm font-medium">Nome:</div>
            <div class="text-sm">
              <span class="inline-block px-2 py-1 bg-gray-100 rounded text-xs font-semibold border">{{ customer.application?.name }}</span>
            </div>
            <div class="text-sm font-medium">Link de Afiliado:</div>
            <div class="text-sm truncate">
              {{ customer.application?.base_affiliate_link.replace('_code_', customer.affiliate?.integration_code) }}
            </div>
            <div class="text-sm font-medium">Painel:</div>
            <div class="text-sm">
              <button @click="openExternal(customer.application?.links.frontend)" class="text-blue-600 hover:underline flex items-center gap-1">
                Abrir aplicação no painel
                <span>🔗</span>
              </button>
            </div>
          </div>
        </div>
        <!-- Afiliado -->
        <div class="space-y-2">
          <div class="text-sm font-medium text-gray-500 flex items-center gap-2">
            <span>🔗</span> Afiliado
          </div>
          <hr class="my-2 border-gray-200">
          <div class="grid grid-cols-[120px_1fr] gap-1">
            <div class="text-sm font-medium">Nome:</div>
            <div class="text-sm">{{ customer.affiliate?.name }}</div>
            <div class="text-sm font-medium">Email:</div>
            <div class="text-sm">{{ customer.affiliate?.email }}</div>
            <div class="text-sm font-medium">Código:</div>
            <div class="text-sm">{{ customer.affiliate?.integration_code }}</div>
            <div class="text-sm font-medium">Painel:</div>
            <div class="text-sm">
              <button @click="openExternal(customer.affiliate?.links.frontend)" class="text-blue-600 hover:underline flex items-center gap-1">
                Abrir afiliado no painel
                <span>🔗</span>
              </button>
            </div>
          </div>
        </div>
        <!-- Datas -->
        <div class="space-y-2">
          <div class="text-sm font-medium text-gray-500 flex items-center gap-2">
            <span>📅</span> Datas
          </div>
          <hr class="my-2 border-gray-200">
          <div class="grid grid-cols-[120px_1fr] gap-1">
            <div class="text-sm font-medium">Criado em:</div>
            <div class="text-sm">{{ formatDate(customer.created_at) }}</div>
            <div class="text-sm font-medium">Atualizado em:</div>
            <div class="text-sm">{{ formatDate(customer.updated_at) }}</div>
          </div>
        </div>
      </div>

      <!-- <div class="flex justify-between border-t pt-6 mt-8">
        <div class="flex gap-2">
          <button @click="openExternal(customer.links.api)" class="border px-4 py-2 rounded text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            API <span>🔗</span>
          </button>
          <button @click="openExternal(customer.links.frontend)" class="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 flex items-center gap-2">
            Abrir no painel <span>🔗</span>
          </button>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/services/api';

export default defineComponent({
  name: 'CustomerDetail',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const customer = ref<any>(null);
    const loading = ref(true);

const fetchCustomer = async () => {
  loading.value = true;
  try {
    const url = `/manager/customers/${route.params.id}`;
    const response = await api.get(url); // 'api' já injeta o token no header
    customer.value = response.data;
  } catch (e) {
    customer.value = null;
  } finally {
    loading.value = false;
  }
};

    onMounted(fetchCustomer);

    function formatDate(dateString: string) {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
      });
    }

    function openExternal(url?: string) {
      if (url) window.open(url, '_blank');
    }
    function mailto(email?: string) {
      if (email) window.open(`mailto:${email}`);
    }
    function tel(phone?: string) {
      if (phone) window.open(`tel:${phone}`);
    }
    function goBack() {
      router.back();
    }
    function goToList() {
      router.push('/customers');
    }

    return {
      customer, loading, formatDate, openExternal, mailto, tel, goBack, goToList
    };
  }
});
</script>

<style scoped>
.container {
  max-width: 900px;
}
</style>
