import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: String,
  type: { type: String, enum: ['text', 'image', 'voice'], default: 'text' },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Message', messageSchema);