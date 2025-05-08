<template>
  <BaseModal title="Resetar chave de API?" :show-footer="false" @close="$emit('close')" :content-class="'gap-6'">
    <div class="flex flex-col gap-6">
      <div class="flex items-start gap-4">
        <div class="p-2 rounded-full bg-red-500/10">
          <font-awesome-icon icon="exclamation-triangle" class="w-6 h-6 text-red-500" />
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-white font-inter font-light leading-6">
            Ao redefinir sua chave de API, a chave atual será <span class="font-medium text-red-400">desativada
              imediatamente</span> e uma nova será gerada.
          </p>
          <p class="text-[#B8B8B8] font-inter font-light leading-6">
            Isso pode afetar integrações que estejam utilizando a chave antiga.
          </p>
        </div>
      </div>

      <div class="bg-[#061337] p-4 rounded-lg">
        <p class="text-[#B8B8B8] font-inter font-light leading-5 mb-2">Chave atual:</p>
        <div class="flex items-center gap-2">
          <code class="bg-[#0A1F4D] p-2 rounded text-gray-300 font-mono text-sm flex-1 truncate">
            {{ showApiKey ? props.apiKey : maskedApiKey }}
          </code>
          <button @click="copyApiKey" class="p-2 rounded hover:bg-[#0A1F4D] transition-colors"
            :title="copied ? 'Copiado!' : 'Copiar chave'">
            <font-awesome-icon :icon="copied ? 'check' : 'copy'" class="w-4 h-4 text-[#B8B8B8]" />
          </button>
          <button @click="showApiKey = !showApiKey" class="p-2 rounded hover:bg-[#0A1F4D] transition-colors"
            :title="showApiKey ? 'Ocultar chave' : 'Mostrar chave'">
            <font-awesome-icon :icon="showApiKey ? 'eye-slash' : 'eye'" class="w-4 h-4 text-[#B8B8B8]" />
          </button>
        </div>
      </div>

      <div class="flex gap-4 mt-2">
        <BaseButton variant="outline" class="flex-1" @click="$emit('close')">
          Cancelar
        </BaseButton>
        <BaseButton variant="danger" class="flex-1" @click="$emit('submit')">
          <font-awesome-icon icon="rotate" class="w-4 h-4 mr-2" />
          Sim, resetar chave
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>
<script setup lang="ts">
import BaseModal from '@/components/common/BaseModal.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { computed, ref } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faEye, faEyeSlash, faCopy, faCheck, faExclamationTriangle, faRotate } from '@fortawesome/free-solid-svg-icons'

library.add(faEye, faEyeSlash, faCopy, faCheck, faExclamationTriangle, faRotate)

const props = defineProps<{
  show: boolean
  applicationId: string
  apiKey: string
}>()

const copied = ref(false);
const showApiKey = ref(false);

const maskedApiKey = computed(() => {
  if (!props.apiKey) return '••••••••••••••••••••••••';
  return props.apiKey.substring(0, 8) + '••••••••••••••••••' + props.apiKey.substring(props.apiKey.length - 4);
});

const copyApiKey = () => {
  navigator.clipboard.writeText(props.apiKey);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
};

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit'): void
}>()
</script>
