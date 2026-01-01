import { http } from '../request'

// 聊天相关API
export const chatApi = {
  // 获取聊天列表
  getConversations: (params = {}) => http.get('/chat/conversations', params),
  
  // 获取聊天记录
  getMessages: (conversationId, params = {}) => 
    http.get(`/chat/conversations/${conversationId}/messages`, params),
  
  // 发送消息
  sendMessage: (conversationId, messageData) => 
    http.post(`/chat/conversations/${conversationId}/messages`, messageData),
  
  // 删除消息
  deleteMessage: (conversationId, messageId) => 
    http.delete(`/chat/conversations/${conversationId}/messages/${messageId}`),
  
  // 创建聊天会话
  createConversation: (participants) => 
    http.post('/chat/conversations', { participants }),
  
  // 删除聊天会话
  deleteConversation: (conversationId) => 
    http.delete(`/chat/conversations/${conversationId}`),
  
  // 标记消息已读
  markAsRead: (conversationId, messageId) => 
    http.put(`/chat/conversations/${conversationId}/messages/${messageId}/read`),
  
  // 获取未读消息数
  getUnreadCount: () => http.get('/chat/unread-count')
}

export default chatApi