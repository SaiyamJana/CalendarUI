import january from '../assets/january.png';
import february from '../assets/february.png';
import march from '../assets/march.png';
import april from '../assets/april.png';
import may from '../assets/may.png';
import june from '../assets/june.png';
import july from '../assets/july.png';
import august from '../assets/august.png';
import september from '../assets/september.png';
import october from '../assets/october.png';
import november from '../assets/november.png';
import december from '../assets/december.png';


export const MONTHS = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];

export const DAYS_SHORT = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export const MONTH_THEMES = [
  { bg: 'from-sky-900 to-blue-700', accent: '#38BDF8', label: 'Winter Peaks', emoji: '🏔️' },
  { bg: 'from-rose-900 to-pink-700', accent: '#FB7185', label: 'Frost Blooms', emoji: '🌸' },
  { bg: 'from-emerald-900 to-teal-700', accent: '#34D399', label: 'New Growth', emoji: '🌿' },
  { bg: 'from-violet-900 to-purple-700', accent: '#A78BFA', label: 'Spring Mist', emoji: '🌷' },
  { bg: 'from-amber-800 to-yellow-600', accent: '#FCD34D', label: 'Golden Fields', emoji: '🌾' },
  { bg: 'from-cyan-900 to-teal-600', accent: '#67E8F9', label: 'Ocean Breeze', emoji: '🌊' },
  { bg: 'from-orange-900 to-red-700', accent: '#FB923C', label: 'Summer Heat', emoji: '☀️' },
  { bg: 'from-lime-900 to-green-700', accent: '#A3E635', label: 'Forest Deep', emoji: '🌲' },
  { bg: 'from-stone-800 to-amber-700', accent: '#D97706', label: 'Harvest Gold', emoji: '🍂' },
  { bg: 'from-slate-800 to-blue-900', accent: '#60A5FA', label: 'Autumn Dusk', emoji: '🌙' },
  { bg: 'from-zinc-800 to-slate-700', accent: '#94A3B8', label: 'Silver Fog', emoji: '🌫️' },
  { bg: 'from-indigo-900 to-blue-800', accent: '#818CF8', label: 'Winter Solstice', emoji: '❄️' },
];

export const MONTH_IMAGES = [
  january, february, march, april,
  may, june, july, august,
  september, october, november, december
];

export const HOLIDAYS = {
  '1-1': "New Year's Day",
  '1-26': 'Republic Day',
  '3-8': "Women's Day",
  '4-14': 'Dr. Ambedkar Jayanti',
  '5-1': 'Labour Day',
  '8-15': 'Independence Day',
  '10-2': 'Gandhi Jayanti',
  '11-1': "All Saints' Day",
  '12-25': 'Christmas',
  '12-31': "New Year's Eve",
};

export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year, month) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday-based
}

export function isSameDay(d1, d2) {
  return d1 && d2 &&
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();
}

export function isInRange(date, start, end) {
  if (!start || !end || !date) return false;
  const s = start < end ? start : end;
  const e = start < end ? end : start;
  return date > s && date < e;
}