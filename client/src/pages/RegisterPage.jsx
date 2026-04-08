import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Sparkles, User, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'user' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      toast.success('Account created! Welcome to WallCraft 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const field = (key, value) => {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(er => ({ ...er, [key]: '' }));
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, var(--aurora-teal), transparent 70%)', filter: 'blur(70px)' }} />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, var(--aurora-pink), transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--aurora-purple), var(--aurora-pink))' }}>
              <Sparkles size={20} className="text-white" />
            </div>
          </Link>
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Join WallCraft</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Create your account and start exploring
          </p>
        </div>

        <div className="card p-8">
          {/* Role Picker */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { value: 'user', label: 'Explorer', desc: 'Browse & download', icon: User },
              { value: 'creator', label: 'Creator', desc: 'Upload & sell', icon: UserCheck },
            ].map(r => (
              <button key={r.value} type="button" onClick={() => field('role', r.value)}
                className="flex flex-col items-center gap-1.5 p-4 rounded-xl transition-all duration-200"
                style={{
                  background: form.role === r.value ? 'rgba(199,125,255,0.1)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${form.role === r.value ? 'rgba(199,125,255,0.4)' : 'var(--border)'}`,
                }}>
                <r.icon size={20} style={{ color: form.role === r.value ? 'var(--aurora-purple)' : 'var(--text-muted)' }} />
                <span className="text-sm font-medium" style={{ color: form.role === r.value ? 'var(--aurora-purple)' : 'var(--text-primary)' }}>
                  {r.label}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{r.desc}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input type="text" value={form.name} onChange={e => field('name', e.target.value)}
                  placeholder="Your name" className="input-field pl-10"
                  style={errors.name ? { borderColor: 'var(--aurora-pink)' } : {}} />
              </div>
              {errors.name && <p className="mt-1 text-xs" style={{ color: 'var(--aurora-pink)' }}>{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input type="email" value={form.email} onChange={e => field('email', e.target.value)}
                  placeholder="you@example.com" className="input-field pl-10"
                  style={errors.email ? { borderColor: 'var(--aurora-pink)' } : {}} />
              </div>
              {errors.email && <p className="mt-1 text-xs" style={{ color: 'var(--aurora-pink)' }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => field('password', e.target.value)}
                  placeholder="Min 6 characters" className="input-field pl-10 pr-10"
                  style={errors.password ? { borderColor: 'var(--aurora-pink)' } : {}} />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity">
                  {showPass ? <EyeOff size={16} style={{ color: 'var(--text-muted)' }} /> : <Eye size={16} style={{ color: 'var(--text-muted)' }} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs" style={{ color: 'var(--aurora-pink)' }}>{errors.password}</p>}
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input type={showPass ? 'text' : 'password'} value={form.confirm} onChange={e => field('confirm', e.target.value)}
                  placeholder="Repeat password" className="input-field pl-10"
                  style={errors.confirm ? { borderColor: 'var(--aurora-pink)' } : {}} />
              </div>
              {errors.confirm && <p className="mt-1 text-xs" style={{ color: 'var(--aurora-pink)' }}>{errors.confirm}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 mt-2">
              {loading
                ? <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                : 'Create Account'
              }
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-medium hover:opacity-80 transition-opacity" style={{ color: 'var(--aurora-purple)' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
