<template>
  <div class="discover-item" @click="$emit('click')">
    <div class="item-icon">
      <span class="icon">{{ icon }}</span>
    </div>
    <div class="item-content">
      <div class="item-title">
        {{ title }}
        <span v-if="badge" class="badge">{{ badgeText }}</span>
      </div>
      <div class="item-description">{{ description }}</div>
    </div>
    <div class="item-arrow">›</div>
  </div>
</template>

<script>
export default {
  name: 'DiscoverItem',
  props: {
    icon: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    badge: {
      type: [String, Number],
      default: null
    }
  },
  computed: {
    badgeText() {
      if (this.badge === 'hot') return '热门'
      if (this.badge > 99) return '99+'
      return this.badge.toString()
    }
  }
}
</script>

<style scoped>
:root {
  --wechat-bg: #ededed;
  --wechat-border: #d6d6d6;
  --wechat-border-light: #e5e5e5;
  --wechat-text-primary: #000000;
  --wechat-text-secondary: #999999;
  --wechat-badge: #fa5151;
  --wechat-cell-hover: #d9d9d9;
  --wechat-cell-active: #b2b2b2;
}

.discover-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  background-color: white;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
  height: 56px;
  box-sizing: border-box;
}

.discover-item:not(:last-child)::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 60px; /* 图标宽度 + 边距 */
  right: 0;
  height: 1px;
  background-color: var(--wechat-border-light);
}

.discover-item:hover {
  background-color: var(--wechat-cell-hover);
}

.discover-item:active {
  background-color: var(--wechat-cell-active);
}

/* 图标 */
.item-icon {
  width: 28px;
  height: 28px;
  margin-right: 15px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-icon .icon {
  font-size: 24px;
  line-height: 1;
}

/* 内容区域 */
.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.item-title {
  font-size: 16px;
  color: var(--wechat-text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
  line-height: 1.4;
}

.item-description {
  font-size: 13px;
  color: var(--wechat-text-secondary);
  margin-top: 2px;
  line-height: 1.4;
}

/* 箭头 */
.item-arrow {
  font-size: 20px;
  color: var(--wechat-text-secondary);
  margin-left: 10px;
  flex-shrink: 0;
  font-weight: 300;
}

/* Badge */
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 6px;
  background-color: var(--wechat-badge);
  color: white;
  border-radius: 9px;
  font-size: 12px;
  font-weight: normal;
  line-height: 1;
}

.badge:empty {
  display: none;
}
</style>