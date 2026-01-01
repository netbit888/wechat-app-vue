<template>
  <div class="time-divider">
    <span class="time-text">{{ formatTime(time) }}</span>
  </div>
</template>

<script>
import { formatDate } from '@/utils/date'

export default {
  name: 'TimeDivider',
  props: {
    time: {
      type: String,
      required: true
    }
  },
  methods: {
    formatTime(timeString) {
      return formatDate(timeString, 'date')
    }
  }
}
</script>

<style scoped>
.time-divider {
  text-align: center;
  margin: 20px 0;
  position: relative;
}

.time-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: var(--wechat-border-color);
  z-index: 1;
}

.time-text {
  background-color: var(--wechat-bg-color);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  color: var(--wechat-text-secondary);
  position: relative;
  z-index: 2;
}
</style>