<template>
  <div class="search-bar">
    <div class="search-input-container">
      <span class="search-icon">🔍</span>
      <input
        v-model="inputValue"
        type="text"
        class="search-input"
        :placeholder="placeholder"
        @input="handleInput"
        @keyup.enter="handleSearch"
      />
      <button v-if="inputValue" class="clear-button" @click="clearInput">×</button>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'SearchBar',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '搜索'
    }
  },
  emits: ['update:modelValue', 'search'],
  setup(props, { emit }) {
    const inputValue = ref(props.modelValue)

    // 监听外部modelValue变化
    watch(() => props.modelValue, (newValue) => {
      inputValue.value = newValue
    })

    const handleInput = () => {
      emit('update:modelValue', inputValue.value)
    }

    const handleSearch = () => {
      emit('search', inputValue.value)
    }

    const clearInput = () => {
      inputValue.value = ''
      emit('update:modelValue', '')
      emit('search', '')
    }

    return {
      inputValue,
      handleInput,
      handleSearch,
      clearInput
    }
  }
}
</script>

<style scoped>
.search-bar {
  width: 100%;
}

.search-input-container {
  position: relative;
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 4px;
  padding: 8px 12px;
  border: 1px solid var(--wechat-border-color);
}

.search-icon {
  margin-right: 8px;
  color: var(--wechat-text-secondary);
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  background: transparent;
}

.search-input::placeholder {
  color: var(--wechat-text-secondary);
}

.clear-button {
  background: none;
  border: none;
  font-size: 18px;
  color: var(--wechat-text-secondary);
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.clear-button:hover {
  background-color: var(--wechat-bg-color);
}
</style>