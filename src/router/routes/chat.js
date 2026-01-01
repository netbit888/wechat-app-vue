// 聊天相关路由
const routes = [
  {
    path: '/chat',
    name: 'ChatList',
    component: () => import('@/views/WeChat/ChatList.vue')
  },
  {
    path: '/chat/:id', // 动态路由，用于聊天详情页
    name: 'ChatDetail',
    component: () => import('@/views/WeChat/ChatDetail.vue'),
    props: true // 将路由参数作为 props 传递给组件
  }
]

export default routes