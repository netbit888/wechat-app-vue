import { ref, watch } from 'vue'

const storage = {
  set(key, value, expireHours = null) { /* 同 actions.js */ },
  get(key) { /* 同 actions.js */ }
}

export function useLocalStorage(key, defaultValue) {
  const data = ref(storage.get(key) ?? defaultValue)
  watch(data, newVal => storage.set(key, newVal), { deep: true })
  return data
}