import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Download, Lock, Eye } from 'lucide-react';
import { wallpaperService } from '../services/wallpaperService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CATEGORIES = {
  nature: '🌿', abstract: '🎨', architecture: '🏛️', space: '🌌',
  animals: '🦋', minimalist: '◼️', dark: '🖤', gradient: '🌈',
  cars: '🚗', art: '🖼️', other: '✨',
};

export default function WallpaperCard({ wallpaper, onUpdate }) {
  const { user } = useAuth();
  const [liking, setLiking] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error('Login to like wallpapers'); return; }
    if (liking) return;
    setLiking(true);
    try {
      const { data } = await wallpaperService.like(wallpaper._id);
      if (onUpdate) onUpdate(wallpaper._id, {
        isLiked: data.isLiked,
        likesCount: data.likesCount,
      });
    } catch {
      toast.error('Failed to update like');
    } finally {
      setLiking(false);
    }
  };

  const displayUrl = wallpaper.thumbnailUrl || wallpaper.imageUrl;

  return (
    <div className="wallpaper-grid-item group">
      <Link to={`/wallpaper/${wallpaper._id}`} className="block">
        <div className="relative rounded-2xl overflow-hidden cursor-pointer"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

          {/* Image */}
          <div className="relative overflow-hidden" style={{ minHeight: '160px' }}>
            {!imgLoaded && (
              <div className="absolute inset-0 skeleton" style={{ minHeight: '200px' }} />
            )}
            <img
              src={displayUrl}
              alt={wallpaper.title}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              className={`w-full object-cover transition-all duration-500 group-hover:scale-105 ${
                !wallpaper.isFree ? 'premium-blur group-hover:blur-[8px]' : ''
              } ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              style={{ maxHeight: '320px' }}
            />

            {/* Overlay on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)' }}>
              <div className="flex justify-end">
                <button onClick={handleLike}
                  className="p-2 rounded-full transition-all duration-200 hover:scale-110"
                  style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
                  <Heart
                    size={16}
                    fill={wallpaper.isLiked ? 'var(--aurora-pink)' : 'none'}
                    stroke={wallpaper.isLiked ? 'var(--aurora-pink)' : 'white'}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-white/70 text-xs">
                  <Eye size={12} /> {wallpaper.downloads}
                </div>
                {!wallpaper.isFree && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                    style={{ background: 'rgba(0,0,0,0.6)', color: 'var(--aurora-pink)' }}>
                    <Lock size={11} /> ₹{wallpaper.price}
                  </div>
                )}
              </div>
            </div>

            {/* Premium lock overlay */}
            {!wallpaper.isFree && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    background: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,107,157,0.4)',
                    color: 'var(--aurora-pink)',
                  }}>
                  Premium — ₹{wallpaper.price}
                </div>
              </div>
            )}
          </div>

          {/* Card Footer */}
          <div className="p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                  {wallpaper.title}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {CATEGORIES[wallpaper.category] || '✨'} {wallpaper.category}
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0">
                {wallpaper.isFree
                  ? <span className="badge-free">Free</span>
                  : <span className="badge-premium">₹{wallpaper.price}</span>
                }
              </div>
            </div>

            {/* Likes & Downloads */}
            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                <Heart size={11} fill={wallpaper.isLiked ? 'var(--aurora-pink)' : 'none'}
                  stroke={wallpaper.isLiked ? 'var(--aurora-pink)' : 'currentColor'} />
                {wallpaper.likesCount}
              </span>
              <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                <Download size={11} /> {wallpaper.downloads}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
