import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// 用户注册
router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// 用户登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, error: '用户名或密码错误' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;