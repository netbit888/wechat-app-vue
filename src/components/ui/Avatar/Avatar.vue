<template>
  <div 
    :class="[
      'wechat-avatar',
      `wechat-avatar--${size}`,
      { 'wechat-avatar--round': round }
    ]" 
    :style="avatarStyle"
  >
    <img 
      v-if="src" 
      :src="src" 
      :alt="alt"
      @error="handleImageError"
    >
    <span v-else class="wechat-avatar__text">
      {{ displayText }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'WeChatAvatar',
  props: {
    src: {
      type: String,
      default: ''
    },
    alt: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'medium', // small, medium, large, xlarge
      validator: (value) => ['small', 'medium', 'large', 'xlarge'].includes(value)
    },
    round: {
      type: Boolean,
      default: true
    },
    text: {
      type: String,
      default: ''
    },
    backgroundColor: {
      type: String,
      default: '#ccc'
    },
    color: {
      type: String,
      default: '#fff'
    }
  },
  data() {
    return {
      imageLoaded: true
    }
  },
  computed: {
    displayText() {
      if (this.text) {
        return this.text.charAt(0).toUpperCase()
      }
      return '?'
    },
    avatarStyle() {
      if (!this.src || !this.imageLoaded) {
        return {
          backgroundColor: this.backgroundColor,
          color: this.color
        }
      }
      return {}
    }
  },
  methods: {
    handleImageError() {
      this.imageLoaded = false
    }
  }
}
</script>

<style scoped>
.wechat-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #ddd;
  color: white;
  font-weight: 500;
  overflow: hidden;
  flex-shrink: 0;
}

.wechat-avatar--round {
  border-radius: 50%;
}

.wechat-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.wechat-avatar__text {
  font-weight: 500;
}

/* 尺寸样式 */
.wechat-avatar--small {
  width: 32px;
  height: 32px;
  font-size: 12px;
}

.wechat-avatar--medium {
  width: 44px;
  height: 44px;
  font-size: 14px;
}

.wechat-avatar--large {
  width: 64px;
  height: 64px;
  font-size: 18px;
}

.wechat-avatar--xlarge {
  width: 80px;
  height: 80px;
  font-size: 24px;
}
</style>