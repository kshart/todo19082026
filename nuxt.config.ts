// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@pinia/nuxt',
  ],
  components: [
    {
      path: '@/components',
      pathPrefix: false,
    },
  ],
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Note list',
      htmlAttrs: {
        lang: 'ru',
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },
  css: ['@/assets/scss/main.scss'],
  runtimeConfig: {
    redis: {
      host: process.env.REDIS_DB_HOST,
      port: Number(process.env.REDIS_DB_PORT),
    },
  },
  compatibilityDate: '2026-08-19',
  nitro: {
    experimental: {
      websocket: true,
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/scss/mixins.scss" as *;',
        },
      },
    },
  },
  typescript: {
    typeCheck: true,
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
})
