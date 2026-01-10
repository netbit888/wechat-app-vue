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
        <!-- 加载状态 -->
        <div v-if="isLoading" class="loading-tip">加载中...</div>
        
        <!-- 消息列表 -->
        <div 
          v-for="message in currentMessages" 
          :key="message._id"
          class="message-wrapper"
        >
          <!-- 系统提示消息（撤回） -->
          <div v-if="message.type === 'system'" class="system-message">
            {{ message.content }}
          </div>
          
          <!-- 对方消息：左侧头像 + 右侧白色气泡 -->
          <div 
            v-else-if="!isMyMessage(message)" 
            class="message-item message-item-other"
          >
            <img 
              :src="message.sender?.avatar || `https://picsum.photos/200/200?random=${message.sender?._id}`" 
              class="message-avatar"
              alt=""
            />
            <MessageBubble 
              :message="message" 
              :is-own="false"
              @resend="handleResend"
            />
          </div>
          
          <!-- 自己消息：左侧气泡 + 右侧头像 -->
          <div 
            v-else 
            class="message-item message-item-own"
          >
            <MessageBubble 
              :message="message" 
              :is-own="true"
              @resend="handleResend"
            />
            <img 
              :src="currentUser.avatar || `https://picsum.photos/200/200?random=${currentUser.id}`" 
              class="message-avatar-own"
              alt=""
            />
          </div>
        </div>
      </div>
    </main>

    <!-- 底部输入区域 -->
    <footer class="input-area">
      <MessageInput 
        @send-message="handleSendMessage"
        @send-voice="handleSendVoice"
        @send-image="handleSendImage"
        @send-video="handleSendVideo"
        @send-file="handleSendFile"
        @send-location="handleSendLocation"
      />
    </footer>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useChatStore, useUserStore} from '@/composables/useStore'
import { showToast } from '@/utils/feedback'
import { http } from '@/api/request';
import { useWebSocket } from '@/composables/useWebSocket';
import { useStore } from '@/store'
import MessageBubble from '@/components/business/Chat/MessageBubble/MessageBubble.vue'

export default {
  name: 'ChatDetail',
  components: {
    MessageBubble
  },
  setup() {
    const { onMessage } = useWebSocket();
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const chatStore = useChatStore()
    const userStore = useUserStore()
    
    const messageListRef = ref(null)
    const inputContent = ref('')
    const isLoading = ref(false)
    const websocket = useWebSocket(import.meta.env.VITE_WEBSOCKET_URL)

    const contactId = route.params.id
    if (!contactId) {
      showToast('无效的聊天对象')
      router.back()
      return
    }
    
    // 获取当前用户信息
    const currentUser = computed(() => userStore.currentUser || { id: 0 })

    // 获取聊天对象信息
    const currentContact = computed(() => {
      return chatStore.currentConversation || { 
        id: contactId, 
        name: '加载中...' 
      }
    })

    // 从 Store 获取消息
    const currentMessages = computed(() => {
      return chatStore.getMessagesByConversationId?.(contactId)?.value || []
    })

    // 判断消息是否是自己发的
    const isMyMessage = (message) => {
      const senderId = message.sender?._id || message.sender
      return senderId === currentUser.value.id
    }

    const goBack = () => {
      router.back()
    }

    /* 加载历史 */
    onMounted(async () => {
      isLoading.value = true;
      try {
        await chatStore.fetchMessages({ contactId });
      } catch (e) {
        console.error('加载历史失败', e);
      } finally {
        isLoading.value = false;
        nextTick(scrollToBottom);
      }

      websocket.connect()
      // 监听消息
      websocket.onMessage((msg) => {
        if (msg.from !== contactId) return
        // 处理消息逻辑
        chatStore.addMessage({
          conversationId: contactId,
          message: { ...msg, _id: msg._id || Date.now() }
        })
        nextTick(scrollToBottom)
      })
    })

    /* 发送文本消息 */
    const handleSendMessage = async (content) => {
      if (!content.trim()) return;
      await chatStore.dispatch('chat/sendMessage', {
        conversationId: contactId,
        content,
        type: 'text'
      });
      nextTick(scrollToBottom);
    };
    
    /* 发送语音消息 */
    const handleSendVoice = async (voiceData) => {
      try {
        await chatStore.dispatch('chat/sendMessage', {
          conversationId: contactId,
          content: voiceData,
          type: 'voice'
        });
        showToast('语音发送成功', 'success');
        nextTick(scrollToBottom);
      } catch (error) {
        showToast('语音发送失败', 'error');
        console.error('语音发送失败:', error);
      }
    };
    
    /* 发送图片消息 */
    const handleSendImage = async () => {
      try {
        // 模拟图片数据
        const imageData = {
          url: 'https://picsum.photos/200/200?random=' + Date.now(),
          name: 'image.jpg',
          size: '1.2MB'
        };
        await chatStore.dispatch('chat/sendMessage', {
          conversationId: contactId,
          content: imageData,
          type: 'image'
        });
        showToast('图片发送成功', 'success');
        nextTick(scrollToBottom);
      } catch (error) {
        showToast('图片发送失败', 'error');
        console.error('图片发送失败:', error);
      }
    };
    
    /* 发送视频消息 */
    const handleSendVideo = async () => {
      try {
        // 模拟视频数据
        const videoData = {
          url: 'https://example.com/video.mp4',
          name: 'video.mp4',
          size: '10.5MB',
          duration: '1:23'
        };
        await chatStore.dispatch('chat/sendMessage', {
          conversationId: contactId,
          content: videoData,
          type: 'video'
        });
        showToast('视频发送成功', 'success');
        nextTick(scrollToBottom);
      } catch (error) {
        showToast('视频发送失败', 'error');
        console.error('视频发送失败:', error);
      }
    };
    
    /* 发送文件消息 */
    const handleSendFile = async () => {
      try {
        // 模拟文件数据
        const fileData = {
          name: 'document.pdf',
          size: '1.5MB',
          url: 'https://example.com/document.pdf'
        };
        await chatStore.dispatch('chat/sendMessage', {
          conversationId: contactId,
          content: fileData,
          type: 'file'
        });
        showToast('文件发送成功', 'success');
        nextTick(scrollToBottom);
      } catch (error) {
        showToast('文件发送失败', 'error');
        console.error('文件发送失败:', error);
      }
    };
    
    /* 发送位置消息 */
    const handleSendLocation = async () => {
      try {
        // 模拟位置数据
        const locationData = {
          latitude: 39.9042,
          longitude: 116.4074,
          address: '北京市东城区天安门广场'
        };
        await chatStore.dispatch('chat/sendMessage', {
          conversationId: contactId,
          content: locationData,
          type: 'location'
        });
        showToast('位置发送成功', 'success');
        nextTick(scrollToBottom);
      } catch (error) {
        showToast('位置发送失败', 'error');
        console.error('位置发送失败:', error);
      }
    };

    const scrollToBottom = () => {
      if (messageListRef.value) {
        messageListRef.value.scrollTop = messageListRef.value.scrollHeight
      }
    }

    // 监听消息变化自动滚动
    watch(currentMessages, () => {
      nextTick(scrollToBottom)
    }, { deep: true })

    // 重发消息
    const handleResend = async (message) => {
      try {
        await chatStore.dispatch('chat/sendMessage', {
          conversationId: contactId,
          content: message.content,
          type: message.type
        });
        showToast('消息已重发', 'success');
      } catch (error) {
        showToast('消息重发失败', 'error');
        console.error('消息重发失败:', error);
      }
    };

    return {
      currentContact,
      currentUser,
      currentMessages,
      messageListRef,
      isLoading,
      isMyMessage,
      goBack,
      handleSendMessage,
      handleSendVoice,
      handleSendImage,
      handleSendVideo,
      handleSendFile,
      handleSendLocation,
      handleResend
    }
  }
}
</script>

