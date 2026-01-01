// 本地存储封装
const storage = {
  // 设置存储项
  set: (key, value, expire = null) => {
    try {
      const data = {
        value,
        expire: expire ? Date.now() + expire * 1000 : null,
        timestamp: Date.now()
      }
      localStorage.setItem(key, JSON.stringify(data))
      return true
    } catch (error) {
      console.error('Storage set error:', error)
      return false
    }
  },
  
  // 获取存储项
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key)
      if (!item) return defaultValue
      
      const data = JSON.parse(item)
      
      // 检查是否过期
      if (data.expire && Date.now() > data.expire) {
        localStorage.removeItem(key)
        return defaultValue
      }
      
      return data.value
    } catch (error) {
      console.error('Storage get error:', error)
      return defaultValue
    }
  },
  
  // 删除存储项
  remove: (key) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Storage remove error:', error)
      return false
    }
  },
  
  // 清空所有存储
  clear: () => {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Storage clear error:', error)
      return false
    }
  },
  
  // 获取所有键名
  keys: () => {
    try {
      return Object.keys(localStorage)
    } catch (error) {
      console.error('Storage keys error:', error)
      return []
    }
  }
}

// 存储键名常量
export const STORAGE_KEYS = {
  USER_TOKEN: 'wechat_user_token',
  USER_INFO: 'wechat_user_info',
  USER_SETTINGS: 'wechat_user_settings',
  CHAT_CONVERSATIONS: 'wechat_chat_conversations',
  CONTACT_LIST: 'wechat_contact_list',
  SEARCH_HISTORY: 'wechat_search_history'
}

export default storage