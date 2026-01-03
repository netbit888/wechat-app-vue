import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import FriendRequest from '../models/FriendRequest.js';

const router = express.Router();

/* 获取当前登录用户的好友列表 */
router.get('/', protect, async (req, res) => {
  try {
    const me = await User.findById(req.userId)
                         .populate('friends', 'username nickname avatar');
    res.json({ ok: 1, friends: me.friends });
  } catch (e) {
    res.status(500).json({ ok: 0, error: e.message });
  }
});

/* 搜索用户（含非好友） */
router.get('/search', protect, async (req, res) => {
  const kw = (req.query.keyword || '').trim();
  console.log('[search] keyword:', kw); 
  if (!kw) return res.json({ ok: 1, users: [] });

  const users = await User.find({
    $or: [
      { username: { $regex: kw, $options: 'i' } },
      { nickname: { $regex: kw, $options: 'i' } }
    ]
  }).select('username nickname avatar _id');

  console.log('[search] 查询结果:', users);
  res.json({ ok: 1, users });
});

/* 发送好友请求 */
router.post('/add', protect, async (req, res) => {
  const { userId } = req.body;          // 要加的人
  if (!userId || userId === req.userId) return res.status(400).json({ ok: 0, msg: '参数错误' });

  const target = await User.findById(userId);
  if (!target) return res.status(404).json({ ok: 0, msg: '用户不存在' });

  // 是否已存在 pending 记录
  const exist = await FriendRequest.findOne({ from: req.userId, to: userId, status: 'pending' });
  if (exist) return res.json({ ok: 0, msg: '已发送过请求' });

  await FriendRequest.create({ from: req.userId, to: userId });
  res.json({ ok: 1, msg: '请求已发送' });
});

/* 获取“新的朋友”列表 */
router.get('/requests', protect, async (req, res) => {
  const list = await FriendRequest.find({ to: req.userId, status: 'pending' })
    .populate('from', 'username nickname avatar')
    .sort({ createdAt: -1 });
  res.json({ ok: 1, requests: list });
});

/* 处理好友请求（接受/拒绝） */
router.post('/handle', protect, async (req, res) => {
  const { requestId, action } = req.body;   // action: 'accept' | 'reject'
  const fr = await FriendRequest.findById(requestId).populate('from');
  if (!fr || fr.to.toString() !== req.userId) return res.status(403).json({ ok: 0, msg: '无权限' });

  if (action === 'accept') {
    // 双向加好友
    await User.updateOne({ _id: fr.from }, { $addToSet: { friends: fr.to } });
    await User.updateOne({ _id: fr.to   }, { $addToSet: { friends: fr.from } });
  }
  fr.status = action === 'accept' ? 'accepted' : 'rejected';
  await fr.save();
  res.json({ ok: 1, msg: '已' + (action === 'accept' ? '接受' : '拒绝') });
});

export default router;