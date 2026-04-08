const CATEGORIES = [
  { value: 'all', label: 'All', emoji: '🌐' },
  { value: 'nature', label: 'Nature', emoji: '🌿' },
  { value: 'abstract', label: 'Abstract', emoji: '🎨' },
  { value: 'architecture', label: 'Architecture', emoji: '🏛️' },
  { value: 'space', label: 'Space', emoji: '🌌' },
  { value: 'animals', label: 'Animals', emoji: '🦋' },
  { value: 'minimalist', label: 'Minimal', emoji: '◼️' },
  { value: 'dark', label: 'Dark', emoji: '🖤' },
  { value: 'gradient', label: 'Gradient', emoji: '🌈' },
  { value: 'cars', label: 'Cars', emoji: '🚗' },
  { value: 'art', label: 'Art', emoji: '🖼️' },
];

export default function CategoryFilter({ active, onChange }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {CATEGORIES.map(cat => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value)}
          className={`tag flex-shrink-0 flex items-center gap-1.5 ${active === cat.value ? 'active' : ''}`}
        >
          <span>{cat.emoji}</span>
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
