import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// 定义__dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 导入路由
import userRoutes from './routes/users.js';
import chatRoutes from './routes/chat.js';
import contactRoutes from './routes/contacts.js';

// 1. 先加载环境变量
dotenv.config();

// 2. JWT 检查
if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your_random_string_here') {
  console.error('❌ 警告: JWT_SECRET 未设置或使用了默认值');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== CORS 配置（关键！）====================
const allowedOrigins = process.env.CLIENT_URLS 
  ? process.env.CLIENT_URLS.split(',').map(url => url.trim())
  : ['http://localhost:5173'];

console.log('✅ 允许的客户端域名:', allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) {
      console.log('⚠️ 请求无 origin，已允许');
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      console.log(`✅ CORS 通过: ${origin}`);
      callback(null, true);
    } else {
      console.warn(`❌ CORS 拒绝: ${origin}`);
      callback(new Error(`不允许的域名: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  exposedHeaders: ['set-cookie'],
}));

// 中间件
app.use(express.json());

// 静态文件服务 - 用于访问上传的头像
import fs from 'fs';
const uploadsDir = path.join(__dirname, 'uploads/avatars');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ 连接 MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wechat')
  .then(async () => {
    console.log('✅ MongoDB连接成功');
    
    // 修复注册问题：删除users集合中可能存在的username唯一索引
    try {
      // 直接使用collection操作，避免模型编译冲突
      const usersCollection = mongoose.connection.collection('users');
      const indexes = await usersCollection.indexes();
      
      console.log('当前索引:', indexes.map(idx => idx.name));
      
      // 检查并删除username唯一索引
      for (const index of indexes) {
        if (index.name.includes('username')) {
          await usersCollection.dropIndex(index.name);
          console.log(`✅ 已删除索引: ${index.name}`);
        }
      }
    } catch (error) {
      console.error('删除索引时出错:', error.message);
    }
  })
  .catch(err => console.error('❌ MongoDB连接失败:', err));

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: '后端服务运行正常', 
    timestamp: new Date(),
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    corsEnabled: true,
    allowedOrigins
  });
});

// 测试路由
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

// ==================== 业务路由（必须放在SPA Fallback之前）====================
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/contacts', contactRoutes);

// ==================== SPA Fallback 处理（关键修复！）====================
// 作用：让前端路由（如/auth/login）刷新时能正确加载 Vue 应用
app.get('*', (req, res, next) => {
  // 只处理 GET 请求，确保 POST/PUT/DELETE 等 API 请求能正确走到下面的 404 JSON
  if (req.method === 'GET') {
    // 假设 dist 文件夹在 backend 的上一级目录
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  } else {
    next(); // 非 GET 请求继续向下走
  }
});

// ==================== API 404 处理（仅对未匹配的API请求）====================
app.use((req, res) => {
  res.status(404).json({ success: false, error: '接口不存在' });
});

// ==================== 全局错误处理中间件 ====================
app.use((err, req, res, next) => {
  console.error('❌ 服务器错误:', err.message);
  
  if (err.message.includes('不允许的域名')) {
    return res.status(403).json({ 
      success: false, 
      error: 'CORS 拒绝：该域名未在白名单中' 
    });
  }
  
  res.status(500).json({ 
    success: false, 
    error: import.meta.env.DEV ? err.message : '服务器内部错误' 
  });
});

// ==================== 新增：Socket.io ====================
import { Server } from 'socket.io';
import http from 'http';

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('🔌 用户连接', socket.id);

  socket.on('register', (userId) => {
    socket.join(userId);
    console.log('👤 用户注册房间', userId);
  });

  socket.on('sendMessage', (data) => {
    // data: { to, content }
    const msg = { ...data, from: socket.id, time: Date.now() };
    io.to(data.to).emit('receiveMessage', msg);
    console.log('📨 消息', msg);
  });

  socket.on('disconnect', () => console.log('🔌 断开', socket.id));
});

// ==================== 启动 ====================
server.listen(PORT, () => {
  console.log(`🚀 后端+Socket 运行在 http://localhost:${PORT}`);
  console.log(`✅ 健康检查: http://localhost:${PORT}/api/health`);
});