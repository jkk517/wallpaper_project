import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Sparkles, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      {/* Background ambient */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, var(--aurora-purple), transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, var(--aurora-pink), transparent 70%)', filter: 'blur(50px)' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--aurora-purple), var(--aurora-pink))' }}>
              <Sparkles size={20} className="text-white" />
            </div>
          </Link>
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Welcome back</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Sign in to access your wallpaper collection
          </p>
        </div>

        {/* Form Card */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Email address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: '' })); }}
                  placeholder="you@example.com"
                  className="input-field pl-10"
                  style={errors.email ? { borderColor: 'var(--aurora-pink)' } : {}}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs" style={{ color: 'var(--aurora-pink)' }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(er => ({ ...er, password: '' })); }}
                  placeholder="Your password"
                  className="input-field pl-10 pr-10"
                  style={errors.password ? { borderColor: 'var(--aurora-pink)' } : {}}
                />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity">
                  {showPass ? <EyeOff size={16} style={{ color: 'var(--text-muted)' }} /> : <Eye size={16} style={{ color: 'var(--text-muted)' }} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs" style={{ color: 'var(--aurora-pink)' }}>{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 mt-2">
              {loading ? (
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <><LogIn size={16} /> Sign In</>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Don't have an account?{' '}
              <Link to="/register" className="font-medium transition-colors hover:opacity-80"
                style={{ color: 'var(--aurora-purple)' }}>
                Create one free
              </Link>
            </p>
          </div>
        </div>

        {/* Demo hint */}
        <div className="mt-4 p-4 rounded-xl text-xs text-center"
          style={{ background: 'rgba(199,125,255,0.06)', border: '1px solid rgba(199,125,255,0.15)', color: 'var(--text-muted)' }}>
          💡 Tip: Register as a <strong style={{ color: 'var(--aurora-purple)' }}>Creator</strong> to upload and sell wallpapers
        </div>
      </div>
    </div>
  );
}
