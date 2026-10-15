/* ha-feiertage-serbien v1.0.0 | MIT | AshenSage */
(() => {
"use strict";
const VERSION = "1.0.0";
const CARD_CSS = ":host{display:block;min-width:0;--blue:var(--feiertage-next-color,#76bde7);--gold:var(--feiertage-family-color,#e2b866);--mint:#85cfa4;--purple:#c6a0e1}\n*{box-sizing:border-box}ha-card{display:block;overflow:hidden;padding:12px;background:var(--ha-card-background,var(--card-background-color,#fff));color:var(--primary-text-color,#222);border:1px solid var(--ha-card-border-color,var(--divider-color,#ddd));border-radius:var(--ha-card-border-radius,18px);box-shadow:var(--ha-card-box-shadow,none);container-type:inline-size}\nbutton{font:inherit;color:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent}button:focus-visible{outline:2px solid var(--primary-color,#509ac6);outline-offset:2px}ha-icon{display:inline-flex;flex:none;--mdc-icon-size:17px}\nheader{display:flex;align-items:center;gap:9px;padding:1px 1px 10px}header ha-icon{color:var(--blue);--mdc-icon-size:23px}h2{flex:1;min-width:0;margin:0;font-size:16px;line-height:1.3;font-weight:650;text-align:left;overflow-wrap:anywhere}.country{flex:none;border:1px solid var(--divider-color,#ddd);border-radius:9px;padding:3px 6px;font-size:10px;font-weight:650;color:var(--secondary-text-color,#666)}\n.rows{display:grid;gap:1px}.event{position:relative;width:100%;display:grid;grid-template-columns:41px minmax(0,1fr) auto;grid-template-areas:'date title count' 'date meta meta';column-gap:9px;row-gap:3px;align-items:center;min-height:66px;padding:10px 7px;border:0;border-top:1px solid var(--divider-color,#ddd);background:transparent;text-align:left;border-radius:0}.event:first-child{border-top-color:transparent}.event.next{border:1px solid color-mix(in srgb,var(--blue) 28%,transparent);border-left:3px solid var(--blue);border-radius:12px;background:color-mix(in srgb,var(--blue) 8%,transparent);margin-bottom:4px;padding-left:5px}.event.family{border:1px solid color-mix(in srgb,var(--gold) 42%,transparent);border-left:3px solid var(--gold);border-radius:12px;background:color-mix(in srgb,var(--gold) 10%,transparent);padding-left:5px;margin-top:3px;margin-bottom:3px}\n.date{grid-area:date;align-self:start;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;min-height:45px;border-radius:9px;background:color-mix(in srgb,var(--primary-text-color,#222) 5%,transparent)}.date strong{font-size:22px;line-height:1.05;font-weight:650}.date small{font-size:10px;line-height:1.1;color:var(--secondary-text-color,#666);text-transform:uppercase;letter-spacing:.3px}.next .date{background:color-mix(in srgb,var(--blue) 12%,transparent)}.family .date{background:color-mix(in srgb,var(--gold) 16%,transparent)}\n.title{grid-area:title;min-width:0;font-size:14px;font-weight:650;line-height:1.3;overflow-wrap:anywhere}.count{grid-area:count;align-self:start;white-space:nowrap;line-height:1.4;font-size:11px;color:var(--secondary-text-color,#666);padding-top:2px}.next .count{color:var(--primary-text-color,#222);background:color-mix(in srgb,var(--blue) 11%,transparent);padding:3px 6px;border-radius:12px;margin-top:-1px}.meta{grid-area:meta;display:flex;align-items:center;gap:5px;min-width:0;font-size:11.5px;line-height:1.3;color:var(--secondary-text-color,#666);overflow-wrap:anywhere}.meta ha-icon{--mdc-icon-size:15px;color:var(--blue)}.slava .meta ha-icon{color:var(--purple)}.holiday .meta ha-icon{color:var(--mint)}.family .meta ha-icon{color:var(--gold)}.family .meta span{color:var(--primary-text-color,#222);font-weight:600}.year{font-size:10px;color:var(--secondary-text-color,#666);margin-left:4px;font-weight:400}\n.family-pin{width:100%;margin-top:8px;display:flex;align-items:center;gap:7px;min-height:39px;padding:8px 9px;border:1px solid color-mix(in srgb,var(--gold) 38%,transparent);border-radius:10px;background:color-mix(in srgb,var(--gold) 8%,transparent);text-align:left}.family-pin ha-icon{color:var(--gold);--mdc-icon-size:18px}.family-pin strong{font-size:12px;font-weight:650;flex:1;overflow-wrap:anywhere;min-width:0}.family-pin small{font-size:11px;color:var(--secondary-text-color,#666);white-space:nowrap}\nfooter{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:9px;padding-top:8px;border-top:1px solid var(--divider-color,#ddd)}footer button{display:flex;align-items:center;gap:5px;padding:4px 0;border:0;background:none;font-size:11px;color:var(--secondary-text-color,#666);min-height:27px}.all-button{font-weight:650!important;color:var(--primary-text-color,#222)!important}.all-button ha-icon{color:var(--blue);--mdc-icon-size:18px}.source-button ha-icon{--mdc-icon-size:15px}.source-button[data-warning='true'] ha-icon{color:var(--gold)}\ndialog{width:min(460px,calc(100vw - 24px));max-width:none;max-height:85dvh;overflow:auto;margin:auto;padding:0;border:1px solid var(--ha-card-border-color,var(--divider-color,#ddd));border-radius:20px;color:var(--primary-text-color,#222);background:var(--ha-card-background,var(--card-background-color,#fff));box-shadow:0 12px 50px #0005}dialog::backdrop{background:#0007}.dialog-head{position:sticky;top:0;z-index:1;display:flex;align-items:center;gap:8px;padding:14px 16px;background:var(--ha-card-background,var(--card-background-color,#fff));border-bottom:1px solid var(--divider-color,#ddd)}.dialog-head h3{flex:1;min-width:0;margin:0;font-size:17px;line-height:1.3;overflow-wrap:anywhere}.dialog-head button{border:0;background:transparent;border-radius:50%;padding:8px;display:flex;align-items:center;justify-content:center;min-width:36px;min-height:36px}.dialog-content{padding:12px 16px 18px;font-size:14px;line-height:1.6}.dialog-content p{margin:0 0 12px}.dialog-content .event{padding-top:11px;padding-bottom:11px}.dialog-content .event:first-child{border-top:0}.dialog-content .title{font-size:14px}.dialog-content .count{font-size:11px}.dialog-intro{color:var(--secondary-text-color,#666);font-size:12px}.detail-type{display:inline-flex;align-items:center;gap:7px;padding:6px 10px;margin:2px 0 14px;border-radius:9px;background:color-mix(in srgb,var(--blue) 9%,transparent);font-size:13px}.detail-type.family{background:color-mix(in srgb,var(--gold) 13%,transparent)}.detail-type.family ha-icon{color:var(--gold)}.detail-type.slava ha-icon{color:var(--purple)}.detail-type.holiday ha-icon{color:var(--mint)}.year-heading{font-size:12px;color:var(--secondary-text-color,#666);margin:16px 5px 4px;font-weight:650}.year-heading:first-of-type{margin-top:0}.muted{color:var(--secondary-text-color,#666);font-size:12px}\n@container (max-width:310px){h2{font-size:14px}.country{display:none}.event{grid-template-columns:36px minmax(0,1fr) auto;column-gap:7px;padding-right:4px}.title{font-size:13px}.count{font-size:10px}.next .count{padding:3px 4px}.meta{font-size:11px}.date strong{font-size:20px}.family-pin{flex-wrap:wrap;column-gap:6px}.family-pin small{font-size:10px}.family-pin strong{font-size:11px}}\n@media(prefers-reduced-motion:no-preference){button{transition:background-color .12s ease}button:hover{background-color:color-mix(in srgb,var(--primary-text-color,#222) 5%,transparent)}}\n";
// Dates are integer Gregorian civil days, never elapsed local 24-hour periods.
const DAY_MS = 86400000;
const DEFAULTS = Object.freeze({
  title: 'Feiertage & Traditionen', max_items: 3, entity: null,
  family_slava: 'Aranđelovdan', family_name: '',
  show_family_countdown: true, show_footer: true,
});
function civilDay(year, month, day) {
  return Math.floor(Date.UTC(year, month - 1, day) / DAY_MS);
}
function dayISO(day) { return new Date(day * DAY_MS).toISOString().slice(0, 10); }
function parseDay(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [y, m, d] = value.split('-').map(Number);
  const result = civilDay(y, m, d);
  return dayISO(result) === value ? result : null;
}
const formatters = new Map();
function dayInZone(instant = new Date(), zone = 'Europe/Belgrade') {
  if (!formatters.has(zone)) formatters.set(zone, new Intl.DateTimeFormat('en-CA', { timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit' }));
  const parts = Object.fromEntries(formatters.get(zone).formatToParts(instant).map((p) => [p.type, p.value]));
  return civilDay(Number(parts.year), Number(parts.month), Number(parts.day));
}
function normalizeName(value) {
  return String(value || '').replace(/[đĐ]/g, 'dj').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
}
function normalizeConfig(config) {
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
function orthodoxEaster(year) {
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
function eventsForYear(year) {
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
function supplementCalendar(events, entity, today, now, zone) {
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
function createModel(today, config = DEFAULTS, calendarEntity = null, now = new Date(), zone = 'Europe/Belgrade') {
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
function distance(event, today) {
  const days = event.start - today;
  return days <= 0 ? 'Heute' : days === 1 ? 'Morgen' : `In ${days} Tagen`;
}
function formatDate(day, includeYear = true) {
  return new Intl.DateTimeFormat('de-CH', { timeZone: 'UTC', day: '2-digit', month: '2-digit', ...(includeYear ? { year: 'numeric' } : {}) }).format(new Date(day * DAY_MS));
}
function dateRange(event) { return event.start === event.end ? formatDate(event.start) : `${formatDate(event.start)} – ${formatDate(event.end)}`; }
function shortDate(day) { return new Intl.DateTimeFormat('de-CH', { timeZone: 'UTC', day: 'numeric', month: 'short' }).format(new Date(day * DAY_MS)); }
function familyLabel(config) { return config.family_name.trim() ? `Slava ${config.family_name.trim()}` : 'Unsere Slava'; }
function presentation(event, config) {
  if (event.family) return { tone: 'family', icon: 'mdi:home-heart', label: familyLabel(config) };
  if (event.free === true) return { tone: 'holiday', icon: 'mdi:calendar-check-outline', label: 'Arbeitsfrei' };
  if (event.kind === 'Slava') return { tone: 'slava', icon: 'mdi:church-outline', label: 'Slava' };
  if (event.kind === 'Gedenktag') return { tone: 'memorial', icon: 'mdi:ribbon', label: 'Gedenktag · nicht allg. arbeitsfrei' };
  if (event.kind === 'Tradition') return { tone: 'tradition', icon: 'mdi:candle', label: 'Tradition · nicht allg. arbeitsfrei' };
  return { tone: 'calendar', icon: 'mdi:calendar-outline', label: 'Arbeitsfreiheit ungeprüft' };
}
function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

const MONTHS = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
class FeiertageSerbienCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<style>${CARD_CSS}</style><ha-card><main></main></ha-card><dialog aria-labelledby="dialog-title"></dialog>`;
    this._dialog = this.shadowRoot.querySelector('dialog');
    this.shadowRoot.addEventListener('click', (event) => {
      const button = event.target.closest('button');
      if (!button) return;
      const id = button.dataset.event;
      if (id) {
        const item = this._model?.upcoming.find((entry) => entry.id === id);
        if (item) this._showDialog({ type: 'event', id, fromList: this._dialogState?.type === 'all' });
      } else if (button.dataset.action === 'close') this._dialog.close();
      else if (button.dataset.action) this._showDialog({ type: button.dataset.action });
    });
    this._dialog.addEventListener('click', (event) => {
      if (event.target !== this._dialog) return;
      const box = this._dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) this._dialog.close();
    });
    this._dialog.addEventListener('close', () => { this._dialogState = null; });
  }
  setConfig(config) {
    this._config = normalizeConfig(config);
    this._signature = null;
    this._render();
  }
  set hass(hass) { this._hass = hass; this._render(); }
  get hass() { return this._hass; }
  connectedCallback() {
    this._render();
    if (!this._timer) this._timer = setInterval(() => this._render(), 60000);
  }
  disconnectedCallback() {
    clearInterval(this._timer); this._timer = null;
    if (this._dialog.open) this._dialog.close();
  }
  getCardSize() { return Math.ceil((this.shadowRoot.querySelector('ha-card').offsetHeight || 320) / 50); }
  getGridOptions() { return { columns: 12, rows: 'auto', min_columns: 6 }; }
  static getStubConfig() { return { type: 'custom:feiertage-serbien-card', family_slava: 'Aranđelovdan', family_name: '' }; }
  _zone() {
    return this._config?.time_zone || this._hass?.config?.time_zone || 'Europe/Belgrade';
  }
  _render() {
    if (!this._config) return;
    const now = new Date(), zone = this._zone();
    const today = dayInZone(now, zone);
    const entity = this._config.entity ? this._hass?.states?.[this._config.entity] : null;
    const freshBucket = entity ? Math.floor(now.getTime() / 60000) : '';
    const signature = `${today}:${zone}:${freshBucket}:${JSON.stringify(entity || null)}`;
    if (signature === this._signature) return;
    this._signature = signature;
    const model = this._model = createModel(today, this._config, entity, now, zone);
    const family = model.familyPin;
    this.shadowRoot.querySelector('main').innerHTML = `
      <header><ha-icon icon="mdi:calendar-star"></ha-icon><h2>${escapeHTML(this._config.title)}</h2><span class="country" aria-label="Serbien">RS</span></header>
      <div class="rows">${model.visible.map((item, i) => this._row(item, i === 0)).join('')}</div>
      ${family ? `<button class="family-pin" data-event="${escapeHTML(family.id)}" aria-label="${escapeHTML(familyLabel(this._config) + ', ' + family.name + ', ' + dateRange(family) + ', ' + distance(family, today))}"><ha-icon icon="mdi:home-heart"></ha-icon><strong>${escapeHTML(familyLabel(this._config))}</strong><small>${escapeHTML(shortDate(family.start))} · ${escapeHTML(distance(family, today))}</small></button>` : ''}
      ${this._config.show_footer ? `<footer><button class="source-button" data-action="source" data-warning="${!!this._config.entity && !['on', 'off'].includes(entity?.state)}" aria-label="Informationen zu den Terminen"><ha-icon icon="mdi:check-circle-outline"></ha-icon>Lokal berechnet</button><button class="all-button" data-action="all">Alle Termine<ha-icon icon="mdi:chevron-right"></ha-icon></button></footer>` : ''}`;
    if (this._dialog.open) this._renderDialog();
  }
  _row(item, next = false) {
    const info = presentation(item, this._config), today = this._model.today;
    const badgeDate = new Date(Math.max(item.start, Math.min(today, item.end)) * DAY_MS);
    const nextYear = new Date(item.start * DAY_MS).getUTCFullYear();
    const currentYear = new Date(today * DAY_MS).getUTCFullYear();
    return `<button class="event ${info.tone}${next ? ' next' : ''}" data-event="${escapeHTML(item.id)}" aria-label="${escapeHTML(item.name + ', ' + dateRange(item) + ', ' + info.label + ', ' + distance(item, today))}">
      <span class="date"><strong>${String(badgeDate.getUTCDate()).padStart(2, '0')}</strong><small>${MONTHS[badgeDate.getUTCMonth()]}</small></span>
      <span class="title">${escapeHTML(item.name)}${nextYear !== currentYear ? `<span class="year">${nextYear}</span>` : ''}</span>
      <span class="count">${distance(item, today)}</span>
      <span class="meta"><ha-icon icon="${info.icon}"></ha-icon><span>${escapeHTML(info.label)}</span></span>
    </button>`;
  }
  _showDialog(state) {
    this._dialogState = state;
    this._renderDialog();
    if (!this._dialog.open) this._dialog.showModal();
    this._dialog.querySelector('[data-action="close"]')?.focus();
  }
  _renderDialog() {
    const state = this._dialogState;
    if (!state || !this._model) return;
    let title = '', content = '';
    if (state.type === 'all') {
      title = 'Alle Termine';
      let year = null;
      content = '<p class="dialog-intro">Nächste 12 Monate · Termin für Details antippen</p>';
      for (const item of this._model.annual) {
        const itemYear = new Date(item.start * DAY_MS).getUTCFullYear();
        if (itemYear !== year) { year = itemYear; content += `<div class="year-heading">${year}</div>`; }
        content += this._row(item);
      }
    } else if (state.type === 'event') {
      const item = this._model.upcoming.find((entry) => entry.id === state.id);
      if (!item) { this._dialog.close(); return; }
      const info = presentation(item, this._config);
      title = item.name;
      const work = item.free === true ? 'Allgemein arbeitsfreier Feiertag in Serbien.' : item.free === false ? 'Nicht allgemein arbeitsfrei.' : 'Arbeitsfreiheit dieses Zusatztermins wurde nicht geprüft.';
      content = `<p><strong>${escapeHTML(dateRange(item))}</strong><br>${escapeHTML(distance(item, this._model.today))}</p>
        <div class="detail-type ${info.tone}"><ha-icon icon="${info.icon}"></ha-icon>${escapeHTML(info.label)}</div>
        ${item.family ? `<p><strong>Unser Familienfeiertag · ${escapeHTML(familyLabel(this._config))}</strong></p>` : ''}
        <p>${escapeHTML(item.hint)}</p><p class="muted">${escapeHTML(work)}</p>`;
    } else {
      title = 'Informationen zu den Terminen';
      content = `<p>Feiertage, orthodoxe Ostertage und die hinterlegten Traditionen werden lokal berechnet. Die Karte benötigt dafür keine Internetverbindung und keine zusätzliche Integration.</p>
        <p class="muted">Berechnung nach den hinterlegten Regeln. Einmalige Sonderregelungen werden nicht automatisch aus dem Internet übernommen. „Arbeitsfrei“ bezeichnet allgemeine Feiertage in Serbien.</p>
        ${this._config.entity ? `<p><strong>Zusatzkalender</strong><br>${escapeHTML(this._model.calendarNote)}</p><p class="muted">Die Kalender-Entität liefert nur einen Termin. Ihre übrigen Termine werden hier nicht abgerufen.</p>` : ''}
        <p><strong>Familien-Slava</strong><br>${this._model.nextFamily ? `${escapeHTML(this._model.nextFamily.name)} · ${escapeHTML(familyLabel(this._config))}<br>${escapeHTML(dateRange(this._model.nextFamily))}` : 'Keine passende Familien-Slava hinterlegt.'}</p><p class="muted">Karte v${VERSION}</p>`;
    }
    const scroll = this._dialog.scrollTop;
    this._dialog.innerHTML = `<div class="dialog-head">${state.fromList ? '<button data-action="all" aria-label="Zurück zu allen Terminen"><ha-icon icon="mdi:arrow-left"></ha-icon></button>' : ''}<h3 id="dialog-title">${escapeHTML(title)}</h3><button data-action="close" aria-label="Schliessen"><ha-icon icon="mdi:close"></ha-icon></button></div><div class="dialog-content">${content}</div>`;
    this._dialog.scrollTop = scroll;
  }
}
if (!customElements.get('feiertage-serbien-card')) customElements.define('feiertage-serbien-card', FeiertageSerbienCard);
window.customCards = window.customCards || [];
if (!window.customCards.some((card) => card.type === 'feiertage-serbien-card')) window.customCards.push({
  type: 'feiertage-serbien-card', name: 'Feiertage & Traditionen Serbien',
  description: 'Kompakte Feiertagskarte mit eigener Familien-Slava.', preview: true,
  documentationURL: 'https://github.com/AshenSage/ha-feiertage-serbien',
});

})();
