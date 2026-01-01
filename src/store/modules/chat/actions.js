import { chatApi } from '@/api'
import storage, { STORAGE_KEYS } from '@/utils/storage'
import { showToast } from '@/utils/feedback'

export default {
  // 获取聊天列表
  async fetchConversations({ commit, state }) {
    try {
      // 先尝试从本地存储加载
      const cachedConversations = storage.get(STORAGE_KEYS.CHAT_CONVERSATIONS, [])
      if (cachedConversations.length > 0) {
        commit('SET_CONVERSATIONS', cachedConversations)
      }
      
      const response = await chatApi.getConversations({
        lastUpdate: state.lastUpdate
      })
      
      if (response.code === 0) {
        const conversations = response.data.conversations || []
        
        // 保存到本地存储
        storage.set(STORAGE_KEYS.CHAT_CONVERSATIONS, conversations)
        
        // 提交到store
        commit('SET_CONVERSATIONS', conversations)
        commit('SET_LAST_UPDATE', Date.now())
        
        return Promise.resolve(conversations)
      } else {
        showToast('获取聊天列表失败', 'error')
        return Promise.reject(new Error(response.message))
      }
    } catch (error) {
      console.warn('获取聊天列表失败，使用缓存数据:', error)
      // 网络失败时使用缓存数据
      return Promise.resolve(state.conversations)
    }
  },
  
  // 获取聊天消息
  async fetchMessages({ commit, state }, conversationId) {
    try {
      const response = await chatApi.getMessages(conversationId, {
        since: state.messagesLastUpdate[conversationId]
      })
      
      if (response.code === 0) {
        const messages = response.data.messages || []
        
        // 提交到store
        commit('ADD_MESSAGES', { conversationId, messages })
        commit('SET_MESSAGES_LAST_UPDATE', { conversationId, timestamp: Date.now() })
        
        return Promise.resolve(messages)
      } else {
        showToast('获取消息失败', 'error')
        return Promise.reject(new Error(response.message))
      }
    } catch (error) {
      showToast('获取消息失败，请检查网络', 'error')
      return Promise.reject(error)
    }
  },
  
  // 发送消息
  async sendMessage({ commit, state }, { conversationId, content, type = 'text' }) {
    const userStore = useUserStore()
    const currentUser = userStore.currentUser
    
    // 先创建本地消息（乐观更新）
    const tempMessage = {
      id: `temp_${Date.now()}`,
      type,
      content,
      senderId: currentUser.id,
      time: new Date().toISOString(),
      status: 'sending'
    }
    
    commit('ADD_MESSAGE', { conversationId, message: tempMessage })
    
    try {
      const response = await chatApi.sendMessage(conversationId, {
        content,
        type,
        timestamp: tempMessage.time
      })
      
      if (response.code === 0) {
        // 更新消息状态为已发送
        commit('UPDATE_MESSAGE_STATUS', {
          conversationId,
          tempId: tempMessage.id,
          realId: response.data.messageId,
          status: 'sent'
        })
        
        // 更新会话的最后消息
        commit('UPDATE_CONVERSATION_LAST_MESSAGE', {
          conversationId,
          lastMessage: {
            content,
            type,
            time: tempMessage.time,
            senderId: currentUser.id
          }
        })
        
        return Promise.resolve(response.data)
      } else {
        // 发送失败，更新消息状态
        commit('UPDATE_MESSAGE_STATUS', {
          conversationId,
          tempId: tempMessage.id,
          status: 'error'
        })
        
        showToast('消息发送失败', 'error')
        return Promise.reject(new Error(response.message))
      }
    } catch (error) {
      // 网络错误，更新消息状态
      commit('UPDATE_MESSAGE_STATUS', {
        conversationId,
        tempId: tempMessage.id,
        status: 'error'
      })
      
      showToast('消息发送失败，请检查网络', 'error')
      return Promise.reject(error)
    }
  }
}