import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// 导入路由
import userRoutes from './routes/users.js';
import chatRoutes from './routes/chat.js';
import contactRoutes from './routes/contacts.js';

// 1. 先加载环境变量
dotenv.config();
// 2. 再检查
if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your_random_string_here') {
  console.error('❌ 警告: JWT_SECRET 未设置或使用了默认值，请修改 .env 文件');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// ✅ 连接 MongoDB（关键！）
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wechat')
  .then(() => console.log('✅ MongoDB连接成功'))
  .catch(err => console.error('❌ MongoDB连接失败:', err));

// 健康检查（增加DB状态）
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: '后端服务运行正常', 
    timestamp: new Date(),
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// 添加简单测试路由（用于前后端连通测试）
app.get('/api/test', async (req, res) => {
  try {
    const TestModel = mongoose.model('Test', new mongoose.Schema({
      message: String,
      timestamp: { type: Date, default: Date.now }
    }));
    const data = await TestModel.find().sort({ timestamp: -1 }).limit(5);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/test', async (req, res) => {
  try {
    const TestModel = mongoose.model('Test');
    const newData = new TestModel(req.body);
    await newData.save();
    res.json({ success: true, data: newData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 使用你的业务路由
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/contacts', contactRoutes);

// 404 处理
app.use('*', (req, res) => {
  res.status(404).json({ success: false, error: '接口不存在' });
});

app.listen(PORT, () => {
  console.log(`🚀 后端服务运行在 http://localhost:${PORT}`);
  console.log(`✅ 健康检查: http://localhost:${PORT}/api/health`);
});