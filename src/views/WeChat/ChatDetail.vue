<template>
  <div class="chat-detail-page">
    <!-- 聊天头部 -->
    <header class="chat-header">
      <div class="header-left">
        <button class="back-button" @click="goBack">⬅</button>
      </div>
      <div class="header-center">
        <div class="contact-name">{{ currentContact?.name }}</div>
      </div>
      <div class="header-right">
        <button class="header-button">⋯</button>
      </div>
    </header>

    <!-- 消息列表区域 -->
    <main class="message-list" ref="messageListRef">
      <div class="message-container">
        <!-- 时间分隔符 -->
        <div class="time-divider">11:29</div>
        
        <!-- 消息列表 -->
        <div 
          v-for="message in currentMessages" 
          :key="message.id"
          class="message-wrapper"
        >
          <!-- 系统提示消息（撤回） -->
          <div v-if="message.type === 'system'" class="system-message">
            {{ message.content }}
          </div>
          
          <!-- 对方消息：左侧头像 + 右侧白色气泡 -->
          <div 
            v-else-if="message.senderId !== currentUser.id" 
            class="message-item message-item-other"
          >
            <img 
              :src="`https://picsum.photos/200/200?random=${message.senderId}`" 
              class="message-avatar"
              alt=""
            />
            <div class="message-bubble message-bubble-other">
              {{ message.content }}
            </div>
          </div>
          
          <!-- 自己消息：右侧头像 + 左侧绿色气泡 -->
          <div 
            v-else 
            class="message-item message-item-own"
          >
            <div class="message-bubble message-bubble-own">
              {{ message.content }}
            </div>
            <!-- 自己头像（新增） -->
            <img 
              :src="`https://picsum.photos/200/200?random=${currentUser.id}`" 
              class="message-avatar-own"
              alt=""
            />
          </div>
        </div>
      </div>
    </main>

    <!-- 底部输入区域 -->
    <footer class="input-area">
      <div class="input-wrapper">
        <button class="input-button voice-button">🎤</button>
        <div class="input-container">
          <input 
            type="text" 
            class="message-input" 
            placeholder="输入消息..."
            @keyup.enter="handleSendMessage"
          />
        </div>
        <button class="input-button emoji-button">😊</button>
        <button class="input-button more-button">+</button>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useChatStore } from '@/composables/useStore'
import { useUserStore } from '@/composables/useStore'

export default {
  name: 'ChatDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const chatStore = useChatStore()
    const userStore = useUserStore()
    
    const messageListRef = ref(null)

    const conversationId = parseInt(route.params.id)
    chatStore.selectConversation(conversationId)

    const currentConversation = computed(() => chatStore.currentConversation)
    const currentMessages = computed(() => [
      { id: 1, senderId: 2, content: '往下滑，很多张图片', time: '11:29', type: 'text' },
      { id: 2, senderId: 1, content: 'Mars:\n嗯，看了，', time: '11:29', type: 'text' },
      { id: 3, senderId: 1, content: '你撤回了一条消息', time: '11:29', type: 'system' },
      { id: 4, senderId: 2, content: '新年快乐迎', time: '04:49', type: 'text' },
      { id: 5, senderId: 2, content: '新年快乐酒', time: '04:49', type: 'text' },
      { id: 6, senderId: 2, content: '玫防战宝\nCTFUARORG\n网络安全的本质是攻防对抗\n讲百遍不妞打一遍\n习近平', time: '04:49', type: 'text' },
      { id: 7, senderId: 2, content: '我是顶级黑客\n个月后对你发起网络攻击\n不要攻击我呀', time: '04:49', type: 'text' }
    ])
    const currentUser = computed(() => ({ id: 1, name: 'Mars' }))

    const currentContact = computed(() => {
      if (currentConversation.value) {
        return {
          id: currentConversation.value.id,
          name: currentConversation.value.name || '朱龙春'
        }
      }
      return { id: 2, name: '朱龙春' }
    })

    const goBack = () => {
      router.back()
    }

    const handleSendMessage = (event) => {
      const content = event.target.value
      if (!content.trim()) return
      
      chatStore.sendMessage({
        conversationId,
        content: content.trim(),
        type: 'text'
      })
      
      event.target.value = ''
      
      nextTick(() => {
        scrollToBottom()
      })
    }

    const scrollToBottom = () => {
      if (messageListRef.value) {
        messageListRef.value.scrollTop = messageListRef.value.scrollHeight
      }
    }

    watch(currentMessages, () => {
      nextTick(scrollToBottom)
    })

    onMounted(() => {
      nextTick(scrollToBottom)
    })

    return {
      currentContact,
      currentUser,
      currentMessages,
      messageListRef,
      goBack,
      handleSendMessage
    }
  }
}
</script>

