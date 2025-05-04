  <template>
    <BaseModal content-class="gap-8" @close="$emit('close')" :show-footer="true">
      <template #icon>
        <BackButton @click="$emit('close')" />
      </template>

      <div class="flex flex-col items-center gap-4 mb-10">
        <SuccessIcon />

        <div class="text-center gap-1">
          <h3 class="text-white text-[20px] font-semibold leading-6">Solicitação de saque enviada com sucesso</h3>
          <p class="text-[#C2C2C2] font-inter text-[14px] leading-[18px]">Em até 2 horas o valor será aprovado e
            possivelmente
            enviar em sua conta</p>
        </div>
      </div>
    </BaseModal>
  </template>

<script setup lang="ts">
import BaseModal from '@/components/common/BaseModal.vue';
import BackButton from '@/components/icons/BackButton.vue';
import SuccessIcon from '@/components/icons/SuccessIcon.vue';
defineProps({
  amount: {
    type: String,
    required: true
  },
  pixKey: {
    type: String,
    required: true
  }
})

defineEmits(['close'])
</script>

<style scoped>
@media (min-width: 320px) and (max-width: 440px) {
  .modal-box {
    margin: 0 24px;
  }
}
</style>
