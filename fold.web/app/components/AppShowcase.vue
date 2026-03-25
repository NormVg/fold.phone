<template>
  <section class="w-full py-20 md:py-28 overflow-hidden">
    <div class="text-center mb-16 px-6">
      <h2 class="font-display italic text-4xl md:text-5xl text-brand-charcoal mb-4">
        Experience Fold
      </h2>
      <p class="font-sans text-lg text-brand-charcoal/60 max-w-xl mx-auto">
        A glimpse into your private sanctuary — beautifully crafted for capturing life's moments.
      </p>
    </div>

    <!-- Marquee Container -->
    <div class="relative">
      <!-- Fade edges -->
      <div
        class="absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-background-light to-transparent z-10 pointer-events-none">
      </div>
      <div
        class="absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-background-light to-transparent z-10 pointer-events-none">
      </div>

      <!-- Scrolling track -->
      <div class="marquee-track flex gap-6 py-6">
        <div v-for="n in 2" :key="n" class="marquee-slide flex gap-6 shrink-0">
          <div v-for="i in 12" :key="`${n}-${i}`"
            class="screen-card shrink-0 w-[220px] md:w-[260px] rounded-[28px] overflow-hidden border-[3px] border-white/70 transition-all duration-400 hover:scale-105 hover:-translate-y-2"
            style="box-shadow: 0 12px_40px -8px rgba(0,0,0,0.18), 0 4px 12px -2px rgba(0,0,0,0.06), inset 0 1px 0 0 rgba(255,255,255,0.4);">
            <img :src="`/img/screen-${i}.jpeg`" :alt="`Fold app screen ${i}`" class="w-full h-auto block"
              loading="lazy" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.marquee-track {
  animation: marquee-scroll 10s linear infinite;
}

.marquee-track:hover {
  animation-play-state: paused;
}

.screen-card:hover {
  box-shadow: 0 24px 60px -12px rgba(129, 1, 0, 0.18), 0 8px 24px -4px rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.5) !important;
}

@keyframes marquee-scroll {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-50%);
  }
}
</style>
