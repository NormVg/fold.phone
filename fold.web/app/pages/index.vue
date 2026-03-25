<template>
  <div class="w-full">

    <Head>
      <Title>Fold - Your Private Memory Vault</Title>
      <Meta name="description"
        content="Capture your life's unspoken emotions and fleeting moments securely with Fold." />
      <Meta name="theme-color" content="#EDEADC" />
    </Head>

    <Hero />
    <FeatureSection />

    <!-- CTA Section -->
    <section
      class="w-full max-w-4xl mx-auto px-6 py-20 text-center space-y-8 rounded-3xl bg-background-dark border border-brand-charcoal/5 relative overflow-hidden isolate mt-12 shadow-md">
      <div class="absolute inset-0 bg-gradient-to-t from-brand-red/5 to-transparent z-0 pointer-events-none"></div>

      <div class="relative z-10 space-y-4">
        <h2 class="font-display italic text-4xl md:text-5xl text-brand-charcoal">Start Your Story</h2>
        <p class="font-sans text-brand-charcoal/70 max-w-xl mx-auto pb-4">
          Join thousands who have discovered the power of a private sanctuary for their thoughts and memories.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="https://admin.fold.taohq.org/download"
            class="glass-button px-8 py-4 rounded-full text-base font-medium inline-block text-brand-charcoal hover:text-brand-red transition-colors bg-white/50 shadow-sm border border-brand-charcoal/10">
            Download for Android
          </a>
          <a href="https://admin.fold.taohq.org" target="_blank"
            class="bg-brand-red hover:bg-brand-red-light text-brand-cream px-8 py-4 rounded-full text-base font-medium inline-block transition-colors shadow-lg shadow-brand-red/20">
            Open Dashboard
          </a>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>
