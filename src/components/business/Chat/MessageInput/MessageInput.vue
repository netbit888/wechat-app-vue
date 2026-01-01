<template>
  <div class="message-input">
    <div class="input-toolbar">
      <button class="toolbar-button" @click="toggleEmoji">😊</button>
      <button class="toolbar-button" @click="showMoreOptions">➕</button>
    </div>
    
    <div class="input-container">
      <textarea 
        ref="textareaRef"
        v-model="inputText" 
        @keydown.enter.prevent="handleSend"
        @input="adjustHeight"
        placeholder="输入消息..." 
        class="text-input"
        rows="1"
      ></textarea>
      
      <button 
        @click="handleSend" 
        class="send-button"
        :disabled="!inputText.trim()"
      >
        {{ inputText.trim() ? '发送' : '🎤' }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, nextTick } from 'vue'

export default {
  name: 'MessageInput',
  emits: ['send-message'],
  setup(props, { emit }) {
    const inputText = ref('')
    const textareaRef = ref(null)

    const handleSend = () => {
      if (!inputText.value.trim()) return
      
      emit('send-message', inputText.value)
      inputText.value = ''
      
      // 重置高度
      nextTick(() => {
        adjustHeight()
      })
    }

    const adjustHeight = () => {
      if (textareaRef.value) {
        textareaRef.value.style.height = 'auto'
        textareaRef.value.style.height = Math.min(textareaRef.value.scrollHeight, 120) + 'px'
      }
    }

    const toggleEmoji = () => {
      console.log('打开表情面板')
      // 实际实现中应该打开表情选择器
    }

    const showMoreOptions = () => {
      console.log('显示更多选项')
      // 实际实现中应该显示图片、文件等选项
    }

    return {
      inputText,
      textareaRef,
      handleSend,
      adjustHeight,
      toggleEmoji,
      showMoreOptions
    }
  }
}
</script>

<style scoped>
.message-input {
  background-color: white;
  padding: 10px 15px;
  border-top: 1px solid var(--wechat-border-color);
}

.input-toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.toolbar-button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toolbar-button:hover {
  background-color: var(--wechat-bg-color);
}

.input-container {
  display: flex;
  align-items: flex-end;
  gap: 10px;
}

.text-input {
  flex: 1;
  border: 1px solid var(--wechat-border-color);
  border-radius: 20px;
  padding: 10px 15px;
  outline: none;
  resize: none;
  max-height: 120px;
  overflow-y: auto;
  font-size: 14px;
  line-height: 1.4;
  font-family: inherit;
}

.text-input:focus {
  border-color: var(--wechat-primary-color);
}

.send-button {
  background-color: var(--wechat-primary-color);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.send-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.send-button:not(:disabled):hover {
  background-color: #06ae56;
}
</style>