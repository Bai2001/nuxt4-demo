// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    alias: {
      '.prisma/client': resolve(__dirname, './node_modules/@prisma/client'),
    },
  },
  vite: {
    resolve: {
      alias: {
        '.prisma/client/index-browser': './node_modules/@prisma/client/index-browser.js',
      },
    },
  },
  prisma: {
    runMigration: false,
  },
})
