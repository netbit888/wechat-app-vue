<template>
  <div class="profile-page">
    <!-- 顶部导航栏 -->
    <header class="sub-header">
      <button class="back-btn" @click="$router.back()">⬅</button>
      <h2>个人资料</h2>
    </header>
    
    <!-- 个人资料列表 -->
    <main class="profile-content">
      <!-- 头像 -->
      <div class="profile-section">
        <SettingsItem 
          title="头像" 
          @click="goToAvatarSetting"
        >
          <template #suffix>
            <div class="avatar-preview">
              <img :src="userInfo.avatar || 'https://picsum.photos/200/200'" alt="头像" />
            </div>
            <span class="arrow">›</span>
          </template>
        </SettingsItem>
        
        <!-- 名字 -->
        <SettingsItem 
          title="名字" 
          :description="userInfo.nickname || '未设置'" 
          @click="goToNameSetting"
        />
        
        <!-- 性别 -->
        <SettingsItem 
          title="性别" 
          :description="formatGender(userInfo.gender)" 
          @click="goToGenderSetting"
        />
        
        <!-- 地区 -->
        <SettingsItem 
          title="地区" 
          :description="userInfo.region || '未设置'" 
          @click="goToRegionSetting"
        />
      </div>
      
      <div class="profile-section">
        <!-- 手机号 -->
        <SettingsItem 
          title="手机号" 
          :description="formatPhone(userInfo.phone) || '未设置'" 
          @click="goToPhoneSetting"
        />
        
        <!-- 微信号 -->
        <SettingsItem 
          title="微信号" 
          :description="userInfo.wechatId || '未设置'" 
          @click="goToWechatIdSetting"
        />
      </div>
      
      <div class="profile-section">
        <!-- 我的二维码 -->
        <SettingsItem 
          title="我的二维码" 
          @click="showQRCode"
        >
          <template #suffix>
            <span class="qr-icon">📷</span>
            <span class="arrow">›</span>
          </template>
        </SettingsItem>
        
        <!-- 拍一拍 -->
        <SettingsItem 
          title="拍一拍" 
          @click="goToPatSetting"
        />
        
        <!-- 签名 -->
        <SettingsItem 
          title="签名" 
          :description="userInfo.signature || '未填写'" 
          @click="goToSignatureSetting"
        />
      </div>
      
      <div class="profile-section">
        <!-- 来电铃声 -->
        <SettingsItem 
          title="来电铃声" 
          @click="goToRingtoneSetting"
        />
        
        <!-- 我的地址 -->
        <SettingsItem 
          title="我的地址" 
          @click="goToAddressSetting"
        />
        
        <!-- 我的发票抬头 -->
        <SettingsItem 
          title="我的发票抬头" 
          @click="goToInvoiceSetting"
        />
        
        <!-- 微信豆 -->
        <SettingsItem 
          title="微信豆" 
          :description="userInfo.wechatBeans || '0 个'" 
          @click="goToWechatBeansSetting"
        />
      </div>
    </main>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/composables/useStore'
import SettingsItem from '@/components/business/Me/SettingsItem.vue'

export default {
  name: 'Profile',
  components: { SettingsItem },
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    
    const userInfo = computed(() => userStore.currentUser || {})
    
    // 格式化手机号，中间显示为****
    const formatPhone = (phone) => {
      if (!phone) return ''
      return phone.replace(/(\d{3})\d{6}(\d{2})/, '$1******$2')
    }
    
    // 格式化性别显示
    const formatGender = (gender) => {
      if (!gender) return '未设置'
      return gender === 1 ? '男' : gender === 2 ? '女' : '未设置'
    }
    
    // 从数据库获取用户信息
    const fetchUserInfo = async () => {
      try {
        await userStore.getProfile()
      } catch (error) {
        console.error('获取用户信息失败:', error)
      }
    }
    
    // 组件挂载时获取用户信息
    onMounted(() => {
      fetchUserInfo()
    })
    
    // 头像设置
    const goToAvatarSetting = () => {
      console.log('跳转到头像设置')
      // 实际实现中应该跳转到头像设置页面
    }
    
    // 名字设置
    const goToNameSetting = () => {
      console.log('跳转到名字设置')
    }
    
    // 性别设置
    const goToGenderSetting = () => {
      console.log('跳转到性别设置')
    }
    
    // 地区设置
    const goToRegionSetting = () => {
      console.log('跳转到地区设置')
    }
    
    // 手机号设置
    const goToPhoneSetting = () => {
      console.log('跳转到手机号设置')
    }
    
    // 微信号设置
    const goToWechatIdSetting = () => {
      console.log('跳转到微信号设置')
    }
    
    // 显示二维码
    const showQRCode = () => {
      console.log('显示二维码')
    }
    
    // 拍一拍设置
    const goToPatSetting = () => {
      console.log('跳转到拍一拍设置')
    }
    
    // 签名设置
    const goToSignatureSetting = () => {
      console.log('跳转到签名设置')
    }
    
    // 来电铃声设置
    const goToRingtoneSetting = () => {
      console.log('跳到来电铃声设置')
    }
    
    // 我的地址设置
    const goToAddressSetting = () => {
      console.log('跳转到我的地址设置')
    }
    
    // 我的发票抬头设置
    const goToInvoiceSetting = () => {
      console.log('跳转到我的发票抬头设置')
    }
    
    // 微信豆设置
    const goToWechatBeansSetting = () => {
      console.log('跳转到微信豆设置')
    }
    
    return {
      userInfo,
      formatPhone,
      formatGender,
      goToAvatarSetting,
      goToNameSetting,
      goToGenderSetting,
      goToRegionSetting,
      goToPhoneSetting,
      goToWechatIdSetting,
      showQRCode,
      goToPatSetting,
      goToSignatureSetting,
      goToRingtoneSetting,
      goToAddressSetting,
      goToInvoiceSetting,
      goToWechatBeansSetting
    }
  }
}
</script>

<style scoped>
.profile-page {
  height: 100vh;
  background-color: var(--wechat-bg-color);
  display: flex;
  flex-direction: column;
}

.sub-header {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background: #fff;
  border-bottom: 1px solid var(--wechat-border-color);
}

.back-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  margin-right: 10px;
}

.sub-header h2 {
  font-size: 18px;
  font-weight: 500;
  margin: 0;
  flex: 1;
  text-align: center;
}

.profile-content {
  flex: 1;
  overflow-y: auto;
}

.profile-section {
  margin-bottom: 20px;
  background-color: white;
}

/* 头像预览样式 */
.avatar-preview {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 10px;
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 扩展SettingsItem组件，支持自定义后缀 */
:deep(.settings-item) {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.item-content) {
  flex: 1;
}

:deep(.item-control) {
  display: flex;
  align-items: center;
}

.arrow {
  font-size: 18px;
  color: var(--wechat-text-secondary);
  font-weight: bold;
}

.qr-icon {
  font-size: 16px;
  margin-right: 5px;
  color: var(--wechat-text-primary);
}
</style>