// src/router/routes/auth.js
const routes = [
  {
    path: '/auth/login',
    name: 'Login',
    component: () => import('@/views/Auth/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/auth/register',
    name: 'Register',
    component: () => import('@/views/Auth/Register.vue'),
    meta: { requiresAuth: false }
  }
];

export default routes;