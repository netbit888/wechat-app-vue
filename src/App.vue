<template>
  <div id="app">
    <!-- 路由出口，页面内容将在这里渲染 -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* 全局样式 */
#app {
  min-height: 100vh;
  background-color: var(--wechat-bg-color);
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
}
</style>