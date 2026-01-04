// backend/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  // 核心身份字段 ── 唯一、必填
  wechatId: { type: String, required: true, unique: true, index: true },

  // 登录凭证
  password: { type: String, required: true },

  // 个人资料（全部可选）
  nickname:   { type: String, default: '' },
  avatar:     { type: String, default: '' },
  signature:  { type: String, default: '' },
  gender:     { type: Number, enum: [0, 1, 2], default: 0 }, // 0保密 1男 2女
  region:     { type: String, default: '' },

  // 手机号（可选，用于找回/短信）
  phone: { type: String, sparse: true, unique: true, default: null },

  // 好友关系
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    validate: {
      validator(friends) {
        const ids = friends.map(id => id.toString());
        return ids.length === new Set(ids).size && !ids.includes(this._id.toString());
      },
      message: '好友列表包含重复ID或包含自己'
    }
  }],

  // 最近登录时间
  lastLogin: { type: Date, default: Date.now }
}, { timestamps: true });

/* =============== 密码加密钩子 =============== */
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

/* =============== 实例方法 =============== */
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);