<template>
  <div class="avatar-upload-component">
    <!-- 顶部导航栏 -->
    <header class="sub-header">
      <button class="back-btn" @click="goBack">⬅</button>
      <h2>头像设置</h2>
      <button 
        class="save-btn" 
        :disabled="!isModified || isUploading"
        @click="handleUpload"
      >
        {{ isUploading ? '上传中...' : '保存' }}
      </button>
    </header>
    
    <!-- 头像预览和操作 -->
    <main class="avatar-upload-content">
      <div class="avatar-preview-section">
        <div class="avatar-frame">
          <img 
            v-if="previewUrl" 
            :src="previewUrl" 
            alt="头像预览" 
            class="avatar-preview"
          />
          <div v-else class="avatar-placeholder">
            <span class="placeholder-text">点击上传头像</span>
          </div>
        </div>
        
        <div class="avatar-hint">
          <p>建议使用清晰的头像，尺寸不小于200x200像素</p>
          <p>支持JPG、PNG、GIF格式，大小不超过5MB</p>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <div class="upload-actions">
        <button class="upload-btn" @click="triggerFileInput">
          <span class="btn-icon">📸</span>
          选择照片
        </button>
        <button 
          class="delete-btn" 
          v-if="currentAvatarUrl && !isUploading"
          @click="handleDelete"
        >
          <span class="btn-icon">🗑️</span>
          删除当前头像
        </button>
      </div>
      
      <!-- 上传进度条 -->
      <div v-if="isUploading" class="upload-progress">
        <div class="progress-bar">
          <div class="progress" :style="{ width: uploadProgress + '%' }"></div>
        </div>
        <div class="progress-text">{{ uploadProgress }}%</div>
      </div>
      
      <!-- 隐藏的文件输入 -->
      <input 
        ref="fileInput" 
        type="file" 
        accept="image/*" 
        @change="handleFileChange"
        class="hidden-input"
      />
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
const fileInput = ref(null)

// 状态管理
const currentAvatarUrl = ref('')
const previewUrl = ref('')
const isUploading = ref(false)
const uploadProgress = ref(0)
const isModified = ref(false)

// 计算属性
const isSaveDisabled = computed(() => !isModified.value || isUploading.value)

// 生命周期
onMounted(() => {
  // 初始化当前头像
  const user = userStore.currentUser
  if (user && user.avatar) {
    currentAvatarUrl.value = user.avatar
  }
})

// 方法
const goBack = () => {
  router.back()
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    // 检查文件大小（5MB）
    if (file.size > 5 * 1024 * 1024) {
      alert('文件大小不能超过5MB')
      return
    }
    
    // 检查文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      alert('只支持JPG、PNG、GIF格式')
      return
    }
    
    // 创建预览URL
    const reader = new FileReader()
    reader.onload = (e) => {
      previewUrl.value = e.target.result
      isModified.value = true
    }
    reader.readAsDataURL(file)
  }
}

const handleUpload = async () => {
  if (!previewUrl.value || isUploading.value) return
  
  try {
    isUploading.value = true
    uploadProgress.value = 0
    
    // 创建FormData
    const formData = new FormData()
    const blob = await fetch(previewUrl.value).then(r => r.blob())
    const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' })
    formData.append('avatar', file)
    
    // 上传头像
    const onProgress = (progress) => {
      uploadProgress.value = Math.round(progress * 100)
    }
    
    const response = await userApi.uploadAvatar(formData, onProgress)
    
    // 更新用户信息
    userStore.setUser(response.data)
    
    // 重置状态
    currentAvatarUrl.value = response.data.avatar
    isModified.value = false
    
    // 返回上一页
    router.back()
  } catch (error) {
    console.error('上传头像失败:', error)
    alert('上传头像失败，请重试')
  } finally {
    isUploading.value = false
    uploadProgress.value = 0
  }
}

const handleDelete = async () => {
  if (!confirm('确定要删除当前头像吗？')) return
  
  try {
    // 这里简化处理，实际上应该调用删除头像的API
    // 目前我们只是将头像设为空字符串
    const response = await userApi.updateProfile({ avatar: '' })
    
    // 更新用户信息
    userStore.setUser(response.data)
    
    // 重置状态
    currentAvatarUrl.value = ''
    previewUrl.value = ''
    isModified.value = false
    
    // 返回上一页
    router.back()
  } catch (error) {
    console.error('删除头像失败:', error)
    alert('删除头像失败，请重试')
  }
}
</script>

<style scoped>
.avatar-upload-component {
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
.avatar-upload-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

/* 头像预览区 */
.avatar-preview-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.avatar-frame {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--wechat-border-light);
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.avatar-frame:hover {
  transform: scale(1.05);
}

.avatar-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background-color: var(--wechat-bg-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--wechat-text-secondary);
}

.placeholder-text {
  font-size: 14px;
}

.avatar-hint {
  text-align: center;
  color: var(--wechat-text-secondary);
  font-size: 13px;
}

.avatar-hint p {
  margin: 5px 0;
}

/* 操作按钮 */
.upload-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 300px;
}

.upload-btn,
.delete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
}

.upload-btn {
  background-color: var(--wechat-primary-color);
  color: white;
}

.upload-btn:hover {
  background-color: var(--wechat-primary-dark);
}

.delete-btn {
  background-color: white;
  color: var(--wechat-error-color);
  border: 1px solid var(--wechat-error-color);
}

.delete-btn:hover {
  background-color: rgba(250, 81, 81, 0.1);
}

.btn-icon {
  font-size: 18px;
}

/* 上传进度 */
.upload-progress {
  width: 100%;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: var(--wechat-bg-grey);
  border-radius: 4px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: var(--wechat-primary-color);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  color: var(--wechat-text-secondary);
  font-size: 13px;
}

/* 隐藏的文件输入 */
.hidden-input {
  display: none;
}
</style>