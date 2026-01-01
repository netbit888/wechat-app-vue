<template>
  <div class="settings-page">
    <header class="settings-header">
      <button class="back-button" @click="goBack">⬅</button>
      <h1>设置</h1>
    </header>

    <main class="settings-content">
      <!-- 账号与安全 -->
      <div class="settings-section">
        <div class="section-title">账号与安全</div>
        <SettingsItem 
          title="账号与安全"
          description="微信号、密码、登录设备等"
          @click="goToAccountSecurity"
        />
      </div>

      <!-- 消息通知 -->
      <div class="settings-section">
        <div class="section-title">消息通知</div>
        <SettingsItem 
          title="新消息通知"
          :switch-value="messageSettings.notification"
          @switch-change="toggleNotification"
        />
        <SettingsItem 
          title="声音"
          :switch-value="messageSettings.sound"
          @switch-change="toggleSound"
        />
        <SettingsItem 
          title="振动"
          :switch-value="messageSettings.vibration"
          @switch-change="toggleVibration"
        />
      </div>

      <!-- 隐私 -->
      <div class="settings-section">
        <div class="section-title">隐私</div>
        <SettingsItem 
          title="隐私设置"
          description="朋友圈、通讯录权限等"
          @click="goToPrivacy"
        />
        <SettingsItem 
          title="个性化广告"
          :switch-value="privacySettings.personalizedAds"
          @switch-change="togglePersonalizedAds"
        />
      </div>

      <!-- 通用 -->
      <div class="settings-section">
        <div class="section-title">通用</div>
        <SettingsItem 
          title="通用设置"
          description="语言、字体大小等"
          @click="goToGeneral"
        />
        <SettingsItem 
          title="深色模式"
          :switch-value="generalSettings.darkMode"
          @switch-change="toggleDarkMode"
        />
        <SettingsItem 
          title="存储空间"
          description="已用 1.2GB"
          @click="goToStorage"
        />
      </div>

      <!-- 关于与帮助 -->
      <div class="settings-section">
        <SettingsItem 
          title="关于微信"
          description="版本 8.0.0"
          @click="goToAbout"
        />
        <SettingsItem 
          title="帮助与反馈"
          @click="goToHelp"
        />
      </div>

      <!-- 退出登录 -->
      <div class="logout-section">
        <button class="logout-button" @click="handleLogout">退出登录</button>
      </div>
    </main>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/composables/useStore'
import SettingsItem from '@/components/business/Me/SettingsItem.vue'

export default {
  name: 'Settings',
  components: {
    SettingsItem
  },
  setup() {
    const router = useRouter()
    const userStore = useUserStore()

    // 模拟设置数据
    const messageSettings = ref({
      notification: true,
      sound: true,
      vibration: false
    })

    const privacySettings = ref({
      personalizedAds: true
    })

    const generalSettings = ref({
      darkMode: false
    })

    const goBack = () => {
      router.push('/me')
    }

    const toggleNotification = (value) => {
      messageSettings.value.notification = value
      console.log('消息通知:', value ? '开' : '关')
    }

    const toggleSound = (value) => {
      messageSettings.value.sound = value
      console.log('声音:', value ? '开' : '关')
    }

    const toggleVibration = (value) => {
      messageSettings.value.vibration = value
      console.log('振动:', value ? '开' : '关')
    }

    const togglePersonalizedAds = (value) => {
      privacySettings.value.personalizedAds = value
      console.log('个性化广告:', value ? '开' : '关')
    }

    const toggleDarkMode = (value) => {
      generalSettings.value.darkMode = value
      console.log('深色模式:', value ? '开' : '关')
      // 实际实现中应该切换主题
    }

    const goToAccountSecurity = () => {
      console.log('跳转到账号与安全')
    }

    const goToPrivacy = () => {
      console.log('跳转到隐私设置')
    }

    const goToGeneral = () => {
      console.log('跳转到通用设置')
    }

    const goToStorage = () => {
      console.log('跳转到存储空间')
    }

    const goToAbout = () => {
      console.log('跳转到关于微信')
    }

    const goToHelp = () => {
      console.log('跳转到帮助与反馈')
    }

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
      handleLogout
    }
  }
}
</script>

<style scoped>
.settings-page {
  height: 100vh;
  background-color: var(--wechat-bg-color);
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