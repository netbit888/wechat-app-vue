import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 连接MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wechat', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 简单路由测试
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: '后端服务运行正常' });
});

// 用户路由
app.use('/api/users', (await import('./routes/users.js')).default);
app.use('/api/chat', (await import('./routes/chat.js')).default);
app.use('/api/contacts', (await import('./routes/contacts.js')).default);

app.listen(PORT, () => {
  console.log(`后端服务运行在 http://localhost:${PORT}`);
});