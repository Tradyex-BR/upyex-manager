<template>
  <div class="bg-[#222A3F] min-w-60 flex-1 shrink basis-[0%] p-8 rounded-lg max-md:max-w-full max-md:px-5">
    <div class="flex w-full items-center text-xl text-white font-semibold leading-[1.2] justify-between max-md:max-w-full">
      <div class="self-stretch flex-1 shrink basis-[0%] my-auto max-md:max-w-full">
        Top afiliados
      </div>
      <div class="self-stretch flex w-6 shrink-0 h-6 my-auto" />
    </div>
    <div class="flex w-full text-sm text-white leading-none mt-6 max-md:max-w-full">
      <BaseTable 
        :headers="[
          { key: 'rank', label: 'Rank', align: 'center' },
          { key: 'name', label: 'Afiliados', align: 'left' },
          { key: 'volume', label: 'Volume', align: 'center' },
          { key: 'total_value', label: 'Valor total', align: 'center' }
        ]"
        :items="affiliates"
      >
        <template #rank="{ item }">
          {{ item.rank }}
        </template>
        
        <template #name="{ item }">
          <div class="flex items-center gap-3">
            <img
              :src="item.avatar"
              class="aspect-[1] object-contain w-8 self-stretch shrink-0 my-auto"
              :alt="item.name"
            />
            <div class="self-stretch w-[99px] my-auto">
              <div class="font-medium">{{ item.name }}</div>
              <div class="font-normal">{{ item.username }}</div>
            </div>
          </div>
        </template>
        
        <template #volume="{ item }">
          {{ item.volume }}
        </template>
        
        <template #total_value="{ item }">
          {{ item.totalValue }}
        </template>
      </BaseTable>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Affiliate {
  rank: number;
  name: string;
  username: string;
  avatar: string;
  volume: string;
  totalValue: string;
}

const affiliates: Affiliate[] = [
  {
    rank: 1,
    name: "David Jahnsen",
    username: "@david403",
    avatar: "https://cdn.builder.io/api/v1/image/assets/7f72b52c1e064ab59dcec351fcad2273/6830cfe8e1025f86c5f2361098a25b4307d4d60b?placeholderIfAbsent=true",
    volume: "0.4 5678",
    totalValue: "$ 5.400",
  },
  {
    rank: 2,
    name: "Ramon Alves",
    username: "@ramongs5",
    avatar: "https://cdn.builder.io/api/v1/image/assets/7f72b52c1e064ab59dcec351fcad2273/d96d7367d03a22dd0bab330d226278fd927bdfc9?placeholderIfAbsent=true",
    volume: "0.45678",
    totalValue: "$ 5.400",
  },
  {
    rank: 3,
    name: "Laura Martins",
    username: "@martinslaur",
    avatar: "https://cdn.builder.io/api/v1/image/assets/7f72b52c1e064ab59dcec351fcad2273/f26a761d8c37165961fae57514d4158d07f84442?placeholderIfAbsent=true",
    volume: "0.45678",
    totalValue: "$ 5.400",
  },
  {
    rank: 4,
    name: "Clara Antunes",
    username: "@clarinan",
    avatar: "https://cdn.builder.io/api/v1/image/assets/7f72b52c1e064ab59dcec351fcad2273/ae4441942bf6c635f3c28873bcfcc954a17fef09?placeholderIfAbsent=true",
    volume: "0.45678",
    totalValue: "$ 5.400",
  },
  {
    rank: 5,
    name: "Lincon Gomes",
    username: "@lincong",
    avatar: "https://cdn.builder.io/api/v1/image/assets/7f72b52c1e064ab59dcec351fcad2273/a0c5705bd4dd823b99ebb3347f896ba8626ae227?placeholderIfAbsent=true",
    volume: "0.45678",
    totalValue: "$ 5.400",
  },
];
</script>