import { useState, useEffect, useCallback } from 'react';
import { MONTH_THEMES, MONTHS } from '../utils/CalendarUtils.js';

const STORAGE_KEY = 'wall-calendar-notes';

function loadNotesFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveNotesToStorage(notes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    return true;
  } catch {
    return false;
  }
}

export default function NotesPanel({ month, year, rangeStart, rangeEnd, notes, onNotesChange }) {
  const theme = MONTH_THEMES[month];
  const [activeTab, setActiveTab] = useState('month');
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved' | 'error'
  const [savedKeys, setSavedKeys] = useState(() => {
    const stored = loadNotesFromStorage();
    return new Set(Object.keys(stored));
  });

  const monthKey = `${year}-${month + 1}`;
  const rangeKey =
    rangeStart && rangeEnd
      ? `range-${rangeStart.toISOString().slice(0, 10)}-${rangeEnd.toISOString().slice(0, 10)}`
      : null;

  const currentKey = activeTab === 'month' ? monthKey : rangeKey || monthKey;
  const currentNote = notes[currentKey] || '';

  // Load stored notes into parent on mount
  useEffect(() => {
    const stored = loadNotesFromStorage();
    Object.entries(stored).forEach(([key, value]) => {
      onNotesChange(key, value);
    });
  }, []);

  // Reset tab when range is cleared
  useEffect(() => {
    if (!rangeKey && activeTab === 'range') setActiveTab('month');
  }, [rangeKey]);

  const handleSave = useCallback(() => {
    setSaveStatus('saving');
    setTimeout(() => {
      const stored = loadNotesFromStorage();
      stored[currentKey] = currentNote;
      const success = saveNotesToStorage(stored);
      if (success) {
        setSaveStatus('saved');
        setSavedKeys(prev => new Set([...prev, currentKey]));
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    }, 180);
  }, [currentKey, currentNote]);

  const handleDelete = useCallback(() => {
    const stored = loadNotesFromStorage();
    delete stored[currentKey];
    saveNotesToStorage(stored);
    onNotesChange(currentKey, '');
    setSavedKeys(prev => {
      const next = new Set(prev);
      next.delete(currentKey);
      return next;
    });
    setSaveStatus('idle');
  }, [currentKey, onNotesChange]);

  const isSaved = savedKeys.has(currentKey);
  const lineCount = Math.max(5, currentNote.split('\n').length + 1);

  return (
    <div className="border-t flex flex-col" style={{ borderColor: '#e7e5e0' }}>
      {/* Header row */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between gap-2">
        <div
          className="text-xs font-bold uppercase tracking-widest"
          style={{ fontFamily: "'DM Mono', monospace", color: '#9ca3af' }}
        >
          Notes
        </div>

        <div className="flex items-center gap-2">
          {/* Tabs */}
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('month')}
              className="text-xs px-2.5 py-1 rounded-full transition-all font-medium"
              style={{
                fontFamily: "'DM Mono', monospace",
                background: activeTab === 'month' ? theme.accent : 'transparent',
                color: activeTab === 'month' ? '#fff' : '#9ca3af',
                fontSize: '0.6rem',
              }}
            >
              {MONTHS[month].slice(0, 3)}
            </button>
            {rangeKey && (
              <button
                onClick={() => setActiveTab('range')}
                className="text-xs px-2.5 py-1 rounded-full transition-all font-medium"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  background: activeTab === 'range' ? theme.accent : 'transparent',
                  color: activeTab === 'range' ? '#fff' : '#9ca3af',
                  fontSize: '0.6rem',
                }}
              >
                Range
              </button>
            )}
          </div>

          {/* Saved badge */}
          {isSaved && saveStatus === 'idle' && (
            <span
              className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.58rem',
                background: `${theme.accent}18`,
                color: theme.accent,
              }}
            >
              ✓ saved
            </span>
          )}
        </div>
      </div>

      {/* Lined textarea */}
      <div className="px-4 pb-3 relative">
        <div className="absolute inset-x-4 top-0 bottom-3 pointer-events-none">
          {Array.from({ length: lineCount }).map((_, i) => (
            <div
              key={i}
              className="w-full"
              style={{
                height: '1.75rem',
                borderBottom: `1px solid ${theme.accent}20`,
              }}
            />
          ))}
        </div>

        <textarea
          value={currentNote}
          onChange={(e) => onNotesChange(currentKey, e.target.value)}
          placeholder={
            activeTab === 'month'
              ? `Thoughts for ${MONTHS[month]}...`
              : `Notes for selected range...`
          }
          className="relative w-full bg-transparent resize-none outline-none text-sm leading-7 z-10 placeholder-stone-300"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: '#374151',
            minHeight: `${lineCount * 1.75}rem`,
            lineHeight: '1.75rem',
          }}
          rows={lineCount}
        />
      </div>

      {/* Action bar */}
      <div
        className="mx-4 mb-4 rounded-xl flex items-center justify-between px-3 py-2 gap-2"
        style={{ background: '#f7f6f3', border: '1px solid #e7e5e0' }}
      >
        {/* Character count */}
        <span
          className="text-xs tabular-nums"
          style={{ fontFamily: "'DM Mono', monospace", color: '#c4bfb5', fontSize: '0.6rem' }}
        >
          {currentNote.length} chars
        </span>

        <div className="flex items-center gap-2">
          {/* Delete button — only if note exists in storage */}
          {isSaved && (
            <button
              onClick={handleDelete}
              className="text-xs px-2.5 py-1.5 rounded-lg transition-all hover:opacity-80 active:scale-95"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.62rem',
                background: '#fee2e2',
                color: '#ef4444',
              }}
              title="Delete saved note"
            >
              🗑 Delete
            </button>
          )}

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving' || !currentNote.trim()}
            className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.65rem',
              background:
                saveStatus === 'saved'
                  ? '#22c55e'
                  : saveStatus === 'error'
                  ? '#ef4444'
                  : theme.accent,
              color: '#fff',
              boxShadow: `0 2px 8px ${theme.accent}40`,
              minWidth: '72px',
            }}
          >
            {saveStatus === 'saving' && (
              <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {saveStatus === 'saved' && '✓ Saved'}
            {saveStatus === 'error' && '✗ Failed'}
            {saveStatus === 'idle' && '💾 Save'}
          </button>
        </div>
      </div>

      {/* Saved notes list */}
      <SavedNotesList
        theme={theme}
        currentKey={currentKey}
        onNotesChange={onNotesChange}
        savedKeys={savedKeys}
        setSavedKeys={setSavedKeys}
      />
    </div>
  );
}

