// src/store/modules/chat/actions.js
import { chatApi } from '@/api'
import storage, { STORAGE_KEYS } from '@/utils/storage'
import { showToast } from '@/utils/feedback'
import { http } from '@/api/request'

export default {
  // ✅ 第3步：添加选中会话的action
  selectConversation({ commit, dispatch, state }, conversationId) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('selectConversation: 选中会话', conversationId)
        
        // 1. 设置当前会话ID
        commit('SET_CURRENT_CONVERSATION_ID', conversationId)
        
        // 2. 标记该会话为已读
        const conversation = state.conversations.find(conv => conv.id === conversationId)
        if (conversation && conversation.unreadCount > 0) {
          commit('MARK_CONVERSATION_READ', conversationId)
        }
        
        // 3. 加载消息历史（如果还没有加载过）
        const existingMessages = state.messages[conversationId]
        if (!existingMessages || existingMessages.length === 0) {
          try {
            await dispatch('fetchMessages', { contactId: conversationId })
          } catch (error) {
            console.warn('加载消息历史失败，但继续:', error)
            // 即使加载失败也继续，不阻塞用户操作
          }
        }
        
        // 4. 记录最后查看时间
        commit('UPDATE_LAST_VIEW_TIME', {
          conversationId,
          timestamp: Date.now()
        })
        
        resolve(conversationId)
      } catch (error) {
        console.error('选择会话失败:', error)
        showToast('选择会话失败', 'error')
        reject(error)
      }
    })
  },
  
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
  
  // 拉历史消息
  async fetchMessages({ commit }, { contactId }) {
    try {
      console.log('加载消息历史，联系人ID:', contactId)
      
      let messages = []
      
      if (chatApi && chatApi.getHistory) {
        const response = await chatApi.getHistory(contactId)
        messages = Array.isArray(response?.data) ? response.data : 
                  (Array.isArray(response) ? response : [])
      } else {
        const response = await http.get(`/chat/history/${contactId}`)
        messages = Array.isArray(response?.data) ? response.data : []
      }
      
      commit('ADD_MESSAGES', { conversationId: contactId, messages })
      return messages
      
    } catch (error) {
      console.error('加载消息历史失败:', error)
      showToast('加载消息失败')
      commit('ADD_MESSAGES', { conversationId: contactId, messages: [] })
      throw error
    }
  },

  // 发消息
  async sendMessage({ commit, rootGetters }, { conversationId, content, type = 'text' }) {
    const currentUser = rootGetters['user/currentUser'] || { id: 'me', name: '我' }

    const tempMsg = {
      _id: `temp_${Date.now()}`,
      type,
      content,
      sender: { _id: currentUser.id, name: currentUser.name },
      receiver: { _id: conversationId },
      timestamp: new Date().toISOString(),
      status: 'sending'
    }
    commit('ADD_MESSAGE', { conversationId, message: tempMsg })

    try {
      const { data } = await http.post('/chat/message', {
        sender: currentUser.id,
        to: conversationId,
        content,
        type
      })
      
      commit('REPLACE_TEMP_MESSAGE', {
        conversationId,
        tempId: tempMsg._id,
        realMessage: data
      })
      return data
    } catch (e) {
      commit('UPDATE_MESSAGE_STATUS', {
        conversationId,
        tempId: tempMsg._id,
        status: 'error'
      })
      throw e
    }
  }
}