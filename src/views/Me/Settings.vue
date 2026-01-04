<template>
  <div class="settings-page">
    <header class="settings-header">
      <button class="back-button" @click="goBack">⬅</button>
      <h1>设置</h1>
    </header>

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
        <button class="logout-button" @click="">切换账号</button>
      </div>
      
      <!-- 退出登录 -->
      <div class="logout-section">
        <button class="logout-button" @click="handleLogout">退出登录</button>
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

.settings-header {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background-color: white;
  border-bottom: 1px solid var(--wechat-border-color);
}

.back-button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 5px;
  margin-right: 10px;
}

.settings-header h1 {
  font-size: 18px;
  font-weight: normal;
  margin: 0;
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

.logout-section {
  padding: 20px 15px;
  background-color: white;
}

.logout-button {
  width: 100%;
  padding: 12px;
  background-color: var(--wechat-error-color);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
}

.logout-button:hover {
  background-color: #e53935;
}
</style>