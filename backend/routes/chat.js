import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

// 获取聊天记录
router.get('/messages/:userId/:contactId', async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.params.userId, receiver: req.params.contactId },
        { sender: req.params.contactId, receiver: req.params.userId }
      ]
    }).sort({ timestamp: 1 });
    
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 发送消息
router.post('/send', async (req, res) => {
  try {
    const message = new Message(req.body);
    await message.save();
    res.status(201).json({ success: true, message });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;