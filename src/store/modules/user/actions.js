// src/store/modules/user/actions.js
import { userApi } from '@/api/index.js';
import { showToast } from '@/utils/feedback.js';

// 本地存储工具（简洁版）
const storage = {
  set(key, value, expireHours = null) {
    const data = { value, expire: expireHours ? Date.now() + expireHours * 3600000 : null };
    localStorage.setItem(key, JSON.stringify(data));
  },
  get(key) {
    const data = localStorage.getItem(key);
    if (!data) return null;
    try {
      const { value, expire } = JSON.parse(data);
      if (expire && Date.now() > expire) {
        localStorage.removeItem(key);
        return null;
      }
      return value;
    } catch {
      return null;
    }
  },
  remove(key) {
    localStorage.removeItem(key);
  }
};

export default {
  // 登录
  async login({ commit }, credentials) {
    try {
      const response = await userApi.login(credentials);
      // response 已经是 response.data（拦截器处理过）
      const { token, user } = response;
      
      // 保存到本地存储
      storage.set('token', token, 24); // 24小时
      storage.set('user', user);
      
      // 提交到 store
      commit('SET_TOKEN', token);
      commit('SET_USER', user);
      
      showToast('登录成功', 'success');
      return response;
    } catch (error) {
      // 错误已在拦截器中提示
      throw error;
    }
  },
  
  // 新增：注册
  async register({ commit }, userData) {
    try {
      const response = await userApi.register(userData);
      const { token, user } = response;

      storage.set('token', token, 24);
      storage.set('user', user);
      
      commit('SET_TOKEN', token);
      commit('SET_USER', user);
      
      showToast('注册成功', 'success');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 自动登录
  async autoLogin({ commit }) {
    const token = storage.get('token');
    const user = storage.get('user');
    
    if (token && user) {
      commit('SET_TOKEN', token);
      commit('SET_USER', user);
      return true;
    }
    return false;
  },
  
  // 登出
  logout({ commit }) {
    storage.remove('token');
    storage.remove('user');
    commit('LOGOUT');
    showToast('已退出登录', 'info');
  },
  
  // 获取个人资料
  async getProfile({ commit }) {
    try {
      const user = await userApi.getProfile(); // 返回已是 data
      commit('SET_USER', user);
      storage.set('user', user);
      return user;
    } catch (error) {
      throw error;
    }
  }
};