<template>
  <div v-if="checkingAuth" class="flex w-full h-full items-center justify-center text-gray-400">
    Carregando...
  </div>
  <div v-else-if="authStore.isAuthenticated" class="overflow-hidden">
    <div class="gap-5 flex max-md:flex-col max-md:items-stretch">
      <main class="w-full max-md:w-full max-md:ml-0">
        <div class="w-full max-md:max-w-full">
          <section class="min-h-[944px] w-full overflow-hidden max-md:max-w-full max-md:px-5">
            <DashboardCards />
            <div class="flex w-full gap-6 flex-wrap mt-6 max-md:max-w-full">
              <AssetTable v-if="authStore.user && authStore.user.role === 'MANAGER'" />
              <AffiliateTable v-if="authStore.user && authStore.user.role === 'MANAGER'" />
              <div v-if="authStore.user && authStore.user.role === 'AFFILIATE'" class="w-full">
                <!-- Exemplo de exibição para afiliado: pode customizar conforme necessário -->
                <p class="text-lg font-semibold mb-2">Bem-vindo, {{ authStore.user.name }}!</p>
                <p>Seu email: {{ authStore.user.email }}</p>
                <p>Perfil: Afiliado</p>
                <!-- Aqui você pode adicionar componentes ou tabelas específicas do afiliado -->
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  </div>
  <div v-else class="flex w-full h-full items-center justify-center text-gray-400">
    Você não está autenticado.
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import DashboardCards from "@/components/layout/dashboard/DashboardCards.vue";
import AssetTable from "@/components/layout/dashboard/AssetTable.vue";
import AffiliateTable from "@/components/layout/dashboard/AfilliateTable.vue";

const authStore = useAuthStore()
const checkingAuth = ref(true)
onMounted(async () => {
  await authStore.checkAuth()
  checkingAuth.value = false
})
</script>