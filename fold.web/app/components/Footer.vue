<template>
  <footer class="w-full border-t border-white/5 py-12 mt-12">
    <div class="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
      <div class="flex items-center gap-3">
        <div class="w-6 h-6 rounded-md bg-brand-red flex items-center justify-center">
          <span class="text-brand-cream font-bold text-xs leading-none">F</span>
        </div>
        <span class="text-brand-cream/80 font-serif italic text-lg">Fold</span>
      </div>

      <div class="text-brand-cream/50 text-sm font-light">
        © {{ new Date().getFullYear() }} Fold. All rights reserved.
      </div>

      <div class="flex gap-6">
        <a href="#" class="text-brand-cream/50 hover:text-brand-cream transition-colors text-sm">Privacy</a>
        <a href="#" class="text-brand-cream/50 hover:text-brand-cream transition-colors text-sm">Terms</a>
        <a href="https://twitter.com/taohq"
          class="text-brand-cream/50 hover:text-brand-cream transition-colors text-sm">Twitter</a>
      </div>
    </div>
  </footer>
</template>
