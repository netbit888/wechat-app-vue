import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/components/layout/MainLayout.vue'
import chatRoutes from './routes/chat'
import contactRoutes from './routes/contact'
import discoverRoutes from './routes/discover'
import meRoutes from './routes/me'
import authRoutes from './routes/auth.js';

const routes = [
  {
    path: '/',
    component: MainLayout,
    redirect: '/wechat',
    children: [
      ...authRoutes,
      ...chatRoutes,
      ...contactRoutes,
      ...discoverRoutes,
      ...meRoutes
    ]
  },
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