<template>
  <div class="bg-[#222A3F] min-w-60 flex-1 shrink basis-[0%] p-8 rounded-lg max-md:max-w-full max-md:px-5">
    <div class="flex w-full items-center text-xl text-white font-semibold leading-[1.2] justify-between max-md:max-w-full">
      <div class="self-stretch flex-1 shrink basis-[0%] my-auto max-md:max-w-full">
        Top afiliados
      </div>
      <div class="self-stretch flex w-6 shrink-0 h-6 my-auto" />
    </div>
    <div class="flex w-full text-sm text-white leading-none mt-6 max-md:max-w-full">
      <div class="font-normal whitespace-nowrap w-[50px]">
        <div class="self-stretch w-full gap-2.5 font-medium px-2 py-3 border-[rgba(41,51,76,1)] border-b">
          Rank
        </div>
        <div
          v-for="affiliate in affiliates"
          :key="affiliate.rank"
          :class="['min-h-[60px] w-full text-center px-2 py-[21px]', affiliate.rank > 1 ? 'border-[rgba(34,42,63,1)] border-t' : '']"
        >
          {{ affiliate.rank }}
        </div>
      </div>
      <div class="flex-1 shrink basis-[0%]">
        <div class="self-stretch w-full gap-2.5 font-medium whitespace-nowrap px-4 py-3 border-[rgba(41,51,76,1)] border-b">
          Afiliados
        </div>
        <div
          v-for="affiliate in affiliates"
          :key="affiliate.rank"
          :class="['flex w-full flex-col justify-center pl-3 py-3', affiliate.rank > 1 ? 'border-[rgba(34,42,63,1)] border-t' : '']"
        >
          <div class="flex items-center gap-3">
            <img
              :src="affiliate.avatar"
              class="aspect-[1] object-contain w-8 self-stretch shrink-0 my-auto"
              :alt="affiliate.name"
            />
            <div class="self-stretch w-[99px] my-auto">
              <div class="font-medium">{{ affiliate.name }}</div>
              <div class="font-normal">{{ affiliate.username }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="font-normal flex-1 shrink basis-[0%]">
        <div class="text-center self-stretch w-full gap-2.5 font-medium whitespace-nowrap px-4 py-3 border-[rgba(41,51,76,1)] border-b">
          Volume
        </div>
        <div
          v-for="affiliate in affiliates"
          :key="affiliate.rank"
          :class="['min-h-[60px] w-full text-center px-3 py-[21px]', affiliate.rank > 1 ? 'border-[rgba(34,42,63,1)] border-t' : '']"
        >
          {{ affiliate.volume }}
        </div>
      </div>
      <div class="font-normal flex-1 shrink basis-[0%]">
        <div class="text-center self-stretch w-full gap-2.5 font-medium px-4 py-3 border-[rgba(41,51,76,1)] border-b">
          Valor total
        </div>
        <div
          v-for="affiliate in affiliates"
          :key="affiliate.rank"
          :class="['min-h-[60px] w-full text-center px-3 py-[21px]', affiliate.rank > 1 ? 'border-[rgba(34,42,63,1)] border-t' : '']"
        >
          {{ affiliate.totalValue }}
        </div>
      </div>
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