<template>
  <div class="scan-page">
    <header class="scan-header">
      <button class="back-button" @click="goBack">⬅</button>
      <h1>扫一扫</h1>
      <button class="album-button" @click="openAlbum">相册</button>
    </header>

    <main class="scan-content">
      <!-- 扫描区域 -->
      <div class="scan-area">
        <div class="scan-frame">
          <div class="frame-corner top-left"></div>
          <div class="frame-corner top-right"></div>
          <div class="frame-corner bottom-left"></div>
          <div class="frame-corner bottom-right"></div>
          
          <!-- 扫描线动画 -->
          <div class="scan-line" ref="scanLine"></div>
        </div>
        
        <div class="scan-tip">
          将二维码/条形码放入框内，即可自动扫描
        </div>
      </div>

      <!-- 功能按钮 -->
      <div class="scan-actions">
        <button class="scan-action" @click="toggleFlash">
          <div class="action-icon">{{ isFlashOn ? '💡' : '🔦' }}</div>
          <div class="action-label">{{ isFlashOn ? '关闭' : '打开' }}</div>
        </button>
        
        <button class="scan-action" @click="createQRCode">
          <div class="action-icon">📱</div>
          <div class="action-label">我的二维码</div>
        </button>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Scan',
  setup() {
    const router = useRouter()
    const isFlashOn = ref(false)
    const scanLine = ref(null)
    let animationFrame = null

    // 使用CSS动画更流畅
    const startScanAnimation = () => {
      scanLine.value.style.animation = 'scan 2s linear infinite'
    }

    const goBack = () => {
      router.back()
    }

    const openAlbum = () => {
      console.log('打开相册选择图片')
    }

    const toggleFlash = () => {
      isFlashOn.value = !isFlashOn.value
      console.log('闪光灯状态:', isFlashOn.value ? '开' : '关')
    }

    const createQRCode = () => {
      console.log('生成我的二维码')
      router.push('/me/qrcode')
    }

    onMounted(() => {
      startScanAnimation()
    })

    onUnmounted(() => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    })

    return {
      scanLine,
      isFlashOn,
      goBack,
      openAlbum,
      toggleFlash,
      createQRCode
    }
  }
}
</script>

<style scoped>
:root {
  --wechat-primary: #07c160;
  --wechat-bg-dark: #000000;
}

.scan-page {
  height: 100vh;
  background-color: var(--wechat-bg-dark);
  color: white;
  position: relative;
}

/* 头部导航 - 微信标准 */
.scan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  background-color: rgba(0, 0, 0, 0.85);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  height: 44px;
  box-sizing: border-box;
}

.back-button, .album-button {
  background: none;
  border: none;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  padding: 5px 10px;
  font-weight: normal;
  transition: opacity 0.2s;
}

.back-button:hover, .album-button:hover {
  opacity: 0.7;
}

.scan-header h1 {
  font-size: 17px;
  font-weight: 500;
  color: #fff;
  margin: 0;
}

/* 扫描内容区域 */
.scan-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: calc(100vh - 44px);
  padding: 60px 20px 40px;
  box-sizing: border-box;
}

.scan-area {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.scan-frame {
  width: 260px;
  height: 260px;
  position: relative;
  margin-bottom: 24px;
}

/* 四个角装饰 - 微信绿色 */
.frame-corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 3px solid var(--wechat-primary);
}

.top-left {
  top: 0;
  left: 0;
  border-right: none;
  border-bottom: none;
}

.top-right {
  top: 0;
  right: 0;
  border-left: none;
  border-bottom: none;
}

.bottom-left {
  bottom: 0;
  left: 0;
  border-right: none;
  border-top: none;
}

.bottom-right {
  bottom: 0;
  right: 0;
  border-left: none;
  border-top: none;
}

/* 扫描线 - 微信绿色渐变 */
.scan-line {
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(to right, transparent, var(--wechat-primary), transparent);
  box-shadow: 0 0 8px var(--wechat-primary);
}

/* 提示文字 */
.scan-tip {
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  line-height: 1.5;
  max-width: 260px;
}

/* 功能按钮区域 */
.scan-actions {
  display: flex;
  justify-content: center;
  gap: 60px;
  width: 100%;
}

.scan-action {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  text-align: center;
  padding: 10px;
  transition: transform 0.2s;
}

.scan-action:hover {
  transform: scale(1.1);
}

.action-icon {
  font-size: 28px;
  margin-bottom: 8px;
  display: block;
}

.action-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.2;
}

/* CSS动画 */
@keyframes scan {
  0% { top: 0%; }
  100% { top: 100%; }
}
</style>