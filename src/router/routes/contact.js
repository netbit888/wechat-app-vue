// 通讯录相关路由
const routes = [
  {
    path: '/contact',
    name: 'ContactList',
    component: () => import('@/views/Contact/ContactList.vue'),
    meta: { requiresAuth: true }
  }/*,
  {
    path: '/contact/:id',
    name: 'ContactDetail',
    component: () => import('@/views/Contact/ContactDetail.vue'),
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/contact/new-friends',
    name: 'NewFriends',
    component: () => import('@/views/Contact/NewFriends.vue'),
    meta: { requiresAuth: true }
  }
  */
]

export default routes