import { useState, useCallback } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import NotesPanel from './NotesPanel';
import { MONTH_THEMES } from '../utils/CalendarUtils.js';

export default function WallCalendar() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [selecting, setSelecting] = useState(false);
  const [notes, setNotes] = useState({});
  const [flipping, setFlipping] = useState(false);
  const [flipDir, setFlipDir] = useState('next');

  const theme = MONTH_THEMES[month];

  const navigate = useCallback((dir) => {
    if (flipping) return;
    setFlipDir(dir);
    setFlipping(true);
    setTimeout(() => {
      if (dir === 'next') {
        if (month === 11) { setMonth(0); setYear(y => y + 1); }
        else setMonth(m => m + 1);
      } else {
        if (month === 0) { setMonth(11); setYear(y => y - 1); }
        else setMonth(m => m - 1);
      }
      setRangeStart(null);
      setRangeEnd(null);
      setSelecting(false);
      setFlipping(false);
    }, 320);
  }, [flipping, month]);

  const handleDayClick = useCallback((date) => {
    if (!selecting || !rangeStart) {
      setRangeStart(date);
      setRangeEnd(null);
      setSelecting(true);
    } else {
      if (date < rangeStart) {
        setRangeEnd(rangeStart);
        setRangeStart(date);
      } else {
        setRangeEnd(date);
      }
      setSelecting(false);
    }
  }, [selecting, rangeStart]);

  const handleNotesChange = useCallback((key, value) => {
    setNotes(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearRange = () => {
    setRangeStart(null);
    setRangeEnd(null);
    setSelecting(false);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Calendar card */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300"
        style={{
          transform: flipping
            ? flipDir === 'next'
              ? 'rotateX(-8deg) scale(0.97)'
              : 'rotateX(8deg) scale(0.97)'
            : 'rotateX(0deg) scale(1)',
          opacity: flipping ? 0.85 : 1,
          transformOrigin: 'center top',
          boxShadow: '0 30px 80px -10px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.05)',
        }}
      >
        <CalendarHeader
          month={month}
          year={year}
          onPrev={() => navigate('prev')}
          onNext={() => navigate('next')}
        />

        {/* Selection hint */}
        {selecting && (
          <div
            className="mx-4 mt-3 px-3 py-1.5 rounded-lg text-xs flex items-center justify-between"
            style={{ background: `${theme.accent}15`, color: theme.accent, fontFamily: "'DM Mono', monospace", fontSize: '0.65rem' }}
          >
            <span>🖱 Click an end date to complete range</span>
            <button onClick={clearRange} className="opacity-60 hover:opacity-100 transition-opacity">✕</button>
          </div>
        )}

        {rangeStart && rangeEnd && (
          <div className="mx-4 mt-3 flex items-center justify-end">
            <button
              onClick={clearRange}
              className="text-xs px-2 py-0.5 rounded-full transition-all hover:opacity-80"
              style={{
                fontFamily: "'DM Mono', monospace",
                background: `${theme.accent}15`,
                color: theme.accent,
                fontSize: '0.6rem',
              }}
            >
              Clear range ✕
            </button>
          </div>
        )}

        <CalendarGrid
          month={month}
          year={year}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          onDayClick={handleDayClick}
          notes={notes}
        />

        <NotesPanel
          month={month}
          year={year}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          notes={notes}
          onNotesChange={handleNotesChange}
        />

        {/* Paper shadow bottom */}
        <div
          className="h-2 w-full"
          style={{
            background: 'linear-gradient(to bottom, #f5f4f0, #e8e6e1)',
          }}
        />
      </div>

      {/* Instructions */}
      <p
        className="text-center mt-4 text-xs"
        style={{ fontFamily: "'DM Mono', monospace", color: '#a8a29e', fontSize: '0.62rem' }}
      >
        Click once to start range · Click again to end · ‹ › to navigate months
      </p>
    </div>
  );
}
