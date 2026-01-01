import { createApp } from 'vue'
import { createStore } from 'vuex'  // Vuex 4 导入
import App from './App.vue'
import router from './router'

// 样式引入
import '@/assets/styles/weui.css'
import '@/assets/styles/variables.css'
import '@/assets/styles/base.css'

// 1. 先创建 Vuex store 实例（基础配置）
const store = createStore({
  // 静态模块可在这里引入
  // modules: { ... }
})

const app = createApp(App)

// 2. 挂载 Vuex 和 Router
app.use(store)
app.use(router)

// 3. 先挂载应用（关键：避免阻塞）
app.mount('#app')

console.log(`🚀 ${import.meta.env.VITE_APP_TITLE} 启动成功`)
console.log(`📍 环境: ${import.meta.env.MODE}`)
console.log(`🌐 API地址: ${import.meta.env.VITE_API_BASE_URL}`)

// 4. 在应用挂载后执行自动登录（推荐方式）
// 使用动态导入实现代码分割
;(async () => {
  try {
    // 动态导入 user 模块并注册
    const userModule = await import('@/store/modules/user')
    
    // 如果模块需要动态注册
    if (!store.hasModule('user')) {
      store.registerModule('user', userModule.default || userModule)
    }
    
    // 调用自动登录 action
    await store.dispatch('user/autoLogin')
    console.log('✅ 自动登录成功')
  } catch (error) {
    console.error('❌ 自动登录失败:', error)
  }
})()

// 方案2：如果不需要动态注册模块，更简洁的方式
/*
import store from './store'  // 从集中式 store 入口导入

app.use(store)
app.use(router)
app.mount('#app')

// 挂载后 dispatch
store.dispatch('user/autoLogin').catch(err => {
  console.error('自动登录失败:', err)
})
*/