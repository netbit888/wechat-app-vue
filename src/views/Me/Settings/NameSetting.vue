<template>
  <div class="name-edit-page">
    <!-- 顶部导航栏 -->
    <header class="sub-header">
      <button class="back-btn" @click="goBack">⬅</button>
      <h2>名字</h2>
      <button 
        class="save-btn" 
        :disabled="!isModified || isSaving"
        @click="handleSave"
      >
        {{ isSaving ? '保存中...' : '保存' }}
      </button>
    </header>
    
    <!-- 编辑表单 -->
    <main class="edit-content">
      <div class="form-section">
        <div class="input-container">
          <input
            v-model="nickname"
            type="text"
            placeholder="请输入名字"
            class="edit-input"
            maxlength="20"
            @input="handleInput"
            ref="inputRef"
            auto-focus
          />
        </div>
        
        <div class="input-hint">
          <p>名字将显示在您的个人资料和聊天界面</p>
          <p>最多可输入20个字符</p>
          <p class="char-count">{{ nickname.length }}/20</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/composables/useStore'
import userApi from '@/api/modules/user'

const router = useRouter()
const userStore = useUserStore()
const inputRef = ref(null)

// 状态管理
const nickname = ref('')
const originalNickname = ref('')
const isSaving = ref(false)

// 计算属性
const isModified = computed(() => nickname.value !== originalNickname.value)

// 生命周期
onMounted(() => {
  // 初始化名字
  const user = userStore.currentUser
  if (user && user.nickname) {
    nickname.value = user.nickname
    originalNickname.value = user.nickname
  }
  
  // 自动聚焦输入框
  nextTick(() => {
    inputRef.value?.focus()
  })
})

// 方法
const goBack = () => {
  router.back()
}

const handleInput = () => {
  // 输入处理，可以添加额外的验证逻辑
}

const handleSave = async () => {
  if (!isModified.value || isSaving.value) return
  
  // 简单验证
  if (!nickname.value.trim()) {
    alert('名字不能为空')
    return
  }
  
  try {
    isSaving.value = true
    
    // 更新个人资料
    const response = await userApi.updateProfile({ nickname: nickname.value.trim() })
    
    // 更新用户信息
    userStore.setUser(response.data)
    
    // 返回上一页
    router.back()
  } catch (error) {
    console.error('更新名字失败:', error)
    alert('更新名字失败，请重试')
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.name-edit-page {
  height: 100vh;
  background-color: var(--wechat-bg-color);
  display: flex;
  flex-direction: column;
}

/* 顶部导航 */
.sub-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  background-color: white;
  border-bottom: 1px solid var(--wechat-border-color);
  height: 44px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-btn,
.save-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 5px;
  color: var(--wechat-primary-color);
  font-weight: 500;
}

.back-btn {
  font-size: 20px;
  color: var(--wechat-text-primary);
}

.save-btn:disabled {
  color: var(--wechat-text-secondary);
  cursor: not-allowed;
}

.sub-header h2 {
  font-size: 17px;
  font-weight: 500;
  color: var(--wechat-text-primary);
  margin: 0;
}

/* 编辑内容 */
.edit-content {
  flex: 1;
  padding: 20px;
}

.form-section {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.input-container {
  margin-bottom: 20px;
}

.edit-input {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--wechat-border-color);
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.edit-input:focus {
  outline: none;
  border-color: var(--wechat-primary-color);
  box-shadow: 0 0 0 2px rgba(7, 193, 96, 0.1);
}

.edit-input::placeholder {
  color: var(--wechat-text-secondary);
}

.input-hint {
  color: var(--wechat-text-secondary);
  font-size: 13px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.char-count {
  text-align: right;
  font-size: 12px;
  margin-top: 5px;
}
</style>