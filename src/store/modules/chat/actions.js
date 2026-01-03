import { chatApi } from '@/api'
import storage, { STORAGE_KEYS } from '@/utils/storage'
import { showToast } from '@/utils/feedback'
import { http } from '@/api/request'

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
  
  /** 拉历史消息 */
  async fetchMessages({ commit }, { contactId }) {
    try {
      console.log('加载消息历史，联系人ID:', contactId)
      
      let messages = []; // 1. 先初始化为空数组
      
      // 检查chatApi是否有对应方法
      if (chatApi && chatApi.getHistory) {
        const response = await chatApi.getHistory(contactId)
        // 2. 使用默认值，并确保是数组
        messages = Array.isArray(response?.data) ? response.data : 
                  (Array.isArray(response) ? response : [])
      } else {
        // 回退到http
        const response = await http.get(`/chat/history/${contactId}`)
        // 3. 同样确保是数组
        messages = Array.isArray(response?.data) ? response.data : []
      }
      
      // 4. 此时 messages 一定是数组
      commit('ADD_MESSAGES', { conversationId: contactId, messages })
      return messages
      
    } catch (error) {
      console.error('加载消息历史失败:', error)
      showToast('加载消息失败')
      // 5. 即使出错，也提交空数组，保证UI不崩溃
      commit('ADD_MESSAGES', { conversationId: contactId, messages: [] })
      throw error
    }
  },

  /** 发消息 + 落库 */
  async sendMessage({ commit, rootGetters }, { conversationId, content, type = 'text' }) {
    const currentUser = rootGetters['user/currentUser'] || { id: 'me', name: '我' };

    // 1. 临时消息（保持你原有逻辑）
    const tempMsg = {
      _id: `temp_${Date.now()}`,
      type,
      content,
      sender: { _id: currentUser.id, name: currentUser.name },
      receiver: { _id: conversationId },
      timestamp: new Date().toISOString(),
      status: 'sending'
    };
    commit('ADD_MESSAGE', { conversationId, message: tempMsg });

    // 2. 真实发送（后端用 to 而不是 receiver）
    try {
      const { data } = await http.post('/chat/message', {
        sender: currentUser.id,
        to: conversationId,          // ✅ 对齐后端字段
        content,
        type
      });
      // 3. 用真实消息替换临时消息
      commit('REPLACE_TEMP_MESSAGE', {
        conversationId,
        tempId: tempMsg._id,
        realMessage: data
      });
      return data;
    } catch (e) {
      commit('UPDATE_MESSAGE_STATUS', {
        conversationId,
        tempId: tempMsg._id,
        status: 'error'
      });
      throw e;
    }
  }
}