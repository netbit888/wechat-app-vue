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
  
  // 修改 fetchMessages 方法（约第20-40行）
  async fetchMessages({ commit, state }, { userId, contactId }) {
    try {
      const response = await chatApi.getMessages(userId, contactId)
      
      if (response.success) {  // 注意检查 success 字段
        const messages = response.messages || []  // 注意字段名是 messages
        
        commit('ADD_MESSAGES', { 
          conversationId: contactId,  // 使用 contactId 作为 conversationId
          messages 
        })
        
        return Promise.resolve(messages)
      } else {
        showToast('获取消息失败', 'error')
        return Promise.reject(new Error(response.message))
      }
    } catch (error) {
      console.error('获取消息失败:', error)
      showToast('获取消息失败，请检查网络', 'error')
      return Promise.reject(error)
    }
  },
  
  // 修改 sendMessage 方法（约第45-90行）
  async sendMessage({ commit, state }, { conversationId, content, type = 'text' }) {
    const userStore = useUserStore()
    const currentUser = userStore.currentUser
    
    // 临时消息（保持不变）
    const tempMessage = {
      _id: `temp_${Date.now()}`,  // 改为 _id 与后端一致
      type,
      content,
      sender: { _id: currentUser.id, name: currentUser.name },  // 结构调整为对象
      receiver: { _id: conversationId },
      timestamp: new Date().toISOString(),
      status: 'sending'
    }
    
    commit('ADD_MESSAGE', { 
      conversationId, 
      message: tempMessage 
    })
    
    try {
      const response = await chatApi.sendMessage({
        sender: currentUser.id,      // 只传ID
        receiver: conversationId,    // 只传ID
        content,
        type
      })
      
      if (response.success) {
        // 成功后，用真实消息替换临时消息
        commit('UPDATE_MESSAGE', {
          conversationId,
          tempId: tempMessage._id,
          message: response.data  // 后端返回的完整消息对象
        })
        
        return Promise.resolve(response.data)
      } else {
        commit('UPDATE_MESSAGE_STATUS', {
          conversationId,
          tempId: tempMessage._id,
          status: 'error'
        })
        
        showToast('消息发送失败', 'error')
        return Promise.reject(new Error(response.message))
      }
    } catch (error) {
      commit('UPDATE_MESSAGE_STATUS', {
        conversationId,
        tempId: tempMessage._id,
        status: 'error'
      })
      
      showToast('消息发送失败，请检查网络', 'error')
      return Promise.reject(error)
    }
  }
}