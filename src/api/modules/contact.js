import { http } from '../request'

// 联系人相关API
export const contactApi = {
  // 获取联系人列表
  getContacts: (params = {}) => http.get('/contacts', params),
  
  // 搜索联系人
  searchContacts: (keyword, params = {}) => 
    http.get('/contacts/search', { keyword, ...params }),
  
  // 获取联系人详情
  getContactDetail: (contactId) => http.get(`/contacts/${contactId}`),
  
  // 添加联系人
  addContact: (contactData) => http.post('/contacts', contactData),
  
  // 更新联系人
  updateContact: (contactId, contactData) => 
    http.put(`/contacts/${contactId}`, contactData),
  
  // 删除联系人
  deleteContact: (contactId) => http.delete(`/contacts/${contactId}`),
  
  // 处理好友请求
  handleFriendRequest: (requestId, action) => 
    http.put(`/contacts/requests/${requestId}`, { action }),
  
  // 获取好友请求列表
  getFriendRequests: () => http.get('/contacts/requests')
}

export default contactApi