import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'  // 正确导入 resolve 函数

export default defineConfig({
  plugins: [vue()],

  server: {
    port: 3002,
    proxy: {
      '/api': {
        target: 'http://demo01-222374-8-1400573097.sh.run.tcloudbase.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  },
  
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')  // 使用导入的 resolve 函数
    }
  }
})