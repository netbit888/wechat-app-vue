<template>
  <div class="contact-detail-page" v-if="contact && !isLoading">
    <!-- 头部导航 -->
    <header class="detail-header">
      <button class="back-button" @click="goBack">⬅</button>
      <h1>详细资料</h1>
      <button class="more-button" @click="showMoreMenu">⋯</button>
    </header>

    <!-- 基本信息卡片 -->
    <div class="basic-info-card">
      <div class="avatar-section">
        <Avatar 
          :size="'xlarge'" 
          :text="contact.nickname" 
          :backgroundColor="contact.avatarColor"
        />
      </div>
      <div class="name-section">
        <h2 class="nickname">{{ contact.nickname }}</h2>
        <p class="wechat-id">微信号：{{ contact.wechatId }}</p>
        <p class="region" v-if="contact.region">
          <span class="region-icon">📍</span>
          地区：{{ contact.region }}
        </p>
      </div>
    </div>

    <!-- 详细信息列表 -->
    <div class="detail-section">
      <div class="info-item" @click="editRemark">
        <div class="item-label">备注名</div>
        <div class="item-value">{{ contact.remarkName || contact.nickname }}</div>
        <div class="item-arrow">›</div>
      </div>
      <div class="info-item" v-if="contact.phone" @click="callPhone">
        <div class="item-label">手机号</div>
        <div class="item-value">{{ contact.phone }}</div>
        <div class="item-arrow">›</div>
      </div>
      <div class="info-item" v-if="contact.description">
        <div class="item-label">描述</div>
        <div class="item-value description">{{ contact.description }}</div>
      </div>
      <div class="info-item" v-if="contact.tags && contact.tags.length">
        <div class="item-label">标签</div>
        <div class="item-value">
          <div class="tags-list">
            <span v-for="tag in contact.tags" :key="tag" class="tag-item">
              {{ tag }}
            </span>
          </div>
        </div>
        <div class="item-arrow">›</div>
      </div>
    </div>

    <!-- 朋友圈入口 -->
    <div class="moments-entry" @click="viewMoments" v-if="contact.showMoments">
      <div class="entry-label">朋友圈</div>
      <div class="entry-content">
        <img :src="contact.recentMoment" alt="朋友圈" class="moment-preview" />
      </div>
      <div class="entry-arrow">›</div>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <!-- 已添加为好友 -->
      <template v-if="isFriend">
        <button class="action-btn primary" @click="sendMessage">
          <span class="btn-icon">💬</span>
          <span class="btn-text">发消息</span>
        </button>
        <button class="action-btn" @click="videoCall">
          <span class="btn-icon">📞</span>
          <span class="btn-text">音视频通话</span>
        </button>
      </template>
      <!-- 未添加为好友 -->
      <template v-else>
        <!-- 发送请求状态 -->
        <div v-if="friendRequestStatus === 'sent'" class="request-status">
          <p>好友请求已发送</p>
          <button class="cancel-btn" @click="cancelRequest">取消请求</button>
        </div>
        
        <!-- 发送请求表单 -->
        <div v-else-if="friendRequestStatus === 'form'" class="request-form">
          <div class="form-header">发送好友请求</div>
          <textarea 
            v-model="friendRequestMessage" 
            placeholder="请输入验证消息（可选）" 
            class="message-input"
            rows="3"
          ></textarea>
          <div class="form-actions">
            <button class="cancel-btn" @click="cancelForm">取消</button>
            <button class="send-btn" @click="sendFriendRequest">发送</button>
          </div>
        </div>
        
        <!-- 添加按钮 -->
        <template v-else>
          <button class="action-btn primary" @click="showRequestForm">
            <span class="btn-icon">+</span>
            <span class="btn-text">添加到通讯录</span>
          </button>
        </template>
      </template>
    </div>
  </div>

  <div v-else class="loading-state">
    <div class="loading-icon">⏳</div>
    <p>加载中...</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '@/store'
import Avatar from '@/components/ui/Avatar/Avatar.vue'
import contactAPI from '@/api/modules/contact.js'

const route   = useRoute()
const router  = useRouter()
const store = useStore()

/* 1. 路由参数保持字符串即可，不用 parseInt */
const contactId = route.params.id

/* 2. 存储联系人详情 */
const contact = ref(null)
const isLoading = ref(true)
const isFriend = ref(false)
const friendRequestStatus = ref('none') // none, form, sent
const friendRequestMessage = ref('')
const friendRequestId = ref(null)

