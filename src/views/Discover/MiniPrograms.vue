<template>
  <div class="mini-programs-page">
    <!-- 头部导航 -->
    <header class="page-header">
      <button class="back-button" @click="goBack">⬅</button>
      <h1>小程序</h1>
      <div class="header-actions">
        <button class="search-btn" @click="search">🔍</button>
        <button class="more-btn" @click="showMore">⋯</button>
      </div>
    </header>

    <!-- 最近使用 -->
    <section class="recent-section" v-if="recentPrograms.length > 0">
      <div class="section-title">最近使用</div>
      <div class="programs-grid">
        <div 
          v-for="program in recentPrograms" 
          :key="program.id"
          class="program-item"
          @click="openProgram(program)"
        >
          <img :src="program.icon" alt="" class="program-icon">
          <div class="program-name">{{ program.name }}</div>
        </div>
      </div>
    </section>

    <!-- 我的小程序 -->
    <section class="my-section">
      <div class="section-title">我的小程序</div>
      <div class="programs-list">
        <div 
          v-for="program in myPrograms" 
          :key="program.id"
          class="program-item-list"
          @click="openProgram(program)"
        >
          <img :src="program.icon" alt="" class="program-icon">
          <div class="program-info">
            <div class="program-name">{{ program.name }}</div>
            <div class="program-desc">{{ program.description }}</div>
          </div>
          <button class="program-more" @click.stop="showProgramMenu(program)">⋯</button>
        </div>
      </div>
    </section>

    <!-- 发现小程序 -->
    <section class="discover-section">
      <div class="section-title">发现小程序</div>
      <div class="discover-list">
        <div 
          v-for="program in discoverPrograms" 
          :key="program.id"
          class="discover-item"
          @click="openProgram(program)"
        >
          <img :src="program.icon" alt="" class="discover-icon">
          <div class="discover-info">
            <div class="discover-name">{{ program.name }}</div>
            <div class="discover-desc">{{ program.description }}</div>
            <div class="discover-meta">
              <span class="discover-category">{{ program.category }}</span>
              <span class="discover-users">{{ program.users }}人在用</span>
            </div>
          </div>
          <button class="discover-open">打开</button>
        </div>
      </div>
    </section>

    <!-- 添加小程序按钮 -->
    <div class="add-program" @click="addProgram">
      <span class="add-icon">+</span>
      <span>添加小程序</span>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'MiniPrograms',
  setup() {
    const router = useRouter()

    // 最近使用
    const recentPrograms = ref([
      { id: 1, name: '京东购物', icon: 'https://picsum.photos/100/100?random=11' },
      { id: 2, name: '美团外卖', icon: 'https://picsum.photos/100/100?random=12' },
      { id: 3, name: '滴滴出行', icon: 'https://picsum.photos/100/100?random=13' },
      { id: 4, name: '腾讯视频', icon: 'https://picsum.photos/100/100?random=14' }
    ])

    // 我的小程序
    const myPrograms = ref([
      { 
        id: 5, 
        name: '微信支付', 
        description: '官方小程序',
        icon: 'https://picsum.photos/100/100?random=15' 
      },
      { 
        id: 6, 
        name: '微信读书', 
        description: '让阅读不再孤单',
        icon: 'https://picsum.photos/100/100?random=16' 
      }
    ])

    // 发现小程序
    const discoverPrograms = ref([
      { 
        id: 7, 
        name: '拼多多', 
        description: '拼多多，多实惠，多乐趣',
        category: '购物',
        users: '1.2亿',
        icon: 'https://picsum.photos/100/100?random=17' 
      },
      { 
        id: 8, 
        name: '抖音', 
        description: '记录美好生活',
        category: '视频',
        users: '5.8亿',
        icon: 'https://picsum.photos/100/100?random=18' 
      }
    ])

    const goBack = () => {
      router.back()
    }

    const search = () => {
      console.log('搜索小程序')
    }

    const showMore = () => {
      console.log('更多操作')
    }

    const openProgram = (program) => {
      console.log('打开小程序', program.name)
    }

    const showProgramMenu = (program) => {
      console.log('显示小程序菜单', program.name)
    }

    const addProgram = () => {
      console.log('添加小程序')
    }

    return {
      recentPrograms,
      myPrograms,
      discoverPrograms,
      goBack,
      search,
      showMore,
      openProgram,
      showProgramMenu,
      addProgram
    }
  }
}
</script>

