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
    <transition name="dropdown-fade">
      <teleport to="body">
        <div v-if="isOpen"
          ref="dropdownMenu"
          class="absolute rounded-lg shadow-lg z-10 dropdown-scroll"
          :class="[
            variant === 'light' 
              ? 'bg-white border border-[#B8B8B8] shadow-md' 
              : variant === 'full'
                ? 'bg-[#222A3F] w-full'
                : 'bg-[#222A3F]'
          ]"
          :style="dropdownStyle"
        >
          <button 
            v-for="(option, index) in options" 
            :key="index"
            type="button"
            class="w-full flex items-center gap-[10px] p-3 transition-colors font-inter text-[14px] font-normal leading-[18px] text-left outline-none focus:outline-none focus:ring-0"
            :class="[
              variant === 'light'
                ? ' text-[#222A3F] bg-white hover:bg-black hover:bg-opacity-5 active:bg-black active:bg-opacity-10'
                : 'text-white hover:bg-[#2A2F4C] bg-[#222A3F]'
            ]"
            @click="handleOptionClick(option)">
            <template v-if="option.icon">
              <img
                v-if="option.icon === 'img'"
                v-bind="option.iconProps || {}"
                :alt="option.text"
              />
              <component
                v-else
                :is="option.icon"
                v-bind="option.iconProps || {}"
                class="inline-block"
              />
            </template>
            {{ option.text }}
          </button>
        </div>
      </teleport>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick, watch } from 'vue'
import MenuIcon from '@/components/icons/MenuIcon.vue'

interface DropdownOption {
  text: string
  icon?: any
  iconProps?: Record<string, any>
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
      type: String as () => 'default' | 'light' | 'full',
      default: 'default'
    }
  },
  emits: ['update:modelValue', 'select'],
  setup(props) {
    const isOpen = ref(false)
    const dropdownRef = ref<HTMLElement | null>(null)
    const dropdownMenu = ref<HTMLElement | null>(null)
    const dropdownStyle = ref<Record<string, string>>({})

    const updateDropdownPosition = () => {
      if (dropdownRef.value && dropdownMenu.value) {
        const triggerRect = dropdownRef.value.getBoundingClientRect()
        let left = 0
        let width = 192 // 12rem = 192px
        if (props.variant === 'light' || props.variant === 'full') {
          left = triggerRect.left + window.scrollX
          width = triggerRect.width
        } else {
          // Sempre alinhar pelo lado direito do trigger
          left = triggerRect.right - width + window.scrollX
        }
        dropdownStyle.value = {
          position: 'absolute',
          top: `${triggerRect.bottom + window.scrollY}px`,
          left: `${left}px`,
          width: `${width}px`,
          zIndex: '9999',
        }
      }
    }

    watch(() => props.modelValue, (newValue) => {
      isOpen.value = newValue
    })

    watch(isOpen, (open) => {
      if (open) {
        nextTick(updateDropdownPosition)
        window.addEventListener('scroll', updateDropdownPosition)
        window.addEventListener('resize', updateDropdownPosition)
      } else {
        window.removeEventListener('scroll', updateDropdownPosition)
        window.removeEventListener('resize', updateDropdownPosition)
      }
    })

    return {
      isOpen,
      dropdownRef,
      dropdownMenu,
      dropdownStyle
    }
  },
  data() {
    return {
      // ...
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
      const dropdownMenu = this.$refs.dropdownMenu as HTMLElement
      if (dropdownRef && !dropdownRef.contains(event.target as Node) && 
          dropdownMenu && !dropdownMenu.contains(event.target as Node)) {
        this.isOpen = false
        this.$emit('update:modelValue', false)
      }
    }
  }
})
</script>

<style scoped>
.dropdown-fade-enter-active, .dropdown-fade-leave-active {
  transition: opacity 0.18s cubic-bezier(.4,0,.2,1), transform 0.18s cubic-bezier(.4,0,.2,1);
}
.dropdown-fade-enter-from, .dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px) scaleY(0.98);
}
.dropdown-fade-enter-to, .dropdown-fade-leave-from {
  opacity: 1;
  transform: translateY(0) scaleY(1);
}
.dropdown-scroll {
  max-height: 320px;
  overflow-y: auto;
}
</style> 