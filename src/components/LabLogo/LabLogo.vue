<template>
  <div class="lab-logo">
    <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#3b82f6" />
          <stop offset="100%" stop-color="#06b6d4" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      <!-- L -->
      <path d="M10 5 V35 H30" stroke="url(#logo-gradient)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" class="letter-path delay-1" />
      
      <!-- A -->
      <path d="M40 35 L55 5 L70 35 M45 25 H65" stroke="url(#logo-gradient)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" class="letter-path delay-2" />
      
      <!-- B -->
      <path d="M80 35 V5 H95 C105 5 105 15 95 20 C105 20 105 35 95 35 H80" stroke="url(#logo-gradient)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" class="letter-path delay-3" />
      
      <!-- Tech Dots -->
      <circle cx="55" cy="5" r="3" fill="#fff" class="tech-dot" />
      <circle cx="30" cy="35" r="3" fill="#fff" class="tech-dot delay-1" />
      <circle cx="95" cy="20" r="3" fill="#fff" class="tech-dot delay-2" />
      
    </svg>
  </div>
</template>

<script>
export default {
  name: 'LabLogo'
}
</script>

<style lang="scss" scoped>
.lab-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.5));
  }
  
  .letter-path {
    stroke-dasharray: 200;
    stroke-dashoffset: 0;
    animation: draw 3s ease-in-out infinite alternate;
    
    &.delay-1 { animation-delay: 0s; }
    &.delay-2 { animation-delay: 0.5s; }
    &.delay-3 { animation-delay: 1s; }
  }
  
  .tech-dot {
    opacity: 0;
    animation: blink 2s ease-in-out infinite;
    
    &.delay-1 { animation-delay: 0.5s; }
    &.delay-2 { animation-delay: 1s; }
  }
}

@keyframes draw {
  0% { stroke-dashoffset: 200; fill: transparent; }
  50% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: 0; }
}

@keyframes blink {
  0%, 100% { opacity: 0; transform: scale(0.5); }
  50% { opacity: 1; transform: scale(1.2); }
}
</style>
