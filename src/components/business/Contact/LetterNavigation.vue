<template>
  <div class="letter-navigation">
    <div 
      v-for="letter in letters" 
      :key="letter"
      class="letter-item"
      :class="{ active: activeLetter === letter }"
      @click="handleLetterClick(letter)"
      @mouseenter="setActiveLetter(letter)"
      @mouseleave="clearActiveLetter"
    >
      {{ letter }}
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'LetterNavigation',
  props: {
    letters: {
      type: Array,
      default: () => []
    }
  },
  emits: ['navigate'],
  setup(props, { emit }) {
    const activeLetter = ref('')

    const handleLetterClick = (letter) => {
      emit('navigate', letter)
    }

    const setActiveLetter = (letter) => {
      activeLetter.value = letter
    }

    const clearActiveLetter = () => {
      activeLetter.value = ''
    }

    return {
      activeLetter,
      handleLetterClick,
      setActiveLetter,
      clearActiveLetter
    }
  }
}
</script>

<style scoped>
.letter-navigation {
  position: fixed;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 8px 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.letter-item {
  font-size: 12px;
  color: var(--wechat-primary-color);
  padding: 2px 4px;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 3px;
  min-width: 16px;
  text-align: center;
}

.letter-item:hover,
.letter-item.active {
  background-color: var(--wechat-primary-color);
  color: white;
}
</style>