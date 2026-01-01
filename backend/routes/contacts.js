import express from 'express';
const router = express.Router();

// 获取联系人列表
router.get('/', async (req, res) => {
  try {
    // 模拟数据 - 后续替换为数据库查询
    const contacts = [
      { id: 1, name: '张三', avatar: 'avatar1.jpg', lastMessage: '你好！', time: '10:00' },
      { id: 2, name: '李四', avatar: 'avatar2.jpg', lastMessage: '晚上吃饭吗？', time: '09:30' }
    ];
    res.json({ success: true, contacts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 添加联系人
router.post('/add', async (req, res) => {
  try {
    const { name, phone } = req.body;
    // 这里添加数据库操作逻辑
    res.json({ success: true, message: '联系人添加成功' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;