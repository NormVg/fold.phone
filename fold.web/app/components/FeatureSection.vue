<template>
  <section class="w-full max-w-6xl mx-auto px-6 py-24 md:py-32">
    <div class="text-center mb-20 space-y-4">
      <h2 class="font-display italic text-4xl md:text-5xl text-brand-charcoal">
        Designed for Permanence
      </h2>
      <p class="font-sans text-lg text-brand-charcoal/70 max-w-2xl mx-auto">
        Fold isn't just another note-taking app. It's a sanctuary built specifically for your most personal memories,
        thoughts, and reflections.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
      <div v-for="feature in features" :key="feature.title"
        class="feature-card flex flex-col items-center text-center space-y-4 p-8 rounded-[28px] bg-white/50 backdrop-blur-sm border border-white/60 transition-all duration-400 hover:-translate-y-1.5 cursor-default"
        style="box-shadow: 0 6px 30px -8px rgba(0,0,0,0.1), 0 2px 8px -2px rgba(0,0,0,0.05), inset 0 1px 0 0 rgba(255,255,255,0.7), inset 0 -1px 2px 0 rgba(0,0,0,0.02);"
        @mouseover="$event.currentTarget.style.boxShadow = '0 16px 50px -12px rgba(129,1,0,0.12), 0 6px 20px -4px rgba(0,0,0,0.08), inset 0 1px 0 0 rgba(255,255,255,0.8), inset 0 -1px 2px 0 rgba(0,0,0,0.01)'"
        @mouseleave="$event.currentTarget.style.boxShadow = '0 6px 30px -8px rgba(0,0,0,0.1), 0 2px 8px -2px rgba(0,0,0,0.05), inset 0 1px 0 0 rgba(255,255,255,0.7), inset 0 -1px 2px 0 rgba(0,0,0,0.02)'">
        <div
          class="w-14 h-14 rounded-2xl bg-brand-red/10 text-brand-red flex items-center justify-center mb-2 transition-transform duration-300 group-hover:scale-110"
          style="box-shadow: inset 0 2px 4px -1px rgba(129,1,0,0.1);">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            v-html="feature.icon"></svg>
        </div>
        <h3 class="text-xl font-medium text-brand-charcoal">{{ feature.title }}</h3>
        <p class="text-sm text-brand-charcoal/70 leading-relaxed">{{ feature.description }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
const features = [
  {
    title: 'Private by Design',
    description: 'Your memories belong to you. Everything is encrypted and securely stored, far away from data brokers and advertising algorithms.',
    icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />'
  },
  {
    title: 'Frictionless Capture',
    description: "Whether it's a fleeting thought, a photo, or a link, Fold's minimal interface gets out of your way so you can capture the moment instantly.",
    icon: '<path d="M2 12h4l3-9 5 18 3-9h5" />'
  },
  {
    title: 'Beautifully Organized',
    description: "A clutter-free timeline that surfaces what matters. Your life's narrative unfolds in a clean, elegant layout designed for quiet reflection.",
    icon: '<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />'
  }
]
</script>
