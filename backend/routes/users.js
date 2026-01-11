// backend/routes/users.js
import express from 'express';
import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { protect } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置multer存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/avatars'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.userId}-${Date.now()}${ext}`);
  }
});

// 文件过滤
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('只允许上传图片文件'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB限制
});

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

    // 生成随机头像颜色
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // 创建用户，不设置phone字段，使用默认的undefined值
    const user = await User.create({
      wechatId,
      password,
      nickname: nickname || `用户${wechatId.slice(-4)}`,
      avatarColor: randomColor
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

/* ---------- 上传头像 ---------- */
router.post('/avatar', protect, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: '请选择要上传的头像' });
    }
    
    // 更新用户头像路径
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.userId, { avatar: avatarUrl }, { new: true }).select('-password');
    
    res.json({ success: true, data: user });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

export default router;