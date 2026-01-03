export default {
  // 获取所有会话
  allConversations: (state) => state.conversations || [],
  
  // 获取置顶会话
  topConversations: (state) => (state.conversations || []).filter(c => c.isTop),
  
  // 获取普通会话
  normalConversations: (state) => (state.conversations || []).filter(c => !c.isTop),
  
  // 获取当前选中的会话
  currentConversation: (state) => {
    if (!state.currentConversationId) return null
    return state.conversations.find(c => c.id === state.currentConversationId)
  },
  
  // 按会话ID获取消息
  getMessagesByConversationId: (state) => (conversationId) => {
    return state.messages[conversationId] || []
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
  },

  // ✅ 新增：根据会话ID获取特定会话
  getConversationById: (state) => (id) => (state.conversations || []).find(c =>c.id === id),
  
  // ✅ 新增：获取会话的未读消息数
  unreadCountByConversationId: (state) => (id) => (state.conversations || []).find(c => c.id === id)?.unreadCount || 0,
  
  // ✅ 新增：检查会话是否存在
  conversationExists: (state) => (id) => (state.conversations || []).some(c => c.id === id),
  
  // ✅ 新增：获取静音会话列表
  mutedConversations: (state) => (state.conversations || []).filter(c => c.isMuted),
  
  // ✅ 新增：获取最近活跃的会话（按时间排序）
  recentConversations: (state) => [...(state.conversations || [])].sort((a, b) => {
      const timeA = new Date(a.lastActiveTime || a.lastMessage?.timestamp || 0)
      const timeB = new Date(b.lastActiveTime || b.lastMessage?.timestamp || 0)
      return timeB - timeA
    }),
  
  // ✅ 新增：获取有未读消息的会话
  conversationsWithUnread: (state)=> (state.conversations || []).filter(c => c.unreadCount > 0),
  
  // ✅ 新增：获取被屏蔽的会话
  blockedConversations: (state) => (state.conversations || []).filter(c => c.isBlocked)
}