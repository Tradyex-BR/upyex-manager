<template>
  <div class="w-6/12 relative right-[section] max-md:w-full max-md:hidden">
      <div class="background-container">
      <div id="teste" class="background-effect"></div>
    </div>
  </div>
</template>

<style scoped>
.background-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
  height: 1024px;
}

.background-effect {
  position: absolute;
    inset: 0;
    margin-left: auto;
    margin-right: auto;
    width: 511px;
    height: 511px;
    background-color: #0057FF;
    filter: blur(200px);
    opacity: 0.5;
    border-radius: 50%;
    animation: breathe-d41925a3 3s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
</style>