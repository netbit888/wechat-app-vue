// src/composables/useStore.js
import { computed } from 'vue'
import { useStore } from '@/store'

export function useAppStore() {
  const store = useStore()
  return {
    // State
    isLoading: computed(() => store.state.app.isLoading),
    theme: computed(() => store.state.app.theme),
  }
}

export function useUserStore() {
  const store = useStore()
  return {
    // State
    currentUser: computed(() => store.state.user.currentUser),
    isLoggedIn: computed(() => store.state.user.isLoggedIn),
    
    // Actions
    updateProfile: (userInfo) => store.dispatch('user/updateProfile', userInfo),
    logout: () => store.dispatch('user/logout'),
    getProfile: () => store.dispatch('user/getProfile'),
    
    // Getters
    userSettings: computed(() => store.getters['user/userSettings'])
  }
}

export const useChatStore = () => {
  const store = useStore()
  return {
    // State
    conversations: computed(() => store.state.chat.conversations),
    currentConversationId: computed(() => store.state.chat.currentConversationId),
    
    // Getters
    allConversations: computed(() => store.getters['chat/allConversations']),
    topConversations: computed(() => store.getters['chat/topConversations']),
    normalConversations: computed(() => store.getters['chat/normalConversations']),
    currentConversation: computed(() => store.getters['chat/currentConversation']),
    currentMessages: computed(() => store.getters['chat/currentMessages']),
    totalUnreadCount: computed(() => store.getters['chat/totalUnreadCount']),
    

    fetchMessages: (payload) => store.dispatch('chat/fetchMessages', payload),
    addMessage: (payload) => store.commit('chat/ADD_MESSAGE', payload),
    getMessagesByConversationId: (conversationId) => 
      computed(() => store.getters['chat/getMessagesByConversationId'](conversationId)),

    selectConversation: (conversationId) => store.dispatch('chat/selectConversation', conversationId),
    sendMessage: (payload) => store.dispatch('chat/sendMessage', payload),
    toggleConversationTop: (conversationId) => store.dispatch('chat/toggleConversationTop', conversationId),
    toggleConversationMute: (conversationId) => store.dispatch('chat/toggleConversationMute', conversationId),
    deleteConversation: (conversationId) => store.dispatch('chat/deleteConversation', conversationId)
  }
}

export const useContactStore = () => {
  const store = useStore()
  return {
    // State
    contacts: computed(() => store.state.contact.contacts),
    friendRequests: computed(() => store.state.contact.friendRequests),
  }
}