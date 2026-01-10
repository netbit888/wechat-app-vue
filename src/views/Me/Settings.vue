<template>
  <div class="settings-page">
    <header class="settings-header">
      <button class="back-button" @click="goBack">⬅</button>
      <h1>设置</h1>
    </header>

    <!-- 独立搜索栏 -->
    <div class="search-bar">
      <input
        type="text"
        class="search-input"
        placeholder="搜索"
        v-model="keyword"
      />
    </div>

    <main class="settings-content">
      <!-- 账号 -->
      <div class="settings-section">
        <div class="section-title">账号</div>
        <SettingsItem 
          title="个人资料"
          @click="goToProfile"
        />
        <SettingsItem 
          title="账号安全"
          @click="goToAccountSecurity"
        />
        <SettingsItem 
          title="个人信息与权限"
          @click="goToPrivacy"
        />
      </div>

      <!-- 通知 -->
      <div class="settings-section">
        <div class="section-title">通知</div>
        <SettingsItem 
          title="通知"
          @click="goToNotification"
        />
        <SettingsItem 
          title="界面与显示"
          @click="goToInterfaceDisplay"
        />
        <SettingsItem 
          title="朋友权限"
          @click="goToFriendPermission"
        />
        <SettingsItem 
          title="存储空间"
          @click="goToStorage"
        />
        <SettingsItem 
          title="更多"
          @click="goToGeneral"
        />
      </div>

      <!-- 功能 -->
      <div class="settings-section">
        <div class="section-title">功能</div>
        <SettingsItem 
          title="聊天"
          @click="goToGeneral"
        />
        <SettingsItem 
          title="音视频通话"
          @click="goToGeneral"
        />
        <SettingsItem 
          title="聊天记录管理"
          @click="goToStorage"
        />
        <SettingsItem 
          title="其他功能"
          @click="goToGeneral"
        />
      </div>

      <!-- 帮助与关于 -->
      <div class="settings-section">
        <div class="section-title">帮助与关于</div>
        <SettingsItem 
          title="帮助与反馈"
          @click="goToHelp"
        />
        <SettingsItem 
          title="关于微信"
          description="版本 8.0.66"
          @click="goToAbout"
        />
      </div>

      <!-- 切换账号 -->
      <div class="logout-section">
        <button class="logout-button" @click="handleSwitchAccount">切换账号</button>
      </div>
      
      <!-- 退出登录 -->
      <div class="logout-section">
        <button class="logout-button" @click="handleLogout">退出登录</button>
      </div>

      <!-- 底部声明 -->
      <div class="footer-declare">
        <span>个人信息收集清单</span>
        <span class="sep">｜</span>
        <span>第三方信息共享清单</span>
      </div>
    </main>
  </div>
</template>

<script>
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/composables/useStore'
import { useLocalStorage } from '@/composables/useLocalStorage'
import SettingsItem from '@/components/business/Me/SettingsItem.vue'

