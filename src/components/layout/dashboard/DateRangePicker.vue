<template>
  <div class="flex items-center gap-4">
    <div class="flex flex-col">
      <label class="text-sm text-gray-400 mb-1">Data Inicial</label>
      <input 
        type="date" 
        :value="formatDateForInput(startDate)" 
        @input="handleStartDateChange"
        class="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-blue-500"
      />
    </div>
    <div class="flex flex-col">
      <label class="text-sm text-gray-400 mb-1">Data Final</label>
      <input 
        type="date" 
        :value="formatDateForInput(endDate)" 
        @input="handleEndDateChange"
        class="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-blue-500"
      />
    </div>
    <button 
      @click="handleApply"
      class="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
    >
      Aplicar
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { format, parse } from 'date-fns'

const props = defineProps<{
  startDate: Date
  endDate: Date
}>()

const emit = defineEmits<{
  (e: 'update:startDate', value: Date): void
  (e: 'update:endDate', value: Date): void
  (e: 'apply'): void
}>()

const localStartDate = ref(props.startDate)
const localEndDate = ref(props.endDate)

function formatDateForInput(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

function handleStartDateChange(event: Event) {
  const input = event.target as HTMLInputElement
  const date = parse(input.value, 'yyyy-MM-dd', new Date())
  localStartDate.value = date
  emit('update:startDate', date)
}

function handleEndDateChange(event: Event) {
  const input = event.target as HTMLInputElement
  const date = parse(input.value, 'yyyy-MM-dd', new Date())
  localEndDate.value = date
  emit('update:endDate', date)
}

function handleApply() {
  emit('apply')
}

watch(() => props.startDate, (newValue) => {
  localStartDate.value = newValue
})

watch(() => props.endDate, (newValue) => {
  localEndDate.value = newValue
})
</script> 