// src/router/guards/auth.js
export function setupAuthGuard(router) {
  router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('token');
    const routes = router.getRoutes();
    const routeExists = routes.some(route => route.path === to.path);
    
    if (!routeExists) return next();  // ✅ 路由不存在直接放行
    
    if (to.meta.requiresAuth && !isAuthenticated) {
      next('/auth/login');  // ✅ 未登录重定向
    } else if ((to.path === '/auth/login' || to.path === '/auth/register') && isAuthenticated) {
      next('/wechat');  // ✅ 已登录跳首页
    } else {
      next();
    }
  });
}