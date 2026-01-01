import { userApi } from '@/api'
import storage, { STORAGE_KEYS } from '@/utils/storage'
import { showToast } from '@/utils/feedback'

export default {
  // 用户登录
  async login({ commit }, credentials) {
    try {
      const response = await userApi.login(credentials)
      
      if (response.code === 0 && response.data) {
        const { token, user } = response.data
        
        // 保存到本地存储
        storage.set(STORAGE_KEYS.USER_TOKEN, token, 24 * 60 * 60) // 24小时过期
        storage.set(STORAGE_KEYS.USER_INFO, user)
        
        // 提交到store
        commit('SET_TOKEN', token)
        commit('SET_USER_INFO', user)
        commit('SET_LOGIN_STATUS', true)
        
        showToast('登录成功', 'success')
        return Promise.resolve(response.data)
      } else {
        showToast(response.message || '登录失败', 'error')
        return Promise.reject(new Error(response.message))
      }
    } catch (error) {
      showToast('登录失败，请检查网络连接', 'error')
      return Promise.reject(error)
    }
  },
  
  // 自动登录（从本地存储恢复）
  async autoLogin({ commit, dispatch }) {
    const token = storage.get(STORAGE_KEYS.USER_TOKEN)
    const userInfo = storage.get(STORAGE_KEYS.USER_INFO)
    
    if (token && userInfo) {
      commit('SET_TOKEN', token)
      commit('SET_USER_INFO', userInfo)
      commit('SET_LOGIN_STATUS', true)
      
      // 验证token是否有效
      try {
        await dispatch('validateToken')
        showToast('自动登录成功', 'success')
        return true
      } catch (error) {
        // token无效，清除本地存储
        storage.remove(STORAGE_KEYS.USER_TOKEN)
        storage.remove(STORAGE_KEYS.USER_INFO)
        commit('LOGOUT')
        return false
      }
    }
    return false
  },
  
  // 验证token有效性
  async validateToken({ state }) {
    if (!state.token) {
      return Promise.reject(new Error('未找到token'))
    }
    
    try {
      const response = await userApi.getProfile()
      return Promise.resolve(response)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  
  // 更新用户信息
  async updateProfile({ commit, state }, profileData) {
    try {
      const response = await userApi.updateProfile(profileData)
      
      if (response.code === 0) {
        const updatedUser = { ...state.currentUser, ...profileData }
        
        // 更新本地存储
        storage.set(STORAGE_KEYS.USER_INFO, updatedUser)
        
        // 提交到store
        commit('SET_USER_INFO', updatedUser)
        showToast('个人信息更新成功', 'success')
        
        return Promise.resolve(response.data)
      } else {
        showToast(response.message || '更新失败', 'error')
        return Promise.reject(new Error(response.message))
      }
    } catch (error) {
      showToast('更新失败，请稍后重试', 'error')
      return Promise.reject(error)
    }
  },
  
  // 退出登录
  async logout({ commit }) {
    try {
      await userApi.logout()
    } catch (error) {
      // 即使API调用失败也要继续执行本地清理
      console.warn('退出登录API调用失败:', error)
    } finally {
      // 清除本地存储
      storage.remove(STORAGE_KEYS.USER_TOKEN)
      storage.remove(STORAGE_KEYS.USER_INFO)
      
      // 提交到store
      commit('LOGOUT')
      
      showToast('已退出登录', 'info')
    }
  },
  
  // 更新用户设置
  async updateSettings({ commit, state }, settings) {
    try {
      const response = await userApi.updateSettings(settings)
      
      if (response.code === 0) {
        const updatedSettings = { ...state.settings, ...settings }
        
        // 更新本地存储
        storage.set(STORAGE_KEYS.USER_SETTINGS, updatedSettings)
        
        // 提交到store
        commit('UPDATE_SETTINGS', updatedSettings)
        showToast('设置更新成功', 'success')
        
        return Promise.resolve(response.data)
      } else {
        showToast(response.message || '设置更新失败', 'error')
        return Promise.reject(new Error(response.message))
      }
    } catch (error) {
      showToast('设置更新失败，请稍后重试', 'error')
      return Promise.reject(error)
    }
  }
}