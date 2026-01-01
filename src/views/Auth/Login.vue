<template>
  <div class="login-page">
    <div class="login-container">
      <h2>微信登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <input 
            v-model="loginForm.username" 
            type="text" 
            placeholder="用户名" 
            required
          >
        </div>
        <div class="input-group">
          <input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="密码" 
            required
          >
        </div>
        <button type="submit" :disabled="loading" class="login-button">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
      
      <div class="demo-accounts">
        <h3>测试账号</h3>
        <p>用户名: admin</p>
        <p>密码: 123456</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { showToast } from '@/utils/feedback'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    
    const loginForm = ref({
      username: '',
      password: ''
    })
    
    const loading = ref(false)

    const handleLogin = async () => {
      if (!loginForm.value.username || !loginForm.value.password) {
        showToast('请输入用户名和密码', 'error')
        return
      }

      loading.value = true

      try {
        await userStore.login(loginForm.value)
        router.push('/chat')
      } catch (error) {
        console.error('登录失败:', error)
      } finally {
        loading.value = false
      }
    }

    return {
      loginForm,
      loading,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #07c160 0%, #06ae56 100%);
}

.login-container {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 400px;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.input-group {
  margin-bottom: 20px;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #07c160;
}

.login-button {
  width: 100%;
  padding: 12px;
  background-color: #07c160;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover:not(:disabled) {
  background-color: #06ae56;
}

.login-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.demo-accounts {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 6px;
  text-align: center;
}

.demo-accounts h3 {
  margin-bottom: 10px;
  color: #666;
  font-size: 14px;
}

.demo-accounts p {
  margin: 5px 0;
  font-size: 12px;
  color: #888;
}
</style>