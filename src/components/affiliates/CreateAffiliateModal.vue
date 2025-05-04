<template>
  <BaseModal
    title="Criar Afiliado"
    @close="$emit('close')"
  >
    <template #icon>
      <button @click="$emit('close')" class="text-white hover:text-gray-300 transition-colors">
        <i class="fas fa-arrow-left text-xl"></i>
      </button>
    </template>

    <form @submit.prevent="handleSubmit" class="flex flex-col gap-6">
      <!-- Informações Básicas -->
      <div class="flex flex-col gap-1 text-left">
        <label class="text-white text-sm font-medium leading-5" for="name">Nome</label>
        <div class="h-14 flex flex-row items-center bg-transparent px-3 py-4 rounded-lg border border-[#162F65]">
          <input id="name" v-model="form.name" type="text" required
            class="bg-transparent border-none text-white w-full outline-none text-sm p-2.5 placeholder:text-[#CACACA] placeholder:font-inter placeholder:text-base placeholder:font-normal placeholder:leading-5"
            placeholder="Digite o nome completo do afiliado" />
        </div>
      </div>

      <div class="flex flex-col gap-1 text-left">
        <label class="text-white text-sm font-medium leading-5" for="email">E-mail</label>
        <div class="h-14 flex flex-row items-center bg-transparent px-3 py-4 rounded-lg border border-[#162F65]">
          <input id="email" v-model="form.email" type="email" required
            class="bg-transparent border-none text-white w-full outline-none text-sm p-2.5 placeholder:text-[#CACACA] placeholder:font-inter placeholder:text-base placeholder:font-normal placeholder:leading-5"
            placeholder="Digite o e-mail do afiliado" />
        </div>
      </div>

      <div class="flex flex-col gap-1 text-left">
        <label class="text-white text-sm font-medium leading-5" for="integration_code">Código de Integração</label>
        <div class="h-14 flex flex-row items-center bg-transparent px-3 py-4 rounded-lg border border-[#162F65]">
          <input id="integration_code" v-model="form.integration_code" type="text" required
            class="bg-transparent border-none text-white w-full outline-none text-sm p-2.5 placeholder:text-[#CACACA] placeholder:font-inter placeholder:text-base placeholder:font-normal placeholder:leading-5"
            placeholder="Digite o código de integração" />
        </div>
      </div>

      <!-- Aplicações -->
      <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <h3 class="text-white text-sm font-medium leading-5">Aplicações</h3>
          <button type="button" 
            class="bg-[#CF631C] text-white px-4 py-2 rounded-lg hover:bg-[#B5520A] transition-colors flex items-center gap-2" 
            @click="addApp">
            <i class="fas fa-plus"></i>
            Adicionar Aplicação
          </button>
        </div>

        <div v-for="(app, idx) in form.applications" :key="idx" 
          class="p-4 bg-[#1A1F3C] rounded-lg border border-[#162F65]">
          <div class="flex justify-between items-center mb-4">
            <h4 class="text-white text-sm font-medium">Aplicação #{{ idx + 1 }}</h4>
            <button type="button" 
              class="text-red-400 hover:text-red-300 transition-colors" 
              @click="removeApp(idx)">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div class="flex flex-col gap-1">
              <label class="text-white text-sm font-medium leading-5">ID da Aplicação</label>
              <input v-model="app.id" 
                class="h-10 bg-transparent border border-[#162F65] rounded-lg px-3 text-white text-sm outline-none"
                placeholder="ID único" required />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-white text-sm font-medium leading-5">% Comissão</label>
              <input v-model.number="app.commission_percentage" 
                type="number" 
                step="0.01" 
                min="0" 
                max="1"
                class="h-10 bg-transparent border border-[#162F65] rounded-lg px-3 text-white text-sm outline-none"
                placeholder="0.00" required />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-white text-sm font-medium leading-5">Dias para Liberação</label>
              <input v-model.number="app.commission_release_days" 
                type="number" 
                min="0"
                class="h-10 bg-transparent border border-[#162F65] rounded-lg px-3 text-white text-sm outline-none"
                placeholder="0" required />
            </div>
          </div>
        </div>
      </div>

      <div v-if="error" class="p-4 bg-red-500/20 text-red-500 rounded-lg flex items-center gap-2">
        <i class="fas fa-exclamation-circle"></i>
        {{ error }}
      </div>
    </form>

    <template #footer>
      <div class="flex justify-end gap-4">
        <button type="button" 
          class="px-6 py-2 bg-[#162F65] hover:bg-[#1A3A7A] rounded-lg text-white font-medium transition-colors" 
          @click="$emit('close')">
          Cancelar
        </button>
        <button type="submit" 
          class="px-6 py-2 bg-[#CF631C] hover:bg-[#E67E22] rounded-lg text-white font-medium transition-colors" 
          :disabled="loading"
          @click="handleSubmit">
          {{ loading ? "Criando..." : "Criar Afiliado" }}
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'

interface Application {
  id: string;
  commission_percentage: number;
  commission_release_days: number;
}

interface Form {
  name: string;
  email: string;
  integration_code: string;
  applications: Application[];
}

const emit = defineEmits(['close', 'submit'])

const loading = ref(false)
const error = ref('')

const form = ref<Form>({
  name: '',
  email: '',
  integration_code: '',
  applications: [
    { id: '', commission_percentage: 0.2, commission_release_days: 7 }
  ]
})

const addApp = () => {
  form.value.applications.push({ id: '', commission_percentage: 0.2, commission_release_days: 7 })
}

const removeApp = (idx: number) => {
  form.value.applications.splice(idx, 1)
}

const handleSubmit = () => {
  loading.value = true
  error.value = ''
  emit('submit', form.value)
}
</script> 