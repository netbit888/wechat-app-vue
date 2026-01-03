import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: null },
  nickname: String,
  avatar: String,
  lastLogin: Date,
  friends: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    validate: {
      validator: function(friends) {
        // 防止重复和自引用
        return friends.length === new Set(friends.map(id => id.toString())).size &&
              !friends.includes(this._id);
      },
      message: '好友列表包含重复ID或包含自己'
    }
  }]
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