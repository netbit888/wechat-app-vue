import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import router from './router'
import { setupAuthGuard } from './router/guards/auth'
import { testConnection } from '@/api/test.js';

// 样式引入
import '@/assets/styles/weui.css'
import '@/assets/styles/variables.css'
import '@/assets/styles/base.css'

// 1. 同步预加载所有 store 模块（关键修复）
const modules = {}
const moduleFiles = import.meta.glob('./store/modules/*/index.js', { eager: true })

Object.keys(moduleFiles).forEach((path) => {
  const moduleName = path.match(/\.\/store\/modules\/(.+)\/index\.js/)?.[1]
  if (moduleName) {
    modules[moduleName] = moduleFiles[path].default || moduleFiles[path]
    console.log(`✅ 已加载模块: ${moduleName}`)
  }
})

// 2. 创建 Vuex store 并立即注册所有模块
const store = createStore({
  modules
})

// 3. 创建应用实例
const app = createApp(App)

// 4. 挂载插件（此时模块已就绪）
app.use(store)
app.use(router)
setupAuthGuard(router)

// 5. 挂载应用
app.mount('#app')

console.log(`🚀 ${import.meta.env.VITE_APP_TITLE} 启动成功`)
console.log(`📍 环境: ${import.meta.env.MODE}`)
console.log(`🌐 API地址: ${import.meta.env.VITE_API_BASE_URL}`)

// 6. 应用挂载后执行初始化（可选优化）
;(async () => {
  try {
    await store.dispatch('user/autoLogin')
    console.log('✅ 自动登录完成')
  } catch (error) {
    console.error('❌ 自动登录失败:', error)
  }
})()

// 生产环境测试连接
if (import.meta.env.PROD) {
  testConnection().then(success => {
    if (!success) {
      console.warn('⚠️ 无法连接到云端服务器，请检查:')
      console.warn('1. 后端服务是否运行')
      console.warn('2. VITE_API_BASE_URL 是否正确')
      console.warn('3. CORS 配置是否允许前端域名')
    }
  })
}