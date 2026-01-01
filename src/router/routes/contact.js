// 通讯录相关路由
const routes = [
  {
    path: '/contact',
    name: 'ContactList',
    component: () => import('@/views/Contact/ContactList.vue')
  },
  {
    path: '/contact/:id',
    name: 'ContactDetail',
    component: () => import('@/views/Contact/ContactDetail.vue'),
    props: true
  },
  {
    path: '/contact/new-friends',
    name: 'NewFriends',
    component: () => import('@/views/Contact/NewFriends.vue')
  }
]

export default routes