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
    path: '/me/profile-edit',
    name: 'ProfileEdit',
    component: () => import('@/views/Me/ProfileEdit.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/me/wallet',
    name: 'Wallet',
    component: () => import('@/views/Me/Wallet.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings/notification',
    name: 'Notification',
    component: () => import('@/views/Me/Settings/Notification.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings/interface-display',
    name: 'InterfaceDisplay',
    component: () => import('@/views/Me/Settings/InterfaceDisplay.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings/friend-permission',
    name: 'FriendPermission',
    component: () => import('@/views/Me/Settings/FriendPermission.vue'),
    meta: { requiresAuth: true }
  },
    /* ---- 账号 ---- */
  {
    path: '/settings/account-security',
    name: 'AccountSecurity',
    component: () => import('@/views/Me/Settings/AccountSecurity.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings/profile',
    name: 'Profile',
    component: () => import('@/views/Me/Settings/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings/privacy',
    name: 'Privacy',
    component: () => import('@/views/Me/Settings/Privacy.vue'),
    meta: { requiresAuth: true }
  },

  /* ---- 通用 / 存储 / 帮助 ---- */
  {
    path: '/settings/general',
    name: 'General',
    component: () => import('@/views/Me/Settings/General.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings/storage',
    name: 'Storage',
    component: () => import('@/views/Me/Settings/Storage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings/help',
    name: 'Help',
    component: () => import('@/views/Me/Settings/Help.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings/about',
    name: 'About',
    component: () => import('@/views/Me/Settings/About.vue'),
    meta: { requiresAuth: true }
  }
]

export default routes