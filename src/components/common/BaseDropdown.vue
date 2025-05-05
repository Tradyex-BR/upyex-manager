<template>
  <div class="relative w-full" ref="dropdownRef">
    <button
      type="button"
      class="p-0 outline-none border-none bg-transparent cursor-pointer w-full focus:outline-none focus:ring-0 ring-0"
      @click="toggleDropdown">
      <slot name="trigger">
        <MenuIcon />
      </slot>
    </button>
    <div v-if="isOpen"
      class="absolute right-0 rounded-lg shadow-lg z-10"
      :class="[
        variant === 'light' 
          ? 'w-full bg-white border border-[#B8B8B8] shadow-md' 
          : 'w-48 bg-[#222A3F]'
      ]"
      :style="{ top: `${top}px` }">
      <button 
        v-for="(option, index) in options" 
        :key="index"
        type="button"
        class="w-full flex items-center gap-[10px] p-3 transition-colors font-inter text-[14px] font-normal leading-[18px] text-left"
        :class="[
          variant === 'light'
            ? ' text-[#222A3F] hover:bg-black hover:bg-opacity-5 active:bg-black active:bg-opacity-10'
            : 'text-white hover:bg-[#2A2F4C] bg-[#222A3F]'
        ]"
        @click="handleOptionClick(option)">
        <template v-if="option.icon">
          <component 
            v-if="typeof option.icon === 'object'"
            :is="option.icon"
            class="inline-block"
          />
          <i v-else :class="['fas', option.icon]"></i>
        </template>
        {{ option.text }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MenuIcon from '@/components/icons/MenuIcon.vue'

interface DropdownOption {
  text: string
  icon?: string | object
  action: string
}

export default defineComponent({
  name: 'BaseDropdown',
  components: {
    MenuIcon
  },
  props: {
    options: {
      type: Array as () => DropdownOption[],
      required: true
    },
    modelValue: {
      type: Boolean,
      default: false
    },
    top: {
      type: Number,
      default: 8 // valor padrão de 8px (equivalente ao mt-2 do Tailwind)
    },
    variant: {
      type: String as () => 'default' | 'light',
      default: 'default'
    }
  },
  emits: ['update:modelValue', 'select'],
  data() {
    return {
      isOpen: false
    }
  },
  watch: {
    modelValue(newValue) {
      this.isOpen = newValue
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen
      this.$emit('update:modelValue', this.isOpen)
    },
    handleOptionClick(option: DropdownOption) {
      this.$emit('select', option.action)
      this.isOpen = false
      this.$emit('update:modelValue', false)
    },
    handleClickOutside(event: MouseEvent) {
      const dropdownRef = this.$refs.dropdownRef as HTMLElement
      if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
        this.isOpen = false
        this.$emit('update:modelValue', false)
      }
    }
  }
})
</script> 