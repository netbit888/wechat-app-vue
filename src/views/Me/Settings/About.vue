<template>
  <div class="settings-sub-page">
    <header class="sub-header">
      <button class="back-btn" @click="$router.back()">⬅</button>
      <h2>{{ $route.meta.title || '页面标题' }}</h2>
    </header>
    <main>功能开发中…</main>
  </div>
</template>

<style scoped>
.sub-header{
  display:flex; align-items:center; padding:10px 15px;
  background:#fff; border-bottom:1px solid var(--wechat-border-color);
}
.back-btn{background:none;border:none;font-size:18px;cursor:pointer;margin-right:10px;}
.settings-sub-page{height:100vh;background:var(--wechat-bg-color);}
</style>