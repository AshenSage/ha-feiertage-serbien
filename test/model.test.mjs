import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULTS, civilDay, dayISO, parseDay, dayInZone, normalizeConfig, orthodoxEaster, eventsForYear, createModel, supplementCalendar, distance, presentation, escapeHTML } from '../src/model.js';
const config = (extra = {}) => normalizeConfig(extra);
const on = (date, cfg = config()) => createModel(parseDay(date), cfg);
test('2026 NBS holiday dates, including Statehood observed day', () => {
  const days = eventsForYear(2026).filter((e) => e.free).flatMap((e) => Array.from({ length: e.end - e.start + 1 }, (_, i) => dayISO(e.start + i))).sort();
  assert.deepEqual(days, ['2026-01-01', '2026-01-02', '2026-01-07', '2026-02-15', '2026-02-16', '2026-02-17', '2026-04-10', '2026-04-11', '2026-04-12', '2026-04-13', '2026-05-01', '2026-05-02', '2026-11-11']);
});
test('Orthodox Easter reference dates', () => {
  for (const [year, expected] of [[2024, '2024-05-05'], [2025, '2025-04-20'], [2026, '2026-04-12'], [2027, '2027-05-02'], [2028, '2028-04-16'], [2030, '2030-04-28']]) assert.equal(dayISO(orthodoxEaster(year)), expected);
});
test('Sunday replacements skip existing holidays; Saturday creates no extra day', () => {
  assert.ok(eventsForYear(2023).some((e) => e.name === 'Neujahr · Ersatzfeiertag' && dayISO(e.start) === '2023-01-03'));
  assert.ok(eventsForYear(2027).some((e) => e.name === 'Tag der Arbeit · Ersatzfeiertag' && dayISO(e.start) === '2027-05-04'));
  assert.ok(eventsForYear(2022).some((e) => e.name === 'Tag der Arbeit · Ersatzfeiertag' && dayISO(e.start) === '2022-05-03'));
  assert.equal(eventsForYear(2026).filter((e) => e.name.startsWith('Tag der Arbeit')).length, 1);
  // Religious Christmas on Sunday is not a national Sunday replacement.
  assert.equal(eventsForYear(2024).some((e) => dayISO(e.start) === '2024-01-08'), false);
});
test('current card contains 3 upcoming events and a separate gold family pin', () => {
  const model = on('2026-10-15');
  assert.deepEqual(model.visible.map((e) => e.name), ['Gedenken an Kriegsopfer', 'Mitrovdan', 'Tag des Waffenstillstands']);
  assert.equal(model.familyPin.name, 'Aranđelovdan');
  assert.equal(distance(model.familyPin, model.today), 'In 37 Tagen');
  assert.deepEqual(presentation(model.familyPin, DEFAULTS), { tone: 'family', icon: 'mdi:home-heart', label: 'Unsere Slava' });
  assert.equal(model.familyPin.free, false);
});
test('family in main list has gold label without a duplicate pin', () => {
  const model = on('2026-11-12');
  assert.equal(model.visible[0].name, 'Aranđelovdan');
  assert.equal(model.visible[0].family, true);
  assert.equal(model.familyPin, null);
  assert.equal(distance(on('2026-11-21').nextFamily, parseDay('2026-11-21')), 'Heute');
  assert.equal(distance(on('2026-11-20').nextFamily, parseDay('2026-11-20')), 'Morgen');
  assert.equal(dayISO(on('2026-11-22').nextFamily.start), '2027-11-21');
});
test('family settings can be changed or disabled', () => {
  assert.equal(on('2026-10-15', config({ family_slava: false })).nextFamily, null);
  assert.equal(on('2026-10-15', config({ show_family_countdown: false })).familyPin, null);
  const model = on('2026-10-15', config({ family_slava: 'Mitrovdan', family_name: 'Test' }));
  assert.equal(model.visible[1].family, true);
  assert.equal(presentation(model.visible[1], config({ family_name: 'Test' })).label, 'Slava Test');
});
test('multiday event remains visible until the inclusive final day', () => {
  assert.equal(on('2026-04-13').visible[0].name, 'Vaskrs · orthodoxe Ostertage');
  assert.notEqual(on('2026-04-14').visible[0].name, 'Vaskrs · orthodoxe Ostertage');
  assert.equal(distance(on('2026-01-02').visible[0], parseDay('2026-01-02')), 'Heute');
});
test('Home Assistant timezone and DST use civil dates, not browser timezone or 24h division', () => {
  const now = new Date('2026-10-20T22:30:00Z');
  assert.equal(dayISO(dayInZone(now, 'Europe/Belgrade')), '2026-10-21');
  assert.equal(dayISO(dayInZone(now, 'America/Los_Angeles')), '2026-10-20');
  const a = dayInZone(new Date('2026-03-28T23:30:00Z'), 'Europe/Belgrade');
  const b = dayInZone(new Date('2026-03-29T22:30:00Z'), 'Europe/Belgrade');
  assert.equal(b - a, 1);
  assert.equal(on('2026-12-31').visible[0].name, 'Neujahr');
  assert.equal(dayISO(on('2026-12-31').visible[0].start), '2027-01-01');
});
const now = new Date('2026-10-15T08:00:00Z'), today = civilDay(2026, 10, 15);
const calendar = (attrs = {}, extra = {}) => ({ state: 'off', last_updated: now.toISOString(), attributes: { all_day: true, start_time: '2026-11-11 00:00:00', end_time: '2026-11-12 00:00:00', message: 'Armistice Day', ...attrs }, ...extra });
test('optional calendar deduplicates known aliases and uses exclusive all-day ends', () => {
  const cfg = config({ entity: 'calendar.serbien' });
  const model = createModel(today, cfg, calendar(), now, 'Europe/Belgrade');
  assert.equal(model.upcoming.filter((e) => e.start === parseDay('2026-11-11')).length, 1);
  const extra = createModel(today, cfg, calendar({ message: 'Familienfest', start_time: '2026-10-20', end_time: '2026-10-21' }), now);
  const added = extra.upcoming.find((e) => e.name === 'Familienfest');
  assert.equal(dayISO(added.end), '2026-10-20');
  assert.equal(added.free, null);
});
test('different calendar event on a holiday date is not incorrectly suppressed', () => {
  const result = supplementCalendar(eventsForYear(2026), calendar({ message: 'Privater Termin' }), today, now, 'Europe/Belgrade');
  assert.ok(result.events.some((e) => e.name === 'Privater Termin'));
});
test('unavailable, stale, invalid and inconsistent calendar data never removes local dates', () => {
  const base = eventsForYear(2026);
  for (const entity of [null, calendar({}, { state: 'unavailable' }), calendar({}, { last_updated: '2026-10-14T00:00:00Z' }), calendar({ all_day: false }), calendar({ end_time: '2026-02-30' }), calendar({}, { state: 'on' })]) {
    const result = supplementCalendar(base, entity, today, now, 'Europe/Belgrade');
    assert.equal(result.events.length, base.length);
    assert.ok(result.note);
  }
});
test('configuration and dates are validated, HTML content is escaped', () => {
  assert.equal(parseDay('2026-02-30'), null);
  assert.equal(parseDay('2026-2-3'), null);
  assert.throws(() => normalizeConfig({ max_items: 0 }));
  assert.throws(() => normalizeConfig({ entity: 'sensor.test' }));
  assert.throws(() => normalizeConfig({ time_zone: 'wrong/zone' }));
  assert.throws(() => normalizeConfig({ show_footer: 'false' }));
  assert.equal(escapeHTML('<img src=x>'), '&lt;img src=x&gt;');
});