function SavedNotesList({ theme, currentKey, onNotesChange, savedKeys, setSavedKeys }) {
  const [expanded, setExpanded] = useState(false);
  const stored = loadNotesFromStorage();
  const entries = Object.entries(stored).filter(([, v]) => v.trim());

  if (entries.length === 0) return null;

  const handleDeleteEntry = (key) => {
    const fresh = loadNotesFromStorage();
    delete fresh[key];
    saveNotesToStorage(fresh);
    onNotesChange(key, '');
    setSavedKeys(prev => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };

  return (
    <div className="mx-4 mb-4">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all"
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: '0.62rem',
          background: '#f7f6f3',
          border: '1px solid #e7e5e0',
          color: '#9ca3af',
        }}
      >
        <span>📚 {entries.length} saved note{entries.length !== 1 ? 's' : ''}</span>
        <span
          className="transition-transform duration-200"
          style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', display: 'inline-block' }}
        >
          ▾
        </span>
      </button>

      {expanded && (
        <div
          className="mt-1 rounded-xl overflow-hidden"
          style={{ border: '1px solid #e7e5e0' }}
        >
          {entries.map(([key, value], i) => {
            const isActive = key === currentKey;
            const label = key.startsWith('range-')
              ? `📅 ${key.replace('range-', '').replace(/-(\d{4}-\d{2}-\d{2})$/, ' → $1')}`
              : (() => {
                  const [y, m] = key.split('-');
                  return `🗓 ${MONTHS[parseInt(m) - 1]} ${y}`;
                })();

            return (
              <div
                key={key}
                className="px-3 py-2 flex items-start justify-between gap-2"
                style={{
                  background: isActive ? `${theme.accent}08` : i % 2 === 0 ? '#faf9f7' : '#f7f6f3',
                  borderTop: i > 0 ? '1px solid #e7e5e0' : 'none',
                }}
              >
                <div className="flex-1 min-w-0">
                  <div
                    className="font-semibold mb-0.5 truncate"
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '0.6rem',
                      color: isActive ? theme.accent : '#6b7280',
                    }}
                  >
                    {isActive && '▶ '}{label}
                  </div>
                  <div
                    className="truncate"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '0.68rem',
                      color: '#9ca3af',
                    }}
                  >
                    {value.slice(0, 55)}{value.length > 55 ? '…' : ''}
                  </div>
                </div>

                {/* Delete individual entry */}
                <button
                  onClick={() => handleDeleteEntry(key)}
                  className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all hover:bg-red-100 hover:text-red-500 text-stone-300"
                  style={{ fontSize: '0.6rem' }}
                  title="Delete this note"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export { loadNotesFromStorage, STORAGE_KEY };
