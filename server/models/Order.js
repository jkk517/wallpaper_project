import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  wallpaperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallpaper',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  razorpayOrderId: {
    type: String,
    default: '',
  },
  transactionId: {
    type: String,
    default: '',
  },
  razorpaySignature: {
    type: String,
    default: '',
  },
  downloadCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// Prevent duplicate purchases
orderSchema.index({ userId: 1, wallpaperId: 1 }, { unique: true });

export default mongoose.model('Order', orderSchema);
