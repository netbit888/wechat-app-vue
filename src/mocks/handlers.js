import { http } from '@/api'

// 开发环境下的模拟API
if (import.meta.env.DEV) {
  // 模拟用户登录
  http.post('/auth/login', async (config) => {
    const { username, password } = JSON.parse(config.data)
    
    await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟延迟
    
    if (username === 'admin' && password === '123456') {
      return {
        code: 0,
        data: {
          token: 'mock_token_' + Date.now(),
          user: {
            id: 1,
            username: 'admin',
            nickname: '管理员',
            avatar: '',
            wechatId: 'wxid_admin',
            phone: '13800138000',
            gender: 1,
            region: '广东, 深圳',
            signature: '这是模拟数据'
          }
        },
        message: '登录成功'
      }
    } else {
      return {
        code: 1001,
        message: '用户名或密码错误'
      }
    }
  })
}