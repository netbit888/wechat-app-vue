export default {
  // 联系人列表
  contacts: [
    {
      id: 2,
      nickname: '张三',
      remarkName: '张三',
      avatar: '',
      avatarColor: '#07c160',
      wechatId: 'wxid_zhangsan',
      phone: '13800138001',
      region: '北京',
      tags: ['朋友', '同事'],
      isStarred: true,
      description: '这是张三'
    },
    {
      id: 3,
      nickname: '李四',
      remarkName: '李四',
      avatar: '',
      avatarColor: '#fa5151',
      wechatId: 'wxid_lisi',
      phone: '13800138002',
      region: '上海',
      tags: ['家人'],
      isStarred: false,
      description: '这是李四'
    },
    {
      id: 4,
      nickname: '王五',
      remarkName: '王五',
      avatar: '',
      avatarColor: '#10aeff',
      wechatId: 'wxid_wangwu',
      phone: '13800138003',
      region: '广州',
      tags: ['同学'],
      isStarred: true,
      description: '这是王五'
    },
    {
      id: 5,
      nickname: '赵六',
      remarkName: '赵六',
      avatar: '',
      avatarColor: '#6467ef',
      wechatId: 'wxid_zhaoliu',
      phone: '13800138004',
      region: '深圳',
      tags: ['同事'],
      isStarred: false,
      description: '这是赵六'
    },
    {
      id: 6,
      nickname: '前端开发群',
      remarkName: '前端开发群',
      avatar: '',
      avatarColor: '#ffc300',
      wechatId: 'wxid_frontend',
      phone: '',
      region: '',
      tags: ['群聊', '工作'],
      isStarred: false,
      description: '前端技术交流',
      isGroup: true,
      members: [1, 2, 3, 4, 5]
    }
  ],
  
  // 新朋友申请
  friendRequests: [
    {
      id: 1001,
      fromUserId: 7,
      nickname: '新朋友',
      avatarColor: '#07c160',
      message: '你好，我是新朋友',
      status: 'pending', // pending, accepted, rejected
      time: '2023-10-05T08:00:00Z'
    }
  ],
  
  // 联系人分组
  groups: [
    { id: 1, name: '朋友', count: 2 },
    { id: 2, name: '家人', count: 1 },
    { id: 3, name: '同事', count: 2 },
    { id: 4, name: '同学', count: 1 }
  ],
  
  // 搜索历史
  searchHistory: ['张三', '李四', '前端开发']
}