<style scoped>
.chat-detail-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #ededed;
  overflow: hidden;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  background-color: white;
  border-bottom: 1px solid #e5e5e5;
  position: sticky;
  top: 0;
  z-index: 100;
  height: 48px;
  box-sizing: border-box;
}

.header-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.contact-name {
  font-size: 16px;
  color: #000000;
  font-weight: 500;
  line-height: 1;
}

.back-button, .header-button {
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
  color: #000000;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px 15px;
  padding-bottom: 56px;
  -webkit-overflow-scrolling: touch;
}

.loading-tip {
  text-align: center;
  color: #999;
  font-size: 14px;
  padding: 10px;
}

.time-divider {
  text-align: center;
  font-size: 12px;
  color: #b2b2b2;
  margin: 10px 0;
}

.system-message {
  text-align: center;
  font-size: 13px;
  color: #b2b2b2;
  margin: 10px 0;
}

.message-wrapper {
  margin-bottom: 10px;
}

.message-item-other {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}

.message-item-own {
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
}

.message-avatar, .message-avatar-own {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
  flex-shrink: 0;
}

.message-avatar {
  margin-right: 10px;
}

.message-avatar-own {
  margin-left: 10px;
}

.message-bubble {
  max-width: 60%;
  padding: 10px 12px;
  font-size: 16px;
  line-height: 1.4;
  word-wrap: break-word;
  word-break: break-all;
  border-radius: 4px;
}

.message-bubble-other {
  background-color: #ffffff;
  color: #000000;
}

.message-bubble-own {
  background-color: #95ec69;
  color: #000000;
}

.input-area {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  border-top: 1px solid #e5e5e5;
  padding: 8px 0;
  z-index: 100;
}

.input-wrapper {
  display: flex;
  align-items: center;
  padding: 0 12px;
}

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
  color: #999999;
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
  color: #07c160;
  font-weight: 500;
}

.input-container {
  flex: 1;
  display: flex;
  align-items: center;
}

.message-input {
  width: 100%;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 16px;
  outline: none;
  background-color: white;
  box-sizing: border-box;
}

.message-input:focus {
  border-color: #07c160;
}
</style>