<template>
  <div class="bg-[#222A3F] min-w-60 flex-1 shrink basis-[0%] p-8 rounded-lg max-md:max-w-full max-md:px-5">
    <div class="flex w-full items-center text-xl text-white font-semibold leading-[1.2] justify-between max-md:max-w-full">
      <div class="self-stretch flex-1 shrink basis-[0%] my-auto max-md:max-w-full font-inter">
        Top ativos
      </div>
      <div class="self-stretch flex w-6 shrink-0 h-6 my-auto" />
    </div>
    <div class="flex w-full text-sm text-white leading-none mt-6 max-md:max-w-full">
      <BaseTable 
        :headers="[
          { key: 'rank', label: 'Rank', align: 'center' },
          { key: 'name', label: 'Moeda', align: 'left' },
          { key: 'volume', label: 'Volume', align: 'center' },
          { key: 'total_value', label: 'Valor total', align: 'center' }
        ]"
        :items="assets"
      >
        <template #rank="{ item }">
          {{ item.rank }}
        </template>
        
        <template #name="{ item }">
          <div class="flex items-center gap-3">
            <img
              :src="item.icon"
              class="aspect-[1] object-contain w-8 self-stretch shrink-0 my-auto"
              :alt="item.name"
            />
            <div class="self-stretch w-[88px] my-auto">
              <div class="font-medium">{{ item.name }}</div>
              <div class="font-normal">{{ item.symbol }}</div>
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
interface Asset {
  rank: number;
  name: string;
  symbol: string;
  icon: string;
  volume: string;
  totalValue: string;
}

const assets: Asset[] = [
  {
    rank: 1,
    name: "Binance Coin",
    symbol: "$BNB",
    icon: "https://cdn.builder.io/api/v1/image/assets/7f72b52c1e064ab59dcec351fcad2273/96203d422268d234f5dfb5534e75a3b0d627e511?placeholderIfAbsent=true",
    volume: "0.45678",
    totalValue: "$ 5.400",
  },
  {
    rank: 2,
    name: "Bitcoin",
    symbol: "$BTC",
    icon: "https://cdn.builder.io/api/v1/image/assets/7f72b52c1e064ab59dcec351fcad2273/0f7d05e3d2f8b47690733eb24a71f95ef35cfedb?placeholderIfAbsent=true",
    volume: "0.45678",
    totalValue: "$ 5.400",
  },
  {
    rank: 3,
    name: "Ethereum",
    symbol: "$ETH",
    icon: "https://cdn.builder.io/api/v1/image/assets/7f72b52c1e064ab59dcec351fcad2273/3bbb5a7a493a0ca96e2083bd7439117b2a2e143a?placeholderIfAbsent=true",
    volume: "0.45678",
    totalValue: "$ 5.400",
  },
  {
    rank: 4,
    name: "Litecoin",
    symbol: "$LTC",
    icon: "https://cdn.builder.io/api/v1/image/assets/7f72b52c1e064ab59dcec351fcad2273/a88b72a22fe6fe5db78953d2748598da60584d5c?placeholderIfAbsent=true",
    volume: "0.45678",
    totalValue: "$ 5.400",
  },
  {
    rank: 5,
    name: "Tron",
    symbol: "$LTC",
    icon: "https://cdn.builder.io/api/v1/image/assets/7f72b52c1e064ab59dcec351fcad2273/ea74f6836360bf3ea7a54a8edeaae35cc31ea95e?placeholderIfAbsent=true",
    volume: "0.45678",
    totalValue: "$ 5.400",
  },
];
</script>
