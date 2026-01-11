<template>
  <div class="chat-list-page">
    <header class="page-header">
      <h1>微信</h1>
      <div class="header-actions">
        <button class="header-button" @click="showAddMenu">➕</button>
        <button class="header-button" @click="search">🔍</button>
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
            @contextmenu="handleContextMenu(chat, $event)"
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
            @contextmenu="handleContextMenu(chat, $event)"
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
              <div class="time">{{ formatTime(chat.lastMessage?.time) }}</div>
              <div v-if="chat.isMuted && chat.unreadCount > 0" class="muted-dot"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 上下文菜单 -->
      <div 
        v-if="showContextMenu" 
        class="context-menu"
        :style="{ top: contextMenuPos.y + 'px', left: contextMenuPos.x + 'px' }"
        @click.stop
      >
        <div class="menu-item" @click="toggleTop(currentContextChat)">
          {{ currentContextChat?.isTop ? '取消置顶' : '置顶聊天' }}
        </div>
        <div class="menu-item" @click="deleteChat(currentContextChat)">
          删除聊天
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { Avatar, Badge } from '@/components/ui'
import { useConversationList } from '@/composables/useConversationList' // << 关键
import { useRouter } from 'vue-router'
import { useChatStore } from '@/composables/useStore'

export default {
  name: 'ChatList',
  components: { Avatar, Badge },
  setup() {
    const router = useRouter()
    const { topList: topConversations, normalList: normalConversations } = useConversationList()
    const chatStore = useChatStore()
    
    // 上下文菜单状态
    const showContextMenu = ref(false)
    const contextMenuPos = ref({ x: 0, y: 0 })
    const currentContextChat = ref(null)
    
    // 点击外部关闭上下文菜单
    const handleClickOutside = (event) => {
      if (showContextMenu.value) {
        showContextMenu.value = false
      }
    }

    /* 时间格式化 */
    const formatTime = (timeString) => {
      if (!timeString) return '刚刚'
      try {
        const date = new Date(timeString)
        if (isNaN(date.getTime())) return '刚刚'

        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const oneDay = 24 * 60 * 60 * 1000
        const diff = now - date

        if (diff < oneDay && date.getDate() === now.getDate()) {
          return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false })
        } else if (diff < 2 * oneDay) {
          return '昨天'
        } else if (diff < 7 * oneDay) {
          const days = ['日', '一', '二', '三', '四', '五', '六']
          return `星期${days[date.getDay()]}`
        } else {
          return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })
        }
      } catch {
        return ''
      }
    }

    /* 跳转聊天详情 */
    const selectChat = async (chat) => {
      try {
        console.log('选择聊天:', chat)
        await chatStore.selectConversation(chat.id)   // 若 store 提供此 action
      } catch (e) {
        console.error('selectConversation 失败:', e)
      } finally {
        router.push(`/chat/${chat.id}`)
      }
    }

    /* 显示添加菜单 */
    const showAddMenu = () => {
      console.log('显示添加菜单')
      // 实际实现中应该显示添加好友、创建群聊等选项
    }
    
    /* 搜索聊天 */
    const search = () => {
      console.log('搜索聊天')
      // 实际实现中应该打开搜索页面
    }
    
    /* 切换置顶状态 */
    const toggleTop = (chat) => {
      try {
        chatStore.dispatch('chat/TOGGLE_CONVERSATION_TOP', chat.id)
        showContextMenu.value = false
      } catch (e) {
        console.error('切换置顶状态失败:', e)
      }
    }
    
    /* 显示上下文菜单 */
    const handleContextMenu = (chat, event) => {
      event.preventDefault()
      event.stopPropagation()
      
      // 计算菜单位置
      const x = event.clientX
      const y = event.clientY
      
      currentContextChat.value = chat
      contextMenuPos.value = { x, y }
      showContextMenu.value = true
    }
    
    /* 删除聊天 */
    const deleteChat = (chat) => {
      try {
        if (confirm('确定要删除此聊天吗？')) {
          chatStore.dispatch('chat/DELETE_CONVERSATION', chat.id)
          showContextMenu.value = false
        }
      } catch (e) {
        console.error('删除聊天失败:', e)
      }
    }
    
    /* 生命周期 */
    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })
    
    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      topConversations,
      normalConversations,
      formatTime,
      selectChat,
      showAddMenu,
      search,
      showContextMenu,
      contextMenuPos,
      currentContextChat,
      handleContextMenu,
      toggleTop,
      deleteChat
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

.header-button {
  background: none;
  border: none;
  font-size: 20px;
  color: var(--wechat-text-primary);
  cursor: pointer;
  padding: 5px;
  transition: opacity 0.2s;
  width: auto;
  height: auto;
  line-height: 1;
}

.header-button:hover {
  opacity: 0.7;
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

/* 上下文菜单样式 */
.context-menu {
  position: fixed;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  padding: 8px 0;
  min-width: 150px;
  font-size: 14px;
}

.menu-item {
  padding: 8px 16px;
  cursor: pointer;
  color: #333;
  transition: background-color 0.2s;
}

.menu-item:hover {
  background-color: #f5f5f5;
}

.menu-item:active {
  background-color: #e5e5e5;
}
</style>