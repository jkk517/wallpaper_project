import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get user favorites
router.get('/favorites', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites', 'title imageUrl isFree price category likesCount downloads');
    res.json({ success: true, favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get creator stats
router.get('/creator/stats', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, totalEarnings: user.totalEarnings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
