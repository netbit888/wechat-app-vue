<template>
  <div class="wallet-page">
    <header class="wallet-header">
      <button class="back-button" @click="goBack">⬅</button>
      <h1>钱包</h1>
    </header>

    <main class="wallet-content">
      <div class="balance-section">
        <div class="balance-title">零钱</div>
        <div class="balance-amount">¥ 29,234.86</div>
        <div class="balance-actions">
          <button class="action-button">充值</button>
          <button class="action-button">提现</button>
        </div>
      </div>

      <div class="function-section">
        <div class="function-grid">
          <div class="function-item">
            <div class="function-icon">💳</div>
            <div class="function-label">银行卡</div>
          </div>
          <div class="function-item">
            <div class="function-icon">📱</div>
            <div class="function-label">手机充值</div>
          </div>
          <div class="function-item">
            <div class="function-icon">🏪</div>
            <div class="function-label">生活缴费</div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'Wallet',
  setup() {
    const router = useRouter()

    const goBack = () => {
      router.push('/me')
    }

    return {
      goBack
    }
  }
}
</script>

<style scoped>
.wallet-page {
  height: 100vh;
  background-color: var(--wechat-bg-color);
}

.wallet-header {
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

.wallet-header h1 {
  font-size: 18px;
  font-weight: normal;
  margin: 0;
}

.wallet-content {
  padding: 20px;
}

.balance-section {
  background: linear-gradient(135deg, #07c160 0%, #06ae56 100%);
  border-radius: 10px;
  padding: 20px;
  color: white;
  margin-bottom: 20px;
}

.balance-title {
  font-size: 16px;
  margin-bottom: 10px;
  opacity: 0.9;
}

.balance-amount {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 20px;
}

.balance-actions {
  display: flex;
  gap: 10px;
}

.action-button {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
}

.action-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.function-section {
  background-color: white;
  border-radius: 10px;
  padding: 15px;
}

.function-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.function-item {
  text-align: center;
  cursor: pointer;
  padding: 10px;
}

.function-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.function-label {
  font-size: 12px;
  color: var(--wechat-text-secondary);
}
</style>