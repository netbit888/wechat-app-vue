<template>
  <div class="message-input">
    <div class="input-toolbar">
      <button class="toolbar-button" @click="toggleEmoji">😊</button>
      <button class="toolbar-button" @click="toggleVoice">🎤</button>
      <button class="toolbar-button" @click="showMoreOptions">➕</button>
    </div>
    
    <div class="input-container">
      <!-- 语音输入区域 -->
      <div v-if="isVoiceMode" class="voice-recording">
        <div class="voice-button-container">
          <button 
            @mousedown="startRecording"
            @mouseup="stopRecording"
            @mouseleave="stopRecording"
            class="voice-button"
          >
            {{ isRecording ? '松开结束' : '按住说话' }}
          </button>
        </div>
        <div class="voice-tip" v-if="isRecording">
          {{ recordingTime }}秒
        </div>
      </div>
      
      <!-- 文本输入区域 -->
      <div v-else class="text-input-container">
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
          发送
        </button>
      </div>
    </div>
    
    <!-- 表情面板 -->
    <div v-if="showEmojiPanel" class="emoji-panel">
      <div class="emoji-category">
        <button class="emoji-item" v-for="emoji in emojis" :key="emoji" @click="selectEmoji(emoji)">
          {{ emoji }}
        </button>
      </div>
    </div>
    
    <!-- 更多选项面板 -->
    <div v-if="showMorePanel" class="more-panel">
      <div class="more-options">
        <div class="more-option" @click="selectImage">
          <div class="option-icon">🖼️</div>
          <div class="option-text">图片</div>
        </div>
        <div class="more-option" @click="selectVideo">
          <div class="option-icon">📹</div>
          <div class="option-text">视频</div>
        </div>
        <div class="more-option" @click="selectFile">
          <div class="option-icon">📎</div>
          <div class="option-text">文件</div>
        </div>
        <div class="more-option" @click="selectLocation">
          <div class="option-icon">📍</div>
          <div class="option-text">位置</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'

export default {
  name: 'MessageInput',
  emits: ['send-message', 'send-voice', 'send-image', 'send-video', 'send-file', 'send-location'],
  setup(props, { emit }) {
    // 文本输入
    const inputText = ref('')
    const textareaRef = ref(null)
    
    // 语音输入
    const isVoiceMode = ref(false)
    const isRecording = ref(false)
    const recordingTime = ref(0)
    let recordingTimer = null
    
    // 表情面板
    const showEmojiPanel = ref(false)
    const showMorePanel = ref(false)
    
    // 常用表情列表
    const emojis = ref([
      '😊', '😂', '🤣', '❤️', '👍', '👎', '👌', '✌️',
      '🙏', '🎉', '👏', '🤔', '😴', '😢', '😡', '😱',
      '🤯', '🤗', '🥰', '😍', '😘', '😋', '😎', '🤩'
    ])
    
    // 发送文本消息
    const handleSend = () => {
      if (!inputText.value.trim()) return
      
      emit('send-message', inputText.value)
      inputText.value = ''
      
      // 重置高度
      nextTick(() => {
        adjustHeight()
      })
    }

    // 调整文本框高度
    const adjustHeight = () => {
      if (textareaRef.value) {
        textareaRef.value.style.height = 'auto'
        textareaRef.value.style.height = Math.min(textareaRef.value.scrollHeight, 120) + 'px'
      }
    }

    // 切换表情面板
    const toggleEmoji = () => {
      showEmojiPanel.value = !showEmojiPanel.value
      showMorePanel.value = false
    }

    // 切换语音模式
    const toggleVoice = () => {
      isVoiceMode.value = !isVoiceMode.value
      showEmojiPanel.value = false
      showMorePanel.value = false
    }

    // 显示更多选项
    const showMoreOptions = () => {
      showMorePanel.value = !showMorePanel.value
      showEmojiPanel.value = false
    }
    
    // 选择表情
    const selectEmoji = (emoji) => {
      inputText.value += emoji
      adjustHeight()
    }
    
    // 开始录音
    const startRecording = () => {
      isRecording.value = true
      recordingTime.value = 0
      
      // 开始计时
      recordingTimer = setInterval(() => {
        recordingTime.value++
      }, 1000)
      
      // 实际实现中应该调用录音API
      console.log('开始录音')
    }
    
    // 停止录音
    const stopRecording = () => {
      if (!isRecording.value) return
      
      isRecording.value = false
      
      // 清除计时
      if (recordingTimer) {
        clearInterval(recordingTimer)
        recordingTimer = null
      }
      
      // 实际实现中应该停止录音并发送
      console.log(`停止录音，时长：${recordingTime.value}秒`)
      emit('send-voice', { duration: recordingTime.value })
      recordingTime.value = 0
    }
    
    // 选择图片
    const selectImage = () => {
      showMorePanel.value = false
      // 实际实现中应该打开文件选择器
      console.log('选择图片')
      emit('send-image')
    }
    
    // 选择视频
    const selectVideo = () => {
      showMorePanel.value = false
      console.log('选择视频')
      emit('send-video')
    }
    
    // 选择文件
    const selectFile = () => {
      showMorePanel.value = false
      console.log('选择文件')
      emit('send-file')
    }
    
    // 选择位置
    const selectLocation = () => {
      showMorePanel.value = false
      console.log('选择位置')
      emit('send-location')
    }
    
    // 清理定时器
    onUnmounted(() => {
      if (recordingTimer) {
        clearInterval(recordingTimer)
      }
    })

    return {
      inputText,
      textareaRef,
      isVoiceMode,
      isRecording,
      recordingTime,
      showEmojiPanel,
      showMorePanel,
      emojis,
      handleSend,
      adjustHeight,
      toggleEmoji,
      toggleVoice,
      showMoreOptions,
      selectEmoji,
      startRecording,
      stopRecording,
      selectImage,
      selectVideo,
      selectFile,
      selectLocation
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
  transition: background-color 0.2s;
}

.toolbar-button:hover {
  background-color: var(--wechat-bg-color);
}

.input-container {
  display: flex;
  align-items: flex-end;
  gap: 10px;
}

/* 文本输入容器 */
.text-input-container {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  width: 100%;
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
  transition: border-color 0.2s;
}

.text-input:focus {
  border-color: var(--wechat-primary-color);
}

.send-button {
  background-color: var(--wechat-primary-color);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  flex-shrink: 0;
  transition: background-color 0.2s;
}

.send-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.send-button:not(:disabled):hover {
  background-color: #06ae56;
}

/* 语音输入区域 */
.voice-recording {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.voice-button-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.voice-button {
  background-color: var(--wechat-primary-color);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 12px 24px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.voice-button:hover {
  background-color: #06ae56;
}

.voice-tip {
  margin-top: 8px;
  font-size: 12px;
  color: var(--wechat-text-secondary);
}

/* 表情面板 */
.emoji-panel {
  margin-top: 10px;
  padding: 10px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
}

.emoji-category {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.emoji-item {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.emoji-item:hover {
  background-color: var(--wechat-bg-color);
}

/* 更多选项面板 */
.more-panel {
  margin-top: 10px;
  padding: 10px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.more-options {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.more-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: background-color 0.2s;
  width: 60px;
}

.more-option:hover {
  background-color: var(--wechat-bg-color);
}

.option-icon {
  font-size: 24px;
  margin-bottom: 5px;
}

.option-text {
  font-size: 12px;
  color: var(--wechat-text-primary);
}
</style>