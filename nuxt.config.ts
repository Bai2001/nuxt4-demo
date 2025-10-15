// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/image', '@prisma/nuxt'],
  devServer: {
    port: 9527,
    host: '0.0.0.0',
  },
  alias: {},
  nitro: {
    rollupConfig: {
      external: ['@prisma/client', '.prisma/client/index-browser'],
      plugins: [],
    },
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    typescript: {
      tsConfig: {
        include: ['../types/**/*.d.ts'],
      },
    },
  },
  typescript: {
    tsConfig: {
      include: ['../types/**/*.d.ts'],
    },
  },
  vite: {
    resolve: {
      alias: {
        '.prisma/client/index-browser': fileURLToPath(
          new URL('./node_modules/.prisma/client/index-browser.js', import.meta.url)
        ),
      },
    },
  },
  prisma: {
    runMigration: false,
  },
})
