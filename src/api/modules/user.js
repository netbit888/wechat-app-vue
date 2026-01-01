import { http } from '../request'

// 用户相关API
export const userApi = {
  // 用户登录
  login: (credentials) => http.post('/auth/login', credentials),
  
  // 用户注册
  register: (userData) => http.post('/auth/register', userData),
  
  // 获取用户信息
  getProfile: () => http.get('/user/profile'),
  
  // 更新用户信息
  updateProfile: (profileData) => http.put('/user/profile', profileData),
  
  // 更新头像
  uploadAvatar: (formData, onProgress) => http.upload('/user/avatar', formData, onProgress),
  
  // 修改密码
  changePassword: (passwordData) => http.put('/user/password', passwordData),
  
  // 退出登录
  logout: () => http.post('/auth/logout'),
  
  // 获取用户设置
  getSettings: () => http.get('/user/settings'),
  
  // 更新用户设置
  updateSettings: (settings) => http.put('/user/settings', settings)
}

export default userApi