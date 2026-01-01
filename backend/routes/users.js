import express from 'express';
import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// 用户注册
router.post('/register', async (req, res) => {
  try {
    // 先检查用户是否存在
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(409).json({ success: false, error: '用户名已存在' });
    }
    
    const user = new User(req.body);
    await user.save();
    
    // 注册成功后直接返回 token，免去再次登录
    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, nickname: user.nickname }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// 用户登录
router.post('/login', async (req, res) => {
  try {  // 添加 try-catch 防止崩溃
    const { username, password } = req.body;
    
    // 1. 先验证输入
    if (!username || !password) {
      return res.status(400).json({ success: false, error: '用户名和密码必填' });
    }
    
    // 2. 再查询数据库
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, error: '用户名或密码错误' });
    }
    
    // 3. 更新最后登录时间
    user.lastLogin = new Date();
    await user.save();
    
    const token = generateToken(user._id);
    res.json({ 
      success: true, 
      token, 
      user: { id: user._id, nickname: user.nickname } 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取当前用户信息（需登录）
router.get('/profile', protect, async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  res.json({ success: true, user });
});

export default router;