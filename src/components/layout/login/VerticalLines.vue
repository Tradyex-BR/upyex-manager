<template>
  <div class="vertical-lines-container">
    <div class="lines-wrapper">
      <div v-for="(line, index) in lines" :key="index" class="line-container">
        <!-- Linha estática SVG -->
        <svg width="1" height="100%" viewBox="0 0 1 907" preserveAspectRatio="none" class="absolute-svg">
          <path d="M1 0L1 907" stroke="#091D47" stroke-width="1" opacity="0.5" />
        </svg>

        <!-- Luz que cai (separada do SVG estático) -->
        <div class="light-effect" :style="{
          animationDelay: line.delay + 's',
          animationDuration: line.duration + 's',
          display: line.isActive ? 'block' : 'none'
        }"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'

export default {
  name: 'VerticalLines',
  setup() {
    const lines = ref(Array(24).fill(null).map(() => generateLineConfig()))
    const updateQueue = ref([])
    const animationStates = ref(new Map())

    function generateLineConfig() {
      return {
        delay: Math.random() * 8,
        duration: 1 + Math.random() * 2,
        isActive: Math.random() < 0.6
      }
    }

    function updateLine(index) {
      const currentLine = lines.value[index]
      const currentTime = Date.now()
      const lastUpdate = animationStates.value.get(index) || 0
      const timeSinceLastUpdate = currentTime - lastUpdate

      // Só atualiza se passou tempo suficiente desde a última atualização
      if (timeSinceLastUpdate >= (currentLine.duration * 1000)) {
        const newConfig = generateLineConfig()
        // Mantém o delay atual se a animação ainda estiver em andamento
        if (timeSinceLastUpdate < (currentLine.delay * 1000)) {
          newConfig.delay = currentLine.delay
        }
        lines.value[index] = newConfig
        animationStates.value.set(index, currentTime)
      }

      // Agenda a próxima verificação
      const nextCheckDelay = Math.min(
        (currentLine.duration * 1000) - timeSinceLastUpdate,
        1000 // Verifica no máximo a cada segundo
      )

      const timeoutId = setTimeout(() => {
        updateLine(index)
      }, nextCheckDelay)

      updateQueue.value.push(timeoutId)
    }

    onMounted(() => {
      // Inicializa todas as linhas com um delay escalonado
      lines.value.forEach((_, index) => {
        setTimeout(() => {
          updateLine(index)
        }, index * 150) // Aumentado o delay entre linhas para 150ms
      })
    })

    onBeforeUnmount(() => {
      updateQueue.value.forEach(timeoutId => clearTimeout(timeoutId))
      animationStates.value.clear()
    })

    return {
      lines
    }
  }
}
</script>

<style scoped>
.vertical-lines-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
}

.lines-wrapper {
  display: grid;
  grid-auto-flow: column;
  grid-gap: 112px;
  position: relative;
}

.line-container {
  position: relative;
  width: 1.70px;
  overflow: visible;
  /* Alterado para visible para que o brilho não seja cortado */
  height: 100%;
}

.absolute-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

/* Luz que cai, agora como um elemento separado para melhor controle */
.light-effect {
  content: "";
  position: absolute;
  height: 15vh;
  width: 100%;
  top: -50%;
  left: 0;
  background: linear-gradient(to bottom,
      rgba(105, 108, 142, 0.9) 0%,
      rgba(57, 125, 255, 1) 50%,
      rgba(105, 108, 142, 0.9) 100%);
  box-shadow:
    0 0 15px #696C8E,
    0 0 30px #397DFF,
    0 0 45px #696C8E,
    0 0 60px rgba(57, 125, 255, 0.5);
  animation: drop infinite 300ms linear;
  will-change: transform, opacity, top;
  /* Otimiza a performance */
  transform-origin: center;
}

@keyframes drop {
  0% {
    top: -50%;
    opacity: 1;
    transform: scaleY(0.5);
  }

  10% {
    opacity: 1;
    transform: scaleY(1);
  }

  20% {
    opacity: 0.8;
    transform: scaleY(1.2);
  }

  50% {
    top: 50%;
    opacity: 1;
    transform: scaleY(1.2);
  }

  60% {
    opacity: 0.3;
    transform: scaleY(1.2);
  }

  80% {
    top: 150%;
    opacity: 0.2;
    transform: scaleY(0.8);
  }

  100% {
    top: 150%;
    opacity: 0;
    transform: scaleY(0.5);
  }
}
</style>