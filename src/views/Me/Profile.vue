<template>
  <div class="profile-page">
    <!-- 用户信息头部 -->
    <header class="user-header">
      <div class="user-info" @click="viewProfileDetail">
        <Avatar 
          :size="'large'" 
          :text="userInfo.nickname" 
          :backgroundColor="userInfo.avatarColor"
        />
        <div class="user-details">
          <div class="user-name">{{ userInfo.nickname }}</div>
          <div class="user-id">微信号: {{ userInfo.wechatId }}</div>
          <div class="user-signature" v-if="userInfo.signature">
            {{ userInfo.signature }}
          </div>
        </div>
        <div class="qr-code" @click.stop="showQRCode">
          📷
        </div>
      </div>
    </header>

    <!-- 功能菜单 -->
    <main class="profile-menu">
      <!-- 服务菜单 -->
      <div class="menu-section">
        <MenuItem 
          icon="💰"
          title="服务"
          description="支付、卡券等服务"
          @click="goToServices"
        />
      </div>

      <!-- 收藏、朋友圈等 -->
      <div class="menu-section">
        <MenuItem 
          icon="⭐"
          title="收藏"
          badge="12"
          @click="goToFavorites"
        />
        <MenuItem 
          icon="📸"
          title="朋友圈"
          badge="3"
          @click="goToMoments"
        />
        <MenuItem 
          icon="💳"
          title="卡包"
          @click="goToWallet"
        />
        <MenuItem 
          icon="😊"
          title="表情"
          @click="goToStickers"
        />
      </div>

      <!-- 设置 -->
      <div class="menu-section">
        <MenuItem 
          icon="⚙️"
          title="设置"
          @click="goToSettings"
        />
      </div>
    </main>

    <!-- 底部退出登录 -->
    <footer class="logout-footer">
      <button class="logout-button" @click="handleLogout">退出登录</button>
    </footer>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/composables/useStore'
import Avatar from '@/components/ui/Avatar/Avatar.vue'
import MenuItem from '@/components/business/Me/MenuItem.vue'

export default {
  name: 'Profile',
  components: {
    Avatar,
    MenuItem
  },
  setup() {
    const router = useRouter()
    const userStore = useUserStore()

    const userInfo = computed(() => userStore.currentUser)

    const viewProfileDetail = () => {
      console.log('查看个人资料详情')
      // 实际实现中应该跳转到个人资料详情页
    }

    const showQRCode = () => {
      console.log('显示二维码')
      // 实际实现中应该显示用户二维码
    }

    const goToServices = () => {
      console.log('跳转到服务')
    }

    const goToFavorites = () => {
      console.log('跳转到收藏')
    }

    const goToMoments = () => {
      console.log('跳转到朋友圈')
    }

    const goToWallet = () => {
      router.push('/me/wallet')
    }

    const goToStickers = () => {
      console.log('跳转到表情')
    }

    const goToSettings = () => {
      router.push('/settings')
    }

    const handleLogout = () => {
      if (confirm('确定要退出登录吗？')) {
        userStore.logout()
        router.push('/')
      }
    }

    return {
      userInfo,
      viewProfileDetail,
      showQRCode,
      goToServices,
      goToFavorites,
      goToMoments,
      goToWallet,
      goToStickers,
      goToSettings,
      handleLogout
    }
  }
}
</script>

<style scoped>
:root {
  --wechat-primary: #07c160;
  --wechat-bg: #ededed;
  --wechat-bg-grey: #f5f5f5;
  --wechat-border: #d6d6d6;
  --wechat-border-light: #e5e5e5;
  --wechat-text-primary: #000000;
  --wechat-text-secondary: #999999;
  --wechat-error: #fa5151;
}

.profile-page {
  height: 100vh;
  background-color: var(--wechat-bg);
  display: flex;
  flex-direction: column;
}

/* 用户信息头部 - 微信渐变背景 */
.user-header {
  background: linear-gradient(135deg, #07c160 0%, #06ad56 100%);
  padding: 40px 15px 30px;
  color: white;
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
}

.user-details {
  flex: 1;
  margin-left: 15px;
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 6px;
  color: #fff;
}

.user-id {
  font-size: 13px;
  opacity: 0.9;
  margin-bottom: 4px;
  color: rgba(255, 255, 255, 0.9);
}

.user-signature {
  font-size: 13px;
  opacity: 0.8;
  color: rgba(255, 255, 255, 0.8);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
}

.qr-code {
  font-size: 24px;
  padding: 10px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.9);
  transition: transform 0.2s;
}

.qr-code:hover {
  transform: scale(1.1);
}

/* 功能菜单 */
.profile-menu {
  flex: 1;
  padding: 0;
}

.menu-section {
  margin-bottom: 20px;
  background-color: white;
}

.menu-section:first-child {
  border-top: 1px solid var(--wechat-border);
}

.logout-footer {
  padding: 20px 15px;
  background-color: white;
  border-top: 1px solid var(--wechat-border);
}

.logout-button {
  width: 100%;
  padding: 12px;
  background-color: var(--wechat-error);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-weight: 500;
}

.logout-button:hover {
  background-color: #e53935;
}

.logout-button:active {
  background-color: #d32f2f;
}
</style>