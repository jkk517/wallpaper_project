import Wallpaper from '../models/Wallpaper.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';

export const getWallpapers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const { category, isFree, search, sort = 'newest' } = req.query;

    const filter = { isActive: true, isApproved: true };

    if (category && category !== 'all') filter.category = category;
    if (isFree !== undefined) filter.isFree = isFree === 'true';
    if (search) {
      filter.$text = { $search: search };
    }

    let sortOption = {};
    switch (sort) {
      case 'popular': sortOption = { downloads: -1 }; break;
      case 'liked': sortOption = { likesCount: -1 }; break;
      case 'price_asc': sortOption = { price: 1 }; break;
      case 'price_desc': sortOption = { price: -1 }; break;
      default: sortOption = { createdAt: -1 };
    }

    const [wallpapers, total] = await Promise.all([
      Wallpaper.find(filter)
        .populate('uploadedBy', 'name avatar')
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean(),
      Wallpaper.countDocuments(filter),
    ]);

    // Add isLiked info if user authenticated
    const wallpapersWithLikes = wallpapers.map(w => ({
      ...w,
      isLiked: req.user ? w.likes?.some(id => id.toString() === req.user._id.toString()) : false,
      likes: undefined, // Don't send full likes array
    }));

    res.json({
      success: true,
      wallpapers: wallpapersWithLikes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getWallpaper = async (req, res) => {
  try {
    const wallpaper = await Wallpaper.findById(req.params.id)
      .populate('uploadedBy', 'name avatar bio');

    if (!wallpaper || !wallpaper.isActive) {
      return res.status(404).json({ success: false, message: 'Wallpaper not found' });
    }

    // Check if user purchased it
    let hasPurchased = false;
    let isLiked = false;

    if (req.user) {
      if (!wallpaper.isFree) {
        const order = await Order.findOne({
          userId: req.user._id,
          wallpaperId: wallpaper._id,
          paymentStatus: 'completed',
        });
        hasPurchased = !!order;
      } else {
        hasPurchased = true;
      }
      isLiked = wallpaper.likes.some(id => id.toString() === req.user._id.toString());
    }

    const wallpaperData = wallpaper.toObject();
    wallpaperData.isLiked = isLiked;
    wallpaperData.hasPurchased = hasPurchased;
    delete wallpaperData.likes;

    // Blur image URL for unpurchased premium
    if (!wallpaper.isFree && !hasPurchased) {
      wallpaperData.imageUrl = wallpaper.thumbnailUrl || wallpaper.imageUrl;
      wallpaperData.isBlurred = true;
    }

    res.json({ success: true, wallpaper: wallpaperData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadWallpaper = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    const { title, description, category, price, tags, width, height } = req.body;

    if (!title || !category) {
      return res.status(400).json({ success: false, message: 'Title and category are required' });
    }

    const parsedPrice = parseFloat(price) || 0;
    const isFree = parsedPrice === 0;

    // Generate thumbnail from cloudinary
    const imageUrl = req.file.path;
    const publicId = req.file.filename;
    const thumbnailUrl = cloudinary.url(publicId, {
      width: 400,
      height: 250,
      crop: 'fill',
      quality: 'auto',
      fetch_format: 'auto',
    });

    const parsedTags = tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [];

    const wallpaper = await Wallpaper.create({
      title,
      description,
      imageUrl,
      thumbnailUrl,
      cloudinaryPublicId: publicId,
      category,
      price: parsedPrice,
      isFree,
      tags: parsedTags,
      resolution: {
        width: parseInt(width) || 1920,
        height: parseInt(height) || 1080,
      },
      uploadedBy: req.user._id,
    });

    await wallpaper.populate('uploadedBy', 'name avatar');

    res.status(201).json({ success: true, message: 'Wallpaper uploaded successfully', wallpaper });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteWallpaper = async (req, res) => {
  try {
    const wallpaper = await Wallpaper.findById(req.params.id);
    if (!wallpaper) return res.status(404).json({ success: false, message: 'Wallpaper not found' });

    if (wallpaper.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this wallpaper' });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(wallpaper.cloudinaryPublicId);
    await wallpaper.deleteOne();

    res.json({ success: true, message: 'Wallpaper deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const likeWallpaper = async (req, res) => {
  try {
    const wallpaper = await Wallpaper.findById(req.params.id);
    if (!wallpaper) return res.status(404).json({ success: false, message: 'Wallpaper not found' });

    const userId = req.user._id;
    const isLiked = wallpaper.likes.includes(userId);

    if (isLiked) {
      wallpaper.likes.pull(userId);
      wallpaper.likesCount = Math.max(0, wallpaper.likesCount - 1);
    } else {
      wallpaper.likes.push(userId);
      wallpaper.likesCount += 1;
    }

    await wallpaper.save();

    // Update user favorites
    await User.findByIdAndUpdate(userId,
      isLiked ? { $pull: { favorites: wallpaper._id } } : { $addToSet: { favorites: wallpaper._id } }
    );

    res.json({ success: true, isLiked: !isLiked, likesCount: wallpaper.likesCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const downloadWallpaper = async (req, res) => {
  try {
    const wallpaper = await Wallpaper.findById(req.params.id);
    if (!wallpaper) return res.status(404).json({ success: false, message: 'Wallpaper not found' });

    // Check access
    if (!wallpaper.isFree) {
      if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required' });

      const order = await Order.findOne({
        userId: req.user._id,
        wallpaperId: wallpaper._id,
        paymentStatus: 'completed',
      });

      if (!order) return res.status(403).json({ success: false, message: 'Please purchase this wallpaper first' });

      order.downloadCount += 1;
      await order.save();
    }

    wallpaper.downloads += 1;
    await wallpaper.save();

    res.json({ success: true, downloadUrl: wallpaper.imageUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCreatorWallpapers = async (req, res) => {
  try {
    const wallpapers = await Wallpaper.find({ uploadedBy: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    const stats = {
      total: wallpapers.length,
      totalDownloads: wallpapers.reduce((sum, w) => sum + w.downloads, 0),
      totalLikes: wallpapers.reduce((sum, w) => sum + w.likesCount, 0),
    };

    res.json({ success: true, wallpapers, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
