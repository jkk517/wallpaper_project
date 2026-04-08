import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Search, Upload, LayoutDashboard, Heart,
  LogOut, LogIn, Menu, X, Sparkles, User
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(6,6,15,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, var(--aurora-purple), var(--aurora-pink))' }}>
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg aurora-text">WallCraft</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <Link to="/" className="btn-ghost text-sm">Explore</Link>
          <Link to="/?isFree=true" className="btn-ghost text-sm">Free</Link>
          <Link to="/?isFree=false" className="btn-ghost text-sm">Premium</Link>
          {user?.role === 'creator' && (
            <Link to="/upload" className="btn-ghost text-sm">Upload</Link>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2 animate-slide-up">
              <input
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search wallpapers..."
                className="input-field w-48 sm:w-64 py-2 text-sm"
              />
              <button type="button" onClick={() => setSearchOpen(false)} className="btn-ghost p-2">
                <X size={16} />
              </button>
            </form>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="btn-ghost p-2.5 rounded-xl">
              <Search size={18} />
            </button>
          )}

          {user ? (
            <>
              <Link to="/favorites" className="btn-ghost p-2.5 rounded-xl hidden sm:flex">
                <Heart size={18} />
              </Link>
              {user.role === 'creator' && (
                <Link to="/upload" className="btn-primary px-4 py-2 text-sm hidden sm:flex">
                  <Upload size={15} />
                  Upload
                </Link>
              )}

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(v => !v)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all"
                  style={{
                    background: 'linear-gradient(135deg, var(--aurora-purple), var(--aurora-pink))',
                    boxShadow: userMenuOpen ? '0 0 0 3px rgba(199,125,255,0.3)' : 'none',
                  }}
                >
                  {user.name[0].toUpperCase()}
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-12 w-52 rounded-2xl overflow-hidden shadow-card-hover z-50 animate-slide-up"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted capitalize">{user.role}</p>
                    </div>
                    <div className="p-2">
                      <Link to="/dashboard" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-secondary hover:text-primary transition-colors hover:bg-white/5">
                        <LayoutDashboard size={15} /> Dashboard
                      </Link>
                      <Link to="/favorites" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-secondary hover:text-primary transition-colors hover:bg-white/5">
                        <Heart size={15} /> Favorites
                      </Link>
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors hover:bg-white/5"
                        style={{ color: 'var(--aurora-pink)' }}>
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-ghost text-sm hidden sm:flex">
                <LogIn size={15} /> Sign In
              </Link>
              <Link to="/register" className="btn-primary text-sm">Get Started</Link>
            </div>
          )}

          {/* Mobile menu */}
          <button onClick={() => setMenuOpen(v => !v)} className="btn-ghost p-2.5 rounded-xl md:hidden">
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t animate-slide-up" style={{ borderColor: 'var(--border)' }}>
          <div className="px-4 py-4 flex flex-col gap-1">
            <Link to="/" className="btn-ghost text-sm justify-start">Explore</Link>
            <Link to="/?isFree=true" className="btn-ghost text-sm justify-start">Free Wallpapers</Link>
            <Link to="/?isFree=false" className="btn-ghost text-sm justify-start">Premium</Link>
            {user && <Link to="/favorites" className="btn-ghost text-sm justify-start"><Heart size={15} /> Favorites</Link>}
            {user?.role === 'creator' && <Link to="/upload" className="btn-ghost text-sm justify-start"><Upload size={15} /> Upload</Link>}
            {user && <Link to="/dashboard" className="btn-ghost text-sm justify-start"><LayoutDashboard size={15} /> Dashboard</Link>}
            {!user && <Link to="/login" className="btn-ghost text-sm justify-start"><LogIn size={15} /> Sign In</Link>}
          </div>
        </div>
      )}

      {/* Backdrop for user menu */}
      {userMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
      )}
    </header>
  );
}
