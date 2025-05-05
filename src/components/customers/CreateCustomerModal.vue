<template>
  <BaseModal
    v-if="show"
    title="Novo Cliente"
    content-class="gap-8"
    @close="$emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-6">
      <div class="flex flex-col gap-6">
        <!-- Nome e Email -->
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-1 text-left">
            <label class="text-white text-sm font-medium leading-5">Nome</label>
            <div class="h-14 flex flex-row items-center bg-transparent px-3 py-4 rounded-lg border border-[#162F65]">
              <i class="fas fa-user text-[#CF631C] mr-3"></i>
              <input v-model="form.name" 
                type="text" 
                required
                placeholder="Nome completo"
                class="bg-transparent border-none text-white w-full outline-none text-sm p-2.5 placeholder:text-[#CACACA] placeholder:font-inter placeholder:text-base placeholder:font-normal placeholder:leading-5">
            </div>
          </div>

          <div class="flex flex-col gap-1 text-left">
            <label class="text-white text-sm font-medium leading-5">Email</label>
            <div class="h-14 flex flex-row items-center bg-transparent px-3 py-4 rounded-lg border border-[#162F65]">
              <i class="fas fa-envelope text-[#CF631C] mr-3"></i>
              <input v-model="form.email" 
                type="email" 
                required
                placeholder="email@exemplo.com"
                class="bg-transparent border-none text-white w-full outline-none text-sm p-2.5 placeholder:text-[#CACACA] placeholder:font-inter placeholder:text-base placeholder:font-normal placeholder:leading-5">
            </div>
          </div>
        </div>

        <!-- Telefone e CPF/CNPJ -->
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-1 text-left">
            <label class="text-white text-sm font-medium leading-5">Telefone</label>
            <div class="h-14 flex flex-row items-center bg-transparent px-3 py-4 rounded-lg border border-[#162F65]">
              <i class="fas fa-phone text-[#CF631C] mr-3"></i>
              <input v-model="form.phone" 
                type="tel" 
                required
                placeholder="(00) 00000-0000"
                class="bg-transparent border-none text-white w-full outline-none text-sm p-2.5 placeholder:text-[#CACACA] placeholder:font-inter placeholder:text-base placeholder:font-normal placeholder:leading-5">
            </div>
          </div>

          <div class="flex flex-col gap-1 text-left">
            <label class="text-white text-sm font-medium leading-5">CPF/CNPJ</label>
            <div class="h-14 flex flex-row items-center bg-transparent px-3 py-4 rounded-lg border border-[#162F65]">
              <i class="fas fa-id-card text-[#CF631C] mr-3"></i>
              <input v-model="form.document_number" 
                type="text"
                placeholder="000.000.000-00"
                class="bg-transparent border-none text-white w-full outline-none text-sm p-2.5 placeholder:text-[#CACACA] placeholder:font-inter placeholder:text-base placeholder:font-normal placeholder:leading-5">
            </div>
          </div>
        </div>

        <!-- Código do Afiliado -->
        <div class="flex flex-col gap-1 text-left">
          <label class="text-white text-sm font-medium leading-5">Código do Afiliado</label>
          <div class="h-14 flex flex-row items-center bg-transparent px-3 py-4 rounded-lg border border-[#162F65]">
            <i class="fas fa-hashtag text-[#CF631C] mr-3"></i>
            <input v-model="form.affiliate_code" 
              type="text" 
              required
              placeholder="Código único do afiliado"
              class="bg-transparent border-none text-white w-full outline-none text-sm p-2.5 placeholder:text-[#CACACA] placeholder:font-inter placeholder:text-base placeholder:font-normal placeholder:leading-5">
          </div>
        </div>
      </div>

      <div class="flex gap-4 mt-4">
        <BaseButton
          variant="outline"
          class="flex-1"
          @click="$emit('close')">
          Cancelar
        </BaseButton>

        <BaseButton
          class="flex-1"
          type="submit"
          :disabled="!isFormValid || loading"
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