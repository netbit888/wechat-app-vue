import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src') // 设置 '@' 别名指向 src 目录，方便导入
    }
  },
  server: {
    host: '0.0.0.0', // 允许局域网访问（如用手机调试）
    port: 3000
  }
})