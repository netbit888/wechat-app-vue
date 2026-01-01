<template>
  <div class="chat-list-page">
    <header class="page-header">
      <h1>微信</h1>
      <div class="header-actions">
        <Button type="text" size="small" @click="showAddMenu">➕</Button>
        <Button type="text" size="small" @click="search">🔍</Button>
      </div>
    </header>
    
    <main class="page-content">
      <!-- 置顶会话 -->
      <div v-if="topConversations.length > 0" class="conversation-section">
        <div class="section-title">置顶聊天</div>
        <div class="chat-items">
          <div 
            class="chat-item" 
            v-for="chat in topConversations" 
            :key="chat.id"
            @click="selectChat(chat)"
          >
            <div class="avatar-wrapper">
              <Badge 
                :count="chat.unreadCount" 
                :dot="chat.isMuted && chat.unreadCount > 0" 
                type="error"
              >
                <!-- 修改为圆角矩形图片头像，使用chat.id作为随机种子确保一致性 -->
                <img 
                  :src="`https://picsum.photos/200/200?random=${chat.id}`" 
                  class="chat-avatar"
                  alt=""
                />
              </Badge>
            </div>
            <div class="chat-info">
              <div class="chat-title">
                {{ chat.name }}
                <span v-if="chat.type === 'group'" class="group-tag">群</span>
                <span v-if="chat.isMuted" class="muted-icon">🔇</span>
              </div>
              <div class="last-message">
                <span v-if="chat.lastMessage.type === 'text'">{{ chat.lastMessage.content }}</span>
                <span v-if="chat.lastMessage.type === 'image'">[图片]</span>
                <span v-if="chat.lastMessage.type === 'voice'">[语音]</span>
                <span v-if="chat.lastMessage.type === 'video'">[视频]</span>
                <span v-if="chat.lastMessage.type === 'file'">[文件]</span>
              </div>
            </div>
            <div class="chat-meta">
              <div class="time">{{ formatTime(chat.lastMessage.time) }}</div>
              <div v-if="chat.isMuted && chat.unreadCount > 0" class="muted-dot"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 普通会话 -->
      <div class="conversation-section">
        <div v-if="topConversations.length > 0" class="section-title">所有聊天</div>
        <div class="chat-items">
          <div 
            class="chat-item" 
            v-for="chat in normalConversations" 
            :key="chat.id"
            @click="selectChat(chat)"
          >
            <div class="avatar-wrapper">
              <Badge 
                :count="chat.unreadCount" 
                :dot="chat.isMuted && chat.unreadCount > 0" 
                type="error"
              >
                <!-- 修改为圆角矩形图片头像，使用chat.id作为随机种子确保一致性 -->
                <img 
                  :src="`https://picsum.photos/200/200?random=${chat.id}`" 
                  class="chat-avatar"
                  alt=""
                />
              </Badge>
            </div>
            <div class="chat-info">
              <div class="chat-title">
                {{ chat.name }}
                <span v-if="chat.type === 'group'" class="group-tag">群</span>
                <span v-if="chat.isMuted" class="muted-icon">🔇</span>
              </div>
              <div class="last-message">
                <span v-if="chat.lastMessage.type === 'text'">{{ chat.lastMessage.content }}</span>
                <span v-if="chat.lastMessage.type === 'image'">[图片]</span>
                <span v-if="chat.lastMessage.type === 'voice'">[语音]</span>
                <span v-if="chat.lastMessage.type === 'video'">[视频]</span>
                <span v-if="chat.lastMessage.type === 'file'">[文件]</span>
              </div>
            </div>
            <div class="chat-meta">
              <div class="time">{{ formatTime(chat.lastMessage.time) }}</div>
              <div v-if="chat.isMuted && chat.unreadCount > 0" class="muted-dot"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { Button, Avatar, Badge } from '@/components/ui'
import { useChatStore } from '@/composables/useStore'
import { useRouter } from 'vue-router'

export default {
  name: 'ChatList',
  components: {
    Button,
    Avatar,  // 保留Avatar组件，虽然暂时未使用，但避免潜在依赖问题
    Badge
  },
  setup() {
    const chatStore = useChatStore()
    const router = useRouter()
    
    const formatTime = (timeString) => {
      const date = new Date(timeString)
      const now = new Date()
      const diff = now - date
      const oneDay = 24 * 60 * 60 * 1000
      
      if (diff < oneDay) {
        return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      } else if (diff < 2 * oneDay) {
        return '昨天'
      } else if (diff < 7 * oneDay) {
        const days = ['日', '一', '二', '三', '四', '五', '六']
        return `星期${days[date.getDay()]}`
      } else {
        return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })
      }
    }
    
    const getAvatarColor = (id) => {
      const colors = ['#07c160', '#fa5151', '#10aeff', '#6467ef', '#ffc300']
      return colors[(id - 1) % colors.length]
    }
    
    const selectChat = (chat) => {
      chatStore.selectConversation(chat.id)
      // 跳转到聊天详情页面
      router.push(`/chat/${chat.id}`)
    }
    
    const showAddMenu = () => {
      console.log('显示添加菜单')
    }
    
    const search = () => {
      console.log('搜索')
    }
    
    return {
      topConversations: chatStore.topConversations,
      normalConversations: chatStore.normalConversations,
      formatTime,
      getAvatarColor,
      selectChat,
      showAddMenu,
      search
    }
  }
}
</script>

