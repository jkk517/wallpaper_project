import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { wallpaperService } from '../services/wallpaperService';
import { useAuth } from '../context/AuthContext';
import { usePayment } from '../hooks/usePayment';
import {
  Heart, Download, Lock, ArrowLeft, ExternalLink,
  Tag, Calendar, User, Maximize2, Eye, ShoppingCart, CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORY_EMOJI = {
  nature: '🌿', abstract: '🎨', architecture: '🏛️', space: '🌌',
  animals: '🦋', minimalist: '◼️', dark: '🖤', gradient: '🌈',
  cars: '🚗', art: '🖼️', other: '✨',
};

export default function WallpaperDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { initiatePayment } = usePayment();
  const [wallpaper, setWallpaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await wallpaperService.getById(id);
        setWallpaper(data.wallpaper);
      } catch {
        toast.error('Wallpaper not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const handleLike = async () => {
    if (!user) { toast.error('Login to like wallpapers'); return; }
    if (liking) return;
    setLiking(true);
    try {
      const { data } = await wallpaperService.like(id);
      setWallpaper(w => ({ ...w, isLiked: data.isLiked, likesCount: data.likesCount }));
    } catch { toast.error('Failed to update like'); }
    finally { setLiking(false); }
  };

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const { data } = await wallpaperService.download(id);
      const link = document.createElement('a');
      link.href = data.downloadUrl;
      link.download = `${wallpaper.title.replace(/\s+/g, '_')}.jpg`;
      link.target = '_blank';
      link.click();
      toast.success('Download started!');
      setWallpaper(w => ({ ...w, downloads: w.downloads + 1 }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Download failed');
    } finally {
      setDownloading(false);
    }
  };

  const handlePurchase = () => {
    if (!user) { toast.error('Please login to purchase'); navigate('/login'); return; }
    initiatePayment(wallpaper, () => {
      setWallpaper(w => ({ ...w, hasPurchased: true, isBlurred: false }));
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="h-8 w-32 skeleton rounded-lg mb-8" />
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="skeleton rounded-2xl" style={{ height: '520px' }} />
          <div className="space-y-4">
            {[200, 100, 60, 60, 120].map((h, i) => (
              <div key={i} className="skeleton rounded-xl" style={{ height: `${h}px` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!wallpaper) return null;

  const canAccess = wallpaper.isFree || wallpaper.hasPurchased;

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 py-8 page-enter">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="btn-ghost mb-6 -ml-2">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid lg:grid-cols-5 gap-10">
        {/* Image Panel */}
        <div className="lg:col-span-3">
          <div className="relative rounded-2xl overflow-hidden group"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <img
              src={wallpaper.imageUrl}
              alt={wallpaper.title}
              className={`w-full object-cover transition-all duration-500 ${wallpaper.isBlurred ? 'premium-blur' : ''}`}
              style={{ maxHeight: '600px', minHeight: '300px' }}
            />

            {/* Premium overlay */}
            {wallpaper.isBlurred && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                style={{ background: 'rgba(6,6,15,0.5)', backdropFilter: 'blur(2px)' }}>
                <div className="p-4 rounded-2xl text-center"
                  style={{ background: 'rgba(6,6,15,0.8)', border: '1px solid rgba(255,107,157,0.3)' }}>
                  <Lock size={32} className="mx-auto mb-2" style={{ color: 'var(--aurora-pink)' }} />
                  <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Premium Wallpaper</p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Purchase to unlock full resolution</p>
                </div>
              </div>
            )}

            {/* Expand button */}
            {canAccess && (
              <button onClick={() => setLightbox(true)}
                className="absolute top-3 right-3 p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
                <Maximize2 size={16} className="text-white" />
              </button>
            )}
          </div>
        </div>

        {/* Info Panel */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Title & badges */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              {wallpaper.isFree
                ? <span className="badge-free">Free</span>
                : <span className="badge-premium">Premium</span>
              }
              <span className="text-xs px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                {CATEGORY_EMOJI[wallpaper.category]} {wallpaper.category}
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold leading-tight mb-2"
              style={{ color: 'var(--text-primary)' }}>
              {wallpaper.title}
            </h1>
            {wallpaper.description && (
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {wallpaper.description}
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Heart, label: 'Likes', value: wallpaper.likesCount },
              { icon: Download, label: 'Downloads', value: wallpaper.downloads },
              { icon: Eye, label: 'Resolution', value: `${wallpaper.resolution?.width || 1920}×${wallpaper.resolution?.height || 1080}` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="card p-3 text-center" style={{ cursor: 'default' }}>
                <Icon size={16} className="mx-auto mb-1" style={{ color: 'var(--text-muted)' }} />
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{value}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Creator */}
          {wallpaper.uploadedBy && (
            <div className="flex items-center gap-3 p-4 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, var(--aurora-purple), var(--aurora-pink))' }}>
                {wallpaper.uploadedBy.name?.[0]?.toUpperCase() || 'C'}
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {wallpaper.uploadedBy.name}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Creator</p>
              </div>
            </div>
          )}

          {/* Tags */}
          {wallpaper.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {wallpaper.tags.map(tag => (
                <span key={tag} className="tag text-xs"># {tag}</span>
              ))}
            </div>
          )}

          {/* Price & Actions */}
          <div className="mt-auto space-y-3">
            {!wallpaper.isFree && !wallpaper.hasPurchased && (
              <div className="flex items-center justify-between p-4 rounded-xl"
                style={{ background: 'rgba(255,107,157,0.06)', border: '1px solid rgba(255,107,157,0.2)' }}>
                <div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Price</p>
                  <p className="text-2xl font-bold font-display" style={{ color: 'var(--aurora-pink)' }}>
                    ₹{wallpaper.price}
                  </p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full"
                  style={{ background: 'rgba(255,107,157,0.1)', color: 'var(--aurora-pink)' }}>
                  One-time payment
                </span>
              </div>
            )}

            {wallpaper.hasPurchased && !wallpaper.isFree && (
              <div className="flex items-center gap-2 p-3 rounded-xl"
                style={{ background: 'rgba(6,214,160,0.08)', border: '1px solid rgba(6,214,160,0.2)' }}>
                <CheckCircle size={16} style={{ color: 'var(--aurora-green)' }} />
                <p className="text-sm font-medium" style={{ color: 'var(--aurora-green)' }}>
                  Purchased — Full access unlocked
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={handleLike} disabled={liking}
                className="btn-secondary flex-shrink-0 px-4"
                style={wallpaper.isLiked ? { borderColor: 'rgba(255,107,157,0.4)', color: 'var(--aurora-pink)' } : {}}>
                <Heart size={16} fill={wallpaper.isLiked ? 'currentColor' : 'none'} />
                {wallpaper.likesCount}
              </button>

              {canAccess ? (
                <button onClick={handleDownload} disabled={downloading} className="btn-primary flex-1">
                  {downloading
                    ? <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    : <><Download size={16} /> Download Free</>
                  }
                </button>
              ) : (
                <button onClick={handlePurchase} className="btn-primary flex-1">
                  <ShoppingCart size={16} /> Buy for ₹{wallpaper.price}
                </button>
              )}
            </div>
          </div>

          {/* Meta */}
          <p className="text-xs flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
            <Calendar size={12} />
            Added {new Date(wallpaper.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.95)' }}
          onClick={() => setLightbox(false)}>
          <img
            src={wallpaper.imageUrl}
            alt={wallpaper.title}
            className="max-w-full max-h-full object-contain rounded-xl"
            style={{ maxHeight: '90vh' }}
            onClick={e => e.stopPropagation()}
          />
          <button onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 p-2 rounded-full"
            style={{ background: 'rgba(255,255,255,0.1)' }}>
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
