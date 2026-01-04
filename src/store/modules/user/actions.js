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

      // 保护：确保 response 是对象且包含 token/user
      if (!response || typeof response !== 'object') {
        throw new Error('网络异常：未获取到登录信息');
      }
      if (!response.token || !response.user) {
        throw new Error(response.error || '登录信息缺失');
      }

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
      // 把具体错误继续抛给组件
      throw error;
    }
  },

  // 注册
  async register({ commit }, userData) {
    try {
      const response = await userApi.register(userData);

      if (!response || typeof response !== 'object') {
        throw new Error('网络异常：未获取到注册信息');
      }
      if (!response.token || !response.user) {
        throw new Error(response.error || '注册信息缺失');
      }

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
      const user = await userApi.getProfile();
      commit('SET_USER', user);
      storage.set('user', user);
      return user;
    } catch (error) {
      throw error;
    }
  },
  
  updateSettings: async ({ commit }, payload) => {
    const settings = await userApi.updateSettings(payload)
    commit('SET_SETTINGS', settings)
    return settings
  }  
};