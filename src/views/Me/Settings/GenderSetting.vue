<template>
  <div class="gender-setting-page">
    <!-- 顶部导航栏 -->
    <header class="sub-header">
      <button class="back-btn" @click="goBack">⬅</button>
      <h2>性别</h2>
    </header>
    
    <!-- 性别选择列表 -->
    <main class="setting-content">
      <div class="gender-list">
        <div 
          class="gender-item" 
          :class="{ active: selectedGender === 0 }"
          @click="handleGenderSelect(0)"
        >
          <div class="gender-info">
            <div class="gender-title">保密</div>
            <div class="gender-desc">不公开您的性别</div>
          </div>
          <div class="gender-check" v-if="selectedGender === 0">✓</div>
        </div>
        
        <div 
          class="gender-item" 
          :class="{ active: selectedGender === 1 }"
          @click="handleGenderSelect(1)"
        >
          <div class="gender-info">
            <div class="gender-title">男</div>
            <div class="gender-desc">公开为男性</div>
          </div>
          <div class="gender-check" v-if="selectedGender === 1">✓</div>
        </div>
        
        <div 
          class="gender-item" 
          :class="{ active: selectedGender === 2 }"
          @click="handleGenderSelect(2)"
        >
          <div class="gender-info">
            <div class="gender-title">女</div>
            <div class="gender-desc">公开为女性</div>
          </div>
          <div class="gender-check" v-if="selectedGender === 2">✓</div>
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

// 状态管理
const selectedGender = ref(0)
const originalGender = ref(0)

// 生命周期
onMounted(() => {
  // 初始化性别
  const user = userStore.currentUser
  if (user && user.gender !== undefined) {
    selectedGender.value = user.gender
    originalGender.value = user.gender
  }
})

// 方法
const goBack = () => {
  router.back()
}

const handleGenderSelect = async (gender) => {
  // 如果选择的性别与当前性别相同，直接返回
  if (selectedGender.value === gender) {
    router.back()
    return
  }
  
  try {
    // 更新性别
    const response = await userApi.updateProfile({ gender })
    
    // 更新用户信息
    userStore.setUser(response.data)
    
    // 返回上一页
    router.back()
  } catch (error) {
    console.error('更新性别失败:', error)
    alert('更新性别失败，请重试')
  }
}
</script>

<style scoped>
.gender-setting-page {
  height: 100vh;
  background-color: var(--wechat-bg-color);
  display: flex;
  flex-direction: column;
}

/* 顶部导航 */
.sub-header {
  display: flex;
  align-items: center;
  padding: 0 15px;
  background-color: white;
  border-bottom: 1px solid var(--wechat-border-color);
  height: 44px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  color: var(--wechat-text-primary);
  margin-right: 15px;
}

.sub-header h2 {
  font-size: 17px;
  font-weight: 500;
  color: var(--wechat-text-primary);
  margin: 0;
  flex: 1;
  text-align: center;
}

/* 主内容区 */
.setting-content {
  flex: 1;
  padding: 10px 0;
}

/* 性别选择列表 */
.gender-list {
  background-color: white;
}

.gender-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  border-bottom: 1px solid var(--wechat-border-color);
  cursor: pointer;
  transition: background-color 0.2s;
}

.gender-item:last-child {
  border-bottom: none;
}

.gender-item:active {
  background-color: var(--wechat-cell-hover);
}

.gender-item.active {
  color: var(--wechat-primary-color);
}

.gender-info {
  flex: 1;
}

.gender-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 5px;
}

.gender-desc {
  font-size: 13px;
  color: var(--wechat-text-secondary);
}

.gender-check {
  font-size: 18px;
  font-weight: bold;
  color: var(--wechat-primary);
}
</style>