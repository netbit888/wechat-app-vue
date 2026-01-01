// src/store/modules/user/getters.js
export default {
  currentUser: (state) => state.currentUser,
  isLoggedIn: (state) => state.isLoggedIn,
  userSettings: (state) => state.settings,
  userToken: (state) => state.token
}