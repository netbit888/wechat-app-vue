// src/router/routes/chat.js
export default [
  {
    path: '/wechat',
    name: 'WeChat',
    component: () => import('@/views/WeChat/ChatList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/chat/:id',
    name: 'ChatDetail',
    component: () => import('@/views/WeChat/ChatDetail.vue'),
    meta: {
      showTabBar: false,
      requiresAuth: true
    }
  }
];