/**
 * 格式化时间
 * @param {Date|string} date - 日期对象或日期字符串
 * @param {string} format - 格式，可选：relative|date|datetime|time
 * @returns {string} 格式化后的时间字符串
 */
export function formatDate(date, format = 'relative') {
  if (!date) return ''
  
  const d = new Date(date)
  const now = new Date()
  const diff = now - d
  const oneDay = 24 * 60 * 60 * 1000
  
  if (format === 'relative') {
    if (diff < 60 * 1000) { // 1分钟内
      return '刚刚'
    } else if (diff < 60 * 60 * 1000) { // 1小时内
      const minutes = Math.floor(diff / (60 * 1000))
      return `${minutes}分钟前`
    } else if (diff < oneDay) { // 1天内
      const hours = Math.floor(diff / (60 * 60 * 1000))
      return `${hours}小时前`
    } else if (diff < 2 * oneDay) { // 昨天
      return '昨天'
    } else if (diff < 7 * oneDay) { // 一周内
      const days = ['日', '一', '二', '三', '四', '五', '六']
      return `星期${days[d.getDay()]}`
    } else { // 更早
      return d.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })
    }
  } else if (format === 'time') {
    return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  } else if (format === 'date') {
    return d.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })
  } else if (format === 'datetime') {
    return d.toLocaleString('zh-CN', { 
      month: 'numeric', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  return d.toLocaleString()
}

/**
 * 获取友好的时间显示
 * 今天显示时间，昨天显示"昨天"，更早显示日期
 */
export function getFriendlyTime(date) {
  if (!date) return ''
  
  const d = new Date(date)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  
  if (d >= today) {
    return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  } else if (d >= yesterday) {
    return '昨天'
  } else if (d >= weekAgo) {
    const days = ['日', '一', '二', '三', '四', '五', '六']
    return `星期${days[d.getDay()]}`
  } else {
    return d.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })
  }
}

// 在原有函数基础上添加
export function formatChatTime(date) {
  if (!date) return ''
  
  const d = new Date(date)
  const now = new Date()
  const diff = now - d
  const oneDay = 24 * 60 * 60 * 1000
  
  if (diff < oneDay) {
    return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  } else if (diff < 2 * oneDay) {
    return '昨天'
  } else if (diff < 7 * oneDay) {
    const days = ['日', '一', '二', '三', '四', '五', '六']
    return `星期${days[d.getDay()]}`
  } else {
    return d.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })
  }
}