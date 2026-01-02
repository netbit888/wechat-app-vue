import express from 'express';
import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// 用户注册
router.post('/register', async (req, res) => {
  try {
    const { username, password, nickname } = req.body;
    
    // ✅ 验证必填字段
    if (!username || !password) {
      return res.status(400).json({ success: false, error: '用户名和密码必填' });
    }
    
    // ✅ 检查用户名是否存在
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ success: false, error: '用户名已存在' });
    }
    
    // ✅ 创建用户（不存储 phone 字段）
    const user = new User({
      username,
      password,
      nickname: nickname || `用户${username.slice(-4)}`,
      // 不设置 phone，保持为 null
    });
    
    await user.save();
    
    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: { 
        id: user._id, 
        nickname: user.nickname 
      }
    });
  } catch (error) {
    // ✅ 处理 MongoDB 唯一键错误
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({ 
        success: false, 
        error: `${field} 已存在（请检查用户名或手机号）` 
      });
    }
    res.status(400).json({ success: false, error: error.message });
  }
});

// 用户登录
router.post('/login', async (req, res) => {
  try {  
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ success: false, error: '用户名和密码必填' });
    }
    
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, error: '用户名或密码错误' });
    }
    
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

// 获取个人信息
router.get('/profile', protect, async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  res.json({ success: true, user });
});

export default router;