<template>
  <div class="menu-item" @click="handleClick">
    <div class="item-left">
      <div class="item-icon">{{ icon }}</div>
      <div class="item-title">{{ title }}</div>
    </div>
    <div class="item-right">
      <div class="item-description" v-if="description">{{ description }}</div>
      <Badge v-if="badge" :count="badge" type="error" />
      <span class="arrow">›</span>
    </div>
  </div>
</template>

<script>
import Badge from '@/components/ui/Badge/Badge.vue'

export default {
  name: 'MenuItem',
  components: {
    Badge
  },
  props: {
    icon: {
      type: String,
      default: '📱'
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
      default: ''
    }
  },
  emits: ['click'],
  methods: {
    handleClick() {
      this.$emit('click')
    }
  }
}
</script>

<style scoped>
.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid var(--wechat-border-color);
  cursor: pointer;
  transition: background-color 0.3s;
  background-color: white;
}

.menu-item:hover {
  background-color: #f5f5f5;
}

.menu-item:last-child {
  border-bottom: none;
}

.item-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.item-icon {
  font-size: 20px;
  margin-right: 12px;
  width: 24px;
  text-align: center;
}

.item-title {
  font-size: 16px;
  font-weight: 500;
}

.item-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-description {
  font-size: 14px;
  color: var(--wechat-text-secondary);
}

.arrow {
  font-size: 18px;
  color: var(--wechat-text-secondary);
  font-weight: bold;
}
</style>