/* 3. 获取联系人详情和好友状态 */
onMounted(async () => {
  try {
    isLoading.value = true
    
    // 获取联系人详情
    const res = await contactAPI.getDetail(contactId)
    if (res?.ok && res?.contact) {
      contact.value = {
        ...res.contact,
        id: res.contact._id || res.contact.id
      }
      
      // 获取当前用户的好友列表，判断是否是好友
      const friendsRes = await contactAPI.getList()
      if (friendsRes?.friends) {
        const friendIds = friendsRes.friends.map(friend => friend._id || friend.id)
        isFriend.value = friendIds.includes(contact.value.id)
      }
      
      // 检查是否已发送好友请求
      if (!isFriend.value) {
        const sentRequestsRes = await contactAPI.getSentRequests()
        if (sentRequestsRes?.requests) {
          const existingRequest = sentRequestsRes.requests.find(req => 
            req.to._id === contact.value.id || req.to === contact.value.id
          )
          if (existingRequest) {
            friendRequestStatus.value = 'sent'
            friendRequestId.value = existingRequest._id
          }
        }
      }
    } else {
      router.back()
    }
  } catch (e) {
    console.error('获取联系人详情失败', e)
    router.back()
  } finally {
    isLoading.value = false
  }
})

/* 5. 函数们 */
const goBack     = () => router.back()
const sendMessage = () => {
  console.log('准备跳转聊天', contact.value.id)
  if (contact.value?.id) {
    router.push(`/chat/${contact.value.id}`)
  }
}
const videoCall  = () => console.log('音视频通话:', contact.value?.nickname)
const editRemark = () => console.log('编辑备注')
const callPhone  = () => console.log('拨打电话:', contact.value?.phone)
const viewMoments= () => console.log('查看朋友圈')
const showMoreMenu=()=> console.log('显示更多菜单')

// 显示添加好友表单
const showRequestForm = () => {
  friendRequestStatus.value = 'form'
}

// 取消表单
const cancelForm = () => {
  friendRequestStatus.value = 'none'
  friendRequestMessage.value = ''
}

// 发送好友请求
const sendFriendRequest = async () => {
  try {
    await contactAPI.add(contact.value.id, friendRequestMessage.value)
    friendRequestStatus.value = 'sent'
    friendRequestMessage.value = ''
    // 这里应该获取请求ID，但当前API不返回，暂时注释
    // friendRequestId.value = res.requestId
  } catch (e) {
    alert(e?.response?.data?.msg || '发送好友请求失败')
  }
}

// 取消好友请求
const cancelRequest = async () => {
  try {
    // 由于当前API不返回请求ID，我们需要重新获取已发送请求列表
    const sentRequestsRes = await contactAPI.getSentRequests()
    if (sentRequestsRes?.requests) {
      const existingRequest = sentRequestsRes.requests.find(req => 
        req.to._id === contact.value.id || req.to === contact.value.id
      )
      if (existingRequest) {
        await contactAPI.cancelRequest(existingRequest._id)
        friendRequestStatus.value = 'none'
        friendRequestId.value = null
      }
    }
  } catch (e) {
    alert(e?.response?.data?.msg || '取消好友请求失败')
  }
}

/* 6. 模板需要的东西统一导出 */
/*  使用 <script setup> 时自动暴露，无需 return */
</script>

<style scoped>
:root {
  --wechat-bg: #ededed;
  --wechat-border: #d6d6d6;
  --wechat-border-light: #e5e5e5;
  --wechat-text-primary: #000000;
  --wechat-text-secondary: #999999;
  --wechat-primary: #07c160;
  --wechat-cell-hover: #f5f5f5;
  --wechat-label-bg: #f0f0f0;
}

.contact-detail-page {
  min-height: 100vh;
  background-color: var(--wechat-bg);
  padding-bottom: 20px;
}

/* 头部导航 - 微信标准44px */
.detail-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 15px;
  background-color: var(--wechat-bg);
  border-bottom: 1px solid var(--wechat-border);
  position: sticky;
  top: 0;
  z-index: 100;
  height: 44px;
  box-sizing: border-box;
}

.detail-header h1 {
  font-size: 17px;
  font-weight: 500;
  color: var(--wechat-text-primary);
  margin: 0;
  text-align: center;
  line-height: 44px;
}

.back-button,
.more-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  color: var(--wechat-text-primary);
  transition: opacity 0.2s;
  position: absolute;
}

