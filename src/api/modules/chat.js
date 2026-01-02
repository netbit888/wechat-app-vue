// src/api/modules/chat.js
import { http } from '../request.js';

export default {
  // 获取会话列表
  getConversations: () => http.get('/chat/conversations'),
  
  // 获取消息历史
  getMessages: (userId, before) => http.get('/chat/messages', { userId, before }),
  
  // 发送消息
  sendMessage: (data) => http.post('/chat/send', data),
  
  // 标记已读
  markRead: (userId) => http.patch('/chat/read/' + userId)
};