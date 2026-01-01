<template>
  <div class="message-bubble" :class="bubbleClasses">
    <!-- 消息状态指示器 -->
    <div v-if="isOwn" class="message-status">
      <span v-if="message.status === 'sending'" class="status-sending">🕐</span>
      <span v-else-if="message.status === 'sent'" class="status-sent">✓</span>
      <span v-else-if="message.status === 'read'" class="status-read">✓✓</span>
      <span v-else-if="message.status === 'error'" class="status-error">❗</span>
    </div>
    
    <!-- 消息内容 -->
    <div class="bubble-content" :class="contentClasses">
      <!-- 文本消息 -->
      <div v-if="message.type === 'text'" class="text-message">
        {{ message.content }}
      </div>
      
      <!-- 图片消息 -->
      <div v-else-if="message.type === 'image'" class="image-message">
        <div class="image-placeholder">🖼️ [图片]</div>
        <div class="image-size">1.2MB</div>
      </div>
      
      <!-- 语音消息 -->
      <div v-else-if="message.type === 'voice'" class="voice-message">
        <span class="voice-icon">🎵</span>
        <div class="voice-duration">1:23</div>
        <div class="voice-wave"></div>
      </div>
      
      <!-- 文件消息 -->
      <div v-else-if="message.type === 'file'" class="file-message">
        <div class="file-icon">📎</div>
        <div class="file-info">
          <div class="file-name">{{ message.content.name || '文件' }}</div>
          <div class="file-size">{{ message.content.size || '1.5MB' }}</div>
        </div>
        <button class="download-btn">下载</button>
      </div>
      
      <!-- 时间戳 -->
      <div class="message-time">
        {{ formatTime(message.time) }}
      </div>
    </div>
    
    <!-- 重发按钮 -->
    <div v-if="showResend" class="resend-action">
      <button @click="handleResend" class="resend-btn">重发</button>
    </div>
  </div>
</template>

<script>
import { formatDate } from '@/utils/date'

export default {
  name: 'MessageBubble',
  props: {
    message: {
      type: Object,
      required: true
    },
    isOwn: {
      type: Boolean,
      default: false
    }
  },
  emits: ['resend'],
  computed: {
    bubbleClasses() {
      return {
        'message-bubble-own': this.isOwn,
        'message-bubble-other': !this.isOwn,
        'message-bubble-error': this.message.status === 'error'
      }
    },
    contentClasses() {
      return {
        'bubble-content-own': this.isOwn,
        'bubble-content-other': !this.isOwn
      }
    },
    showResend() {
      return this.isOwn && this.message.status === 'error'
    }
  },
  methods: {
    formatTime(timeString) {
      return formatDate(timeString, 'time')
    },
    handleResend() {
      this.$emit('resend', this.message)
    }
  }
}
</script>

<style scoped>
.message-bubble {
  display: flex;
  align-items: flex-start;
  max-width: 70%;
  gap: 8px;
}

.message-bubble-own {
  margin-left: auto;
  flex-direction: row-reverse;
}

.message-status {
  display: flex;
  align-items: flex-end;
  padding-bottom: 2px;
  font-size: 12px;
}

.status-sending {
  color: var(--wechat-text-secondary);
  animation: pulse 1.5s infinite;
}

.status-sent {
  color: var(--wechat-text-secondary);
}

.status-read {
  color: var(--wechat-primary-color);
}

.status-error {
  color: var(--wechat-error-color);
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.bubble-content {
  padding: 10px 14px;
  border-radius: 18px;
  position: relative;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  word-wrap: break-word;
}

.bubble-content-own {
  background-color: #95ec69;
  border-bottom-right-radius: 4px;
}

.bubble-content-other {
  background-color: white;
  border-bottom-left-radius: 4px;
}

.message-bubble-error .bubble-content-own {
  background-color: #ffebee;
  border: 1px solid var(--wechat-error-color);
}

.text-message {
  line-height: 1.4;
  margin-bottom: 4px;
}

.image-message, .voice-message, .file-message {
  display: flex;
  align-items: center;
  gap: 8px;
}

.image-placeholder {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.image-size {
  font-size: 12px;
  color: var(--wechat-text-secondary);
}

.voice-message {
  cursor: pointer;
}

.voice-icon {
  font-size: 18px;
}

.voice-duration {
  font-size: 12px;
  color: var(--wechat-text-secondary);
}

.voice-wave {
  flex: 1;
  height: 4px;
  background: linear-gradient(90deg, #ccc 50%, transparent 50%);
  background-size: 10px 100%;
  border-radius: 2px;
}

.file-message {
  padding: 8px;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 8px;
  min-width: 200px;
}

.file-icon {
  font-size: 20px;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-size {
  font-size: 12px;
  color: var(--wechat-text-secondary);
}

.download-btn {
  background: var(--wechat-primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
}

.message-time {
  font-size: 11px;
  color: var(--wechat-text-secondary);
  text-align: right;
  margin-top: 4px;
}

.resend-action {
  display: flex;
  align-items: center;
}

.resend-btn {
  background: var(--wechat-error-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
}

/* 气泡小三角 */
.bubble-content-own::before {
  content: '';
  position: absolute;
  right: -8px;
  top: 10px;
  width: 0;
  height: 0;
  border-left: 8px solid #95ec69;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
}

.bubble-content-other::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 10px;
  width: 0;
  height: 0;
  border-right: 8px solid white;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
}
</style>