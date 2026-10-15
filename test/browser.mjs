// Optional integration/visual check. Install Playwright locally to run this.
import { readFile, mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, timezoneId: 'America/Los_Angeles' });
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
await page.clock.install({ time: new Date('2026-10-15T08:00:00Z') });
let iconMap = {}, fontRule = '';
// Optional local MDI webfont, for screenshots with Home Assistant's real icons.
if (process.env.MDI_CSS && process.env.MDI_FONT) {
  const css = await readFile(process.env.MDI_CSS, 'utf8');
  for (const match of css.matchAll(/\.mdi-([a-z0-9-]+):{1,2}before\{content:"\\([A-Fa-f0-9]+)"\}/g)) iconMap[`mdi:${match[1]}`] = String.fromCodePoint(parseInt(match[2], 16));
  assert.ok(iconMap['mdi:calendar-star'] && iconMap['mdi:home-heart'], 'MDI icons loaded');
  fontRule = `@font-face{font-family:MDI;src:url(data:font/woff2;base64,${(await readFile(process.env.MDI_FONT)).toString('base64')}) format('woff2')}`;
}
await page.setContent(`<html lang="de"><meta charset="utf-8"><style>${fontRule}body{margin:0;padding:12px;background:#293f35;font:14px Arial,sans-serif;--ha-card-background:#334f41;--primary-text-color:#eef6ef;--secondary-text-color:#bacdc0;--divider-color:#536f5e;--ha-card-border-color:#56735f;--ha-card-border-radius:18px;--primary-color:#76bde7}body.light{background:#f3f5f1;--ha-card-background:#fff;--primary-text-color:#24352d;--secondary-text-color:#596b60;--divider-color:#dce4dc;--ha-card-border-color:#cdd9ce}</style><div id="holder"></div></html>`);
await page.evaluate((icons) => {
  window.icons = icons;
  customElements.define('ha-icon', class extends HTMLElement {
    static get observedAttributes() { return ['icon']; }
    constructor() { super(); this.attachShadow({ mode: 'open' }); }
    connectedCallback() { this.render(); }
    attributeChangedCallback() { this.render(); }
    render() { this.shadowRoot.innerHTML = `<style>:host{display:inline-flex;width:var(--mdc-icon-size,24px);height:var(--mdc-icon-size,24px);align-items:center;justify-content:center;vertical-align:middle}span{font:normal var(--mdc-icon-size,24px)/1 MDI,sans-serif}</style><span>${window.icons[this.getAttribute('icon')] || '◉'}</span>`; }
  });
}, iconMap);
await page.addScriptTag({ content: await readFile('ha-feiertage-serbien.js', 'utf8') });
await page.evaluate(() => {
  window.card = document.createElement('feiertage-serbien-card');
  card.setConfig({ type: 'custom:feiertage-serbien-card', family_slava: 'Aranđelovdan', family_name: '' });
  card.hass = { config: { time_zone: 'Europe/Belgrade' }, states: {} };
  document.getElementById('holder').append(card);
});
await page.evaluate(() => document.fonts.ready);
const card = page.locator('feiertage-serbien-card');
assert.equal(await card.locator('main .event').count(), 3);
assert.match(await card.locator('.family-pin').innerText(), /Unsere Slava.*21\. Nov.*37 Tagen/s);
for (const width of [320, 390, 460, 768]) {
  await page.setViewportSize({ width, height: 1000 });
  for (const theme of ['', 'light']) {
    await page.evaluate((theme) => { document.body.className = theme; }, theme);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${width} ${theme}: page overflow`);
    const overflow = await page.evaluate(() => [...card.shadowRoot.querySelectorAll('ha-card,.event,.title,.meta,.family-pin')].some((el) => el.scrollWidth > el.clientWidth + 1));
    assert.equal(overflow, false, `${width} ${theme}: text/card overflow`);
  }
}
await page.setViewportSize({ width: 390, height: 844 });
await page.evaluate(() => { document.body.className = ''; });
await mkdir('test-output', { recursive: true });
await mkdir('docs', { recursive: true });
await card.screenshot({ path: 'docs/mobile.png' });
await page.evaluate(() => { document.body.className = 'light'; });
await card.screenshot({ path: 'test-output/light-390.png' });
await page.evaluate(() => { document.body.className = ''; });
await card.locator('.family-pin').click();
assert.equal(await card.locator('dialog').evaluate((el) => el.open), true);
assert.match(await card.locator('.dialog-content').innerText(), /Unser Familienfeiertag · Unsere Slava/);
assert.match(await card.locator('.dialog-content').innerText(), /21\.11\.2026/);
await page.screenshot({ path: 'test-output/family-details.png' });
await card.locator('[data-action="close"]').click();
await card.locator('[data-action="all"]').click();
assert.ok(await card.locator('dialog .event').count() > 15);
assert.equal(await card.locator('dialog .family').count(), 1);
await card.locator('dialog .family').click();
assert.match(await card.locator('#dialog-title').innerText(), /Aranđelovdan/);
await card.locator('dialog [data-action="all"]').click();
assert.equal(await card.locator('#dialog-title').innerText(), 'Alle Termine');
await page.keyboard.press('Escape');
assert.equal(await card.locator('dialog').evaluate((el) => el.open), false);
await card.locator('[data-action="source"]').click();
assert.match(await card.locator('.dialog-content').innerText(), /keine Internetverbindung/);
await page.keyboard.press('Escape');
// The HA timezone wins over the browser's America/Los_Angeles timezone.
await page.clock.setSystemTime(new Date('2026-11-20T22:59:50Z'));
await page.evaluate(() => { card.hass = { ...card.hass }; });
assert.match(await card.locator('main .family .count').innerText(), /Morgen/);
assert.equal(await card.locator('.family-pin').count(), 0);
await card.screenshot({ path: 'docs/family-slava.png' });
await page.clock.fastForward(120000);
assert.equal(await card.locator('main .family .count').innerText(), 'Heute');
// A user/calendar label must never become active HTML.
await page.evaluate(() => {
  card.setConfig({ type: 'custom:feiertage-serbien-card', title: '<img src=x onerror="window.injected=true">', family_name: '<script>bad</script>' });
});
assert.equal(await card.locator('img,script').count(), 0);
assert.equal(await page.evaluate(() => !!window.injected), false);
await page.evaluate(() => { card.setConfig({ type: 'custom:feiertage-serbien-card', entity: 'calendar.serbien' }); });
await card.locator('[data-action="source"]').click();
assert.match(await card.locator('.dialog-content').innerText(), /Zusatzkalender nicht verfügbar/);
await page.keyboard.press('Escape');
await page.evaluate(() => { card.remove(); });
assert.equal(await page.evaluate(() => card._timer), null);
await page.evaluate(() => { document.getElementById('holder').append(card); });
assert.notEqual(await page.evaluate(() => card._timer), null);
assert.deepEqual(errors, []);
console.log('Browser passed: 320/390/460/768 px, light/dark themes, family pin, gold family event, details, annual list, Escape, HA timezone, midnight, escaping, optional calendar failure and timer cleanup.');
await browser.close();
