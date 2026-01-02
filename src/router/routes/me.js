// 个人中心相关路由
const routes = [
  {
    path: '/me',
    name: 'Me',
    component: () => import('@/views/Me/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Me/Settings.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/me/wallet',
    name: 'Wallet',
    component: () => import('@/views/Me/Wallet.vue'),
    meta: { requiresAuth: true }
  }
]

export default routes