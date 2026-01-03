export default {
  SET_CURRENT_CONVERSATION_ID(state, conversationId) {
    state.currentConversationId = conversationId
  },
  
  // 批量添加消息（自动去重和排序）
  ADD_MESSAGES(state, { conversationId, messages }) {
    if (!state.messages[conversationId]) {
      state.messages[conversationId] = []
    }
    
    // 去重：过滤已存在的消息
    const existingIds = new Set(state.messages[conversationId].map(m => m._id))
    const newMessages = messages.filter(m => m._id && !existingIds.has(m._id))
    
    // 合并并排序
    state.messages[conversationId] = [
      ...state.messages[conversationId],
      ...newMessages
    ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  },
  
  // 单条添加消息
  ADD_MESSAGE(state, { conversationId, message }) {
    if (!state.messages[conversationId]) {
      state.messages[conversationId] = []
    }
    state.messages[conversationId].push(message)
    
    // 按时间排序
    state.messages[conversationId].sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    )
  },
  
  // 更新消息状态
  UPDATE_MESSAGE_STATUS(state, { conversationId, tempId, status }) {
    const messages = state.messages[conversationId]
    if (messages) {
      const message = messages.find(m => m._id === tempId)
      if (message) {
        message.status = status
      }
    }
  },
  
  // 替换临时消息为真实消息
  REPLACE_TEMP_MESSAGE(state, { conversationId, tempId, realMessage }) {
    const messages = state.messages[conversationId]
    if (messages) {
      const index = messages.findIndex(m => m._id === tempId)
      if (index !== -1) {
        // 保留原数组引用，直接替换元素
        messages.splice(index, 1, realMessage)
      }
    }
  },
  
  // 更新会话最后消息
  UPDATE_CONVERSATION_LAST_MESSAGE(state, { conversationId, lastMessage }) {
    const conversation = state.conversations.find(c => c.id === conversationId)
    if (conversation) {
      conversation.lastMessage = lastMessage
      conversation.lastActiveTime = lastMessage.timestamp || Date.now()
      conversation.unreadCount = 0  // 发送消息后标记为已读
      
      // 重新排序
      state.conversations.sort((a, b) => {
        if (a.isTop && !b.isTop) return -1
        if (!a.isTop && b.isTop) return 1
        return new Date(b.lastActiveTime) - new Date(a.lastActiveTime)
      })
    }
  },
  
  // 标记会话已读
  MARK_CONVERSATION_AS_READ(state, conversationId) {
    const conversation = state.conversations.find(c => c.id === conversationId)
    if (conversation) {
      conversation.unreadCount = 0
    }
  },
  
  // 置顶切换
  TOGGLE_CONVERSATION_TOP(state, conversationId) {
    const conversation = state.conversations.find(c => c.id === conversationId)
    if (conversation) {
      conversation.isTop = !conversation.isTop
      // 重新排序
      state.conversations.sort((a, b) => {
        if (a.isTop && !b.isTop) return -1
        if (!a.isTop && b.isTop) return 1
        return new Date(b.lastActiveTime) - new Date(a.lastActiveTime)
      })
    }
  },
  
  // 静音切换
  TOGGLE_CONVERSATION_MUTE(state, conversationId) {
    const conversation = state.conversations.find(c => c.id === conversationId)
    if (conversation) {
      conversation.isMuted = !conversation.isMuted
    }
  },
  
  // 删除会话
  DELETE_CONVERSATION(state, conversationId) {
    const index = state.conversations.findIndex(c => c.id === conversationId)
    if (index !== -1) {
      state.conversations.splice(index, 1)
    }
    
    if (state.currentConversationId === conversationId) {
      state.currentConversationId = null
    }
    
    // 清理消息记录
    delete state.messages[conversationId]
  },
  
  // 设置输入状态
  SET_TYPING_STATUS(state, { conversationId, userId, isTyping }) {
    if (!state.typingUsers[conversationId]) {
      state.typingUsers[conversationId] = {}
    }
    state.typingUsers[conversationId][userId] = isTyping
  }
}

export const REPLACE_TEMP_MESSAGE = (state, { conversationId, tempId, realMessage }) => {
  const list = state.messages[conversationId];
  if (!list) return;
  const idx = list.findIndex(m => m._id === tempId);
  if (idx > -1) list.splice(idx, 1, realMessage);
};