<template>
  <BaseModal
    title="Solicitar saque"
    :show-footer="false"
    @close="$emit('close')"
    :content-class="'gap-[64px]'"
  >
    <div class="flex flex-col">
      <div class="flex items-center justify-center text-[56px] font-semibold leading-[64px] text-white">
        <input v-model="amount" type="text"
          class="text-center w-[200px] bg-transparent border-none outline-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="R$ 0.00" @keydown="handleKeydown" @input="handleInput" />
      </div>
      <p class="text-[#B8B8B8] text-center font-inter font-light leading-5">
        Saldo disponível: R$ {{ withdrawalInfo.current_balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
      </p>
      <p v-if="error" class="text-red-500 text-center font-inter font-light leading-5 mt-2">
        {{ error }}
      </p>
      <p class="text-[#B8B8B8] text-center font-inter font-light leading-5 mt-2">
        Limite diário: {{ withdrawalInfo.withdrawals_today }}/{{ withdrawalInfo.daily_limit }} saques
      </p>
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

      <BaseButton 
        :disabled="!isAmountValid || !isPixKeyValid || loading" 
        @click="handleSubmit"
      >
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

interface WithdrawalInfo {
  minimum_amount: number;
  maximum_amount: number;
  daily_limit: number;
  withdrawals_today: number;
  current_balance: number;
}

const props = defineProps<{
  withdrawalInfo: WithdrawalInfo
}>()

const emit = defineEmits(['close', 'submit'])
const amount = ref('')
const pixKey = ref('')
const loading = ref(false)
const error = ref('')

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

const numericAmount = computed(() => {
  return Number(amount.value.replace(/[^\d]/g, '')) / 100
})

const isAmountValid = computed(() => {
  if (!amount.value) return false
  
  const value = numericAmount.value
  if (value < props.withdrawalInfo.minimum_amount) {
    error.value = `O valor mínimo para saque é R$ ${props.withdrawalInfo.minimum_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    return false
  }
  if (value > props.withdrawalInfo.maximum_amount) {
    error.value = `O valor máximo para saque é R$ ${props.withdrawalInfo.maximum_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    return false
  }
  if (value > props.withdrawalInfo.current_balance) {
    error.value = 'Saldo insuficiente para realizar o saque'
    return false
  }
  if (props.withdrawalInfo.withdrawals_today >= props.withdrawalInfo.daily_limit) {
    error.value = `Você já atingiu o limite diário de ${props.withdrawalInfo.daily_limit} saques`
    return false
  }
  
  error.value = ''
  return true
})

const isPixKeyValid = computed(() => {
  return pixKey.value.length > 0
})

const handleSubmit = () => {
  if (!isAmountValid.value || !isPixKeyValid.value) return
  
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
