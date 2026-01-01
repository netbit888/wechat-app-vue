import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/components/layout/MainLayout.vue'
import chatRoutes from './routes/chat'
import contactRoutes from './routes/contact'
import discoverRoutes from './routes/discover'
import meRoutes from './routes/me'

const routes = [
  {
    path: '/',
    component: MainLayout,
    redirect: '/chat',
    children: [
      // 聊天相关路由
      ...chatRoutes,
      // 通讯录相关路由  
      ...contactRoutes,
      // 发现页相关路由
      ...discoverRoutes,
      // 个人中心相关路由
      ...meRoutes
    ]
  },
  // 404 页面（不使用主布局）
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router