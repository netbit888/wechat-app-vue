<template>
  <div id="app">
    <router-view /> 
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { onMounted } from 'vue'

const router = useRouter()
const store = useStore()

// ✅ 修复：在组件挂载后执行，并添加多重保护
onMounted(async () => {
  // 防御性检查：确保 store 和 dispatch 方法存在
  if (!store?.dispatch) {
    console.warn('Store 尚未就绪，跳过自动登录')
    return
  }

  // 检查模块是否存在（冗余但安全）
  if (store.hasModule && !store.hasModule('user')) {
    console.warn('User 模块尚未注册，跳过自动登录')
    return
  }

  try {
    const success = await store.dispatch('user/autoLogin')
    
    // 仅在登录页且自动登录成功时跳转
    if (success && router.currentRoute.value?.path === '/auth/login') {
      router.replace('/wechat')
    }
  } catch (error) {
    console.error('自动登录失败:', error)
    // 可选：跳转到登录页
    // router.replace('/auth/login')
  }
})
</script>

<style>
#app {
  min-height: 100vh;
  background-color: var(--wechat-bg-color);
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
}
</style>