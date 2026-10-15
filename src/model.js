// Dates are integer Gregorian civil days, never elapsed local 24-hour periods.
const DAY_MS = 86400000;
export const DEFAULTS = Object.freeze({
  title: 'Feiertage & Traditionen', max_items: 3, entity: null,
  family_slava: 'Aranđelovdan', family_name: '',
  show_family_countdown: true, show_footer: true,
});
export function civilDay(year, month, day) {
  return Math.floor(Date.UTC(year, month - 1, day) / DAY_MS);
}
export function dayISO(day) { return new Date(day * DAY_MS).toISOString().slice(0, 10); }
export function parseDay(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [y, m, d] = value.split('-').map(Number);
  const result = civilDay(y, m, d);
  return dayISO(result) === value ? result : null;
}
const formatters = new Map();
export function dayInZone(instant = new Date(), zone = 'Europe/Belgrade') {
  if (!formatters.has(zone)) formatters.set(zone, new Intl.DateTimeFormat('en-CA', { timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit' }));
  const parts = Object.fromEntries(formatters.get(zone).formatToParts(instant).map((p) => [p.type, p.value]));
  return civilDay(Number(parts.year), Number(parts.month), Number(parts.day));
}
export function normalizeName(value) {
  return String(value || '').replace(/[đĐ]/g, 'dj').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
}
export function normalizeConfig(config) {
  if (!config || typeof config !== 'object') throw new Error('Eine Kartenkonfiguration ist erforderlich.');
  const result = { ...DEFAULTS, ...config };
  if (!Number.isInteger(result.max_items) || result.max_items < 1 || result.max_items > 12) throw new Error('max_items muss zwischen 1 und 12 liegen.');
  for (const key of ['title', 'family_name']) if (typeof result[key] !== 'string') throw new Error(`${key} muss ein Text sein.`);
  if (result.family_slava !== false && typeof result.family_slava !== 'string') throw new Error('family_slava muss ein Name oder false sein.');
  if (result.entity !== null && result.entity !== '' && (typeof result.entity !== 'string' || !/^calendar\.[a-z0-9_]+$/.test(result.entity))) throw new Error('entity muss eine calendar-Entität sein.');
  for (const key of ['show_family_countdown', 'show_footer']) if (typeof result[key] !== 'boolean') throw new Error(`${key} muss true oder false sein.`);
  if (result.time_zone) new Intl.DateTimeFormat('de', { timeZone: result.time_zone }).format();
  return result;
}
// Julian computus converted to the Gregorian civil calendar.
export function orthodoxEaster(year) {
  const a = year % 4, b = year % 7, c = year % 19;
  const d = (19 * c + 15) % 30;
  const e = (2 * a + 4 * b - d + 34) % 7;
  const month = Math.floor((d + e + 114) / 31);
  const date = (d + e + 114) % 31 + 1;
  const offset = Math.floor(year / 100) - Math.floor(year / 400) - 2;
  return civilDay(year, month, date) + offset;
}
const FIXED = [
  [1, 6, 'Badnje veče', 'Tradition', 'Heiligabend mit Badnjak und Familienbräuchen.'],
  [1, 14, 'Serbisches Neujahr', 'Tradition', 'Neujahr nach dem alten Kalender.'],
  [1, 27, 'Sveti Sava', 'Gedenktag', 'Feierlichkeiten besonders in Schulen und Kirche.'],
  [4, 22, 'Gedenken an die Opfer des Faschismus', 'Gedenktag', 'Gedenken an die Opfer des Zweiten Weltkriegs.'],
  [5, 6, 'Đurđevdan', 'Slava', 'Familienfeier des heiligen Georg.'],
  [5, 9, 'Tag des Sieges', 'Gedenktag', 'Gedenken an das Ende des Zweiten Weltkriegs in Europa.'],
  [6, 28, 'Vidovdan', 'Gedenktag', 'Historisches und kirchliches Gedenken.'],
  [10, 21, 'Gedenken an Kriegsopfer', 'Gedenktag', 'Gedenken an die serbischen Opfer des Zweiten Weltkriegs.'],
  [11, 8, 'Mitrovdan', 'Slava', 'Slava des heiligen Demetrius mit Familienbesuchen.'],
  [11, 21, 'Aranđelovdan', 'Slava', 'Slava des Erzengels Michael mit Familienbesuchen.'],
  [12, 19, 'Nikoljdan', 'Slava', 'Eine der verbreitetsten serbischen Slavas.'],
];
const NATIONAL = [
  [1, 1, 2, 'Neujahr', 'Familienfeiern und Besuche.', ['New Year', 'New Year’s Day', 'Nova godina']],
  [2, 15, 2, 'Sretenje', 'Tag der Staatlichkeit Serbiens.', ['Statehood Day', 'Serbian Statehood Day', 'Dan državnosti']],
  [5, 1, 2, 'Tag der Arbeit', 'Ausflüge, Grillieren und Treffen im Freien.', ['Labour Day', 'Labor Day', 'May Day', 'Praznik rada']],
  [11, 11, 1, 'Tag des Waffenstillstands', 'Gedenken an das Ende des Ersten Weltkriegs.', ['Armistice Day', 'Dan primirja']],
];
export function eventsForYear(year) {
  const events = [];
  const add = (start, end, name, kind, free, hint, aliases = []) => events.push({ id: `${dayISO(start)}:${normalizeName(name)}`, start, end, name, kind, free, hint, aliases, source: 'local' });
  const easter = orthodoxEaster(year), christmas = civilDay(year, 1, 7);
  const closed = new Set([christmas, easter - 2, easter - 1, easter, easter + 1]);
  for (const [m, d, length] of NATIONAL) for (let i = 0; i < length; i++) closed.add(civilDay(year, m, d) + i);
  for (const [m, d, length, name, hint, aliases] of NATIONAL) {
    const start = civilDay(year, m, d);
    add(start, start + length - 1, name, 'Feiertag', true, hint, aliases);
    for (let i = 0; i < length; i++) {
      const date = start + i;
      if (new Date(date * DAY_MS).getUTCDay() !== 0) continue;
      let observed = date + 1;
      while ([0, 6].includes(new Date(observed * DAY_MS).getUTCDay()) || closed.has(observed)) observed++;
      closed.add(observed);
      add(observed, observed, `${name} · Ersatzfeiertag`, 'Feiertag', true, 'Ersatz für den Feiertag am Sonntag.', aliases);
    }
  }
  add(christmas, christmas, 'Božić', 'Feiertag', true, 'Orthodoxes Weihnachten mit Familienbesuchen und Česnica.', ['Orthodox Christmas', 'Julian Orthodox Christmas']);
  add(easter - 2, easter + 1, 'Vaskrs · orthodoxe Ostertage', 'Feiertag', true, `Karfreitag bis Ostermontag. Ostersonntag: ${formatDate(easter)}.`, ['Orthodox Easter', 'Orthodox Easter Holidays', 'Good Friday', 'Easter Monday']);
  for (const [m, d, name, kind, hint] of FIXED) add(civilDay(year, m, d), civilDay(year, m, d), name, kind, false, hint);
  return events;
}
function calendarDate(value, zone) {
  if (typeof value !== 'string') return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return parseDay(value);
  if (!/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}/.test(value) || parseDay(value.slice(0, 10)) === null) return null;
  if (!/(Z|[+-]\d{2}:?\d{2})$/i.test(value)) return parseDay(value.slice(0, 10));
  const instant = new Date(value.replace(' ', 'T'));
  return Number.isFinite(instant.getTime()) ? dayInZone(instant, zone) : null;
}
export function supplementCalendar(events, entity, today, now, zone) {
  if (!entity || !['on', 'off'].includes(entity.state)) return { events, note: 'Zusatzkalender nicht verfügbar. Die lokalen Termine sind weiterhin verfügbar.' };
  // last_reported is not always sent to the frontend. Use last_updated as a
  // conservative fallback; never accept an old state as a live calendar result.
  const reported = Date.parse(entity.last_reported || entity.last_updated || '');
  if (!Number.isFinite(reported) || now.getTime() - reported > 21600000 || reported - now.getTime() > 60000) return { events, note: 'Zusatzkalender: Zeitstand unklar oder älter als 6 Stunden.' };
  const attrs = entity.attributes || {};
  const start = calendarDate(attrs.start_time, zone), exclusive = calendarDate(attrs.end_time, zone);
  if (attrs.all_day !== true || start === null || exclusive === null || exclusive <= start || typeof attrs.message !== 'string' || !attrs.message.trim()) return { events, note: 'Zusatzkalender: kein gültiger ganztägiger Termin.' };
  const end = exclusive - 1;
  if (end < today || (entity.state === 'on') !== (start <= today && today <= end)) return { events, note: 'Zusatzkalender: Datum und Zustand passen nicht zusammen.' };
  const name = attrs.message.trim(), normalized = normalizeName(name);
  const known = events.some((event) => event.start <= start && end <= event.end && [event.name, ...event.aliases].some((alias) => normalizeName(alias) === normalized));
  if (known) return { events, note: 'Zusatzkalender geprüft; Termin bereits lokal enthalten.' };
  return { events: [...events, { id: `calendar:${dayISO(start)}:${normalized}`, start, end, name, kind: 'Kalendertermin', free: null, hint: 'Zusätzlicher Termin aus dem Kalender. Arbeitsfreiheit ungeprüft.', aliases: [], source: 'calendar' }], note: 'Der nächste ganztägige Termin des Zusatzkalenders wurde berücksichtigt.' };
}
export function createModel(today, config = DEFAULTS, calendarEntity = null, now = new Date(), zone = 'Europe/Belgrade') {
  const year = new Date(today * DAY_MS).getUTCFullYear();
  let all = [year - 1, year, year + 1, year + 2].flatMap(eventsForYear);
  let calendarNote = '';
  if (config.entity) ({ events: all, note: calendarNote } = supplementCalendar(all, calendarEntity, today, now, zone));
  const family = normalizeName(config.family_slava);
  all = all.map((event) => ({ ...event, family: !!config.family_slava && event.kind === 'Slava' && normalizeName(event.name) === family }));
  const upcoming = all.filter((event) => event.end >= today).sort((a, b) => a.start - b.start || a.name.localeCompare(b.name, 'de'));
  const visible = upcoming.slice(0, config.max_items);
  const nextFamily = upcoming.find((event) => event.family) || null;
  return { today, upcoming, visible, nextFamily, calendarNote,
    familyPin: config.show_family_countdown && nextFamily && !visible.some((event) => event.id === nextFamily.id) ? nextFamily : null,
    annual: upcoming.filter((event) => event.start < today + 366),
  };
}
export function distance(event, today) {
  const days = event.start - today;
  return days <= 0 ? 'Heute' : days === 1 ? 'Morgen' : `In ${days} Tagen`;
}
export function formatDate(day, includeYear = true) {
  return new Intl.DateTimeFormat('de-CH', { timeZone: 'UTC', day: '2-digit', month: '2-digit', ...(includeYear ? { year: 'numeric' } : {}) }).format(new Date(day * DAY_MS));
}
export function dateRange(event) { return event.start === event.end ? formatDate(event.start) : `${formatDate(event.start)} – ${formatDate(event.end)}`; }
export function shortDate(day) { return new Intl.DateTimeFormat('de-CH', { timeZone: 'UTC', day: 'numeric', month: 'short' }).format(new Date(day * DAY_MS)); }
export function familyLabel(config) { return config.family_name.trim() ? `Slava ${config.family_name.trim()}` : 'Unsere Slava'; }
export function presentation(event, config) {
  if (event.family) return { tone: 'family', icon: 'mdi:home-heart', label: familyLabel(config) };
  if (event.free === true) return { tone: 'holiday', icon: 'mdi:calendar-check-outline', label: 'Arbeitsfrei' };
  if (event.kind === 'Slava') return { tone: 'slava', icon: 'mdi:church-outline', label: 'Slava' };
  if (event.kind === 'Gedenktag') return { tone: 'memorial', icon: 'mdi:ribbon', label: 'Gedenktag · nicht allg. arbeitsfrei' };
  if (event.kind === 'Tradition') return { tone: 'tradition', icon: 'mdi:candle', label: 'Tradition · nicht allg. arbeitsfrei' };
  return { tone: 'calendar', icon: 'mdi:calendar-outline', label: 'Arbeitsfreiheit ungeprüft' };
}
export function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}
