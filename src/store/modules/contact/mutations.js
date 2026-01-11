// src/store/modules/contact/mutations.js
export default {
  SET_CONTACTS(state, payload) {
    state.contacts = payload || []
  },
  SET_FRIEND_REQUESTS(state, payload) {
    state.friendRequests = payload || []
  }
}