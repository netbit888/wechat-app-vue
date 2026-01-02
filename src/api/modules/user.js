// src/api/modules/user.js
import { http } from '../request.js';

// 用户相关API
export default {
  login:  (credentials) => http.post('/users/login', credentials),        // ✅ 直接返回拦截器处理后的结果
  register:(userData)   => http.post('/users/register', userData),
  getProfile:()         => http.get('/users/profile'),
  logout:()            => http.post('/users/logout'),
  updateProfile:(data) => http.put('/users/profile', data),
  uploadAvatar:(formData, onProgress) => http.upload('/users/avatar', formData, onProgress)
};