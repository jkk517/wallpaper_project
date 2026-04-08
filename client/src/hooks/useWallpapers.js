import { useState, useEffect, useCallback, useRef } from 'react';
import { wallpaperService } from '../services/wallpaperService';

export const useWallpapers = (filters = {}) => {
  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const filtersRef = useRef(filters);

  // Reset when filters change
  useEffect(() => {
    const prev = filtersRef.current;
    const changed = JSON.stringify(prev) !== JSON.stringify(filters);
    if (changed) {
      filtersRef.current = filters;
      setWallpapers([]);
      setPage(1);
      setHasMore(true);
    }
  }, [filters]);

  const fetchWallpapers = useCallback(async (pageNum) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await wallpaperService.getAll({
        ...filtersRef.current,
        page: pageNum,
        limit: 20,
      });
      setWallpapers(prev =>
        pageNum === 1 ? data.wallpapers : [...prev, ...data.wallpapers]
      );
      setHasMore(data.pagination.hasMore);
      setTotal(data.pagination.total);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load wallpapers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchWallpapers(page); }, [page, fetchWallpapers]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) setPage(p => p + 1);
  }, [loading, hasMore]);

  const refresh = useCallback(() => {
    setWallpapers([]);
    setPage(1);
    setHasMore(true);
    fetchWallpapers(1);
  }, [fetchWallpapers]);

  const updateWallpaper = useCallback((id, updates) => {
    setWallpapers(prev => prev.map(w => w._id === id ? { ...w, ...updates } : w));
  }, []);

  return { wallpapers, loading, error, hasMore, total, loadMore, refresh, updateWallpaper };
};
