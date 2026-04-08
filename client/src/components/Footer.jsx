import { Link } from 'react-router-dom';
import { Sparkles, Github, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }} className="mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--aurora-purple), var(--aurora-pink))' }}>
                <Sparkles size={16} className="text-white" />
              </div>
              <span className="font-display font-bold text-lg aurora-text">WallCraft</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Discover and share the world's most beautiful wallpapers. Free and premium, for every screen.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {[Github, Twitter, Instagram].map((Icon, i) => (
                <button key={i} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Explore</h4>
            <div className="flex flex-col gap-2">
              {[
                { to: '/', label: 'All Wallpapers' },
                { to: '/?isFree=true', label: 'Free Wallpapers' },
                { to: '/?isFree=false', label: 'Premium' },
                { to: '/?category=nature', label: 'Nature' },
                { to: '/?category=abstract', label: 'Abstract' },
              ].map(link => (
                <Link key={link.to} to={link.to} className="text-sm transition-colors hover:text-white"
                  style={{ color: 'var(--text-muted)' }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Creators */}
          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Creators</h4>
            <div className="flex flex-col gap-2">
              {[
                { to: '/register', label: 'Become a Creator' },
                { to: '/upload', label: 'Upload Wallpaper' },
                { to: '/dashboard', label: 'Dashboard' },
              ].map(link => (
                <Link key={link.to} to={link.to} className="text-sm transition-colors hover:text-white"
                  style={{ color: 'var(--text-muted)' }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Legal</h4>
            <div className="flex flex-col gap-2">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Licenses'].map(item => (
                <span key={item} className="text-sm cursor-pointer transition-colors hover:text-white"
                  style={{ color: 'var(--text-muted)' }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} WallCraft. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Built with ❤️ for wallpaper lovers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
