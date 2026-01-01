<template>
  <button 
    :class="[
      'wechat-button',
      `wechat-button--${type}`,
      `wechat-button--${size}`,
      {
        'wechat-button--disabled': disabled,
        'wechat-button--block': block
      }
    ]" 
    :disabled="disabled"
    @click="handleClick"
  >
    <span class="wechat-button__content">
      <slot></slot>
    </span>
  </button>
</template>

<script>
export default {
  name: 'WeChatButton',
  props: {
    type: {
      type: String,
      default: 'default', // default, primary, text
      validator: (value) => ['default', 'primary', 'text'].includes(value)
    },
    size: {
      type: String,
      default: 'medium', // small, medium, large
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    },
    block: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick(event) {
      if (!this.disabled) {
        this.$emit('click', event)
      }
    }
  }
}
</script>

<style scoped>
.wechat-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 4px;
  padding: 0 16px;
  font-size: 14px;
  line-height: 1.4;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
  position: relative;
  overflow: hidden;
}

.wechat-button--block {
  display: flex;
  width: 100%;
}

/* 尺寸样式 */
.wechat-button--small {
  height: 32px;
  padding: 0 12px;
  font-size: 12px;
}

.wechat-button--medium {
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
}

.wechat-button--large {
  height: 48px;
  padding: 0 20px;
  font-size: 16px;
}

/* 类型样式 */
.wechat-button--default {
  background-color: #fff;
  color: #333;
  border: 1px solid #ddd;
}

.wechat-button--default:hover:not(.wechat-button--disabled) {
  background-color: #f5f5f5;
}

.wechat-button--primary {
  background-color: var(--wechat-primary-color, #07c160);
  color: white;
}

.wechat-button--primary:hover:not(.wechat-button--disabled) {
  background-color: #06ae56;
  opacity: 0.9;
}

.wechat-button--text {
  background-color: transparent;
  color: var(--wechat-primary-color, #07c160);
  border: none;
}

.wechat-button--text:hover:not(.wechat-button--disabled) {
  background-color: rgba(7, 193, 96, 0.1);
}

/* 禁用状态 */
.wechat-button--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>