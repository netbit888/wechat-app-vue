<template>
  <div class="add-friend-search-page">
    <!-- 搜索头部 -->
    <header class="search-header">
      <div class="search-container">
        <input 
          type="text" 
          v-model="keyword" 
          placeholder="搜索 账号/手机号" 
          class="search-input"
          @input="handleSearch"
          autofocus
        />
        <button class="cancel-btn" @click="goBack">取消</button>
      </div>
    </header>
    
    <!-- 搜索结果 -->
    <main class="search-results">
      <div v-if="loading" class="loading">搜索中...</div>
      <div v-else-if="searchResults.length === 0 && keyword" class="no-results">未找到相关用户</div>
      <div v-else-if="searchResults.length > 0">
        <div 
          v-for="user in searchResults" 
          :key="user._id" 
          class="search-result-item"
          @click="viewUserDetail(user)"
        >
          <div class="avatar">
            <Avatar :src="user.avatar" :text="user.nickname || user.wechatId" size="48" />
          </div>
          <div class="info">
            <div class="name-row">
              <span class="name">{{ user.nickname || user.wechatId }}</span>
              <span class="wechat-id">微信号：{{ user.wechatId }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import contactAPI from '@/api/modules/contact'
import Avatar from '@/components/ui/Avatar/Avatar.vue'

const router = useRouter()
const keyword = ref('')
const searchResults = ref([])
const loading = ref(false)

// 返回上一页
const goBack = () => {
  router.back()
}

// 搜索用户
const handleSearch = async () => {
  const kw = keyword.value.trim()
  if (!kw) {
    searchResults.value = []
    return
  }
  
  try {
    loading.value = true
    const { users } = await contactAPI.search(kw)
    searchResults.value = users
  } catch (e) {
    console.error('搜索失败', e)
    searchResults.value = []
  } finally {
    loading.value = false
  }
}

// 查看用户详情
const viewUserDetail = (user) => {
  router.push(`/contact/${user._id}`)
}
</script>

<style scoped>
.add-friend-search-page {
  height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

/* 搜索头部 */
.search-header {
  background-color: #ffffff;
  padding: 10px 15px;
  border-bottom: 1px solid #e5e5e5;
  position: sticky;
  top: 0;
  z-index: 100;
}

.search-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
  background-color: #f5f5f5;
}

.search-input:focus {
  background-color: #ffffff;
  border-color: #07c160;
}

.cancel-btn {
  background: none;
  border: none;
  font-size: 16px;
  color: #07c160;
  cursor: pointer;
  padding: 5px;
}

.cancel-btn:active {
  opacity: 0.7;
}

/* 搜索结果 */
.search-results {
  flex: 1;
  overflow-y: auto;
  padding: 10px 0;
}

.loading,
.no-results {
  text-align: center;
  padding: 40px 0;
  color: #999999;
  font-size: 14px;
}

.search-result-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  background-color: white;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
}

.search-result-item:active {
  background-color: #f5f5f5;
}

.search-result-item:not(:last-child)::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 75px;
  right: 0;
  height: 1px;
  background-color: #e5e5e5;
}

.avatar {
  margin-right: 12px;
}

.info {
  flex: 1;
  overflow: hidden;
}

.name-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.name {
  font-size: 16px;
  color: #000000;
  font-weight: 400;
}

.wechat-id {
  font-size: 12px;
  color: #999999;
}
</style>