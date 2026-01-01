<template>
  <div class="wechat-badge-wrapper">
    <slot></slot>
    <span 
      v-if="showBadge"
      :class="[
        'wechat-badge',
        `wechat-badge--${type}`,
        `wechat-badge--${size}`,
        { 
          'wechat-badge--dot': dot,
          'wechat-badge--fixed': $slots.default
        }
      ]"
    >
      {{ displayContent }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'WeChatBadge',
  props: {
    count: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 99
    },
    dot: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'error', // error, primary, warning
      validator: (value) => ['error', 'primary', 'warning'].includes(value)
    },
    size: {
      type: String,
      default: 'medium', // small, medium
      validator: (value) => ['small', 'medium'].includes(value)
    },
    showZero: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    showBadge() {
      if (this.dot) return true
      if (this.count === 0) return this.showZero
      return this.count > 0
    },
    displayContent() {
      if (this.dot) return ''
      if (this.count > this.max) return `${this.max}+`
      return this.count.toString()
    }
  }
}
</script>

<style scoped>
.wechat-badge-wrapper {
  position: relative;
  display: inline-block;
}

.wechat-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-weight: 500;
  white-space: nowrap;
}

.wechat-badge--fixed {
  position: absolute;
  top: -6px;
  right: -6px;
  transform: translate(50%, -50%);
  z-index: 1;
}

/* 类型样式 */
.wechat-badge--error {
  background-color: #fa5151;
  color: white;
}

.wechat-badge--primary {
  background-color: var(--wechat-primary-color, #07c160);
  color: white;
}

.wechat-badge--warning {
  background-color: #ffc300;
  color: #333;
}

/* 尺寸样式 */
.wechat-badge--small {
  height: 16px;
  min-width: 16px;
  padding: 0 4px;
  font-size: 10px;
  line-height: 1;
}

.wechat-badge--medium {
  height: 18px;
  min-width: 18px;
  padding: 0 6px;
  font-size: 11px;
  line-height: 1;
}

.wechat-badge--dot {
  width: 8px;
  height: 8px;
  min-width: auto;
  padding: 0;
  border-radius: 50%;
}

.wechat-badge--dot.wechat-badge--small {
  width: 6px;
  height: 6px;
}

.wechat-badge--dot.wechat-badge--medium {
  width: 8px;
  height: 8px;
}
</style>