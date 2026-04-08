import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../services/wallpaperService';
import { Heart, ArrowRight } from 'lucide-react';
import WallpaperCard from '../components/WallpaperCard';
import toast from 'react-hot-toast';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await userService.getFavorites();
        setFavorites(data.favorites);
      } catch {
        toast.error('Failed to load favorites');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleUpdate = (id, updates) => {
    if (updates.isLiked === false) {
      setFavorites(prev => prev.filter(w => w._id !== id));
    } else {
      setFavorites(prev => prev.map(w => w._id === id ? { ...w, ...updates } : w));
    }
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 py-10 page-enter">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
            <Heart size={28} style={{ color: 'var(--aurora-pink)' }} />
            Favorites
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            {favorites.length} wallpaper{favorites.length !== 1 ? 's' : ''} saved
          </p>
        </div>
      </div>

      {loading ? (
        <div className="wallpaper-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="wallpaper-grid-item">
              <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <div className="skeleton" style={{ height: `${180 + Math.random() * 100}px` }} />
                <div className="p-3 space-y-2" style={{ background: 'var(--bg-card)' }}>
                  <div className="skeleton h-4 rounded-lg w-3/4" />
                  <div className="skeleton h-3 rounded-lg w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(255,107,157,0.08)', border: '1px solid rgba(255,107,157,0.15)' }}>
            <Heart size={36} style={{ color: 'var(--aurora-pink)' }} />
          </div>
          <h2 className="font-display text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            No favorites yet
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            Start liking wallpapers to save them here
          </p>
          <Link to="/" className="btn-primary inline-flex">
            Explore Wallpapers <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="wallpaper-grid">
          {favorites.map(wallpaper => (
            <WallpaperCard
              key={wallpaper._id}
              wallpaper={{ ...wallpaper, isLiked: true }}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
