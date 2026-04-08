import { DAYS_SHORT, getDaysInMonth, getFirstDayOfMonth, isSameDay, isInRange, HOLIDAYS, MONTH_THEMES } from '../utils/CalendarUtils.js';

export default function CalendarGrid({ month, year, rangeStart, rangeEnd, onDayClick, notes }) {
  const theme = MONTH_THEMES[month];
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const getDayState = (day) => {
    if (!day) return 'empty';
    const date = new Date(year, month, day);
    if (isSameDay(date, rangeStart) || isSameDay(date, rangeEnd)) return 'selected';
    if (isInRange(date, rangeStart, rangeEnd)) return 'in-range';
    if (isSameDay(date, today)) return 'today';
    return 'default';
  };

  const getHolidayKey = (day) => `${month + 1}-${day}`;

  return (
    <div className="px-4 pb-4 pt-1">
      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS_SHORT.map((d, i) => (
          <div
            key={d}
            className="text-center py-1 text-xs font-bold tracking-widest"
            style={{
              fontFamily: "'DM Mono', monospace",
              color: i >= 5 ? theme.accent : '#94a3b8',
              fontSize: '0.6rem'
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, idx) => {
          const state = getDayState(day);
          const holiday = day && HOLIDAYS[getHolidayKey(day)];
          const hasNote = day && notes[`${year}-${month + 1}-${day}`];
          const isWeekend = day && ((firstDay + day - 1) % 7) >= 5;

          return (
            <div
              key={idx}
              onClick={() => day && onDayClick(new Date(year, month, day))}
              className={`
                relative flex flex-col items-center justify-center
                w-full aspect-square rounded-lg cursor-pointer
                transition-all duration-200 select-none
                ${day ? 'hover:scale-105' : ''}
                ${state === 'selected' ? 'text-white shadow-lg scale-105 z-10' : ''}
                ${state === 'in-range' ? 'text-white' : ''}
                ${state === 'today' ? 'ring-2 font-bold' : ''}
                ${state === 'default' ? 'hover:bg-stone-100' : ''}
              `}
              style={{
                background:
                  state === 'selected'
                    ? theme.accent
                    : state === 'in-range'
                    ? `${theme.accent}25`
                    : state === 'today'
                    ? `${theme.accent}10`
                    : 'transparent',
                ringColor: state === 'today' ? theme.accent : 'transparent',
              }}
            >
              {day && (
                <>
                  <span
                    className="text-xs leading-none font-semibold"
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '0.72rem',
                      color:
                        state === 'selected'
                          ? '#fff'
                          : state === 'in-range'
                          ? theme.accent
                          : isWeekend
                          ? theme.accent
                          : '#374151',
                    }}
                  >
                    {day}
                  </span>

                  {/* Holiday dot */}
                  {holiday && (
                    <div
                      className="absolute bottom-0.5 w-1 h-1 rounded-full"
                      style={{ background: state === 'selected' ? '#fff' : theme.accent }}
                      title={holiday}
                    />
                  )}

                  {/* Note indicator */}
                  {hasNote && !holiday && (
                    <div
                      className="absolute bottom-0.5 w-1 h-1 rounded-full bg-amber-400"
                      title="Has note"
                    />
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Range summary */}
      {rangeStart && rangeEnd && (
        <div
          className="mt-3 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2"
          style={{ background: `${theme.accent}15`, color: theme.accent, fontFamily: "'DM Mono', monospace" }}
        >
          <span>📅</span>
          <span>
            {rangeStart.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
            {' → '}
            {rangeEnd.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
            {' '}
            ({Math.abs(Math.round((rangeEnd - rangeStart) / 86400000)) + 1} days)
          </span>
        </div>
      )}
    </div>
  );
}
