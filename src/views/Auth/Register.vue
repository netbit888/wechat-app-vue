<!-- 微信注册页 -->
<template>
  <div class="register-container">
    <!-- 状态栏占位 -->
    <div class="status-bar"></div>

    <!-- 头部 -->
    <div class="header">
      <button class="back-btn" @click="router.back()">←</button>
      <h1 class="title">注册</h1>
    </div>

    <!-- 主内容 -->
    <div class="main-content">
      <div class="tips">
        <p class="tips-title">创建微信账号</p>
      </div>

      <form class="form-section" @submit.prevent="handleRegister">
        <!-- 用户名输入 -->
        <div class="input-wrapper">
          <input
            v-model="form.wechatId"
            type="text"
            class="input-field"
            placeholder="设置微信号（4-20位）"
            maxlength="20"
            @focus="onFocus"
            @blur="onBlur"
          >
          <span v-if="form.wechatId" class="clear-btn" @click="form.wechatId = ''">✕</span>
        </div>

        <!-- 昵称输入 -->
        <div class="input-wrapper">
          <input
            v-model="form.nickname"
            type="text"
            class="input-field"
            placeholder="设置名字（2-20位）"
            maxlength="20"
            @focus="onFocus"
            @blur="onBlur"
          >
          <span v-if="form.nickname" class="clear-btn" @click="form.nickname = ''">✕</span>
        </div>

        <!-- 密码输入 -->
        <div class="input-wrapper">
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            class="input-field"
            placeholder="设置密码（6-20位）"
            maxlength="20"
            @focus="onFocus"
            @blur="onBlur"
          >
          <span class="eye-btn" @click="showPassword = !showPassword">
            {{ showPassword ? '🙈' : '👁️' }}
          </span>
        </div>

        <!-- 确认密码 -->
        <div class="input-wrapper">
          <input
            v-model="form.confirmPassword"
            :type="showPassword ? 'text' : 'password'"
            class="input-field"
            placeholder="确认密码"
            maxlength="20"
            @keypress.enter="handleRegister"
          >
          <span class="eye-btn" @click="showPassword = !showPassword">
            {{ showPassword ? '🙈' : '👁️' }}
          </span>
        </div>

        <!-- 注册按钮 -->
        <button
          type="submit"
          class="register-btn"
          :class="{ active: canRegister && !submitting, pressed: buttonPressed }"
          :disabled="!canRegister || submitting"
          @touchstart="onButtonPress"
          @touchend="onButtonRelease"
        >
          <span class="btn-text">{{ submitting ? '注册中...' : '注册' }}</span>
          <div v-if="submitting" class="loading-spinner"></div>
        </button>
      </form>

      <!-- 协议 -->
      <div class="agreement">
        <label class="agreement-label">
          <input type="checkbox" v-model="agreed" class="checkbox">
          <span class="checkbox-icon"></span>
          <span class="agreement-text">
            我已阅读并同意
            <a class="agreement-link">《服务协议》</a>和
            <a class="agreement-link">《隐私政策》</a>
          </span>
        </label>
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
import { http } from '@/api/request.js';

const router = useRouter();
const store = useStore();

const form = reactive({
  wechatId: '',
  nickname: '',
  password: '',
  confirmPassword: ''
});

const submitting = ref(false);
const showPassword = ref(false);
const agreed = ref(true);
const error = ref('');
const buttonPressed = ref(false);

// 注册按钮状态
const canRegister = computed(() => {
  return form.wechatId.length >= 4 && 
         form.nickname.length >= 2 && 
         form.password.length >= 6 &&
         form.password === form.confirmPassword &&
         agreed.value;
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

// 处理注册
  const handleRegister = async () => {
    if (!canRegister.value) return;

    submitting.value = true;
    error.value = '';

    try {
      // ✅ 用户名注册请求格式
      const payload = {
        wechatId: form.wechatId,  // 用户名
        password: form.password,   // 密码
        nickname: form.nickname    // 昵称
      };

      if (import.meta.env.DEV) {
        console.log('注册请求:', payload);
      }

      // 通过 Store Action 处理注册
      const response = await store.dispatch('user/register', payload);
      
      if (import.meta.env.DEV) {
        console.log('注册响应:', response);
      }

      // 安全校验
      if (response?.token) {
        showToast('注册成功', 'success');
        
        setTimeout(() => {
          router.replace('/wechat');
        }, 500);
      } else {
        throw new Error(response?.error || '注册信息缺失');
      }
    } catch (err) {
      const errorMsg = err?.message || '注册失败';
      error.value = errorMsg;
      showToast(errorMsg, 'error');
      
      if (import.meta.env.DEV) {
        console.error('注册错误:', err);
      }
    } finally {
      submitting.value = false;
    }
  };
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  background: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Helvetica Neue', sans-serif;
}

/* 状态栏 */
.status-bar {
  height: constant(safe-area-inset-top);
  height: env(safe-area-inset-top);
  background: #000000;
}

/* 头部 */
.header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #ffffff;
  border-bottom: 1px solid #e5e5e5;
}

.back-btn {
  font-size: 24px;
  color: #576b95;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.title {
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  margin: 0;
}

/* 主内容 */
.main-content {
  padding: 32px 24px;
}

.tips {
  text-align: center;
  margin-bottom: 40px;
}

.tips-title {
  font-size: 22px;
  font-weight: 600;
  color: #000000;
  margin: 0 0 8px;
}

.tips-desc {
  font-size: 14px;
  color: #999999;
  margin: 0;
}

/* 表单 */
.form-section {
  margin-bottom: 32px;
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

/* 注册按钮 */
.register-btn {
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

.register-btn.active {
  opacity: 1;
}

.register-btn.active:hover {
  background: #06ad56;
}

.register-btn.active.pressed {
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

/* 协议 */
.agreement {
  padding: 0 4px;
}

.agreement-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 12px;
  color: #999999;
}

.checkbox {
  display: none;
}

.checkbox-icon {
  width: 16px;
  height: 16px;
  border: 1px solid #b2b2b2;
  border-radius: 2px;
  margin-right: 8px;
  position: relative;
  transition: all 0.2s;
}

.checkbox:checked + .checkbox-icon {
  background: #07c160;
  border-color: #07c160;
}

.checkbox:checked + .checkbox-icon::after {
  content: '✓';
  position: absolute;
  top: -2px;
  left: 2px;
  color: #ffffff;
  font-size: 12px;
}

.agreement-link {
  color: #576b95;
}

/* 错误提示 */
.error-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.85);
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 14px;
  z-index: 9999;
}
</style>