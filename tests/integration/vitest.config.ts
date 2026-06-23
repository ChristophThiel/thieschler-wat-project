import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { compilerOptions } from '../../vite.config.common'

const root = path.resolve(__dirname, '../../../')

process.env.TZ = 'UTC'

export default defineConfig({
  plugins: [vue({ template: { compilerOptions } })],
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api', 'import']
      }
    }
  },
  test: {
    root,
    globals: true,
    environment: 'happy-dom',
    clearMocks: true,
    pool: 'threads',
    include: ['**/integration/*.spec.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
      '.pnpm-store/*',
      'e2e/**'
    ],
    coverage: {
      provider: 'v8',
      reportsDirectory: `${root}/coverage`,
      reporter: 'lcov'
    }
  }
})
