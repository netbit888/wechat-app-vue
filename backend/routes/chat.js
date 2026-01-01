import express from 'express';
import Message from '../models/Message.js';  // 注意：您的项目使用ES6模块，加.js后缀
import User from '../models/User.js';        // 确保有这个模型文件

const router = express.Router();

// ✅ 获取两个用户之间的聊天记录 (替换原有的模拟数据)
router.get('/messages/:userId/:contactId', async (req, res) => {
  try {
    const { userId, contactId } = req.params;

    // 从数据库查询消息，按时间升序排列
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: contactId },
        { sender: contactId, receiver: userId }
      ]
    })
    .populate('sender', 'name avatar')      // 获取发送者信息
    .populate('receiver', 'name avatar')    // 获取接收者信息
    .sort({ timestamp: 1 });                // 按时间升序

    // 标记对方消息为已读（可选）
    await Message.updateMany(
      { sender: contactId, receiver: userId, isRead: { $ne: true } },
      { isRead: true }
    );

    res.json({ 
      success: true, 
      messages  // 注意字段名统一用 messages
    });

  } catch (error) {
    console.error('获取聊天记录失败:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ 发送新消息 (替换原有的模拟逻辑)
router.post('/send', async (req, res) => {
  try {
    const { sender, receiver, content, type } = req.body;

    // 创建并保存消息到数据库
    const message = new Message({
      sender,
      receiver,
      content,
      type: type || 'text'
    });

    await message.save();
    
    // 填充用户信息
    await message.populate('sender', 'name avatar');
    await message.populate('receiver', 'name avatar');

    res.json({ 
      success: true, 
      data: message  // 返回完整的消息对象
    });

  } catch (error) {
    console.error('发送消息失败:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;