<style scoped>
/* 全局变量 - 微信标准色 */
:root {
  --wechat-primary: #07c160;
  --wechat-primary-hover: #06ad56;
  --wechat-bg: #ededed;
  --wechat-bg-grey: #f5f5f5;
  --wechat-border: #d6d6d6;
  --wechat-border-light: #e5e5e5;
  --wechat-text-primary: #000000;
  --wechat-text-secondary: #999999;
  --wechat-text-time: #b2b2b2;
  --wechat-badge: #fa5151;
  --wechat-badge-muted: #cecece;
  --wechat-cell-hover: #d9d9d9;
  --wechat-cell-active: #b2b2b2;
}

/* 页面头部样式 - 完全模仿微信 */
.page-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background-color: var(--wechat-bg);
  border-bottom: 1px solid var(--wechat-border);
  position: relative;
  height: 44px;
  box-sizing: border-box;
  position: sticky;
  top: 0;
  z-index: 100;
}

.page-header h1 {
  font-size: 17px;
  font-weight: 500;
  color: #000;
  margin: 0;
  text-align: center;
  line-height: 44px;
}

/* 右侧操作按钮容器 - 微信标准布局 */
.header-actions {
  display: flex;
  gap: 25px;
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
}

/* 按钮样式调整 - 微信图标大小 */
.header-actions .ui-button {
  padding: 0;
  font-size: 24px;
  color: #000;
  width: auto;
  height: auto;
  line-height: 1;
  background: none !important;
  border: none !important;
  cursor: pointer;
  transition: opacity 0.2s;
}

.header-actions .ui-button:hover {
  background: none !important;
  opacity: 0.7;
}

/* 聊天列表区域 */
.conversation-section {
  background-color: white;
}

.section-title {
  padding: 4px 15px;
  font-size: 13px;
  color: var(--wechat-text-secondary);
  background-color: var(--wechat-bg-grey);
  position: sticky;
  top: 44px;
  z-index: 10;
  font-weight: normal;
}

.chat-items {
  padding: 0;
}

/* 聊天项 - 微信标准高度64px */
.chat-item {
  display: flex;
  align-items: center;
  padding: 0 15px;
  background-color: white;
  cursor: pointer;
  transition: background-color 0.2s;
  height: 64px;
  box-sizing: border-box;
  position: relative;
}

.chat-item:not(:last-child)::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 75px; /* 头像宽度48 + 右边距12 + 左边距15 = 75 */
  right: 0;
  height: 1px;
  background-color: var(--wechat-border-light);
}

.chat-item:hover {
  background-color: var(--wechat-bg-grey);
}

.chat-item:active {
  background-color: var(--wechat-cell-active);
}

/* 头像容器 */
.avatar-wrapper {
  position: relative;
  margin-right: 12px;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
}

/* 修改：移除原有的Avatar组件样式，改为图片头像样式 */
.avatar-wrapper .ui-avatar {
  display: none;
}

/* 新增：圆角矩形图片头像样式 - 微信标准48x48px，4px圆角 */
.chat-avatar {
  width: 48px;
  height: 48px;
  border-radius: 4px;  /* 微信风格的圆角矩形 */
  object-fit: cover;   /* 保持图片比例并填充整个区域 */
  display: block;
  background-color: var(--wechat-bg-grey); /* 图片加载时的占位背景色 */
}

/* 聊天信息区域 */
.chat-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0; /* 防止flex item溢出 */
  margin-right: 10px;
  height: 100%;
}

.chat-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: var(--wechat-text-primary);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 400;
  line-height: 1.4;
}

.group-tag {
  font-size: 10px;
  color: var(--wechat-text-secondary);
  background-color: transparent;
  padding: 0;
  border-radius: 0;
  margin-left: 4px;
  flex-shrink: 0;
}

.muted-icon {
  font-size: 14px;
  margin-left: 4px;
  opacity: 0.6;
  flex-shrink: 0;
}

.last-message {
  font-size: 14px;
  color: var(--wechat-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}

/* 右侧元信息 */
.chat-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  flex-shrink: 0;
  height: 100%;
}

.time {
  font-size: 12px;
  color: var(--wechat-text-time);
  margin-bottom: 4px;
  white-space: nowrap;
  font-weight: normal;
}

/* 静音状态下的灰色小圆点 */
.muted-dot {
  width: 8px;
  height: 8px;
  background-color: var(--wechat-badge-muted);
  border-radius: 50%;
  margin-top: 2px;
}

/* 置顶标签移除 - 微信不显示置顶标签 */
.top-label {
  display: none;
}
</style>