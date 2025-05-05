<template>
  <div class="mt-4">
    <div class="bg-white rounded-lg shadow">
      <div class="p-4">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Lista de Transações</h2>
        <div class="overflow-x-auto">
          <BaseTable 
            :headers="[
              { key: 'date', label: 'Data', align: 'left' },
              { key: 'description', label: 'Descrição', align: 'left' },
              { key: 'value', label: 'Valor', align: 'left' },
              { key: 'status', label: 'Status', align: 'left' }
            ]"
            :items="data"
          >
            <template #date="{ item }">
              {{ item.date }}
            </template>
            
            <template #description="{ item }">
              {{ item.description }}
            </template>
            
            <template #value="{ item }">
              {{ item.value }}
            </template>
            
            <template #status="{ item }">
              <span :class="[
                'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                item.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              ]">
                {{ item.status === 'paid' ? 'Pago' : 'Pendente' }}
              </span>
            </template>
          </BaseTable>
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
  data: Transaction[];
}>();
</script> 