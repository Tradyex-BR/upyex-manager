<template>
  <div class="vertical-lines-container">
    <div class="lines-wrapper">
      <div 
        v-for="(line, index) in lines" 
        :key="index" 
        :class="['line-container', `line-${index}`]"
      >
        <svg
          width="1"
          height="100%"
          viewBox="0 0 1 907"
          preserveAspectRatio="none"
          class="absolute-svg"
        >
          <path
            d="M1 0L1 907"
            stroke="#091D47"
            stroke-width="1pc"
            opacity="0.5"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VerticalLines',
  data() {
    return {
      lines: Array(12).fill(null).map(() => ({
        delay: Math.random() * 10,
        duration: 4 + Math.random() * 3,
        isActive: Math.random() < 0.7 // 70% chance of being active
      }))
    }
  },
  mounted() {
    // Periodically regenerate drop animations to keep them dynamic
    this.animationInterval = setInterval(() => {
      this.lines = this.lines.map(() => ({
        delay: Math.random() * 10,
        duration: 4 + Math.random() * 3,
        isActive: Math.random() < 0.7
      }))
    }, 15000) // Regenerate every 15 seconds
  },
  beforeUnmount() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval)
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
  height: 1031px;
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
  width: 1.73px;
  overflow: hidden;
}

.absolute-svg {
  position: absolute;
  inset: 0;
}

.line-container::after {
  content: "";
  display: block;
  position: absolute;
  height: 10vh;
  width: 100%;
  top: -50%;
  left: 0;
  background: linear-gradient(
    to bottom,
    rgba(105, 108, 142, 0.8) 0%,
    rgba(57, 125, 255, 1) 50%,
    rgba(105, 108, 142, 0.8) 100%
  );
  box-shadow: 
    0 0 10px #696C8E,
    0 0 20px #397DFF,
    0 0 30px #696C8E;
  animation: drop 4s linear infinite;
  animation-timing-function: cubic-bezier(0.445, 0.05, 0.55, 0.95);
  opacity: 1;
  filter: blur(20px);
}

@keyframes drop {
  0% {
    top: -50%;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  50% {
    top: 50%;
    opacity: 1;
  }
  80% {
    top: 150%;
    opacity: 0.2;
  }
  100% {
    top: 150%;
    opacity: 0;
  }
}

/* Dynamically generate styles for each line */
.line-0::after { 
  animation-delay: v-bind('lines[0].delay + "s"'); 
  display: v-bind('lines[0].isActive ? "block" : "none"'); 
  animation-duration: v-bind('lines[0].duration + "s"');
}
.line-1::after { 
  animation-delay: v-bind('lines[1].delay + "s"'); 
  display: v-bind('lines[1].isActive ? "block" : "none"'); 
  animation-duration: v-bind('lines[1].duration + "s"');
}
.line-2::after { 
  animation-delay: v-bind('lines[2].delay + "s"'); 
  display: v-bind('lines[2].isActive ? "block" : "none"'); 
  animation-duration: v-bind('lines[2].duration + "s"');
}
.line-3::after { 
  animation-delay: v-bind('lines[3].delay + "s"'); 
  display: v-bind('lines[3].isActive ? "block" : "none"'); 
  animation-duration: v-bind('lines[3].duration + "s"');
}
.line-4::after { 
  animation-delay: v-bind('lines[4].delay + "s"'); 
  display: v-bind('lines[4].isActive ? "block" : "none"'); 
  animation-duration: v-bind('lines[4].duration + "s"');
}
.line-5::after { 
  animation-delay: v-bind('lines[5].delay + "s"'); 
  display: v-bind('lines[5].isActive ? "block" : "none"'); 
  animation-duration: v-bind('lines[5].duration + "s"');
}
.line-6::after { 
  animation-delay: v-bind('lines[6].delay + "s"'); 
  display: v-bind('lines[6].isActive ? "block" : "none"'); 
  animation-duration: v-bind('lines[6].duration + "s"');
}
.line-7::after { 
  animation-delay: v-bind('lines[7].delay + "s"'); 
  display: v-bind('lines[7].isActive ? "block" : "none"'); 
  animation-duration: v-bind('lines[7].duration + "s"');
}
.line-8::after { 
  animation-delay: v-bind('lines[8].delay + "s"'); 
  display: v-bind('lines[8].isActive ? "block" : "none"'); 
  animation-duration: v-bind('lines[8].duration + "s"');
}
.line-9::after { 
  animation-delay: v-bind('lines[9].delay + "s"'); 
  display: v-bind('lines[9].isActive ? "block" : "none"'); 
  animation-duration: v-bind('lines[9].duration + "s"');
}
.line-10::after { 
  animation-delay: v-bind('lines[10].delay + "s"'); 
  display: v-bind('lines[10].isActive ? "block" : "none"'); 
  animation-duration: v-bind('lines[10].duration + "s"');
}
.line-11::after { 
  animation-delay: v-bind('lines[11].delay + "s"'); 
  display: v-bind('lines[11].isActive ? "block" : "none"'); 
  animation-duration: v-bind('lines[11].duration + "s"');
}
</style>