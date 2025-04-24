<template>
  <header class="items-center border-b-[color:var(--Borda,#222A3F)] bg-[#040D25] flex min-h-20 w-full text-sm flex-wrap px-8 py-[17px] border-b border-solid max-md:max-w-full max-md:px-5">
    <div class="self-stretch flex min-w-60 items-center gap-3 text-[#B8B8B8] font-normal leading-none flex-1 shrink basis-[0%] my-auto max-md:max-w-full">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/7f72b52c1e064ab59dcec351fcad2273/5697248805177b7c44034604d6594552a9fa39ff?placeholderIfAbsent=true"
        class="aspect-[1] object-contain w-5 self-stretch shrink-0 my-auto"
        alt="Search icon"
      />
      <input
        type="text"
        placeholder="Digite para pesquisar"
        v-model="searchQuery"
        class="self-stretch my-auto bg-transparent border-none outline-none w-full"
      />
    </div>
    <div class="self-stretch flex min-w-60 items-center gap-8 text-white font-medium text-right leading-none my-auto">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/7f72b52c1e064ab59dcec351fcad2273/af02ba544c49dcfe6925b9408f10a84e26e396f2?placeholderIfAbsent=true"
        class="aspect-[2.44] object-contain w-[83px] self-stretch shrink-0 my-auto"
        alt="Notifications"
      />
      <div class="self-stretch flex items-stretch gap-[15px] w-[193px] my-auto">
        <div class="grow my-auto">Lucas Marques</div>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/7f72b52c1e064ab59dcec351fcad2273/96e7f41f7be79a401e7a632d173b4a0468526db3?placeholderIfAbsent=true"
          class="aspect-[1.65] object-contain w-[76px] shrink-0"
          alt="User avatar"
        />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const searchQuery = ref('');
</script>
