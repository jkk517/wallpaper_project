import mongoose from 'mongoose';

const wallpaperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: '',
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
  },
  thumbnailUrl: {
    type: String,
    default: '',
  },
  cloudinaryPublicId: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['nature', 'abstract', 'architecture', 'space', 'animals', 'minimalist', 'dark', 'gradient', 'cars', 'art', 'other'],
  },
  tags: [{
    type: String,
    trim: true,
  }],
  resolution: {
    width: { type: Number, default: 1920 },
    height: { type: Number, default: 1080 },
  },
  price: {
    type: Number,
    default: 0,
    min: [0, 'Price cannot be negative'],
  },
  isFree: {
    type: Boolean,
    default: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  downloads: {
    type: Number,
    default: 0,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  likesCount: {
    type: Number,
    default: 0,
  },
  isApproved: {
    type: Boolean,
    default: true, // Set to false for moderation workflow
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  colorPalette: [{
    type: String,
  }],
}, { timestamps: true });

// Index for search
wallpaperSchema.index({ title: 'text', description: 'text', tags: 'text' });
wallpaperSchema.index({ category: 1, isFree: 1, createdAt: -1 });

export default mongoose.model('Wallpaper', wallpaperSchema);