<style scoped>
:root {
  --wechat-bg: #ededed;
  --wechat-border: #d6d6d6;
  --wechat-border-light: #e5e5e5;
  --wechat-text-primary: #000000;
  --wechat-text-secondary: #999999;
  --wechat-primary: #07c160;
  --wechat-cell-hover: #f5f5f5;
}

.mini-programs-page {
  height: 100vh;
  background-color: var(--wechat-bg);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* 头部导航 - 微信标准44px */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  background-color: var(--wechat-bg);
  border-bottom: 1px solid var(--wechat-border);
  position: sticky;
  top: 0;
  z-index: 100;
  height: 44px;
  box-sizing: border-box;
}

.page-header h1 {
  font-size: 17px;
  font-weight: 500;
  color: #000;
  margin: 0;
}

.back-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  color: #000;
  transition: opacity 0.2s;
}

.back-button:hover {
  opacity: 0.7;
}

.header-actions {
  display: flex;
  gap: 15px;
}

.search-btn, .more-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 5px;
  color: #000;
  transition: opacity 0.2s;
}

.search-btn:hover, .more-btn:hover {
  opacity: 0.7;
}

/* 区块标题 */
.section-title {
  padding: 15px 15px 8px;
  font-size: 14px;
  color: var(--wechat-text-secondary);
  font-weight: normal;
}

/* 最近使用 - 网格布局 */
.programs-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 15px;
  background-color: white;
}

.program-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.program-item:hover {
  transform: scale(1.05);
}

.program-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  margin-bottom: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.program-name {
  font-size: 12px;
  color: var(--wechat-text-primary);
  text-align: center;
  line-height: 1.2;
  max-width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 我的小程序 - 列表布局 */
.my-section {
  background-color: white;
  margin-bottom: 20px;
}

.programs-list {
  padding: 0;
}

.program-item-list {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
}

.program-item-list:active {
  background-color: var(--wechat-cell-hover);
}

.program-item-list:not(:last-child)::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 78px; /* 图标48 + 边距15 + 左padding15 */
  right: 0;
  height: 1px;
  background-color: var(--wechat-border-light);
}

.program-item-list .program-icon {
  width: 48px;
  height: 48px;
  margin: 0;
  margin-right: 12px;
  flex-shrink: 0;
}

.program-info {
  flex: 1;
  min-width: 0;
}

.program-info .program-name {
  font-size: 16px;
  max-width: none;
  text-align: left;
  margin-bottom: 4px;
}

.program-desc {
  font-size: 13px;
  color: var(--wechat-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.program-more {
  background: none;
  border: none;
  font-size: 20px;
  color: var(--wechat-text-secondary);
  cursor: pointer;
  padding: 10px;
  margin: -10px;
  transition: color 0.2s;
}

.program-more:hover {
  color: var(--wechat-text-primary);
}

/* 发现小程序 */
.discover-section {
  background-color: white;
  margin-bottom: 20px;
}

.discover-list {
  padding: 0;
}

.discover-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
}

.discover-item:active {
  background-color: var(--wechat-cell-hover);
}

.discover-item:not(:last-child)::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 78px;
  right: 0;
  height: 1px;
  background-color: var(--wechat-border-light);
}

.discover-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  margin-right: 12px;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.discover-info {
  flex: 1;
  min-width: 0;
}

.discover-name {
  font-size: 16px;
  color: var(--wechat-text-primary);
  margin-bottom: 4px;
}

.discover-desc {
  font-size: 13px;
  color: var(--wechat-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 4px;
}

.discover-meta {
  display: flex;
  gap: 10px;
  font-size: 12px;
  color: var(--wechat-text-secondary);
}

.discover-category {
  padding: 2px 6px;
  background-color: #f0f0f0;
  border-radius: 3px;
}

.discover-open {
  background: none;
  border: 1px solid var(--wechat-primary);
  color: var(--wechat-primary);
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.discover-open:hover {
  background-color: var(--wechat-primary);
  color: white;
}

/* 添加小程序按钮 */
.add-program {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 15px;
  background-color: white;
  cursor: pointer;
  transition: background-color 0.2s;
  color: var(--wechat-text-secondary);
  font-size: 14px;
}

.add-program:hover {
  background-color: var(--wechat-cell-hover);
}

.add-icon {
  font-size: 20px;
  color: var(--wechat-text-secondary);
}
</style>