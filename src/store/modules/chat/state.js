export default {
  // 聊天会话列表
  conversations: [
    {
      id: 1,
      type: 'private', // private, group
      name: '张三',
      avatarColor: '#07c160',
      lastMessage: {
        content: '你好，最近怎么样？',
        type: 'text',
        time: '2023-10-05T15:30:00Z',
        senderId: 2
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
        time: '2023-10-05T14:20:00Z',
        senderId: 3
      },
      unreadCount: 0,
      isTop: true,
      isMuted: true,
      isBlocked: false,
      lastActiveTime: '2023-10-05T14:20:00Z'
    },
    {
      id: 3,
      type: 'group',
      name: '前端开发群',
      avatarColor: '#10aeff',
      lastMessage: {
        content: '[图片]',
        type: 'image',
        time: '2023-10-05T12:10:00Z',
        senderId: 4,
        senderName: '王五'
      },
      unreadCount: 15,
      isTop: false,
      isMuted: false,
      isBlocked: false,
      lastActiveTime: '2023-10-05T12:10:00Z'
    },
    {
      id: 4,
      type: 'private',
      name: '赵六',
      avatarColor: '#6467ef',
      lastMessage: {
        content: '明天开会别忘了',
        type: 'text',
        time: '2023-10-05T10:00:00Z',
        senderId: 5
      },
      unreadCount: 0,
      isTop: false,
      isMuted: false,
      isBlocked: false,
      lastActiveTime: '2023-10-05T10:00:00Z'
    }
  ],
  
  // 当前选中的聊天会话
  currentConversationId: null,
  
  // 消息历史记录（按会话ID分组）
  messages: {
    1: [
      {
        id: 101,
        type: 'text',
        content: '你好！',
        senderId: 2,
        time: '2023-10-05T10:00:00Z',
        status: 'sent'
      },
      {
        id: 102,
        type: 'text',
        content: '你好，最近怎么样？',
        senderId: 2,
        time: '2023-10-05T15:30:00Z',
        status: 'sent'
      }
    ],
    2: [
      {
        id: 201,
        type: 'text',
        content: '在吗？',
        senderId: 1,
        time: '2023-10-05T14:00:00Z',
        status: 'read'
      },
      {
        id: 202,
        type: 'text',
        content: '晚上一起吃饭吗？',
        senderId: 3,
        time: '2023-10-05T14:20:00Z',
        status: 'sent'
      }
    ]
  },
  
  // 正在输入状态
  typingUsers: {}
}