// 发现页相关路由
const routes = [
  {
    path: '/discover',
    name: 'Discover',
    component: () => import('@/views/Discover/Discover.vue')
  },
  {
    path: '/scan',
    name: 'Scan',
    component: () => import('@/views/Discover/Scan.vue')
  },
  {
    path: '/moments',
    name: 'Moments',
    component: () => import('@/views/Discover/Moments.vue')
  },
  {
    path: '/mini-programs',
    name: 'MiniPrograms',
    component: () => import('@/views/Discover/MiniPrograms.vue')
  }
]

export default routes