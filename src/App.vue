<template>
  <div id="app">
    <!-- 路由出口 -->
    <router-view />
    
    <!-- ✅ 测试组件放在 div 内部 -->
  </div>
</template>

<script setup>
</script>

<style>
#app {
  min-height: 100vh;
  background-color: var(--wechat-bg-color);
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
}
</style>