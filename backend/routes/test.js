import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: '测试路由工作正常' });
});

export default router;