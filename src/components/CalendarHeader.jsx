import { MONTHS, MONTH_THEMES, MONTH_IMAGES } from '../utils/CalendarUtils.js';

export default function CalendarHeader({ month, year, onPrev, onNext }) {
  const theme = MONTH_THEMES[month];
  const image = MONTH_IMAGES[month];

  return (
    <div className="relative overflow-hidden rounded-t-2xl" style={{ minHeight: '260px' }}>
      {/* Spiral binding */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-center gap-[18px] pt-1">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-4 h-4 rounded-full border-2 border-stone-400 bg-stone-200 shadow-inner" />
            <div className="w-1 h-2 bg-stone-300" />
          </div>
        ))}
      </div>

      {/* Hero image */}
      <div className="relative w-full" style={{ height: '260px' }}>
        <img
          src={image}
          alt={MONTHS[month]}
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center 40%' }}
        />

        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg} opacity-50`} />

        {/* Bottom diagonal accent */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 400 60" preserveAspectRatio="none" className="w-full h-14">
            <polygon points="0,60 0,30 180,0 400,20 400,60" fill="white" fillOpacity="0.97" />
          </svg>
        </div>

        {/* Month/Year label */}
        <div className="absolute bottom-6 right-6 text-right">
          <div
            className="text-xs font-bold tracking-widest uppercase mb-0.5"
            style={{ color: theme.accent, fontFamily: "'DM Mono', monospace", textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}
          >
            {year}
          </div>
          <div
            className="text-3xl font-black uppercase tracking-tight"
            style={{ color: '#fff', fontFamily: "'Playfair Display', serif", textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}
          >
            {MONTHS[month]}
          </div>
          <div
            className="text-xs mt-0.5 font-medium tracking-widest"
            style={{ color: theme.accent, fontFamily: "'DM Mono', monospace", textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}
          >
            {theme.emoji} {theme.label}
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={onPrev}
          className="absolute left-3 bottom-8 w-8 h-8 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
          style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)', border: `1px solid ${theme.accent}40` }}
          aria-label="Previous month"
        >
          ‹
        </button>
        <button
          onClick={onNext}
          className="absolute left-14 bottom-8 w-8 h-8 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
          style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)', border: `1px solid ${theme.accent}40` }}
          aria-label="Next month"
        >
          ›
        </button>
      </div>
    </div>
  );
}
