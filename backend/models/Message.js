import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: String,
  type: { type: String, enum: ['text', 'image', 'voice'], default: 'text' },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Message', messageSchema);

// 在文件末尾添加索引
messageSchema.index({ sender: 1, receiver: 1, timestamp: -1 }); // 添加复合索引
messageSchema.set('timestamps', true); // 启用 createdAt 和 updatedAt