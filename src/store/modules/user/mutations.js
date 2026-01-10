// src/store/modules/user/mutations.js
export default {
  SET_USER_INFO(state, userInfo) {
    state.currentUser = { ...state.currentUser, ...userInfo }
  },
  
  // 添加SET_USER mutation，用于完全替换用户信息
  SET_USER(state, user) {
    state.currentUser = user
  },
  
  SET_LOGIN_STATUS(state, status) {
    state.isLoggedIn = status
  },
  
  SET_TOKEN(state, token) {
    state.token = token
  },
  
  UPDATE_SETTING(state, { key, value }) {
    if (key.includes('.')) {
      const keys = key.split('.')
      let obj = state.settings
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]]
      }
      obj[keys[keys.length - 1]] = value
    } else {
      state.settings[key] = value
    }
  },
  
  LOGOUT(state) {
    state.currentUser = null
    state.isLoggedIn = false
    state.token = ''
  },

  SET_SETTINGS(state, settings) {
    state.settings = settings
  }
}