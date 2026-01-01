export default {
  // 应用状态
  isLoading: false,
  theme: 'light', // light, dark
  language: 'zh-CN',
  
  // 网络状态
  networkStatus: 'online', // online, offline
  
  // 全局弹窗
  globalDialog: {
    visible: false,
    title: '',
    message: '',
    type: 'info' // info, success, error, warning
  },
  
  // 底部导航栏相关
  tabBar: {
    show: true,
    activeTab: 'chat',
    unreadCounts: {
      chat: 3,
      contact: 0,
      discover: 0,
      me: 0
    }
  }
}