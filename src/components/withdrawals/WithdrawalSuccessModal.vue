<template>
  <div class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="success-title"
    aria-describedby="success-subtitle">
    <div class="modal-box">
      <div class="modal-body">
        <button class="close-btn" @click="close">
          <CloseButton />
        </button>
        <div class="icon-success">
          <Sucess />
        </div>
        <h2 class="success-title" id="success-title">
          {{ props.title }}
        </h2>
        <p class="success-subtitle" id="success-subtitle">
          {{ props.subtitle }}
        </p>
      </div>
      <div class="modal-footer">
        <p class="powered-by">Protected by <span class="privy"></span></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import CloseButton from "@/components/icons/CloseButton.vue";
import Sucess from "@/components/icons/Success.vue";

const emit = defineEmits(["close", "back"]);
const close = () => emit("close");

// Default props
const props = withDefaults(
  defineProps<{
    title?: string;
    subtitle?: string;
  }>(),
  {
    title: "Tudo certo!",
    subtitle: "Sua operação foi concluída com sucesso.",
  }
);

// Handle ESC key to close modal
onMounted(() => {
  const handler = (e: KeyboardEvent) => {
    if (e.key === "Escape") close();
  };
  window.addEventListener("keydown", handler);
  onUnmounted(() => window.removeEventListener("keydown", handler));
});
</script>

<style scoped>
@media (min-width: 320px) and (max-width: 440px) {
  .modal-box {
    margin: 0 24px;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-box {
  width: 560px;
  background-color: #040d25;
  border-radius: 16px;
  text-align: center;
  color: white;
  position: relative;
}

.icon-success {
  font-size: 50px;
  color: #00ff88;
  margin-top: 64px;
  margin-bottom: 16px;
}

.success-title {
  color: #fff;
  text-align: center;
  font-family: "Bricolage Grotesque";
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;
  margin-bottom: 0;
}

.success-subtitle {
  margin-top: 4px;
  color: #c2c2c2;
  text-align: center;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  margin-bottom: 40px;
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: normal;
}

.footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 15px;
}

.protected-text {
  font-size: 12px;
  opacity: 0.6;
}

.privy {
  font-weight: bold;
}

.powered-by {
  display: flex;
  justify-content: center;
  color: #fff;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 300;
  line-height: 20px;
  gap: 8px;

  span {
    background-repeat: no-repeat;
    background-image: url(/public/privy.png);
    background-position: center;
    display: block;
    width: 90px;
    height: 24px;
  }
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
}

.back-btn {
  position: absolute;
  top: 16px;
  left: 16px;
}

.powered-by {
  display: flex;
  justify-content: center;
  color: #FFF;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 300;
  line-height: 20px;
  gap: 8px;

  span {
    background-repeat: no-repeat;
    background-image: url(/public/privy.png);
    background-position: center;
    display: block;
    width: 90px;
    height: 24px;
  }
}
</style>
