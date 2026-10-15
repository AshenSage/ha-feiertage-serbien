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
