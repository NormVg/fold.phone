<template>
  <nav class="absolute top-0 left-0 right-0 w-full flex justify-between items-center z-50 pt-8 pb-6 px-8 md:px-16">
    <div class="flex items-center gap-2">
      <img src="/img/fold-icon.png" alt="Fold"
        class="w-10 h-10 rounded-xl shadow-[0_8px_20px_-4px_rgba(129,1,0,0.5)]" />
    </div>
    <div class="flex items-center gap-6">
      <a href="#features"
        class="text-sm font-semibold text-brand-charcoal/80 hover:text-brand-red transition-colors hidden md:block">Features</a>
      <a href="#join"
        class="px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 bg-brand-red text-white hover:bg-brand-red-light hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.97]"
        style="box-shadow: 0 4px 16px -3px rgba(129,1,0,0.4), inset 0 1px 0 0 rgba(255,255,255,0.12);">
        Join Waitlist
      </a>
    </div>
  </nav>
</template>
