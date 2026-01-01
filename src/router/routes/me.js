// 个人中心相关路由
const routes = [
  {
    path: '/me',
    name: 'Me',
    component: () => import('@/views/Me/Profile.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Me/Settings.vue')
  },
  {
    path: '/me/wallet',
    name: 'Wallet',
    component: () => import('@/views/Me/Wallet.vue')
  }
]

export default routes