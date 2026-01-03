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
  
  /** 拉历史消息 */
  async fetchMessages({ commit }, { contactId }) {
    // 直接调后端
    const { data } = await http.get(`/chat/history/${contactId}`);
    commit('ADD_MESSAGES', { conversationId: contactId, messages: data });
    return data;
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