import axios from 'axios';
import { showToast } from '@/utils/feedback.js';

const rawBaseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const baseURL = rawBaseURL.replace(/\/api$/, '');

console.log('🌐 API BaseURL:', baseURL);

const request = axios.create({
  baseURL: baseURL + '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (import.meta.env.PROD) {
      config.headers['X-Request-ID'] = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    if (import.meta.env.DEV) {
      console.log(`🚀 API请求: ${config.method?.toUpperCase()} ${config.url}`, 
        config.params || config.data);
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器（核心修复）
request.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`✅ API响应: ${response.config.url}`, response.data);
    }

    // ✅ 安全获取数据
    const resData = response.data || {};
    const { success, data, error, token, user, phone, nickname, ...rest } = resData;
    
    // 业务错误处理
    if (success === false) {
      return Promise.reject(new Error(error || '请求失败'));
    }
    
    // ✅ 兼容三种后端格式：
    // 1. 裸数据格式：{success: true, token: '...', user: {...}}
    // 2. 标准格式：{success: true, data: {...}}
    // 3. 混合格式：包含 phone, nickname 等字段
    if (success === true) {
      // 如果有 data 字段，返回 data
      if (data !== undefined) {
        return data;
      }
      // 否则返回整个对象（包含 token, user, phone 等）
      return resData;
    }
    
    // ✅ 兜底：返回原始数据，防止 undefined
    return resData;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error(`❌ API错误: ${error.config?.url}`, 
        error.response?.data || error.message);
    }

    if (error.code === 'ECONNABORTED') {
      showToast('请求超时，请检查网络连接', 'error');
      return Promise.reject(new Error('网络超时'));
    }

    const { status, data } = error.response || {};
    
    switch (status) {
      case 401:
        showToast('登录已过期，请重新登录', 'warning');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 1500);
        break;
        
      case 403:
        showToast('无权限访问', 'error');
        break;
        
      case 404:
        showToast('接口不存在，请检查后端', 'error');
        break;
        
      case 500:
        showToast('服务器内部错误', 'error');
        break;
        
      case 502:
      case 503:
        showToast('服务器维护中，请稍后重试', 'error');
        break;
        
      default:
        showToast(data?.error || error.message || '网络异常', 'error');
    }
    
    return Promise.reject(error);
  }
);

export const http = {
  get: (url, params = {}) => request.get(url, { params }),
  post: (url, data = {}) => request.post(url, data),
  put: (url, data = {}) => request.put(url, data),
  delete: (url, params = {}) => request.delete(url, { params }),
  upload: (url, formData, onProgress) => 
    request.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress
    })
};

export default request;