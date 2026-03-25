// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'Fold - Your Private Memory Vault',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Fold is a private sanctuary for your memories. Capture your unspoken emotions and fleeting moments securely in a digital tapestry woven from your life.' },
        { name: 'theme-color', content: '#EDEADC' },

        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://fold.taohq.org/' },
        { property: 'og:title', content: 'Fold - Your Private Memory Vault' },
        { property: 'og:description', content: 'Capture your life\'s unspoken emotions and fleeting moments securely with Fold.' },
        { property: 'og:image', content: 'https://fold.taohq.org/img/fold-icon.png' },

        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:url', content: 'https://fold.taohq.org/' },
        { name: 'twitter:title', content: 'Fold - Your Private Memory Vault' },
        { name: 'twitter:description', content: 'Capture your life\'s unspoken emotions securely with Fold.' },
        { name: 'twitter:image', content: 'https://fold.taohq.org/img/fold-icon.png' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'mask-icon', color: '#810100', href: '/icon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&display=swap' }
      ]
    }
  }
})
