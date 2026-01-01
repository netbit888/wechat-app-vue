// 用户反馈工具函数
export const showToast = (message, type = 'info', duration = 3000) => {
  // 这里可以集成UI框架的Toast组件
  console.log(`[${type.toUpperCase()}] ${message}`)
  
  // 简单的浏览器通知实现
  if (type === 'error') {
    alert(`错误: ${message}`)
  }
}

export const showLoading = (message = '加载中...') => {
  console.log(`[LOADING] ${message}`)
  // 可以集成加载中组件
  return () => console.log('[LOADING] 关闭加载')
}

export const showConfirm = (message, title = '提示') => {
  return confirm(`${title}: ${message}`)
}