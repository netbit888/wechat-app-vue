// src/api/modules/user.js
import { http } from '../request.js';

// 用户相关API
export default {
  // 登录
  login: (credentials) => http.post('/users/login', credentials)
    .then(response => response.data), // ✅ 提取 response.data
  
  // 注册
  register: (userData) => http.post('/users/register', userData)
    .then(response => response.data), // ✅ 提取 response.data
  
  // 获取个人资料
  getProfile: () => http.get('/users/profile')
    .then(response => response.data), // ✅ 提取 response.data
  
  // 退出登录
  logout: () => http.post('/users/logout')
    .then(response => response.data), // ✅ 提取 response.data
  
  // 更新用户信息
  updateProfile: (data) => http.put('/users/profile', data)
    .then(response => response.data), // ✅ 提取 response.data
  
  // 上传头像
  uploadAvatar: (formData, onProgress) => http.upload('/users/avatar', formData, onProgress)
    .then(response => response.data)  // ✅ 提取 response.data
};