<template>
  <div class="new-friends-page">
    <!-- 头部导航 -->
    <header class="page-header">
      <button class="back-button" @click="goBack">⬅</button>
      <h1>新的朋友</h1>
      <button class="add-button" @click="goToAddFriend">添加朋友</button>
    </header>
    
    <!-- 搜索栏 -->
    <div class="search-section" @click="goToSearch">
      <div class="search-bar">
        <span class="search-icon">🔍</span>
        <input 
          type="text" 
          placeholder="搜索账号/手机号" 
          class="search-input" 
          readonly
        />
      </div>
    </div>
    
    <!-- 添加手机联系人 -->
    <div class="add-phone-contacts">
      <div class="contact-icon">📞</div>
      <div class="contact-label">添加手机联系人</div>
      <div class="contact-arrow">›</div>
    </div>
    
    <!-- 请求类型切换 -->
    <div class="request-type-tabs">
      <div 
        class="tab" 
        :class="{ active: activeTab === 'pending' }" 
        @click="switchTab('pending')"
      >
        等待验证
      </div>
      <div 
        class="tab" 
        :class="{ active: activeTab === 'processed' }" 
        @click="switchTab('processed')"
      >
        已处理
      </div>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <div class="loading-icon">⏳</div>
      <p>加载中...</p>
    </div>
    
    <!-- 好友请求列表 -->
    <div v-else>
      <div v-if="displayedRequests.length === 0" class="empty">
        {{ activeTab === 'pending' ? '暂无等待验证的请求' : '暂无已处理的请求' }}
      </div>
      <div v-else class="request-list">
        <div 
          v-for="r in displayedRequests" 
          :key="r._id" 
          class="request-item"
          @click="viewProfile(r.from._id || r.from.id)"
        >
          <div class="avatar">
            <Avatar :src="r.from.avatar" :text="r.from.nickname || r.from.wechatId" size="48"/>
          </div>
          <div class="info">
            <div class="name-row">
              <span class="name">{{ r.from.nickname || r.from.wechatId }}</span>
              <div class="meta">
                <span class="time">{{ formatTime(r.createdAt) }}</span>
                <span class="status" :class="getStatusClass(r.status)">
                  {{ getStatusText(r.status) }}
                </span>
              </div>
            </div>
            <div class="message-row">
              <span class="message" :class="{ 'expanded': expandedRequests.has(r._id) }">
                {{ getDisplayMessage(r.message, expandedRequests.has(r._id)) }}
                <span v-if="r.message && r.message.length > 20" class="expand-btn" @click.stop="toggleExpand(r._id)">
                  {{ expandedRequests.has(r._id) ? '收起' : '展开' }}
                </span>
              </span>
            </div>
          </div>
          <div class="actions" v-if="r.status === 'pending'">
            <button @click.stop="handle(r._id, 'accept')" class="accept">接受</button>
            <button @click.stop="handle(r._id, 'reject')" class="reject">拒绝</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import contactAPI from '@/api/modules/contact'
import Avatar from '@/components/ui/Avatar/Avatar.vue'

const router = useRouter()
const allRequests = ref([])
const expandedRequests = ref(new Set())
const activeTab = ref('pending')
const loading = ref(false)

// 返回上一页
const goBack = () => {
  router.back()
}

// 跳转到添加朋友页面
const goToAddFriend = () => {
  console.log('跳转到添加朋友页面')
}

// 跳转到搜索页面
const goToSearch = () => {
  router.push('/contact/add-friend/search')
}

// 切换标签
const switchTab = (tab) => {
  activeTab.value = tab
}

// 格式化时间
const formatTime = (timeString) => {
  const date = new Date(timeString)
  const now = new Date()
  const diff = now - date
  
  // 小于1小时显示几分钟前
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000)
    return `${minutes}分钟前`
  }
  
  // 小于24小时显示几小时前
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000)
    return `${hours}小时前`
  }
  
  // 小于7天显示星期几
  if (diff < 604800000) {
    const days = ['日', '一', '二', '三', '四', '五', '六']
    return `星期${days[date.getDay()]}`
  }
  
  // 其他显示完整日期
  return date.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  })
}

// 查看请求者资料
const viewProfile = (userId) => {
  router.push(`/contact/${userId}`)
}

// 加载好友请求
const load = async () => {
  try {
    loading.value = true
    const { requests: list } = await contactAPI.getRequests()
    allRequests.value = list
  } catch (error) {
    console.error('加载好友请求失败:', error)
    allRequests.value = []
  } finally {
    loading.value = false
  }
}

// 处理好友请求
const handle = async (id, action) => {
  try {
    await contactAPI.handleRequest(id, action)
    load()          // 刷新列表
  } catch (error) {
    console.error('处理好友请求失败:', error)
    alert(error?.response?.data?.msg || '处理请求失败')
  }
}

// 切换消息展开状态
const toggleExpand = (requestId) => {
  if (expandedRequests.value.has(requestId)) {
    expandedRequests.value.delete(requestId)
  } else {
    expandedRequests.value.add(requestId)
  }
}

// 获取显示的消息
const getDisplayMessage = (message, isExpanded) => {
  if (!message) return ''
  if (isExpanded || message.length <= 20) {
    return message
  }
  return message.substring(0, 20) + '...'
}

// 获取状态类名
const getStatusClass = (status) => {
  switch (status) {
    case 'accepted':
      return 'status-added'
    case 'rejected':
      return 'status-rejected'
    case 'expired':
      return 'status-expired'
    default:
      return 'status-pending'
  }
}

