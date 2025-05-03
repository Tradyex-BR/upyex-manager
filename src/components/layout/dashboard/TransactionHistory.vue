<template>
  <div class="w-full h-full overflow-auto">
    <div class="min-w-full divide-y divide-gray-700">
      <div v-for="(transaction, index) in transactions" :key="index" 
        class="flex items-center justify-between py-4 px-6 hover:bg-gray-800/50">
        <div class="flex flex-col">
          <span class="text-sm text-gray-400">{{ transaction.date }}</span>
          <span class="text-white">{{ transaction.description }}</span>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-white">{{ transaction.value }}</span>
          <span :class="{
            'px-2 py-1 rounded text-xs': true,
            'bg-green-500/20 text-green-400': transaction.status === 'paid',
            'bg-yellow-500/20 text-yellow-400': transaction.status === 'pending'
          }">
            {{ transaction.status === 'paid' ? 'Pago' : 'Pendente' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Transaction {
  date: string;
  description: string;
  value: string;
  status: 'paid' | 'pending';
}

defineProps<{
  transactions: Transaction[];
}>();

defineOptions({
  name: 'TransactionHistory'
});
</script> 