import { createStore } from 'vuex'
import app from './modules/app'
import user from './modules/user'
import chat from './modules/chat'
import contact from './modules/contact'

// 创建 Vuex store
const store = createStore({
  modules: {
    app,
    user,
    chat,
    contact
  }
})

// 导出 store 实例（用于选项式 API）
export default store

// 导出 useStore 函数（用于组合式 API）
export function useStore() {
  return store
}