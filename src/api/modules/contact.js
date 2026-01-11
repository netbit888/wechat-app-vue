// src/api/modules/contact.js
import { http } from '../request.js';

export default {
  // 获取联系人列表（真实后端）
  getList: () => http.get('/contacts'),
  
  // 搜索联系人
  search: (keyword) => http.get('/contacts/search', { keyword }),
  
  // 添加好友
  add: (userId, message) => http.post('/contacts/add', { userId, message }),
  
  // 删除好友
  delete: (userId) => http.delete('/contacts/' + userId),
  
  // 获取好友请求
  getRequests: () => http.get('/contacts/requests'),
  
  // 处理好友请求
  handleRequest: (requestId, action) => 
    http.post('/contacts/handle', { requestId, action }),
  
  // 取消好友请求
  cancelRequest: (requestId) => http.delete(`/contacts/request/${requestId}`),
  
  // 获取发送的请求历史
  getSentRequests: () => http.get('/contacts/sent-requests'),
  
  // 获取联系人详情
  getDetail: (userId) => http.get(`/contacts/${userId}`)
};