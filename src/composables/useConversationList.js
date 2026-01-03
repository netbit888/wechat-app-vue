import { computed } from 'vue'
import { useStore } from '@/store'

// 统一的字段补全 / 转形状
function mapConversation(conv) {
  return {
    id: conv.id ?? String(Math.random()),
    name: conv.name ?? '用户',
    type: conv.type ?? 'private',
    isMuted: !!conv.isMuted,
    unreadCount: conv.unreadCount ?? 0,
    lastMessage: {
      type: conv.lastMessage?.type ?? 'text',
      content: conv.lastMessage?.content ?? '',
      time: conv.lastMessage?.timestamp ?? conv.lastActiveTime ?? new Date().toISOString()
    }
  }
}

export function useConversationList() {
  const store = useStore()

  // 直接读 getter，保证是数组
  const topRaw     = computed(() => store.getters['chat/topConversations'])
  const normalRaw  = computed(() => store.getters['chat/normalConversations'])

  // 映射后的业务列表
  const topList    = computed(() => topRaw.value.map(mapConversation))
  const normalList = computed(() => normalRaw.value.map(mapConversation))

  return { topList, normalList }
}