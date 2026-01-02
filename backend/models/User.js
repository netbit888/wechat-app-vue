import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { 
    type: String, 
    // 关键修复：先注释掉唯一索引，确保功能正常后再优化
    // unique: true,
    // sparse: true,
    default: null  // 明确默认为 null
  },
  nickname: String,
  avatar: String,
  lastLogin: Date
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);