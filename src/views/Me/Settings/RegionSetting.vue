<template>
  <div class="region-setting-page">
    <!-- 顶部导航栏 -->
    <header class="sub-header">
      <button class="back-btn" @click="goBack">⬅</button>
      <h2>地区</h2>
    </header>
    
    <!-- 地区选择列表 -->
    <main class="setting-content">
      <div class="region-list">
        <div 
          class="region-item" 
          :class="{ active: selectedRegion === '' }"
          @click="handleRegionSelect('')"
        >
          <div class="region-info">
            <div class="region-title">未设置</div>
          </div>
          <div class="region-check" v-if="selectedRegion === ''">✓</div>
        </div>
        
        <div 
          class="region-item" 
          :class="{ active: selectedRegion === '北京' }"
          @click="handleRegionSelect('北京')"
        >
          <div class="region-info">
            <div class="region-title">北京</div>
          </div>
          <div class="region-check" v-if="selectedRegion === '北京'">✓</div>
        </div>
        
        <div 
          class="region-item" 
          :class="{ active: selectedRegion === '上海' }"
          @click="handleRegionSelect('上海')"
        >
          <div class="region-info">
            <div class="region-title">上海</div>
          </div>
          <div class="region-check" v-if="selectedRegion === '上海'">✓</div>
        </div>
        
        <div 
          class="region-item" 
          :class="{ active: selectedRegion === '广州' }"
          @click="handleRegionSelect('广州')"
        >
          <div class="region-info">
            <div class="region-title">广州</div>
          </div>
          <div class="region-check" v-if="selectedRegion === '广州'">✓</div>
        </div>
        
        <div 
          class="region-item" 
          :class="{ active: selectedRegion === '深圳' }"
          @click="handleRegionSelect('深圳')"
        >
          <div class="region-info">
            <div class="region-title">深圳</div>
          </div>
          <div class="region-check" v-if="selectedRegion === '深圳'">✓</div>
        </div>
        
        <div 
          class="region-item" 
          :class="{ active: selectedRegion === '杭州' }"
          @click="handleRegionSelect('杭州')"
        >
          <div class="region-info">
            <div class="region-title">杭州</div>
          </div>
          <div class="region-check" v-if="selectedRegion === '杭州'">✓</div>
        </div>
        
        <div 
          class="region-item" 
          :class="{ active: selectedRegion === '成都' }"
          @click="handleRegionSelect('成都')"
        >
          <div class="region-info">
            <div class="region-title">成都</div>
          </div>
          <div class="region-check" v-if="selectedRegion === '成都'">✓</div>
        </div>
        
        <div 
          class="region-item" 
          :class="{ active: selectedRegion === '武汉' }"
          @click="handleRegionSelect('武汉')"
        >
          <div class="region-info">
            <div class="region-title">武汉</div>
          </div>
          <div class="region-check" v-if="selectedRegion === '武汉'">✓</div>
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
const selectedRegion = ref('')
const originalRegion = ref('')

// 生命周期
onMounted(() => {
  // 初始化地区
  const user = userStore.currentUser
  if (user && user.region) {
    selectedRegion.value = user.region
    originalRegion.value = user.region
  }
})

// 方法
const goBack = () => {
  router.back()
}

const handleRegionSelect = async (region) => {
  // 如果选择的地区与当前地区相同，直接返回
  if (selectedRegion.value === region) {
    router.back()
    return
  }
  
  try {
    // 更新地区
    const response = await userApi.updateProfile({ region })
    
    // 更新用户信息
    userStore.setUser(response.data)
    
    // 返回上一页
    router.back()
  } catch (error) {
    console.error('更新地区失败:', error)
    alert('更新地区失败，请重试')
  }
}
</script>

<style scoped>
.region-setting-page {
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

/* 地区选择列表 */
.region-list {
  background-color: white;
}

.region-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  border-bottom: 1px solid var(--wechat-border-color);
  cursor: pointer;
  transition: background-color 0.2s;
}

.region-item:last-child {
  border-bottom: none;
}

.region-item:active {
  background-color: var(--wechat-cell-hover);
}

.region-item.active {
  color: var(--wechat-primary-color);
}

.region-info {
  flex: 1;
}

.region-title {
  font-size: 16px;
  font-weight: 500;
}

.region-check {
  font-size: 18px;
  font-weight: bold;
  color: var(--wechat-primary);
}
</style>