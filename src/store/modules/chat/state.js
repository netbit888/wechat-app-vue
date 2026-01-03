// src/store/modules/chat/state.js
export default () => ({
  // 聊天会话列表（与后端 _id 同类型：字符串）
  conversations: [
    {
      id: '69586a6f718590d4ed3ad48c',          // ✅ 字符串
      type: 'private',
      name: '小凯',
      avatarColor: '#07c160',
      lastMessage: {
        content: '你好！',
        type: 'text',
        timestamp: '2023-10-05T15:30:00Z',
        sender: '69586a6f718590d4ed3ad48c'
      },
      unreadCount: 0,
      isTop: false,
      isMuted: false,
      isBlocked: false,
      lastActiveTime: '2023-10-05T15:30:00Z'
    },
    {
      id: '69586a8d718590d4ed3ad48f',          // ✅ 字符串
      type: 'private',
      name: '小美',
      avatarColor: '#fa5151',
      lastMessage: {
        content: '晚上一起吃饭吗？',
        type: 'text',
        timestamp: '2023-10-05T14:20:00Z',
        sender: '69586a8d718590d4ed3ad48f'
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

  // 消息历史记录（key 也是字符串 _id）
  messages: {
    '69586a6f718590d4ed3ad48c': [   // ✅ 字符串 key
      {
        _id: 'msg_101',
        type: 'text',
        content: '你好！',
        sender: '69586a6f718590d4ed3ad48c',
        receiver: '69586a8d718590d4ed3ad48f',
        timestamp: '2023-10-05T10:00:00Z',
        status: 'sent'
      },
      {
        _id: 'msg_102',
        type: 'text',
        content: '你好，最近怎么样？',
        sender: '69586a6f718590d4ed3ad48c',
        receiver: '69586a8d718590d4ed3ad48f',
        timestamp: '2023-10-05T15:30:00Z',
        status: 'sent'
      }
    ],
    '69586a8d718590d4ed3ad48f': [   // ✅ 字符串 key
      {
        _id: 'msg_201',
        type: 'text',
        content: '在吗？',
        sender: '69586a8d718590d4ed3ad48f',
        receiver: '69586a6f718590d4ed3ad48c',
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
});