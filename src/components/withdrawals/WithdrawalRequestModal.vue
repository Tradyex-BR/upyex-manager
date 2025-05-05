<template>
  <BaseModal
    title="Solicitar saque"
    :show-footer="false"
    @close="$emit('close')"
  >
    <div class="flex flex-col">
      <div class="flex items-center justify-center text-[56px] font-semibold leading-[64px] text-white">
        <input v-model="amount" type="text"
          class="text-center w-[200px] bg-transparent border-none outline-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="$ 0.00" @keydown="handleKeydown" @input="handleInput" />
      </div>
      <p class="text-[#B8B8B8] text-center font-inter font-light leading-5">Saldo disponível: $3.500</p>
    </div>

    <div class="flex flex-col gap-6">
      <BaseInput
        v-model="pixKey"
        label="Chave Pix"
        placeholder="Digite a chave pix, email, cpf ou telefone"
        :disabled="loading"
        variant="dark"
      >
        <template #prefix>
          <EmailConfigIcon />
        </template>
      </BaseInput>

      <BaseButton :disabled="!isAmountValid || !isPixKeyValid || loading" @click="handleSubmit">
        {{ loading ? "Processando Saque..." : "Confirmar Saque" }}
      </BaseButton>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import EmailConfigIcon from "@/components/icons/EmailConfigIcon.vue";
import BaseModal from '@/components/common/BaseModal.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import BaseInput from '@/components/common/BaseInput.vue';

const emit = defineEmits(['close', 'submit'])
const amount = ref('480.00')
const pixKey = ref('')
const loading = ref(false)

// Bloqueia letras na digitação
const handleKeydown = (e: KeyboardEvent) => {
  const allowedKeys = [
    'Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete',
    ...Array.from({ length: 10 }, (_, i) => i.toString()) // números 0-9
  ]

  if (!allowedKeys.includes(e.key)) {
    e.preventDefault()
  }
}

// Formata o valor enquanto digita
const handleInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/[^\d]/g, '') // Remove tudo que não for número

  // Se o valor estiver vazio, permite digitar
  if (!value) {
    amount.value = ''
    return
  }

  // Converte para número e formata
  const numericValue = parseInt(value)
  const formatted = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numericValue / 100)

  amount.value = formatted
}

const isAmountValid = computed(() => {
  return amount.value.length > 0
})

const isPixKeyValid = computed(() => {
  return pixKey.value.length > 0
})

const handleSubmit = () => {
  loading.value = true
  emit('submit', {
    amount: amount.value,
    pixKey: pixKey.value
  })
}
</script>

<style scoped>
@media (min-width: 320px) and (max-width: 440px) {
  .withdrawal-modal-content {
    margin: 0 24px !important;
  }
}
</style>
