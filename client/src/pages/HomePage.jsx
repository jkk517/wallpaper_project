import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, TrendingUp, Gift, Crown, X } from 'lucide-react';
import { useWallpapers } from '../hooks/useWallpapers';
import WallpaperGrid from '../components/WallpaperGrid';
import CategoryFilter from '../components/CategoryFilter';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Downloaded' },
  { value: 'liked', label: 'Most Liked' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);

  const filters = useMemo(() => {
    const params = {};
    if (searchParams.get('search')) params.search = searchParams.get('search');
    if (searchParams.get('category') && searchParams.get('category') !== 'all') params.category = searchParams.get('category');
    if (searchParams.get('isFree') !== null && searchParams.get('isFree') !== '') params.isFree = searchParams.get('isFree');
    if (searchParams.get('sort')) params.sort = searchParams.get('sort');
    return params;
  }, [searchParams]);

  const { wallpapers, loading, hasMore, total, loadMore, updateWallpaper } = useWallpapers(filters);

  const currentCategory = searchParams.get('category') || 'all';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentIsFree = searchParams.get('isFree');

  const updateParam = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (!value || value === 'all' || value === '') p.delete(key);
    else p.set(key, value);
    setSearchParams(p);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateParam('search', searchInput);
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const hasActiveFilters = filters.search || filters.category || filters.isFree !== undefined;

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative overflow-hidden" style={{
        background: 'linear-gradient(180deg, rgba(199,125,255,0.08) 0%, transparent 100%)',
        borderBottom: '1px solid var(--border)',
      }}>
        {/* Ambient blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--aurora-purple), transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute top-0 right-1/4 w-64 h-64 rounded-full opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--aurora-teal), transparent 70%)', filter: 'blur(50px)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{ background: 'rgba(199,125,255,0.1)', border: '1px solid rgba(199,125,255,0.25)', color: 'var(--aurora-purple)' }}>
            <TrendingUp size={12} /> {total > 0 ? `${total.toLocaleString()} wallpapers available` : 'Explore premium wallpapers'}
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4">
            <span className="aurora-text">Beautiful walls</span>
            <br />
            <span style={{ color: 'var(--text-primary)' }}>for every screen</span>
          </h1>
          <p className="text-lg max-w-xl mx-auto mb-8" style={{ color: 'var(--text-secondary)' }}>
            Discover thousands of stunning wallpapers. Free downloads and exclusive premium collections.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Search wallpapers, themes, moods..."
                className="input-field pl-11 pr-4 py-4 text-base"
              />
              {searchInput && (
                <button type="button" onClick={() => { setSearchInput(''); updateParam('search', ''); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity">
                  <X size={16} style={{ color: 'var(--text-muted)' }} />
                </button>
              )}
            </div>
          </form>

          {/* Quick tabs */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button onClick={() => updateParam('isFree', '')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${!currentIsFree ? 'btn-primary py-2' : 'btn-secondary py-2'}`}>
              All
            </button>
            <button onClick={() => updateParam('isFree', 'true')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${currentIsFree === 'true' ? 'btn-primary py-2' : 'btn-secondary py-2'}`}>
              <Gift size={14} /> Free
            </button>
            <button onClick={() => updateParam('isFree', 'false')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${currentIsFree === 'false' ? 'btn-primary py-2' : 'btn-secondary py-2'}`}>
              <Crown size={14} /> Premium
            </button>
          </div>
        </div>
      </div>

      {/* Filters & Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Filter bar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex-1 min-w-0">
            <CategoryFilter active={currentCategory} onChange={v => updateParam('category', v)} />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {hasActiveFilters && (
              <button onClick={clearFilters} className="btn-ghost text-xs px-3 py-2 rounded-xl"
                style={{ color: 'var(--aurora-pink)' }}>
                <X size={13} /> Clear
              </button>
            )}
            <div className="relative">
              <select
                value={currentSort}
                onChange={e => updateParam('sort', e.target.value)}
                className="input-field text-xs py-2 pl-3 pr-8 appearance-none cursor-pointer"
                style={{ width: 'auto' }}
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        {total > 0 && !loading && (
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            Showing {wallpapers.length} of {total} wallpapers
            {filters.search && <span> for "<span style={{ color: 'var(--text-secondary)' }}>{filters.search}</span>"</span>}
          </p>
        )}

        <WallpaperGrid
          wallpapers={wallpapers}
          loading={loading}
          hasMore={hasMore}
          onLoadMore={loadMore}
          onUpdate={updateWallpaper}
        />
      </div>
    </div>
  );
}
