// src/store/modules/contact/actions.js
export default {
  async loadContacts({ commit }, list) {
    commit('SET_CONTACTS', list)   // 保证数组由调用方保证
  },
  async loadFriendRequests({ commit }, list) {
    commit('SET_FRIEND_REQUESTS', list)   // 保证数组由调用方保证
  }
}