.back-button {
  left: 5px;
}

.more-button {
  right: 5px;
}

.back-button:hover,
.more-button:hover {
  opacity: 0.7;
}

/* 基本信息卡片 */
.basic-info-card {
  background-color: white;
  padding: 30px 15px 20px;
  text-align: center;
  margin-bottom: 20px;
}

.avatar-section {
  margin-bottom: 20px;
}

.avatar-section .ui-avatar {
  width: 80px;
  height: 80px;
  border-radius: 4px;
}

.nickname {
  font-size: 20px;
  font-weight: 500;
  color: var(--wechat-text-primary);
  margin-bottom: 8px;
  line-height: 1.4;
}

.wechat-id {
  font-size: 14px;
  color: var(--wechat-text-secondary);
  margin-bottom: 6px;
  line-height: 1.4;
}

.region {
  font-size: 14px;
  color: var(--wechat-text-secondary);
  line-height: 1.4;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.region-icon {
  font-size: 12px;
}

/* 详细信息列表 */
.detail-section {
  background-color: white;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
}

.info-item:active {
  background-color: var(--wechat-cell-hover);
}

.info-item:not(:last-child)::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 15px;
  right: 15px;
  height: 1px;
  background-color: var(--wechat-border-light);
}

.item-label {
  font-size: 16px;
  color: var(--wechat-text-primary);
  flex-shrink: 0;
  min-width: 80px;
}

.item-value {
  flex: 1;
  font-size: 16px;
  color: var(--wechat-text-primary);
  text-align: right;
  margin: 0 10px;
  min-width: 0;
}

.item-value.description {
  color: var(--wechat-text-secondary);
  font-size: 14px;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: flex-end;
}

.tag-item {
  background-color: var(--wechat-label-bg);
  color: var(--wechat-text-secondary);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  white-space: nowrap;
}

.item-arrow {
  font-size: 20px;
  color: var(--wechat-text-secondary);
  flex-shrink: 0;
  font-weight: 300;
}

/* 朋友圈入口 */
.moments-entry {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  background-color: white;
  margin-bottom: 20px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.moments-entry:active {
  background-color: var(--wechat-cell-hover);
}

.entry-label {
  font-size: 16px;
  color: var(--wechat-text-primary);
  flex-shrink: 0;
}

.entry-content {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  margin: 0 10px;
}

.moment-preview {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
}

.entry-arrow {
  font-size: 20px;
  color: var(--wechat-text-secondary);
  flex-shrink: 0;
  font-weight: 300;
}

/* 操作按钮 */
.action-buttons {
  padding: 0 15px;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border: none;
  border-radius: 6px;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 16px;
}

.action-btn.primary {
  background-color: var(--wechat-primary);
  color: white;
}

.action-btn.primary:hover {
  background-color: #06ad56;
}

.action-btn:hover {
  background-color: var(--wechat-cell-hover);
}

.action-btn:active {
  transform: scale(0.98);
}

.btn-icon {
  font-size: 18px;
}

.btn-text {
  color: inherit;
  font-size: 16px;
}

/* 请求状态 */
.request-status {
  background-color: white;
  padding: 16px;
  border-radius: 6px;
  text-align: center;
}

.request-status p {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: var(--wechat-text-primary);
}

.cancel-btn {
  background-color: transparent;
  border: none;
  color: var(--wechat-primary);
  font-size: 14px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.cancel-btn:hover {
  background-color: var(--wechat-cell-hover);
}

/* 请求表单 */
.request-form {
  background-color: white;
  padding: 16px;
  border-radius: 6px;
}

.form-header {
  font-size: 16px;
  font-weight: 500;
  color: var(--wechat-text-primary);
  margin-bottom: 12px;
}

.message-input {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--wechat-border-light);
  border-radius: 6px;
  resize: none;
  font-size: 14px;
  line-height: 1.5;
  outline: none;
  box-sizing: border-box;
}

.message-input:focus {
  border-color: var(--wechat-primary);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
}

.send-btn {
  padding: 8px 16px;
  background-color: var(--wechat-primary);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.send-btn:hover {
  background-color: #06ad56;
}

.send-btn:active {
  transform: scale(0.98);
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: var(--wechat-bg);
}

.loading-icon {
  font-size: 40px;
  margin-bottom: 12px;
  animation: spin 1s linear infinite;
}

.loading-state p {
  font-size: 14px;
  color: var(--wechat-text-secondary);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>