import express from 'express';
import {
  getWallpapers, getWallpaper, uploadWallpaper,
  deleteWallpaper, likeWallpaper, downloadWallpaper,
  getCreatorWallpapers,
} from '../controllers/wallpaperController.js';
import { protect, requireCreator, optionalAuth } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.get('/', optionalAuth, getWallpapers);
router.get('/creator/my', protect, requireCreator, getCreatorWallpapers);
router.get('/:id', optionalAuth, getWallpaper);
router.post('/upload', protect, requireCreator, upload.single('image'), uploadWallpaper);
router.delete('/:id', protect, deleteWallpaper);
router.post('/:id/like', protect, likeWallpaper);
router.get('/:id/download', optionalAuth, downloadWallpaper);

export default router;
