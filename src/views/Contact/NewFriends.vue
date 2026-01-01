<template>
  <div class="new-friends-page">
    <header class="page-header">
      <button class="back-button" @click="goBack">⬅</button>
      <h1>新的朋友</h1>
    </header>

    <main class="page-content">
      <div v-if="friendRequests.length === 0" class="empty-state">
        <p>暂无新的朋友请求</p>
      </div>

      <div v-else class="friend-requests">
        <div v-for="request in friendRequests" :key="request.id" class="request-item">
          <Avatar 
            :size="'medium'" 
            :text="request.nickname" 
            :backgroundColor="request.avatarColor"
          />
          <div class="request-info">
            <div class="request-name">{{ request.nickname }}</div>
            <div class="request-message">{{ request.message }}</div>
          </div>
          <div class="request-actions">
            <button class="accept-button" @click="acceptRequest(request)">接受</button>
            <button class="reject-button" @click="rejectRequest(request)">拒绝</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { useContactStore } from '@/composables/useStore'
import Avatar from '@/components/ui/Avatar/Avatar.vue'

export default {
  name: 'NewFriends',
  components: {
    Avatar
  },
  setup() {
    const router = useRouter()
    const contactStore = useContactStore()

    const friendRequests = contactStore.friendRequests

    const goBack = () => {
      router.push('/contact')
    }

    const acceptRequest = (request) => {
      console.log('接受好友请求:', request.nickname)
      // 实际实现中应该调用store的action
    }

    const rejectRequest = (request) => {
      console.log('拒绝好友请求:', request.nickname)
      // 实际实现中应该调用store的action
    }

    return {
      friendRequests,
      goBack,
      acceptRequest,
      rejectRequest
    }
  }
}
</script>

<style scoped>
.new-friends-page {
  height: 100vh;
  background-color: white;
}

.page-header {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background-color: var(--wechat-header-bg, #f7f7f7);
  border-bottom: 1px solid var(--wechat-border-color);
}

.back-button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 5px;
  margin-right: 10px;
}

.page-header h1 {
  font-size: 18px;
  font-weight: normal;
  margin: 0;
}

.page-content {
  padding: 20px 15px;
}

.empty-state {
  text-align: center;
  color: var(--wechat-text-secondary);
  margin-top: 50px;
}

.request-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid var(--wechat-border-color);
}

.request-info {
  flex: 1;
  margin-left: 12px;
}

.request-name {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
}

.request-message {
  font-size: 14px;
  color: var(--wechat-text-secondary);
}

.request-actions {
  display: flex;
  gap: 10px;
}

.accept-button, .reject-button {
  padding: 6px 12px;
  border: 1px solid var(--wechat-primary-color);
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.accept-button {
  background-color: var(--wechat-primary-color);
  color: white;
}

.reject-button {
  background-color: white;
  color: var(--wechat-primary-color);
}
</style>