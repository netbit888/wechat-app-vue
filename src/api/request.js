import axios from 'axios'
import store from '@/store'  // 导入 Vuex store 实例
import { showToast } from '@/utils/feedback'

// 创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.wechat.com/v1',  // 修改这里
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 添加认证token
    const token = store.state.user.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 记录请求日志（开发环境）
    if (import.meta.env.DEV) {  // 修改这里
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.params || config.data)
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 处理响应数据
    if (import.meta.env.DEV) {  // 修改这里
      console.log(`✅ API Response: ${response.config.url}`, response.data)
    }
    
    return response.data
  },
  (error) => {
    // 统一错误处理
    if (import.meta.env.DEV) {  // 修改这里
      console.error(`❌ API Error: ${error.config?.url}`, error.response?.data || error.message)
    }
    
    const status = error.response?.status
    const message = error.response?.data?.message || error.message
    
    switch (status) {
      case 401:
        // 未授权，跳转到登录页
        showToast('登录已过期，请重新登录')
        setTimeout(() => {
          store.dispatch('user/logout')
          window.location.href = '/login'
        }, 2000)
        break
      case 403:
        showToast('没有权限访问该资源')
        break
      case 404:
        showToast('请求的资源不存在')
        break
      case 500:
        showToast('服务器内部错误，请稍后重试')
        break
      default:
        if (message) {
          showToast(message)
        }
    }
    
    return Promise.reject(error)
  }
)

// 通用的HTTP方法封装
export const http = {
  get: (url, params = {}) => request.get(url, { params }),
  post: (url, data = {}) => request.post(url, data),
  put: (url, data = {}) => request.put(url, data),
  delete: (url, params = {}) => request.delete(url, { params }),
  upload: (url, formData, onProgress) => {
    return request.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress
    })
  }
}

export default request