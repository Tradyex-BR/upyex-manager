<template>
  <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]" @click.self="$emit('close')">
    <div class="bg-[#040D25] w-[560px] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.4)] text-white">
      <div class="flex flex-col p-6 pb-10" :class="contentClass">
        <div class="flex justify-between items-center relative h-8">
          <div class="flex items-center gap-2">
            <slot name="icon"></slot>
            <p class="font-inter font-light leading-5">
              <slot name="title">{{ title }}</slot>
            </p>
          </div>
          <CloseButton @click="$emit('close')" class="cursor-pointer" />
        </div>

        <slot></slot>

        <div v-if="$slots.footer" class="mt-auto">
          <slot name="footer"></slot>
        </div>
      </div>

      <div v-if="showFooter" class="p-4 flex flex-col gap-4 text-center border-t border-[#061337]">
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
import CloseButton from "@/components/icons/CloseButton.vue";

defineProps({
  title: {
    type: String,
    default: ''
  },
  showFooter: {
    type: Boolean,
    default: false
  },
  contentClass: {
    type: String,
    default: 'gap-16'
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