export default {
  name: 'Settings',
  components: { SettingsItem },
  setup() {
    const router = useRouter()
    const userStore = useUserStore()

    /* ---------- 本地缓存 + 后端同步 ---------- */
    const messageSettings = useLocalStorage('setting_message', {
      notification: true,
      sound:        true,
      vibration:    false
    })
    const privacySettings = useLocalStorage('setting_privacy', {
      personalizedAds: true
    })
    const generalSettings = useLocalStorage('setting_general', {
      darkMode: false
    })

    /* 任一开关变化即同步后端（防抖可由 watch 自动合并） */
    const syncSettings = () => userStore.updateSettings({
      notification:    messageSettings.value.notification,
      sound:           messageSettings.value.sound,
      vibration:       messageSettings.value.vibration,
      personalizedAds: privacySettings.value.personalizedAds,
      darkMode:        generalSettings.value.darkMode
    })
    watch([messageSettings, privacySettings, generalSettings], syncSettings, { deep: true })

    /* ---------- 事件 ---------- */
    const goBack = () => router.push('/me')

    const toggleNotification = v => (messageSettings.value.notification = v)
    const toggleSound        = v => (messageSettings.value.sound = v)
    const toggleVibration    = v => (messageSettings.value.vibration = v)
    const togglePersonalizedAds = v => (privacySettings.value.personalizedAds = v)
    const toggleDarkMode     = v => (generalSettings.value.darkMode = v)

    const goTo = () => console.log('暂未实现')
    const goToNotification = () => router.push('/settings/notification')
    const goToInterfaceDisplay = () => router.push('/settings/interface-display')
    const goToFriendPermission = () => router.push('/settings/friend-permission')

    const goToProfile        = () => router.push('/settings/profile')
    const goToAccountSecurity = () => router.push('/settings/account-security')
    const goToPrivacy        = () => router.push('/settings/privacy')
    const goToGeneral        = () => router.push('/settings/general')
    const goToStorage        = () => router.push('/settings/storage')
    const goToHelp           = () => router.push('/settings/help')
    const goToAbout          = () => router.push('/settings/about')



    const handleLogout = () => {
      if (confirm('确定要退出登录吗？')) {
        userStore.logout()
        router.push('/')
      }
    }

    // 切换账号处理函数
    const handleSwitchAccount = () => {
      if (confirm('确定要切换账号吗？')) {
        userStore.logout()
        router.push('/auth/login')
      }
    }

    return {
      messageSettings,
      privacySettings,
      generalSettings,
      goBack,
      toggleNotification,
      toggleSound,
      toggleVibration,
      togglePersonalizedAds,
      toggleDarkMode,
      goToAccountSecurity,
      goToPrivacy,
      goToGeneral,
      goToStorage,
      goToAbout,
      goToHelp,
      handleLogout,
      handleSwitchAccount,
      goToProfile,
      goToNotification,
      goToInterfaceDisplay,
      goToFriendPermission,
      goTo
      
    }
  }
}
</script>

<style scoped>
.settings-page {
  height: 100vh;
  background-color: var(--wechat-bg-color);
  overflow-y: auto;   /* ← 加这一行就能滑 */
}

.settings-header{
  display: flex;
  align-items: center;
  justify-content: center;   /* 标题居中 */
  padding: 12px;
  background: #fff;
  border-bottom: 1px solid var(--wechat-border-color);
  position: relative;
  font-size: 10px;
}

.back-button{
  position: absolute;
  left: 12px;
  background: none;
  border: none;
  font-size: 20px;
}

.settings-header{
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #fff;
  border-bottom: 1px solid var(--wechat-border-color);
}

.settings-content {
  padding: 20px 0;
}

.settings-section {
  margin-bottom: 20px;
  background-color: white;
}

.section-title {
  padding: 15px;
  font-size: 14px;
  color: var(--wechat-text-secondary);
  border-bottom: 1px solid var(--wechat-border-color);
}

.logout-section{
  padding: 12px 0;        /* 只留上下，左右 0 → 贴边 */
  background: #f1f1f1;
}

.logout-button{
  width: 100%;
  height: 48px;
  line-height: 48px;
  font-size: 17px;
  color: #000;
  background: #fff;
  border: none;
  border-radius: 0;       /* 直角 */
  cursor: pointer;
}

.logout-button:active{
  background: #e5e5e5;
}

.footer-declare{
  padding: 24px 16px 32px;   /* 上 24 下 32，左右 16 */
  text-align: center;
  font-size: 13px;
  color: #888;               /* 微信灰字 */
  background: #f1f1f1;       /* 跟页面背景一致 */
}
.footer-declare .sep{
  margin: 0 4px;
}

/* 独立搜索栏 */
.search-bar{
  margin: 12px 16px 0;
  height: 36px;
  background: #f1f1f1;
  border-radius: 6px;
  display: flex;
  align-items: center;
  padding: 0 12px;
}
.search-icon{
  width: 16px;
  height: 16px;
  fill: #888;
  margin-right: 8px;
}
.search-input{
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 15px;
}
.search-input::placeholder{
  color: #888;
}

</style>