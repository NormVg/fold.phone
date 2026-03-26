<template>
  <div class="w-full min-h-screen bg-background-light">

    <Head>
      <Title>Terms of Service - Fold</Title>
      <Meta name="description" content="Fold's Terms of Service - the rules for using our memory vault." />
    </Head>

    <!-- Nav -->
    <nav class="w-full flex justify-between items-center pt-8 pb-6 px-8 md:px-16">
      <NuxtLink to="/" class="flex items-center gap-2">
        <img src="/img/fold-icon.png" alt="Fold" class="w-10 h-10 rounded-xl" />
      </NuxtLink>
      <NuxtLink to="/" class="text-brand-charcoal/60 hover:text-brand-charcoal text-sm font-medium transition-colors">
        ← Back to Home
      </NuxtLink>
    </nav>

    <!-- Content -->
    <article class="max-w-3xl mx-auto px-6 py-12 space-y-8">
      <h1 class="font-display italic text-4xl md:text-5xl text-brand-charcoal">Terms of Service</h1>
      <p class="text-brand-charcoal/50 text-sm">Last updated: March 25, 2026</p>

      <div class="prose-section space-y-6 text-brand-charcoal/80 leading-relaxed">
        <section class="space-y-3">
          <h2 class="text-xl font-semibold text-brand-charcoal">Welcome to Fold</h2>
          <p>By downloading, accessing, or using Fold, you agree to these Terms of Service. If you do not agree, please
            do not use our service.</p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-semibold text-brand-charcoal">Your Account</h2>
          <ul class="list-disc pl-6 space-y-2 text-brand-charcoal/70">
            <li>You must be at least 13 years old to use Fold.</li>
            <li>You are responsible for maintaining the security of your account.</li>
            <li>You are responsible for all content you create within Fold.</li>
          </ul>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-semibold text-brand-charcoal">Your Content</h2>
          <p>You retain full ownership of all content you create in Fold - your memories, text, photos, voice memos, and
            emotions. We do not claim any intellectual property rights over your content.</p>
          <p>You grant us a limited license to store and process your content solely for the purpose of providing the
            Fold service to you.</p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-semibold text-brand-charcoal">Acceptable Use</h2>
          <p>Fold is designed as a personal memory vault. You agree not to:</p>
          <ul class="list-disc pl-6 space-y-2 text-brand-charcoal/70">
            <li>Use the service for any illegal purposes</li>
            <li>Attempt to reverse-engineer or compromise the service</li>
            <li>Interfere with other users' access to the service</li>
            <li>Upload content that contains malware or harmful code</li>
          </ul>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-semibold text-brand-charcoal">Service Availability</h2>
          <p>We strive to keep Fold available at all times, but we cannot guarantee uninterrupted access. We may
            temporarily suspend the service for maintenance or updates.</p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-semibold text-brand-charcoal">Termination</h2>
          <p>You may delete your account at any time. Upon deletion, all your data will be permanently removed from our
            servers within 30 days.</p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-semibold text-brand-charcoal">Changes to Terms</h2>
          <p>We may update these terms from time to time. We'll notify you of significant changes via email or in-app
            notification.</p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-semibold text-brand-charcoal">Contact</h2>
          <p>Questions about these terms? Contact us at <a href="mailto:thealphaones.work@gmail.com"
              class="text-brand-red hover:underline">thealphaones.work@gmail.com</a>.</p>
        </section>
      </div>
    </article>

    <Footer />
  </div>
</template>
