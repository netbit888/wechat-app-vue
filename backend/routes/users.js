// backend/routes/users.js
import express from 'express';
import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

/* ---------- 注册 ---------- */
router.post('/register', async (req, res) => {
  try {
    const { wechatId, password, nickname } = req.body;
    
    console.log('注册请求:', { wechatId, password, nickname });

    if (!wechatId || !password) {
      console.log('注册失败: 微信号和密码必填');
      return res.status(400).json({ success: false, error: '微信号和密码必填' });
    }

    console.log('检查微信号是否存在:', wechatId);
    const exist = await User.findOne({ wechatId });
    console.log('查询结果:', exist);
    
    if (exist) {
      console.log('注册失败: 微信号已存在');
      return res.status(409).json({ success: false, error: '微信号已存在' });
    }

    // 创建用户，不设置phone字段，使用默认的undefined值
    const user = await User.create({
      wechatId,
      password,
      nickname: nickname || `用户${wechatId.slice(-4)}`
    });

    const token = generateToken(user._id);
    res.status(201).json({ success: true, data: { token, user } });
  } catch (e) {
    console.error('注册错误:', e);
    if (e.code === 11000) {
      console.error('重复键错误:', e.keyPattern, e.keyValue);
      const field = Object.keys(e.keyPattern)[0];
      const fieldName = field === 'wechatId' ? '微信号' : field;
      return res.status(409).json({ success: false, error: `${fieldName} 已存在` });
    }
    res.status(500).json({ success: false, error: e.message });
  }
});

/* ---------- 登录 ---------- */
router.post('/login', async (req, res) => {
  try {
    const { wechatId, password } = req.body;

    if (!wechatId || !password) {
      return res.status(400).json({ success: false, error: '微信号和密码必填' });
    }

    const user = await User.findOne({ wechatId });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, error: '微信号或密码错误' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);
    res.json({ success: true, data: { token, user } });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

/* ---------- 获取个人资料 ---------- */
router.get('/profile', protect, async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  res.json({ success: true, data: user });
});

/* ---------- 更新个人资料 ---------- */
router.put('/profile', protect, async (req, res) => {
  const ALLOW = ['nickname', 'signature', 'gender', 'region', 'avatar'];
  const payload = {};
  ALLOW.forEach(k => { if (req.body[k] !== undefined) payload[k] = req.body[k]; });
  const user = await User.findByIdAndUpdate(req.userId, payload, { new: true }).select('-password');
  res.json({ success: true, data: user });
});

/* ---------- 获取设置 ---------- */
router.get('/settings', protect, async (req, res) => {
  const user = await User.findById(req.userId).select('settings');
  res.json({ success: true, data: user.settings });
});

/* ---------- 更新设置 ---------- */
router.put('/settings', protect, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.userId, { settings: req.body }, { new: true }).select('settings');
  res.json({ success: true, data: user.settings });
});

export default router;