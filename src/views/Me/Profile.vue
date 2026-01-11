<template>
  <div class="profile-page">
    <!-- 用户信息头部 -->
    <header class="user-header">
      <div class="user-info" @click="$router.push('/settings/profile')">
        <Avatar 
          :size="'large'" 
          :src="userInfo.avatar"
          :text="userInfo.nickname" 
          :backgroundColor="userInfo.avatarColor || '#ccc'"
        />
        <div class="user-details">
          <div class="user-name">{{ userInfo.nickname }}</div>
          <div class="user-id">微信号: {{ userInfo.wechatId }}</div>
        </div>
        <div class="qr-code" @click.stop="showQRCode">
          📛
        </div>
      </div>
      <!-- 状态栏 -->
      <div class="status-bar" @click="goToStatus">
        <button class="status-btn">+ 状态</button>
        <button class="refresh-btn" @click.stop="refreshStatus">
          🔄
        </button>
      </div>
    </header>

    <!-- 功能菜单 -->
    <main class="profile-menu">
      <!-- 服务菜单 -->
      <div class="menu-section">
        <MenuItem 
          icon="💚"
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
          icon="📺"
          title="视频号和公众号"
          @click="goToVideoAccounts"
        />
        <MenuItem 
          icon="💳"
          title="卡包"
          @click="goToCardPackage"
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
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
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
    
    // 获取用户信息，添加默认值和测试数据
    const userInfo = computed(() => {
      const user = userStore.currentUser || {};
      
      // 测试数据，当没有用户信息时使用
      const testUser = {
        nickname: 'Mars',
        wechatId: 'T19539788318',
        avatarColor: '#FF6B6B',
        signature: '这是一个测试签名'
      };
      
      return {
        nickname: user.nickname || testUser.nickname,
        wechatId: user.wechatId || testUser.wechatId,
        avatar: user.avatar || '',
        avatarColor: user.avatarColor || testUser.avatarColor,
        signature: user.signature || testUser.signature,
        ...user
      };
    })

    // 从数据库获取用户信息
    const fetchUserInfo = async () => {
      try {
        console.log('开始获取用户信息')
        await userStore.getProfile()
        console.log('获取用户信息成功:', userStore.currentUser)
      } catch (error) {
        console.error('获取用户信息失败:', error)
      }
    }
    
    // 组件挂载时获取用户信息
    onMounted(() => {
      fetchUserInfo()
    })

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

    const goToStatus = () => {
      console.log('跳转到状态页面')
    }

    const refreshStatus = () => {
      console.log('刷新状态')
    }

    const goToVideoAccounts = () => {
      console.log('跳转到视频号和公众号')
    }

    const goToCardPackage = () => {
      console.log('跳转到卡包')
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
      goToStatus,
      refreshStatus,
      goToVideoAccounts,
      goToCardPackage,
      handleLogout
    }
  }
}
</script>

<style scoped>
:root {
  --wechat-primary: #07c160;
  --wechat-bg-color: #ededed;
  --wechat-bg-grey: #f5f5f5;
  --wechat-border-color: #d6d6d6;
  --wechat-text-primary: #000000;
  --wechat-text-secondary: #999999;
  --wechat-error-color: #fa5151;
}

.profile-page {
  height: 100vh;
  background-color: var(--wechat-bg-color);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

/* 用户信息头部 - 微信白色背景 */
.user-header {
  background: white;
  padding: 15px;
  color: var(--wechat-text-primary);
  position: relative;
  border-bottom: 1px solid var(--wechat-border-color);
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  padding: 10px 0;
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
  margin-bottom: 2px;
  color: var(--wechat-text-primary);
}

.user-id {
  font-size: 13px;
  opacity: 0.7;
  color: var(--wechat-text-secondary);
}

.qr-code {
  font-size: 24px;
  padding: 10px;
  cursor: pointer;
  color: var(--wechat-text-primary);
  transition: transform 0.2s;
}

.qr-code:hover {
  transform: scale(1.1);
}

/* 状态栏 */
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-top: 1px solid var(--wechat-border-color);
  margin-top: 5px;
}

.status-btn {
  background: none;
  border: 1px solid var(--wechat-primary);
  color: var(--wechat-primary);
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.status-btn:hover {
  background-color: rgba(7, 193, 96, 0.1);
}

.refresh-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 8px;
  color: var(--wechat-text-secondary);
  transition: transform 0.2s;
}

.refresh-btn:hover {
  transform: rotate(180deg);
}

/* 功能菜单 */
.profile-menu {
  flex: 1;
  padding: 0;
}

.menu-section {
  margin-bottom: 15px;
  background-color: white;
}

.menu-section:first-child {
  margin-top: 15px;
}

/* 菜单之间的分隔线 */
.menu-section:not(:last-child) {
  border-bottom: 1px solid var(--wechat-border-color);
}

.logout-footer {
  padding: 20px 15px;
  background-color: white;
  border-top: 1px solid var(--wechat-border-color);
}

.logout-button {
  width: 100%;
  padding: 12px;
  background-color: var(--wechat-error-color);
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