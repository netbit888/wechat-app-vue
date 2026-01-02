// 发现页相关路由
const routes = [
  {
    path: '/discover',
    name: 'Discover',
    component: () => import('@/views/Discover/Discover.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/scan',
    name: 'Scan',
    component: () => import('@/views/Discover/Scan.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/moments',
    name: 'Moments',
    component: () => import('@/views/Discover/Moments.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/mini-programs',
    name: 'MiniPrograms',
    component: () => import('@/views/Discover/MiniPrograms.vue'),
    meta: { requiresAuth: true }
  }
]

export default routes