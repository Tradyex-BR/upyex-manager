<template>
  <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]" @click.self="$emit('close')">
    <div class="bg-[#040D25] w-[560px] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.4)] text-white">
      <div class="flex flex-col p-6 pb-10 gap-16">
        <div class="flex justify-between items-center relative h-8">
          <p class="font-inter font-light leading-5">
            Solicitar saque
          </p>

          <CloseButton @click="$emit('close')" />
        </div>

        <div class="flex flex-col ">
          <div class="flex items-center justify-center text-[56px] font-semibold leading-[64px] text-white">
            <input v-model="amount" type="text"
              class="text-center w-[200px] bg-transparent border-none outline-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="$ 0.00" @keydown="handleKeydown" @input="handleInput" />
          </div>
          <p class="text-[#B8B8B8] text-center font-inter font-light leading-5">Saldo disponível: $3.500</p>
        </div>

        <div class="flex flex-col gap-6">
          <div class="flex flex-col gap-1 text-left">
            <label class="text-white text-sm font-medium leading-5" for="pix-key">Chave Pix</label>
            <div class="h-14 flex flex-row items-center bg-transparent px-3 py-4 rounded-lg border border-[#162F65]">
              <EmailConfigIcon />
              <input id="pix-key" v-model="pixKey"
                class="bg-transparent border-none text-white w-full outline-none text-sm p-2.5 placeholder:text-[#CACACA] placeholder:font-inter placeholder:text-base placeholder:font-normal placeholder:leading-5"
                placeholder="Digite a chave pix, email, cpf ou telefone" type="text" />
            </div>
          </div>

          <button
            class="bg-[#CF631C] px-4 py-2 border-none rounded w-full text-[#F7F7F8] font-inter text-sm font-bold leading-6 cursor-pointer disabled:bg-[#444c5a] disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="!isAmountValid || !isPixKeyValid || loading" @click="handleSubmit">
            {{ loading ? "Processando Saque..." : "Confirmar Saque" }}
          </button>
        </div>
      </div>
      <div class="p-4 flex flex-col gap-4 text-center border-t border-[#061337]">
        <p class="text-white font-inter font-light leading-5">By logging in I agree to the Terms of Service</p>
        <p class="flex justify-center text-white font-inter font-light leading-5 gap-2">
          Protected by
          <span class="bg-no-repeat bg-center block w-[90px] h-6 bg-[url('/public/png/privy.png')]"></span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CloseButton from "@/components/icons/CloseButton.vue";
import EmailConfigIcon from "@/components/icons/EmailConfigIcon.vue";

const props = defineProps({
  suggestedAmount: {
    type: [String, Number],
    default: ''
  },
  availableBalance: {
    type: [String, Number],
    default: ''
  },
  symbol: {
    type: String,
    required: true
  },
  tokenIcon: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close', 'submit'])
const amount = ref('480.00')
const pixKey = ref('')
const confirmed = ref(false)
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
  emit('submit', {
    amount: parseFloat(amount.value.replace(/\./g, '').replace(',', '.')),
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
