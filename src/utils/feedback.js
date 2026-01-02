// 用户反馈工具函数
export const showToast = (message, type = 'info', duration = 3000) => {
  // ✅ 严格安全检查
  if (message === null || message === undefined) {
    message = '未知错误';
  } else if (typeof message === 'object') {
    // 如果是错误对象，优先提取错误信息
    message = message.message || message.error || 
              (message.data?.message) || (message.data?.error) || 
              JSON.stringify(message);
  }
  
  // 确保 message 是字符串
  const displayMessage = String(message);
  
  console.log(`[${type.toUpperCase()}] ${displayMessage}`)
  
  if (type === 'error') {
    alert(`错误: ${displayMessage}`)
  } else if (type === 'success') {
    // 使用手机原生提示或轻量 toast
    alert(`成功: ${displayMessage}`)
  }
}

export const showLoading = (message = '加载中...') => {
  console.log(`[LOADING] ${message}`)
  return () => console.log('[LOADING] 关闭加载')
}

export const showConfirm = (message, title = '提示') => {
  const displayMessage = typeof message === 'object' ? 
    (message.message || JSON.stringify(message)) : 
    String(message);
    
  return confirm(`${title}: ${displayMessage}`)
}