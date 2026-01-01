export default {
  // 聊天会话列表（初始数据保持模拟，但字段格式与后端一致）
  conversations: [
    {
      id: 1,
      type: 'private',
      name: '张三',
      avatarColor: '#07c160',
      lastMessage: {
        content: '你好，最近怎么样？',
        type: 'text',
        timestamp: '2023-10-05T15:30:00Z',  // ✅ 改为 timestamp
        sender: 'user2'  // ✅ 改为 sender
      },
      unreadCount: 3,
      isTop: false,
      isMuted: false,
      isBlocked: false,
      lastActiveTime: '2023-10-05T15:30:00Z'
    },
    {
      id: 2,
      type: 'private',
      name: '李四',
      avatarColor: '#fa5151',
      lastMessage: {
        content: '晚上一起吃饭吗？',
        type: 'text',
        timestamp: '2023-10-05T14:20:00Z',
        sender: 'user3'
      },
      unreadCount: 0,
      isTop: true,
      isMuted: true,
      isBlocked: false,
      lastActiveTime: '2023-10-05T14:20:00Z'
    }
  ],
  
  // 当前选中的聊天会话
  currentConversationId: null,
  
  // 消息历史记录（按会话ID分组）
  messages: {
    1: [
      {
        _id: 'msg_101',  // ✅ 改为 _id
        type: 'text',
        content: '你好！',
        sender: 'user2',  // ✅ 改为 sender
        receiver: 'user1', // ✅ 添加 receiver
        timestamp: '2023-10-05T10:00:00Z',  // ✅ 改为 timestamp
        status: 'sent'
      },
      {
        _id: 'msg_102',
        type: 'text',
        content: '你好，最近怎么样？',
        sender: 'user2',
        receiver: 'user1',
        timestamp: '2023-10-05T15:30:00Z',
        status: 'sent'
      }
    ],
    2: [
      {
        _id: 'msg_201',
        type: 'text',
        content: '在吗？',
        sender: 'user1',
        receiver: 'user3',
        timestamp: '2023-10-05T14:00:00Z',
        status: 'read'
      }
    ]
  },
  
  // 正在输入状态
  typingUsers: {},
  
  // 最后更新时间
  lastUpdate: 0,
  messagesLastUpdate: {}
}