import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'LucidAptosSDK',
      fileName: (format) => `lucid-aptos-sdk.${format}.js`,
      formats: ['es', 'cjs', 'umd']
    },
    rollupOptions: {
      external: ['@aptos-labs/ts-sdk'],
      output: {
        globals: {
          '@aptos-labs/ts-sdk': 'AptosLabsSDK'
        }
      }
    },
    sourcemap: true,
    minify: 'terser',
    target: 'es2022'
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  test: {
    globals: true,
    environment: 'node'
  }
}) 