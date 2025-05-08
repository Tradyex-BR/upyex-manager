<template>
  <BaseModal v-if="show" title="Novo Cliente" content-class="gap-8" @close="$emit('close')">
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-8">
      <div class="flex flex-col gap-7">
        <!-- Nome e Email -->
        <div class="grid grid-cols-2 gap-5">
          <BaseInput v-model="form.name" label="Nome" placeholder="Nome completo" required variant="dark">
            <template #prefix>
              <FontAwesomeIcon icon="user" class="text-[#85B1FF] mr-3" />
            </template>
          </BaseInput>

          <BaseInput v-model="form.email" label="Email" type="email" placeholder="email@exemplo.com" required
            variant="dark">
            <template #prefix>
              <FontAwesomeIcon icon="envelope" class="text-[#85B1FF] mr-3" />
            </template>
          </BaseInput>
        </div>

        <!-- Telefone e CPF/CNPJ -->
        <div class="grid grid-cols-2 gap-5">
          <BaseInput v-model="form.phone" label="Telefone" type="tel" placeholder="(00) 00000-0000" required
            variant="dark">
            <template #prefix>
              <FontAwesomeIcon icon="phone" class="text-[#85B1FF] mr-3" />
            </template>
          </BaseInput>

          <BaseInput v-model="form.document_number" label="CPF/CNPJ" placeholder="000.000.000-00" variant="dark">
            <template #prefix>
              <FontAwesomeIcon icon="id-card" class="text-[#85B1FF] mr-3" />
            </template>
          </BaseInput>
        </div>

        <!-- Código do Afiliado -->
        <BaseInput v-model="form.affiliate_code" label="Código do Afiliado" placeholder="Código único do afiliado"
          required variant="dark">
          <template #prefix>
            <FontAwesomeIcon icon="hashtag" class="text-[#85B1FF] mr-3" />
          </template>
        </BaseInput>
      </div>

      <div class="flex gap-5 mt-2">
        <BaseButton variant="outline"
          class="bg-[#131836] hover:bg-[#1e2642] text-white h-12 px-5 transition-colors flex-1" @click="$emit('close')">
          Cancelar
        </BaseButton>

        <BaseButton class="flex-1 h-12 transition-colors" type="submit" :disabled="!isFormValid || loading"
          :loading="loading">
          {{ loading ? "Criando Cliente..." : "Criar Cliente" }}
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import { FontAwesomeIcon } from '@/plugins/fontawesome'

interface Props {
  show: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'submit', data: CustomerFormData): void
}

interface CustomerFormData {
  name: string
  email: string
  phone: string
  document_number: string
  affiliate_code: string
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const loading = ref(false)
const form = ref<CustomerFormData>({
  name: '',
  email: '',
  phone: '',
  document_number: '',
  affiliate_code: ''
})

const isFormValid = computed(() => {
  // Validar campos obrigatórios
  if (!form.value.name.trim() ||
    !form.value.email.trim() ||
    !form.value.phone.trim() ||
    !form.value.affiliate_code.trim()) {
    return false
  }

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.value.email)) {
    return false
  }

  // Validar telefone (formato básico: (00) 00000-0000)
  const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/
  if (!phoneRegex.test(form.value.phone)) {
    return false
  }

  // Validar CPF/CNPJ (opcional, mas se preenchido deve ter formato válido)
  if (form.value.document_number.trim()) {
    const documentRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/
    if (!documentRegex.test(form.value.document_number)) {
      return false
    }
  }

  return true
})

const handleSubmit = async () => {
  if (!isFormValid.value) return

  loading.value = true
  try {
    emit('submit', { ...form.value })
  } finally {
    loading.value = false
  }
}
</script>