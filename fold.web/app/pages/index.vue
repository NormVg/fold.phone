<template>
  <div class="w-full">

    <Head>
      <Title>Fold - Your Private Memory Vault</Title>
      <Meta name="description"
        content="Capture your life's unspoken emotions and fleeting moments securely with Fold." />
      <Meta name="theme-color" content="#EDEADC" />
    </Head>

    <Hero />
    <AppShowcase />
    <FeatureSection />

    <!-- CTA Section — deep card with inner glow -->
    <section
      class="w-full max-w-4xl mx-auto px-6 py-20 text-center space-y-8 rounded-[36px] bg-white/45 backdrop-blur-xl border border-white/50 relative overflow-hidden isolate mt-12 transition-shadow duration-500 hover:shadow-[0_24px_80px_-16px_rgba(129,1,0,0.12),0_8px_32px_-8px_rgba(0,0,0,0.08),inset_0_1px_0_0_rgba(255,255,255,0.6)]"
      style="box-shadow: 0 12px 60px -12px rgba(0,0,0,0.14), 0 4px 20px -4px rgba(0,0,0,0.06), inset 0 1px 0 0 rgba(255,255,255,0.5), inset 0 -1px 3px 0 rgba(0,0,0,0.02);">
      <div class="absolute inset-0 bg-gradient-to-t from-brand-red/5 to-transparent z-0 pointer-events-none"></div>

      <div class="relative z-10 space-y-4">
        <h2 class="font-display italic text-4xl md:text-5xl text-brand-charcoal">Start Your Story</h2>
        <p class="font-sans text-brand-charcoal/70 max-w-xl mx-auto pb-4">
          Join thousands who have discovered the power of a private sanctuary for their thoughts and memories.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="https://admin.fold.taohq.org/download"
            class="px-8 py-4 rounded-2xl text-base font-semibold inline-block text-brand-charcoal/90 hover:text-brand-charcoal transition-all duration-300 bg-white/80 backdrop-blur-sm border border-brand-charcoal/8 hover:bg-white hover:-translate-y-0.5"
            style="box-shadow: 0 2px 8px -2px rgba(0,0,0,0.08), 0 1px 2px 0 rgba(0,0,0,0.04), inset 0 1px 0 0 rgba(255,255,255,0.8);"
            @mouseover="$event.target.style.boxShadow = '0 8px 24px -4px rgba(0,0,0,0.12), 0 2px 6px 0 rgba(0,0,0,0.06), inset 0 1px 0 0 rgba(255,255,255,0.9)'"
            @mouseleave="$event.target.style.boxShadow = '0 2px 8px -2px rgba(0,0,0,0.08), 0 1px 2px 0 rgba(0,0,0,0.04), inset 0 1px 0 0 rgba(255,255,255,0.8)'">
            Download for Android
          </a>
          <a href="#join"
            class="text-white px-8 py-4 rounded-2xl text-base font-semibold inline-block transition-all duration-300 bg-brand-red hover:bg-brand-red-light hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98]"
            style="box-shadow: 0 6px 20px -4px rgba(129,1,0,0.4), 0 2px 6px 0 rgba(129,1,0,0.15), inset 0 1px 0 0 rgba(255,255,255,0.15);"
            @mouseover="$event.target.style.boxShadow = '0 12px 30px -4px rgba(129,1,0,0.45), 0 4px 10px 0 rgba(129,1,0,0.2), inset 0 1px 0 0 rgba(255,255,255,0.2)'"
            @mouseleave="$event.target.style.boxShadow = '0 6px 20px -4px rgba(129,1,0,0.4), 0 2px 6px 0 rgba(129,1,0,0.15), inset 0 1px 0 0 rgba(255,255,255,0.15)'">
            Join the Waitlist
          </a>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>
