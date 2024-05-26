import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

    console.log(env.APP_DOMAIN)

  return {
    plugins: [
      vue(),
      vueJsx()
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      host: true,
      port: 8080,
      hmr: {
        protocol: 'wss',
        clientPort: 443,
        host: env.APP_DOMAIN
      }
    }
  }
})
