import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import FriendRequest from '../models/FriendRequest.js';

const router = express.Router();

/* 获取当前登录用户的好友列表 */
router.get('/', protect, async (req, res) => {
  try {
    const me = await User.findById(req.userId)
                         .populate('friends', 'wechatId nickname avatar');
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
      { wechatId: { $regex: kw, $options: 'i' } },
      { nickname: { $regex: kw, $options: 'i' } }
    ]
  }).select('wechatId nickname avatar _id');

  console.log('[search] 查询结果:', users);
  res.json({ ok: 1, users });
});

/* 发送好友请求 */
router.post('/add', protect, async (req, res) => {
  const { userId, message } = req.body;          // 要加的人
  if (!userId || userId === req.userId) return res.status(400).json({ ok: 0, msg: '参数错误' });

  const target = await User.findById(userId);
  if (!target) return res.status(404).json({ ok: 0, msg: '用户不存在' });

  // 是否已存在 pending 记录
  const exist = await FriendRequest.findOne({ 
    from: req.userId, 
    to: userId, 
    status: { $in: ['pending'] } 
  });
  if (exist) return res.json({ ok: 0, msg: '已发送过请求' });

  await FriendRequest.create({ 
    from: req.userId, 
    to: userId, 
    message: message || ''
  });
  res.json({ ok: 1, msg: '请求已发送' });
});

/* 获取“新的朋友”列表 */
router.get('/requests', protect, async (req, res) => {
  const list = await FriendRequest.find({ to: req.userId })
    .populate('from', 'wechatId nickname avatar')
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

/* 取消好友请求 */
router.delete('/request/:requestId', protect, async (req, res) => {
  const { requestId } = req.params;
  
  try {
    const fr = await FriendRequest.findById(requestId);
    if (!fr) return res.status(404).json({ ok: 0, msg: '请求不存在' });
    
    // 只能取消自己发送的请求
    if (fr.from.toString() !== req.userId) return res.status(403).json({ ok: 0, msg: '无权限' });
    
    // 只能取消待处理的请求
    if (fr.status !== 'pending') return res.status(400).json({ ok: 0, msg: '只能取消待处理的请求' });
    
    await fr.deleteOne();
    res.json({ ok: 1, msg: '请求已取消' });
  } catch (error) {
    res.status(500).json({ ok: 0, msg: error.message });
  }
});

/* 获取发送的请求历史 */
router.get('/sent-requests', protect, async (req, res) => {
  try {
    const list = await FriendRequest.find({ from: req.userId })
      .populate('to', 'wechatId nickname avatar')
      .sort({ createdAt: -1 });
    res.json({ ok: 1, requests: list });
  } catch (error) {
    res.status(500).json({ ok: 0, msg: error.message });
  }
});

/* 获取联系人详情 */
router.get('/:userId', protect, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .select('wechatId nickname avatar region phone');
    
    if (!user) {
      return res.status(404).json({ ok: 0, msg: '用户不存在' });
    }
    
    res.json({ ok: 1, contact: user });
  } catch (e) {
    res.status(500).json({ ok: 0, error: e.message });
  }
});

export default router;