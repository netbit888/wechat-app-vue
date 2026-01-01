export default {
  SET_CURRENT_CONVERSATION_ID(state, conversationId) {
    state.currentConversationId = conversationId
  },
  
  ADD_MESSAGE(state, { conversationId, message }) {
    if (!state.messages[conversationId]) {
      state.messages[conversationId] = []
    }
    state.messages[conversationId].push(message)
  },
  
  UPDATE_MESSAGE_STATUS(state, { conversationId, messageId, status }) {
    const messages = state.messages[conversationId]
    if (messages) {
      const message = messages.find(m => m.id === messageId)
      if (message) {
        message.status = status
      }
    }
  },
  
  UPDATE_CONVERSATION_LAST_MESSAGE(state, { conversationId, lastMessage }) {
    const conversation = state.conversations.find(c => c.id === conversationId)
    if (conversation) {
      conversation.lastMessage = lastMessage
      conversation.lastActiveTime = lastMessage.time
      
      // 重新排序会话列表（置顶的在前，按时间倒序）
      state.conversations.sort((a, b) => {
        if (a.isTop && !b.isTop) return -1
        if (!a.isTop && b.isTop) return 1
        return new Date(b.lastActiveTime) - new Date(a.lastActiveTime)
      })
    }
  },
  
  MARK_CONVERSATION_AS_READ(state, conversationId) {
    const conversation = state.conversations.find(c => c.id === conversationId)
    if (conversation) {
      conversation.unreadCount = 0
    }
  },
  
  TOGGLE_CONVERSATION_TOP(state, conversationId) {
    const conversation = state.conversations.find(c => c.id === conversationId)
    if (conversation) {
      conversation.isTop = !conversation.isTop
    }
  },
  
  TOGGLE_CONVERSATION_MUTE(state, conversationId) {
    const conversation = state.conversations.find(c => c.id === conversationId)
    if (conversation) {
      conversation.isMuted = !conversation.isMuted
    }
  },
  
  DELETE_CONVERSATION(state, conversationId) {
    const index = state.conversations.findIndex(c => c.id === conversationId)
    if (index !== -1) {
      state.conversations.splice(index, 1)
    }
    
    if (state.currentConversationId === conversationId) {
      state.currentConversationId = null
    }
  },
  
  SET_TYPING_STATUS(state, { conversationId, userId, isTyping }) {
    if (!state.typingUsers[conversationId]) {
      state.typingUsers[conversationId] = {}
    }
    state.typingUsers[conversationId][userId] = isTyping
  }
}