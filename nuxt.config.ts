// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2024-10-21',
  devtools: { enabled: true },
  modules: [
    '@nuxt/fonts',
    '@nuxtjs/tailwindcss',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxthub/core',
    '@vueuse/nuxt',
  ],
  eslint: {
    config: {
      stylistic: false,
      standalone: false,
    },
  },
  hub: {
    cache: true,
    database: true,
  },
  nitro: {
    experimental: {
      tasks: true,
    },
  },
  runtimeConfig: {
    botToken: '',
    botUrl: 'https://api.telegram.org/bot',
  },
})