<style scoped>
/* 微信标准色 */
:root {
  --wechat-primary: #07c160;
  --wechat-bg: #ededed;
  --wechat-bg-grey: #f5f5f5;
  --wechat-border-light: #e5e5e5;
  --wechat-text-primary: #000000;
  --wechat-text-secondary: #999999;
  --wechat-text-time: #b2b2b2;
  --wechat-bubble-other: #ffffff;
  --wechat-bubble-own: #95ec69;
  --wechat-system: #b2b2b2;
}

.chat-detail-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--wechat-bg);
  overflow: hidden;
}

/* 聊天头部 - 高度48px */
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  background-color: white;
  border-bottom: 1px solid var(--wechat-border-light);
  position: sticky;
  top: 0;
  z-index: 100;
  height: 48px;
  box-sizing: border-box;
}

/* 左侧返回按钮区域 */
.header-left {
  flex-shrink: 0;
}

/* 中间标题区域 - 绝对居中 */
.header-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

/* 联系人名称 - 16px */
.contact-name {
  font-size: 16px;
  color: var(--wechat-text-primary);
  font-weight: 500;
  line-height: 1;
}

/* 右侧三个点按钮 - 20px */
.header-right {
  flex-shrink: 0;
}

.header-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--wechat-text-primary);
}

/* 返回按钮 - 20px大小 */
.back-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 消息列表区域 */
.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px 15px;
  padding-bottom: 56px;
  -webkit-overflow-scrolling: touch;
}

.message-container {
  min-height: 100%;
}

/* 时间分隔符 - 12px灰色 */
.time-divider {
  text-align: center;
  font-size: 12px;
  color: var(--wechat-text-time);
  margin: 10px 0;
}

/* 系统消息（撤回提示） */
.system-message {
  text-align: center;
  font-size: 13px;
  color: var(--wechat-system);
  margin: 10px 0;
  padding: 2px 0;
}

/* 消息项 - 每条消息独立容器 */
.message-wrapper {
  margin-bottom: 10px;
}

/* 对方消息 - 左头像，右气泡 */
.message-item-other {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}

/* 自己消息 - 左气泡，右头像（按用户要求修改） */
.message-item-own {
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
}

/* 对方消息头像 - 40x40px圆角矩形 */
.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
  margin-right: 10px;
  flex-shrink: 0;
}

/* 自己消息头像 - 40x40px圆角矩形，在右侧 */
.message-avatar-own {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
  margin-left: 10px; /* 左侧气泡，右侧头像 */
  flex-shrink: 0;
}

/* 消息气泡 - 矩形（圆角4px） */
.message-bubble {
  max-width: 60%;
  padding: 10px 12px;
  font-size: 16px;
  line-height: 1.4;
  word-wrap: break-word;
  word-break: break-all;
  border-radius: 4px;
  position: relative;
}

/* 对方消息气泡 - 白色矩形 */
.message-bubble-other {
  background-color: var(--wechat-bubble-other);
  color: var(--wechat-text-primary);
}

/* 自己消息气泡 - 绿色矩形 */
.message-bubble-own {
  background-color: var(--wechat-bubble-own);
  color: var(--wechat-text-primary);
}

/* 底部输入区域 - 高度56px */
.input-area {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  border-top: 1px solid var(--wechat-border-light);
  padding: 8px 0;
  z-index: 100;
}

.input-wrapper {
  display: flex;
  align-items: center;
  padding: 0 12px;
}

/* 输入按钮 - 24x24px */
.input-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--wechat-text-secondary);
  flex-shrink: 0;
}

.voice-button {
  margin-right: 8px;
}

.emoji-button {
  margin: 0 8px;
}

.more-button {
  margin-left: 8px;
}

/* 输入框容器 */
.input-container {
  flex: 1;
  display: flex;
  align-items: center;
}

.message-input {
  width: 100%;
  border: 1px solid var(--wechat-border-light);
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 16px;
  outline: none;
  background-color: white;
  box-sizing: border-box;
}

.message-input:focus {
  border-color: var(--wechat-primary);
}
</style>