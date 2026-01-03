// src/store/modules/contact/actions.js
export default {
  async loadContacts({ commit }, list) {
    commit('SET_CONTACTS', list)   // 保证数组由调用方保证
  }
}