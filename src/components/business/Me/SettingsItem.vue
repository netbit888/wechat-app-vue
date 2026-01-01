<template>
  <div class="settings-item" @click="handleClick">
    <div class="item-content">
      <div class="item-title">{{ title }}</div>
      <div class="item-description" v-if="description">{{ description }}</div>
    </div>
    <div class="item-control">
      <div v-if="hasSwitch" class="switch-container">
        <input 
          type="checkbox" 
          :checked="switchValue"
          @change="handleSwitchChange"
          class="switch-input"
          id="switch"
        />
        <label for="switch" class="switch-label"></label>
      </div>
      <span v-else class="arrow">›</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingsItem',
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    switchValue: {
      type: Boolean,
      default: false
    },
    hasSwitch: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click', 'switch-change'],
  methods: {
    handleClick() {
      if (!this.hasSwitch) {
        this.$emit('click')
      }
    },
    handleSwitchChange(event) {
      this.$emit('switch-change', event.target.checked)
    }
  }
}
</script>

<style scoped>
.settings-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid var(--wechat-border-color);
  cursor: pointer;
  transition: background-color 0.3s;
  background-color: white;
}

.settings-item:hover {
  background-color: #f5f5f5;
}

.settings-item:last-child {
  border-bottom: none;
}

.item-content {
  flex: 1;
}

.item-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
}

.item-description {
  font-size: 14px;
  color: var(--wechat-text-secondary);
}

.item-control {
  display: flex;
  align-items: center;
}

.arrow {
  font-size: 18px;
  color: var(--wechat-text-secondary);
  font-weight: bold;
}

/* 开关样式 */
.switch-container {
  position: relative;
  display: inline-block;
}

.switch-input {
  display: none;
}

.switch-label {
  display: block;
  width: 50px;
  height: 26px;
  background-color: #ccc;
  border-radius: 13px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s;
}

.switch-label::after {
  content: '';
  position: absolute;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: white;
  top: 2px;
  left: 2px;
  transition: transform 0.3s;
}

.switch-input:checked + .switch-label {
  background-color: var(--wechat-primary-color);
}

.switch-input:checked + .switch-label::after {
  transform: translateX(24px);
}
</style>