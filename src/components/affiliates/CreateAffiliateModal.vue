<template>
  <BaseModal title="Criar Afiliado" @close="$emit('close')">
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-8">
      <!-- Informações Básicas -->
      <div class="flex flex-col gap-2 text-left">
        <label class="text-white text-sm font-medium leading-5" for="name">Nome</label>
        <div
          class="h-14 flex flex-row items-center bg-[#131836] px-4 py-4 rounded-lg border border-[#1e2642] focus-within:border-[#3b4167] transition-colors">
          <input id="name" v-model="form.name" type="text" required
            class="bg-transparent border-none text-white w-full outline-none text-sm p-2.5 placeholder:text-[#CACACA] placeholder:font-inter placeholder:text-base placeholder:font-normal placeholder:leading-5"
            placeholder="Digite o nome completo do afiliado" />
        </div>
      </div>

      <div class="flex flex-col gap-2 text-left">
        <label class="text-white text-sm font-medium leading-5" for="email">E-mail</label>
        <div
          class="h-14 flex flex-row items-center bg-[#131836] px-4 py-4 rounded-lg border border-[#1e2642] focus-within:border-[#3b4167] transition-colors">
          <input id="email" v-model="form.email" type="email" required
            class="bg-transparent border-none text-white w-full outline-none text-sm p-2.5 placeholder:text-[#CACACA] placeholder:font-inter placeholder:text-base placeholder:font-normal placeholder:leading-5"
            placeholder="Digite o e-mail do afiliado" />
        </div>
      </div>

      <div class="flex flex-col gap-2 text-left">
        <label class="text-white text-sm font-medium leading-5" for="integration_code">Código de Integração</label>
        <div
          class="h-14 flex flex-row items-center bg-[#131836] px-4 py-4 rounded-lg border border-[#1e2642] focus-within:border-[#3b4167] transition-colors">
          <input id="integration_code" v-model="form.integration_code" type="text" required
            class="bg-transparent border-none text-white w-full outline-none text-sm p-2.5 placeholder:text-[#CACACA] placeholder:font-inter placeholder:text-base placeholder:font-normal placeholder:leading-5"
            placeholder="Digite o código de integração" />
        </div>
      </div>

      <!-- Aplicações -->
      <div class="flex flex-col gap-5">
        <div class="flex items-center justify-between">
          <h3 class="text-white text-sm font-medium leading-5">Aplicações</h3>
          <BaseButton variant="primary" class="bg-[#e67e22] hover:bg-[#d35400] text-white transition-colors h-10 px-4"
            @click="addApp">
            <template #icon>
              <FontAwesomeIcon icon="plus" class="mr-2" />
            </template>
            Adicionar Aplicação
          </BaseButton>
        </div>

        <div v-for="(app, idx) in form.applications" :key="idx"
          class="p-5 bg-[#131836] rounded-lg border border-[#1e2642]">
          <div class="flex justify-between items-center mb-4">
            <h4 class="text-white text-sm font-medium">Aplicação #{{ idx + 1 }}</h4>
            <BaseButton variant="ghost"
              class="bg-[#2d1b1b] hover:bg-red-900 text-red-500 border-none rounded-md px-3 py-1.5 transition-colors"
              @click="removeApp(idx)">
              <FontAwesomeIcon icon="trash-alt" class="mr-2" />
              Remover
            </BaseButton>
          </div>
          <div class="grid grid-cols-3 gap-5">
            <div class="flex flex-col gap-2">
              <label class=" text-gray-400 text-sm font-medium leading-5">ID da Aplicação</label>
              <input v-model="app.id"
                class="h-10 bg-[#0a0e1c] border border-[#1e2642] rounded-lg px-4 text-white text-sm outline-none focus:border-[#3b4167] transition-colors"
                placeholder="ID único" required />
            </div>
            <div class="flex flex-col gap-2">
              <label class=" text-gray-400 text-sm font-medium leading-5">% Comissão</label>
              <input v-model.number="app.commission_percentage" type="number" step="0.01" min="0" max="1"
                class="h-10 bg-[#0a0e1c] border border-[#1e2642] rounded-lg px-4 text-white text-sm outline-none focus:border-[#3b4167] transition-colors"
                placeholder="0.00" required />
            </div>
            <div class="flex flex-col gap-2">
              <label class=" text-gray-400 text-sm font-medium leading-5">Dias para Liberação</label>
              <input v-model.number="app.commission_release_days" type="number" min="0"
                class="h-10 bg-[#0a0e1c] border border-[#1e2642] rounded-lg px-4 text-white text-sm outline-none focus:border-[#3b4167] transition-colors"
                placeholder="0" required />
            </div>
          </div>
        </div>
      </div>

      <div v-if="error" class="p-4 bg-red-500/20 text-red-500 rounded-lg flex items-center gap-2">
        <FontAwesomeIcon icon="exclamation-circle" class="mr-2" />
        {{ error }}
      </div>
    </form>

    <template #footer>
      <div class="flex justify-end gap-5 mt-4">
        <BaseButton variant="outline"
          class="bg-[#131836] hover:bg-[#1e2642] text-white h-12 px-5 transition-colors"
          @click="$emit('close')">
          Cancelar
        </BaseButton>
        <BaseButton variant="primary" type="submit"
          class="bg-[#e67e22] hover:bg-[#d35400] text-white h-12 px-5 transition-colors"
          :disabled="!isFormValid || loading" :loading="loading" @click="handleSubmit">
          {{ loading ? "Criando..." : "Criar Afiliado" }}
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { FontAwesomeIcon } from '@/plugins/fontawesome'

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

const isFormValid = computed(() => {
  // Validar campos básicos
  if (!form.value.name.trim() || !form.value.email.trim() || !form.value.integration_code.trim()) {
    return false
  }

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.value.email)) {
    return false
  }

  // Validar aplicações
  return form.value.applications.every(app =>
    app.id.trim() &&
    app.commission_percentage >= 0 &&
    app.commission_percentage <= 1 &&
    app.commission_release_days >= 0
  )
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