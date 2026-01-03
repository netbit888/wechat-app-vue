import mongoose from 'mongoose';

const friendRequestSchema = new mongoose.Schema({
  from:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status:{ type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  message:String,   // 验证消息，可空
}, { timestamps: true });

// 复合唯一键：同一对用户只能有一条 pending
friendRequestSchema.index({ from: 1, to: 1, status: 1 }, { unique: true });

export default mongoose.model('FriendRequest', friendRequestSchema);