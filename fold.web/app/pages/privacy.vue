<template>
  <div class="w-full min-h-screen bg-background-light">

    <Head>
      <Title>Privacy Policy - Fold</Title>
      <Meta name="description" content="Fold's Privacy Policy - how we protect your memories and data." />
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
      <h1 class="font-display italic text-4xl md:text-5xl text-brand-charcoal">Privacy Policy</h1>
      <p class="text-brand-charcoal/50 text-sm">Last updated: March 25, 2026</p>

      <div class="prose-section space-y-6 text-brand-charcoal/80 leading-relaxed">
        <section class="space-y-3">
          <h2 class="text-xl font-semibold text-brand-charcoal">Your Privacy Matters</h2>
          <p>At Fold, your privacy is not just a feature - it's the foundation. We built Fold to be a private sanctuary
            for your memories, and we take that promise seriously.</p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-semibold text-brand-charcoal">Data We Collect</h2>
          <p>We collect only what's necessary to provide you with a seamless experience:</p>
          <ul class="list-disc pl-6 space-y-2 text-brand-charcoal/70">
            <li><strong>Account Information:</strong> Your email address and display name when you sign up.</li>
            <li><strong>Your Memories:</strong> Text entries, voice memos, photos, and emotions you choose to save.
              These are stored securely and encrypted.</li>
            <li><strong>Device Information:</strong> Basic device type and OS version for app compatibility.</li>
          </ul>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-semibold text-brand-charcoal">How We Use Your Data</h2>
          <ul class="list-disc pl-6 space-y-2 text-brand-charcoal/70">
            <li>To provide and maintain the Fold app experience</li>
            <li>To sync your memories securely across your devices</li>
            <li>To send you important updates about the service (only if you opt in)</li>
          </ul>
          <p>We <strong>never</strong> sell your data. We <strong>never</strong> use your memories for advertising. Your
            story is yours alone.</p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-semibold text-brand-charcoal">Data Security</h2>
          <p>All data is encrypted in transit and at rest. We use industry-standard security measures to protect your
            information. Your memories are stored on secure cloud infrastructure with strict access controls.</p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-semibold text-brand-charcoal">Your Rights</h2>
          <p>You can request to export or delete all your data at any time. Simply reach out to us and we'll process
            your request promptly.</p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-semibold text-brand-charcoal">Contact</h2>
          <p>If you have questions about this privacy policy, reach out to us at <a
              href="mailto:thealphaones.work@gmail.com"
              class="text-brand-red hover:underline">thealphaones.work@gmail.com</a>.</p>
        </section>
      </div>
    </article>

    <Footer />
  </div>
</template>