// 获取状态文本
const getStatusText = (status) => {
  switch (status) {
    case 'accepted':
      return '已添加'
    case 'rejected':
      return '已拒绝'
    case 'expired':
      return '已过期'
    default:
      return '等待验证'
  }
}

// 根据当前标签显示不同的请求
const displayedRequests = computed(() => {
  if (activeTab.value === 'pending') {
    return allRequests.value.filter(r => r.status === 'pending')
  } else {
    return allRequests.value.filter(r => r.status !== 'pending')
  }
})

onMounted(load)
</script>

<style scoped>
:root {
  --wechat-bg: #f5f5f5;
  --wechat-border: #d6d6d6;
  --wechat-border-light: #e5e5e5;
  --wechat-text-primary: #000000;
  --wechat-text-secondary: #999999;
  --wechat-primary: #07c160;
  --wechat-cell-hover: #f0f0f0;
  --wechat-gray: #999999;
  --wechat-light-gray: #cccccc;
}

.new-friends-page {
  height: 100vh;
  background-color: var(--wechat-bg);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* 头部导航 */
.page-header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  background-color: white;
  border-bottom: 1px solid var(--wechat-border-light);
  position: sticky;
  top: 0;
  z-index: 100;
}

.page-header h1 {
  font-size: 17px;
  font-weight: 500;
  color: var(--wechat-text-primary);
  margin: 0;
}

.back-button {
  position: absolute;
  left: 15px;
  background: none;
  border: none;
  font-size: 20px;
  color: var(--wechat-text-primary);
  cursor: pointer;
  padding: 5px;
}

.add-button {
  position: absolute;
  right: 15px;
  background: none;
  border: none;
  font-size: 16px;
  color: var(--wechat-primary);
  cursor: pointer;
  padding: 5px;
}

/* 搜索栏 */
.search-section {
  padding: 10px 15px;
  background-color: white;
  border-bottom: 1px solid var(--wechat-border-light);
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: var(--wechat-bg);
  border-radius: 20px;
  padding: 8px 15px;
}

.search-icon {
  font-size: 14px;
  color: var(--wechat-text-secondary);
  margin-right: 8px;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  color: var(--wechat-text-primary);
  outline: none;
}

.search-input::placeholder {
  color: var(--wechat-text-secondary);
}

/* 添加手机联系人 */
.add-phone-contacts {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  background-color: white;
  border-bottom: 1px solid var(--wechat-border-light);
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-phone-contacts:active {
  background-color: var(--wechat-cell-hover);
}

.contact-icon {
  font-size: 20px;
  margin-right: 12px;
}

.contact-label {
  flex: 1;
  font-size: 16px;
  color: var(--wechat-text-primary);
}

.contact-arrow {
  font-size: 18px;
  color: var(--wechat-text-secondary);
}

/* 请求类型切换 */
.request-type-tabs {
  display: flex;
  background-color: white;
  border-bottom: 1px solid var(--wechat-border-light);
}

.tab {
  flex: 1;
  text-align: center;
  padding: 12px;
  font-size: 14px;
  color: var(--wechat-text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.tab.active {
  color: var(--wechat-primary);
  font-weight: 500;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 2px;
  background-color: var(--wechat-primary);
}

.tab:active {
  background-color: var(--wechat-cell-hover);
}

/* 加载状态 */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  background-color: white;
}

.loading-icon {
  font-size: 40px;
  margin-bottom: 12px;
  animation: spin 1s linear infinite;
}

.loading p {
  font-size: 14px;
  color: var(--wechat-text-secondary);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 好友请求列表 */
.request-list {
  background-color: white;
}

.request-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  border-bottom: 1px solid var(--wechat-border-light);
  transition: background-color 0.2s;
}

.request-item:active {
  background-color: var(--wechat-cell-hover);
}

.avatar {
  margin-right: 12px;
}

.info {
  flex: 1;
  min-width: 0;
}

.name-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
  flex-wrap: wrap;
  gap: 8px;
}

.name {
  font-size: 16px;
  font-weight: 500;
  color: var(--wechat-text-primary);
}

.meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time {
  font-size: 12px;
  color: var(--wechat-text-secondary);
}

.status {
  font-size: 12px;
  color: var(--wechat-text-secondary);
}

.status-added {
  color: var(--wechat-text-secondary);
}

.status-expired {
  color: var(--wechat-gray);
}

.status-pending {
  color: var(--wechat-primary);
}

.message-row {
  display: flex;
  align-items: flex-start;
}

.message {
  font-size: 14px;
  color: var(--wechat-text-secondary);
  line-height: 1.4;
  max-height: 2.8em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.message.expanded {
  max-height: none;
  -webkit-line-clamp: unset;
}

.expand-btn {
  color: var(--wechat-primary);
  cursor: pointer;
  margin-left: 4px;
  font-size: 12px;
}

/* 操作按钮 */
.actions {
  display: flex;
  gap: 8px;
}

.actions button {
  padding: 4px 12px;
  border: none;
  border-radius: 3px;
  font-size: 14px;
  cursor: pointer;
}

.accept {
  background-color: var(--wechat-primary);
  color: white;
}

.reject {
  background-color: var(--wechat-bg);
  color: var(--wechat-text-primary);
}

/* 搜索栏可点击样式 */
.search-section {
  cursor: pointer;
}

.search-section:active {
  background-color: rgba(0, 0, 0, 0.05);
}

/* 空状态 */
.empty {
  text-align: center;
  padding: 40px;
  color: var(--wechat-text-secondary);
  background-color: white;
}
</style>