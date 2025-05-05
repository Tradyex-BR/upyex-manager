<template>
  <BaseModal title="Criar Afiliado" @close="$emit('close')">
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-8">
      <!-- Informações Básicas -->
      <BaseInput
        v-model="form.name"
        label="Nome"
        placeholder="Digite o nome completo do afiliado"
        required
        variant="dark"
      />

      <BaseInput
        v-model="form.email"
        label="E-mail"
        type="email"
        placeholder="Digite o e-mail do afiliado"
        required
        variant="dark"
      />

      <BaseInput
        v-model="form.integration_code"
        label="Código de Integração"
        placeholder="Digite o código de integração"
        required
        variant="dark"
      />

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
            <BaseInput
              v-model="app.id"
              label="ID da Aplicação"
              placeholder="ID único"
              required
              variant="darker"
            />
            <BaseInput
              v-model.number="app.commission_percentage"
              label="% Comissão"
              type="number"
              step="0.01"
              min="0"
              max="1"
              placeholder="0.00"
              required
              variant="darker"
            />
            <BaseInput
              v-model.number="app.commission_release_days"
              label="Dias para Liberação"
              type="number"
              min="0"
              placeholder="0"
              required
              variant="darker"
            />
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
import BaseInput from '@/components/common/BaseInput.vue'

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