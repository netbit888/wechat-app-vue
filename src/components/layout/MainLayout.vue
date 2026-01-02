<template>
  <div class="main-layout">
    <!-- 页面内容区域 -->
    <main class="main-content" :class="{ 'has-tabbar': showTabBar }">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </main>
    
    <!-- 底部导航栏 -->
    <footer class="tab-bar" v-if="showTabBar">
      <div 
        v-for="tab in tabs" 
        :key="tab.name"
        class="tab-item"
        :class="{ active: $route.path.startsWith(tab.path) }"
        @click="switchTab(tab)"
      >
        <div class="tab-icon">
          <span class="icon">{{ tab.icon }}</span>
          <span class="badge" v-if="tab.badge">{{ tab.badge }}</span>
        </div>
        <div class="tab-label">{{ tab.label }}</div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'MainLayout',
  data() {
    return {
      tabs: [
        {
          name: 'WeChat',
          path: '/wechat',
          label: '微信',
          icon: '💬',
          badge: 0
        },
        {
          name: 'Contact',
          path: '/contact',
          label: '通讯录',
          icon: '👥',
          badge: 0
        },
        {
          name: 'Discover',
          path: '/discover',
          label: '发现',
          icon: '🔍',
          badge: 0
        },
        {
          name: 'Me',
          path: '/me',
          label: '我',
          icon: '👤',
          badge: 0
        }
      ]
    }
  },
  computed: {
    showTabBar() {
      // 在这些路径下显示底部导航栏
      const tabBarPaths = ['/wechat', '/contact', '/discover', '/me']
      return tabBarPaths.some(path => this.$route.path.startsWith(path))
    }
  },
  methods: {
    switchTab(tab) {
      if (!this.$route.path.startsWith(tab.path)) {
        this.$router.push(tab.path)
      }
    }
  }
}
</script>

<style scoped>
.main-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--wechat-bg-color);
}

.main-content {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.main-content.has-tabbar {
  padding-bottom: 50px; /* 为底部导航栏留出空间 */
}

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background-color: #f7f7f7;
  border-top: 1px solid var(--wechat-border-color);
  display: flex;
  z-index: 1000;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #999;
  cursor: pointer;
  transition: color 0.3s;
  position: relative;
}

.tab-item.active {
  color: var(--wechat-primary-color);
}

.tab-icon {
  position: relative;
  margin-bottom: 2px;
}

.tab-icon .icon {
  font-size: 20px;
}

.badge {
  position: absolute;
  top: -5px;
  right: -8px;
  background-color: #fa5151;
  color: white;
  border-radius: 8px;
  min-width: 16px;
  height: 16px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

.tab-label {
  font-size: 12px;
}
</style>