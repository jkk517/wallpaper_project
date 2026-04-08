import { useEffect, useRef } from 'react';
import WallpaperCard from './WallpaperCard';
import { Loader2, ImageOff } from 'lucide-react';

const SkeletonCard = () => (
  <div className="wallpaper-grid-item">
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
      <div className="skeleton" style={{ height: `${180 + Math.random() * 120}px` }} />
      <div className="p-3 space-y-2" style={{ background: 'var(--bg-card)' }}>
        <div className="skeleton h-4 rounded-lg w-3/4" />
        <div className="skeleton h-3 rounded-lg w-1/2" />
      </div>
    </div>
  </div>
);

export default function WallpaperGrid({ wallpapers, loading, hasMore, onLoadMore, onUpdate, emptyMessage }) {
  const loaderRef = useRef(null);

  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting && hasMore && !loading) onLoadMore?.(); },
      { threshold: 0.1 }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, onLoadMore]);

  if (!loading && wallpapers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <ImageOff size={28} style={{ color: 'var(--text-muted)' }} />
        </div>
        <div className="text-center">
          <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>
            {emptyMessage || 'No wallpapers found'}
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Try adjusting your filters or search query
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="wallpaper-grid">
        {wallpapers.map((wallpaper) => (
          <WallpaperCard key={wallpaper._id} wallpaper={wallpaper} onUpdate={onUpdate} />
        ))}
        {loading && Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={`sk-${i}`} />)}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={loaderRef} className="flex justify-center py-8">
        {loading && wallpapers.length > 0 && (
          <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm">Loading more...</span>
          </div>
        )}
        {!hasMore && wallpapers.length > 0 && (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            You've seen all {wallpapers.length} wallpapers ✨
          </p>
        )}
      </div>
    </div>
  );
}
