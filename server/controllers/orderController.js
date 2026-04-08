import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import Wallpaper from '../models/Wallpaper.js';
import User from '../models/User.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  try {
    const { wallpaperId } = req.body;

    const wallpaper = await Wallpaper.findById(wallpaperId);
    if (!wallpaper) return res.status(404).json({ success: false, message: 'Wallpaper not found' });

    if (wallpaper.isFree) {
      return res.status(400).json({ success: false, message: 'This wallpaper is free to download' });
    }

    // Check if already purchased
    const existingOrder = await Order.findOne({
      userId: req.user._id,
      wallpaperId,
      paymentStatus: 'completed',
    });

    if (existingOrder) {
      return res.status(400).json({ success: false, message: 'You have already purchased this wallpaper' });
    }

    const amountInPaise = Math.round(wallpaper.price * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      notes: {
        wallpaperId: wallpaperId.toString(),
        userId: req.user._id.toString(),
      },
    });

    // Save pending order
    const order = await Order.create({
      userId: req.user._id,
      wallpaperId,
      amount: wallpaper.price,
      currency: 'INR',
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: 'pending',
    });

    res.json({
      success: true,
      order: {
        id: order._id,
        razorpayOrderId: razorpayOrder.id,
        amount: amountInPaise,
        currency: 'INR',
        wallpaper: { title: wallpaper.title, price: wallpaper.price },
      },
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    // Verify signature
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // Update order
    const order = await Order.findOneAndUpdate(
      { razorpayOrderId },
      {
        paymentStatus: 'completed',
        transactionId: razorpayPaymentId,
        razorpaySignature,
      },
      { new: true }
    ).populate('wallpaperId', 'price uploadedBy');

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    // Update creator earnings
    if (order.wallpaperId?.uploadedBy) {
      const creatorShare = order.amount * 0.8; // 80% to creator
      await User.findByIdAndUpdate(order.wallpaperId.uploadedBy, {
        $inc: { totalEarnings: creatorShare },
      });
    }

    res.json({ success: true, message: 'Payment verified successfully', order });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.user._id,
      paymentStatus: 'completed',
    })
      .populate('wallpaperId', 'title imageUrl thumbnailUrl category price')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const checkPurchase = async (req, res) => {
  try {
    const { wallpaperId } = req.params;
    const order = await Order.findOne({
      userId: req.user._id,
      wallpaperId,
      paymentStatus: 'completed',
    });

    res.json({ success: true, hasPurchased: !!order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
