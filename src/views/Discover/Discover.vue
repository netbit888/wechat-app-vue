<template>
  <div class="discover-page">
    <!-- 页面头部 -->
    <header class="page-header">
      <button class="back-button" @click="goBack">⬅</button>
      <h1>发现</h1>
    </header>

    <!-- 功能列表 -->
    <main class="discover-list">
      <!-- 朋友圈 -->
      <div class="discover-section">
        <DiscoverItem 
          icon="📸"
          title="朋友圈"
          description="朋友的新动态"
          badge="3"
          @click="goToMoments"
        />
      </div>

      <!-- 扫一扫/摇一摇 -->
      <div class="discover-section">
        <DiscoverItem 
          icon="🔍"
          title="扫一扫"
          description="扫描二维码"
          @click="goToScan"
        />
        <DiscoverItem 
          icon="👋"
          title="摇一摇"
          description="摇动手机找朋友"
          @click="goToShake"
        />
      </div>

      <!-- 小程序/游戏 -->
      <div class="discover-section">
        <DiscoverItem 
          icon="🕹️"
          title="小程序"
          description="无需下载的应用"
          badge="12"
          @click="goToMiniPrograms"
        />
        <DiscoverItem 
          icon="🎮"
          title="游戏"
          description="休闲娱乐"
          @click="goToGames"
        />
      </div>

      <!-- 购物/直播 -->
      <div class="discover-section">
        <DiscoverItem 
          icon="🛒"
          title="购物"
          description="京东购物"
          badge="hot"
          @click="goToShopping"
        />
        <DiscoverItem 
          icon="📺"
          title="直播"
          description="精彩直播内容"
          @click="goToLive"
        />
      </div>
    </main>
  </div>
</template>

<script>
import DiscoverItem from '@/components/business/Discover/DiscoverItem.vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Discover',
  components: {
    DiscoverItem
  },
  setup() {
    const router = useRouter()
    
    const goBack = () => {
      router.back()
    }

    const goToMoments = () => {
      router.push('/moments')
    }

    const goToScan = () => {
      router.push('/scan')
    }

    const goToShake = () => {
      console.log('跳转到摇一摇')
    }

    const goToMiniPrograms = () => {
      router.push('/mini-programs')
    }

    const goToGames = () => {
      console.log('跳转到游戏')
    }

    const goToShopping = () => {
      console.log('跳转到购物')
    }

    const goToLive = () => {
      console.log('跳转到直播')
    }

    return {
      goBack,
      goToMoments,
      goToScan,
      goToShake,
      goToMiniPrograms,
      goToGames,
      goToShopping,
      goToLive
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
}

.discover-page {
  height: 100vh;
  background-color: var(--wechat-bg);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* 头部导航 - 微信标准44px */
.page-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
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
  text-align: center;
  line-height: 44px;
}

.back-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 5px 10px;
  color: #000;
  transition: opacity 0.2s;
  position: absolute;
  left: 5px;
  top: 50%;
  transform: translateY(-50%);
}

.back-button:hover {
  opacity: 0.7;
}

/* 功能列表区域 */
.discover-list {
  padding: 0;
}

/* 功能区块 - 微信标准间距 */
.discover-section {
  margin-bottom: 20px;
  background-color: white;
}

.discover-section:first-child {
  margin-top: 20px;
}

.discover-section:last-child {
  margin-bottom: 0;
}
</style>