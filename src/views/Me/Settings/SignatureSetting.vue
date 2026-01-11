<template>
  <div class="signature-setting-page">
    <!-- 顶部导航栏 -->
    <header class="sub-header">
      <button class="back-btn" @click="goBack">⬅</button>
      <h2>个性签名</h2>
      <button 
        class="save-btn" 
        :disabled="!isModified || isSaving"
        @click="handleSave"
      >
        {{ isSaving ? '保存中...' : '保存' }}
      </button>
    </header>
    
    <!-- 签名编辑区域 -->
    <main class="setting-content">
      <div class="signature-editor">
        <textarea
          v-model="signature"
          placeholder="写下你的个性签名..."
          class="signature-input"
          maxlength="100"
          @input="handleInput"
          ref="textareaRef"
          rows="6"
        ></textarea>
        
        <div class="editor-hint">
          <p>个性签名将显示在您的个人资料页面</p>
          <p>最多可输入100个字符</p>
          <p class="char-count">{{ signature.length }}/100</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/composables/useStore'
import userApi from '@/api/modules/user'

const router = useRouter()
const userStore = useUserStore()
const textareaRef = ref(null)

// 状态管理
const signature = ref('')
const originalSignature = ref('')
const isSaving = ref(false)

// 计算属性
const isModified = computed(() => signature.value !== originalSignature.value)

// 生命周期
onMounted(() => {
  // 初始化签名
  const user = userStore.currentUser
  if (user && user.signature) {
    signature.value = user.signature
    originalSignature.value = user.signature
  }
  
  // 自动聚焦输入框
  nextTick(() => {
    textareaRef.value?.focus()
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
  
  try {
    isSaving.value = true
    
    // 更新个性签名
    const response = await userApi.updateProfile({ signature: signature.value.trim() })
    
    // 更新用户信息
    userStore.setUser(response.data)
    
    // 返回上一页
    router.back()
  } catch (error) {
    console.error('更新个性签名失败:', error)
    alert('更新个性签名失败，请重试')
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.signature-setting-page {
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

/* 主内容区 */
.setting-content {
  flex: 1;
  padding: 20px;
}

/* 签名编辑器 */
.signature-editor {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.signature-input {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--wechat-border-color);
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
  resize: none;
  font-family: inherit;
  line-height: 1.5;
  transition: border-color 0.2s;
}

.signature-input:focus {
  outline: none;
  border-color: var(--wechat-primary-color);
  box-shadow: 0 0 0 2px rgba(7, 193, 96, 0.1);
}

.signature-input::placeholder {
  color: var(--wechat-text-secondary);
}

.editor-hint {
  color: var(--wechat-text-secondary);
  font-size: 13px;
  margin-top: 15px;
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