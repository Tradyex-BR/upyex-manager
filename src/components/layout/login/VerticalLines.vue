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
export default {
  name: 'VerticalLines',
  data() {
    return {
      lines: Array(24).fill(null).map(() => this.generateLineConfig()),
      updateQueue: []
    }
  },
  mounted() {
    // Inicializa a fila de atualizações para evitar que todas as linhas mudem ao mesmo tempo
    for (let i = 0; i < this.lines.length; i++) {
      this.scheduleNextUpdate(i);
    }
  },
  beforeUnmount() {
    // Limpa todos os timeouts pendentes
    this.updateQueue.forEach(timeoutId => clearTimeout(timeoutId));
  },
  methods: {
    generateLineConfig() {
      return {
        delay: Math.random() * 8, // Aumentado o delay inicial para 0-8s
        duration: 1 + Math.random() * 2, // Reduzida a duração para 3-5s para movimentos mais rápidos
        isActive: Math.random() < 0.6 // Reduzida a chance de estar ativo para 60%
      }
    },

    scheduleNextUpdate(index) {
      const currentLine = this.lines[index];
      const animationTotalTime = (currentLine.delay + currentLine.duration) * 200;

      // Aumentado o delay entre atualizações para 2-5s
      const nextUpdateDelay = animationTotalTime + (2000 + Math.random() * 3000);

      const timeoutId = setTimeout(() => {
        // Atualiza apenas esta linha específica
        this.$set(this.lines, index, this.generateLineConfig());

        // Agenda a próxima atualização
        this.scheduleNextUpdate(index);
      }, nextUpdateDelay);

      // Armazena o ID do timeout para limpeza posterior
      this.updateQueue.push(timeoutId);
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