import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { wallpaperService } from '../services/wallpaperService';
import { Upload, Image, X, Tag, DollarSign, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['nature','abstract','architecture','space','animals','minimalist','dark','gradient','cars','art','other'];

export default function UploadPage() {
  const navigate = useNavigate();
  const fileRef = useRef();
  const [form, setForm] = useState({
    title: '', description: '', category: '', price: '0',
    tags: '', width: '1920', height: '1080',
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [dragOver, setDragOver] = useState(false);

  const setField = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: '' }));
  };

  const handleFile = (f) => {
    if (!f || !f.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
    if (f.size > 20 * 1024 * 1024) { toast.error('File size must be under 20MB'); return; }
    setFile(f);
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target.result);
    reader.readAsDataURL(f);

    // Try to get image dimensions
    const img = new window.Image();
    img.onload = () => {
      setForm(prev => ({ ...prev, width: String(img.width), height: String(img.height) }));
    };
    img.src = URL.createObjectURL(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.category) e.category = 'Select a category';
    if (!file) e.file = 'Please select an image';
    const price = parseFloat(form.price);
    if (isNaN(price) || price < 0) e.price = 'Enter a valid price';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));

      const { data } = await wallpaperService.upload(formData);
      toast.success('Wallpaper uploaded successfully! 🎉');
      navigate(`/wallpaper/${data.wallpaper._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const isFree = parseFloat(form.price) === 0 || form.price === '';

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 sm:px-6 py-10 page-enter">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Upload Wallpaper</h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Share your artwork with the WallCraft community
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Image Upload */}
          <div className="space-y-6">
            {/* Dropzone */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Image File <span style={{ color: 'var(--aurora-pink)' }}>*</span>
              </label>
              <div
                onClick={() => !preview && fileRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                className="relative rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer"
                style={{
                  minHeight: '280px',
                  border: `2px dashed ${errors.file ? 'var(--aurora-pink)' : dragOver ? 'var(--aurora-purple)' : 'var(--border)'}`,
                  background: dragOver ? 'rgba(199,125,255,0.05)' : 'var(--bg-card)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                {preview ? (
                  <>
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" style={{ maxHeight: '320px' }} />
                    <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); }}
                      className="absolute top-3 right-3 p-1.5 rounded-full"
                      style={{ background: 'rgba(0,0,0,0.7)', color: 'white' }}>
                      <X size={14} />
                    </button>
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-xs"
                      style={{ background: 'rgba(0,0,0,0.7)', color: 'white' }}>
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                    <button type="button" onClick={() => fileRef.current?.click()}
                      className="absolute bottom-3 right-3 btn-secondary text-xs py-1.5 px-3">
                      Change
                    </button>
                  </>
                ) : (
                  <div className="text-center p-8">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                      style={{ background: 'rgba(199,125,255,0.1)', border: '1px solid rgba(199,125,255,0.2)' }}>
                      <Image size={28} style={{ color: 'var(--aurora-purple)' }} />
                    </div>
                    <p className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Drop image here</p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>JPG, PNG, WebP · Max 20MB</p>
                    <button type="button" className="btn-secondary mt-4 text-sm py-2">
                      <Upload size={14} /> Browse Files
                    </button>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={e => handleFile(e.target.files[0])} />
              {errors.file && <p className="mt-1 text-xs" style={{ color: 'var(--aurora-pink)' }}>{errors.file}</p>}
            </div>

            {/* Resolution */}
            <div className="grid grid-cols-2 gap-3">
              {['width', 'height'].map(dim => (
                <div key={dim}>
                  <label className="block text-xs font-medium mb-1.5 capitalize" style={{ color: 'var(--text-secondary)' }}>{dim} (px)</label>
                  <input type="number" value={form[dim]} onChange={e => setField(dim, e.target.value)}
                    className="input-field text-sm py-2" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Metadata */}
          <div className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Title <span style={{ color: 'var(--aurora-pink)' }}>*</span>
              </label>
              <input type="text" value={form.title} onChange={e => setField('title', e.target.value)}
                placeholder="e.g. Misty Forest at Dawn" maxLength={100}
                className="input-field" style={errors.title ? { borderColor: 'var(--aurora-pink)' } : {}} />
              {errors.title && <p className="mt-1 text-xs" style={{ color: 'var(--aurora-pink)' }}>{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Description</label>
              <textarea value={form.description} onChange={e => setField('description', e.target.value)}
                placeholder="Tell us about this wallpaper..." rows={3} maxLength={500}
                className="input-field resize-none" />
              <p className="mt-1 text-xs text-right" style={{ color: 'var(--text-muted)' }}>
                {form.description.length}/500
              </p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Category <span style={{ color: 'var(--aurora-pink)' }}>*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button key={cat} type="button" onClick={() => setField('category', cat)}
                    className={`tag capitalize ${form.category === cat ? 'active' : ''}`}>
                    {cat}
                  </button>
                ))}
              </div>
              {errors.category && <p className="mt-1 text-xs" style={{ color: 'var(--aurora-pink)' }}>{errors.category}</p>}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Tags <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>(comma-separated)</span>
              </label>
              <div className="relative">
                <Tag size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input type="text" value={form.tags} onChange={e => setField('tags', e.target.value)}
                  placeholder="forest, minimal, dark, 4k" className="input-field pl-10" />
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Price (₹) — Set 0 for free
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium"
                  style={{ color: 'var(--text-muted)' }}>₹</span>
                <input type="number" min="0" step="1" value={form.price} onChange={e => setField('price', e.target.value)}
                  className="input-field pl-8" style={errors.price ? { borderColor: 'var(--aurora-pink)' } : {}} />
              </div>
              {errors.price && <p className="mt-1 text-xs" style={{ color: 'var(--aurora-pink)' }}>{errors.price}</p>}

              <div className="mt-2 p-3 rounded-xl flex items-start gap-2"
                style={{ background: isFree ? 'rgba(6,214,160,0.06)' : 'rgba(255,107,157,0.06)', border: `1px solid ${isFree ? 'rgba(6,214,160,0.15)' : 'rgba(255,107,157,0.15)'}` }}>
                <Info size={14} className="flex-shrink-0 mt-0.5" style={{ color: isFree ? 'var(--aurora-green)' : 'var(--aurora-pink)' }} />
                <p className="text-xs" style={{ color: isFree ? 'var(--aurora-green)' : 'var(--aurora-pink)' }}>
                  {isFree
                    ? 'This wallpaper will be free for all users to download.'
                    : `Premium wallpaper — You earn 80% of each sale (₹${(parseFloat(form.price || 0) * 0.8).toFixed(2)} per download).`
                  }
                </p>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="btn-primary w-full py-4 mt-2 text-base">
              {loading
                ? <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Uploading...</>
                : <><Upload size={18} /> Publish Wallpaper</>
              }
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
