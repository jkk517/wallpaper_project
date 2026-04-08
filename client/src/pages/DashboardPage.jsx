import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { wallpaperService, orderService, userService } from '../services/wallpaperService';
import {
  LayoutDashboard, Download, Heart, IndianRupee,
  Upload, ShoppingBag, Image, Trash2, ExternalLink,
  TrendingUp, Package
} from 'lucide-react';
import toast from 'react-hot-toast';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="card p-5">
    <div className="flex items-center justify-between mb-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
        <Icon size={20} style={{ color }} />
      </div>
    </div>
    <p className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>{value}</p>
    <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
  </div>
);

export default function DashboardPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState(user?.role === 'creator' ? 'uploads' : 'purchases');
  const [uploads, setUploads] = useState([]);
  const [orders, setOrders] = useState([]);
  const [creatorStats, setCreatorStats] = useState(null);
  const [uploadStats, setUploadStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [ordersRes] = await Promise.all([orderService.getUserOrders()]);
        setOrders(ordersRes.data.orders);

        if (user?.role === 'creator' || user?.role === 'admin') {
          const [uploadsRes, statsRes] = await Promise.all([
            wallpaperService.getCreatorWallpapers(),
            userService.getCreatorStats(),
          ]);
          setUploads(uploadsRes.data.wallpapers);
          setUploadStats(uploadsRes.data.stats);
          setCreatorStats(statsRes.data);
        }
      } catch (err) {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this wallpaper? This cannot be undone.')) return;
    try {
      await wallpaperService.delete(id);
      setUploads(prev => prev.filter(w => w._id !== id));
      toast.success('Wallpaper deleted');
    } catch {
      toast.error('Failed to delete wallpaper');
    }
  };

  const isCreator = user?.role === 'creator' || user?.role === 'admin';

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 py-10 page-enter">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Welcome back, <span style={{ color: 'var(--aurora-purple)' }}>{user?.name}</span>
          </p>
        </div>
        {isCreator && (
          <Link to="/upload" className="btn-primary">
            <Upload size={16} /> Upload New
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className={`grid grid-cols-2 ${isCreator ? 'md:grid-cols-4' : 'md:grid-cols-2'} gap-4 mb-8`}>
        <StatCard icon={ShoppingBag} label="Purchases" value={orders.length} color="var(--aurora-purple)" />
        <StatCard icon={Download} label="Downloads Available" value={orders.length} color="var(--aurora-teal)" />
        {isCreator && (
          <>
            <StatCard icon={Image} label="Wallpapers Uploaded" value={uploadStats?.total || 0} color="var(--aurora-blue)" />
            <StatCard
              icon={IndianRupee}
              label="Total Earnings"
              value={`₹${(creatorStats?.totalEarnings || 0).toFixed(2)}`}
              color="var(--aurora-green)"
            />
          </>
        )}
      </div>

      {/* Creator additional stats */}
      {isCreator && uploadStats && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <StatCard icon={Download} label="Total Downloads" value={uploadStats.totalDownloads} color="var(--aurora-pink)" />
          <StatCard icon={Heart} label="Total Likes" value={uploadStats.totalLikes} color="var(--aurora-purple)" />
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl mb-6 w-fit"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        {isCreator && (
          <button onClick={() => setTab('uploads')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${tab === 'uploads' ? 'text-white' : 'text-secondary'}`}
            style={tab === 'uploads' ? { background: 'linear-gradient(135deg, var(--aurora-purple), var(--aurora-pink))' } : {}}>
            My Uploads
          </button>
        )}
        <button onClick={() => setTab('purchases')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${tab === 'purchases' ? 'text-white' : 'text-secondary'}`}
          style={tab === 'purchases' ? { background: 'linear-gradient(135deg, var(--aurora-purple), var(--aurora-pink))' } : {}}>
          Purchases
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card overflow-hidden">
              <div className="skeleton" style={{ height: '160px' }} />
              <div className="p-4 space-y-2">
                <div className="skeleton h-4 rounded-lg w-3/4" />
                <div className="skeleton h-3 rounded-lg w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : tab === 'uploads' ? (
        <div>
          {uploads.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <Image size={28} style={{ color: 'var(--text-muted)' }} />
              </div>
              <p className="font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>No wallpapers uploaded yet</p>
              <Link to="/upload" className="btn-primary inline-flex mt-2">
                <Upload size={15} /> Upload your first wallpaper
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploads.map(w => (
                <div key={w._id} className="card overflow-hidden group">
                  <div className="relative overflow-hidden" style={{ height: '160px' }}>
                    <img src={w.thumbnailUrl || w.imageUrl} alt={w.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2"
                      style={{ background: 'rgba(0,0,0,0.6)' }}>
                      <Link to={`/wallpaper/${w._id}`}
                        className="p-2 rounded-lg hover:scale-110 transition-transform"
                        style={{ background: 'rgba(255,255,255,0.15)' }}>
                        <ExternalLink size={16} className="text-white" />
                      </Link>
                      <button onClick={() => handleDelete(w._id)}
                        className="p-2 rounded-lg hover:scale-110 transition-transform"
                        style={{ background: 'rgba(255,107,157,0.3)' }}>
                        <Trash2 size={16} style={{ color: 'var(--aurora-pink)' }} />
                      </button>
                    </div>
                    <div className="absolute top-2 right-2">
                      {w.isFree ? <span className="badge-free">Free</span> : <span className="badge-premium">₹{w.price}</span>}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>{w.title}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <span className="flex items-center gap-1"><Heart size={11} /> {w.likesCount}</span>
                      <span className="flex items-center gap-1"><Download size={11} /> {w.downloads}</span>
                      <span className="ml-auto capitalize">{w.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <Package size={28} style={{ color: 'var(--text-muted)' }} />
              </div>
              <p className="font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>No purchases yet</p>
              <Link to="/?isFree=false" className="btn-primary inline-flex mt-2">
                Explore premium wallpapers
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {orders.map(order => (
                <div key={order._id} className="card overflow-hidden group">
                  <div className="relative overflow-hidden" style={{ height: '160px' }}>
                    <img
                      src={order.wallpaperId?.thumbnailUrl || order.wallpaperId?.imageUrl}
                      alt={order.wallpaperId?.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      style={{ background: 'rgba(0,0,0,0.6)' }}>
                      <Link to={`/wallpaper/${order.wallpaperId?._id}`}
                        className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.15)' }}>
                        <ExternalLink size={16} className="text-white" />
                      </Link>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                      {order.wallpaperId?.title}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </span>
                      <span className="text-xs font-medium" style={{ color: 'var(--aurora-green)' }}>
                        ₹{order.amount} paid
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
