<!-- 微信登录页 - 仅保留核心功能 -->
<template>
  <div class="login-container">
    <!-- 状态栏占位 -->
    <div class="status-bar"></div>

    <!-- 主内容 -->
    <div class="main-content">
      <!-- Logo -->
      <div class="logo-section">
        <div class="wechat-logo">
          <svg class="wechat-icon" viewBox="0 0 64 64" fill="currentColor">
            <path d="M32 2C15.432 2 2 15.432 2 32s13.432 30 30 30 30-13.432 30-30S48.568 2 32 2zm24.337 39.93c.059.175.093.364.093.564 0 .78-.632 1.412-1.412 1.412H31.765c-.78 0-1.412-.632-1.412-1.412V31.765c0-.78.632-1.412 1.412-1.412h23.253c.78 0 1.412.632 1.412 1.412v8.165z"/>
          </svg>
        </div>
        <h1 class="app-title">微信</h1>
      </div>

      <!-- 登录表单 -->
      <div class="form-section">
        <!-- 用户名输入 -->
        <div class="input-wrapper">
          <input
            v-model="form.wechatId"
            type="text"
            class="input-field"
            placeholder="请输入微信号"
            maxlength="20"
            @focus="onFocus"
            @blur="onBlur"
          >
          <span v-if="form.wechatId" class="clear-btn" @click="form.wechatId = ''">✕</span>
        </div>

        <!-- 密码输入 -->
        <div class="input-wrapper">
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            class="input-field"
            placeholder="请输入密码"
            maxlength="20"
            @keypress.enter="handleLogin"
            @focus="onFocus"
            @blur="onBlur"
          >
          <span class="eye-btn" @click="showPassword = !showPassword">
            {{ showPassword ? '🙈' : '👁️' }}
          </span>
        </div>

        <!-- 登录按钮 -->
        <button
          class="login-btn"
          :class="{ active: canLogin && !loading, pressed: buttonPressed }"
          :disabled="!canLogin || loading"
          @click="handleLogin"
          @touchstart="onButtonPress"
          @touchend="onButtonRelease"
        >
          <span class="btn-text">{{ loading ? '登录中...' : '登录' }}</span>
          <div v-if="loading" class="loading-spinner"></div>
        </button>

        <!-- 辅助选项 -->
        <div class="form-options">
          <a class="link-text" @click="handleFindPassword">找回密码</a>
          <a class="link-text" @click="goToRegister">注册</a>
        </div>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="error-toast">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { showToast } from '@/utils/feedback.js';

const router = useRouter();
const store = useStore();

const form = reactive({
  wechatId: '',
  password: ''
});

const loading = ref(false);
const showPassword = ref(false);
const buttonPressed = ref(false);

// 登录按钮状态
const canLogin = computed(() => {
  return form.wechatId.length >= 4 && form.password.length >= 6;
});

// 输入框焦点效果
const onFocus = (e) => {
  e.target.parentElement.classList.add('focused');
};

const onBlur = (e) => {
  e.target.parentElement.classList.remove('focused');
};

// 按钮按压效果
const onButtonPress = () => {
  buttonPressed.value = true;
};

const onButtonRelease = () => {
  setTimeout(() => {
    buttonPressed.value = false;
  }, 100);
};

// 处理登录
const handleLogin = async () => {
  if (!canLogin.value) return;

  loading.value = true;
  try {
    const result = await store.dispatch('user/login', form);
    
    if (import.meta.env.DEV) {
      console.log('登录响应:', result);
    }

    if (result?.token) {
      // 双重保险存储
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user || {}));
      
      showToast('登录成功', 'success');
      
      setTimeout(() => {
        router.replace('/wechat');
      }, 300);
    } else {
      throw new Error('token获取失败');
    }
  } catch (err) {
    const errorMsg = err?.message || '登录失败';
    showToast(errorMsg, 'error');
    
    if (import.meta.env.DEV) {
      console.error('登录错误:', err);
    }
  } finally {
    loading.value = false;
  }
};

// 跳转到注册
const goToRegister = () => {
  router.push('/auth/register');
};

// 找回密码
const handleFindPassword = () => {
  showToast('找回密码功能开发中', 'info');
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Helvetica Neue', sans-serif;
}

/* 状态栏占位 */
.status-bar {
  height: constant(safe-area-inset-top);
  height: env(safe-area-inset-top);
  background: #000000;
}

/* 主内容区 */
.main-content {
  flex: 1;
  padding: 0 32px;
  margin-top: 80px; /* 增加顶部间距，使界面更居中 */
}

/* Logo区域 */
.logo-section {
  text-align: center;
  margin-bottom: 56px;
}

.wechat-logo {
  width: 86px;
  height: 86px;
  margin: 0 auto 12px;
  background: #07c160;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wechat-icon {
  width: 48px;
  height: 48px;
  color: #ffffff;
}

.app-title {
  font-size: 24px;
  font-weight: 600;
  color: #000000;
  margin: 0;
  letter-spacing: 2px;
}

/* 表单区域 */
.form-section {
  margin-bottom: 0; /* 移除底部间距 */
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  border-bottom: 1px solid #e5e5e5;
  transition: border-color 0.3s;
}

.input-wrapper.focused {
  border-bottom: 1px solid #07c160;
}

.input-field {
  flex: 1;
  height: 48px;
  border: none;
  outline: none;
  font-size: 16px;
  color: #000000;
  padding: 0 40px 0 0;
  background: transparent;
}

.input-field::placeholder {
  color: #b2b2b2;
  font-size: 16px;
}

/* 清除按钮 */
.clear-btn {
  position: absolute;
  right: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #e5e5e5;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
}

/* 密码可见按钮 */
.eye-btn {
  position: absolute;
  right: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b2b2b2;
  font-size: 18px;
  cursor: pointer;
}

/* 登录按钮 */
.login-btn {
  width: 100%;
  height: 48px;
  margin-top: 32px;
  background: #07c160;
  border: none;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.2s;
}

.login-btn.active {
  opacity: 1;
}

.login-btn.active:hover {
  background: #06ad56;
}

.login-btn.active.pressed {
  transform: scale(0.98);
  background: #05a04a;
}

.btn-text {
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
}

.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid #ffffff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-left: 8px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 表单选项 */
.form-options {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.link-text {
  color: #576b95;
  font-size: 14px;
  cursor: pointer;
}

.link-text:active {
  opacity: 0.6;
}

/* 响应式 */
@media (max-width: 375px) {
  .main-content {
    padding: 0 24px;
  }
}
</style>