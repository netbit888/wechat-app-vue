<template>
  <div class="new-friends-page">
    <header class="page-header">新的朋友</header>
    <div v-if="requests.length === 0" class="empty">暂无好友请求</div>
    <div v-else class="request-list">
      <div v-for="r in requests" :key="r._id" class="request-item">
        <Avatar :src="r.from.avatar" size="40"/>
        <div class="info">
          <p class="name">{{ r.from.nickname || r.from.username }}</p>
        </div>
        <div class="actions">
          <button @click="handle(r._id, 'accept')" class="accept">接受</button>
          <button @click="handle(r._id, 'reject')" class="reject">拒绝</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import contactAPI from '@/api/modules/contact'
import Avatar from '@/components/ui/Avatar/Avatar.vue'

const requests = ref([])

const load = async () => {
  const { requests: list } = await contactAPI.getRequests()
  requests.value = list
}

const handle = async (id, action) => {
  await contactAPI.handleRequest(id, action)
  load()          // 刷新列表
}

onMounted(load)
</script>

<style scoped>
.page-header{ height:44px;text-align:center;line-height:44px;border-bottom:1px solid #e5e5e5; }
.request-item{ display:flex;align-items:center;padding:12px 15px;border-bottom:1px solid #f0f0f0; }
.info{ flex:1;margin-left:12px; }
.actions button{ margin-left:8px;padding:4px 12px;border:none;border-radius:3px; }
.accept{ background:#07c160;color:#fff; }
.reject{ background:#f0f0f0;color:#333; }
.empty{ text-align:center;padding:40px;color:#999; }
</style>