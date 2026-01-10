export default {
  // 当前登录用户信息
  currentUser: {
    id: 1,
    wechatId: 'wxid_123456',
    nickname: '微信用户',
    avatar: '',
    phone: '13800138000',
    gender: 1, // 0:未知, 1:男, 2:女
    region: '广东, 深圳',
    signature: '这个人很懒，什么都没留下',
    status: 'online' // online, offline, busy, away
  },
  
  // 用户设置
  settings: {
    notification: true,
    sound: true,
    vibration: true,
    privacy: {
      addMeByWechatId: true,
      addMeByPhone: true,
      recommendContacts: true
    }
  },
  
  // 登录状态
  isLoggedIn: true,
  token: 'mock-token-1234567890',
  loginTime: '2023-10-01T10:00:00Z'
}