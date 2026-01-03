// src/store/modules/contact/mutations.js
export default {
  SET_CONTACTS(state, payload) {
    state.contacts = payload || []
  }
}