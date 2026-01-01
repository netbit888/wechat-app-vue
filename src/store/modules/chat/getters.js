export default {
  // 获取所有会话
  allConversations: (state) => {
    return state.conversations
  },
  
  // 获取置顶会话
  topConversations: (state) => {
    return state.conversations.filter(conv => conv.isTop)
  },
  
  // 获取普通会话
  normalConversations: (state) => {
    return state.conversations.filter(conv => !conv.isTop)
  },
  
  // 获取当前选中的会话
  currentConversation: (state) => {
    if (!state.currentConversationId) return null
    return state.conversations.find(conv => conv.id === state.currentConversationId)
  },
  
  // 获取当前会话的消息
  currentMessages: (state) => {
    if (!state.currentConversationId) return []
    return state.messages[state.currentConversationId] || []
  },
  
  // 获取未读消息总数
  totalUnreadCount: (state) => {
    return state.conversations.reduce((total, conv) => total + conv.unreadCount, 0)
  },
  
  // 获取正在输入的用户
  typingUsersInCurrentConversation: (state) => {
    if (!state.currentConversationId) return []
    const typing = state.typingUsers[state.currentConversationId]
    return typing ? Object.keys(typing).filter(userId => typing[userId]) : []
  }
}