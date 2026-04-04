/**
 * weatherAPI.js — Open-Meteo weather for Banff & Jasper trip
 *
 * TOP STRIP  (weather-dN) — trip day forecast with hourly temps at key times.
 *   Shows "available closer to trip" when outside the 15-day window.
 *
 * BOTTOM SECTION  (planning-dN) — "next 3 days" grid at each day's key
 *   locations. Always live — useful for packing no matter how far the trip is.
 *
 * ── HOW TO TEST / RESTORE ────────────────────────────────────────────────────
 * Only one constant needs changing: TRIP_DATES (line ~24).
 *   Testing :  set dates to within the next 15 days from today.
 *   Real trip:  ['2026-06-16','2026-06-17','2026-06-18','2026-06-19','2026-06-20','2026-06-21','2026-06-22']
 * ─────────────────────────────────────────────────────────────────────────────
 */

const TripWeather = (() => {
  const FORECAST     = 'https://api.open-meteo.com/v1/forecast';
  const DAILY_VARS   = 'temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max';
  const HOURLY_VARS  = 'temperature_2m';
  const SHOW_HOURS   = [5, 7, 10, 13, 16, 19, 21, 23]; // 7 am → 7 pm, five snapshots

  // ── TRIP DATES (change both lines for testing) ───────────────────────────
  const TRIP_DATES = ['2026-04-13','2026-04-14','2026-04-15','2026-04-16','2026-04-17','2026-04-18','2026-04-19'];
  // ────────────────────────────────────────────────────────────────────────

  // Locations shown per day. Multiple per day capture real temp variation
  // (e.g. Hinton base vs glacier at 2,000 m on Day 5).
  const DAY_LOCS = [
    // Day 1 — Calgary → Kootenay NP → Banff → Canmore
    [
      { lat: 51.0447, lon: -114.0719, label: 'Calgary' },
      { lat: 51.1528, lon: -116.1008, label: 'Kootenay NP' },
      { lat: 51.1784, lon: -115.5708, label: 'Banff' },
    ],
    // Day 2 — Canmore → Moraine Lake → Lake Louise → Johnston Canyon
    [
      { lat: 51.4254, lon: -116.1773, label: 'Lake Louise' },
      { lat: 51.0892, lon: -115.3456, label: 'Canmore' },
    ],
    // Day 3 — Canmore → Yoho NP (Takakkaw Falls, Emerald Lake) → Minnewanka
    [
      { lat: 51.3944, lon: -116.4928, label: 'Yoho NP' },
      { lat: 51.0892, lon: -115.3456, label: 'Canmore' },
    ],
    // Day 4 — Canmore → full Icefields Parkway → Hinton
    [
      { lat: 51.0892, lon: -115.3456, label: 'Canmore' },
      { lat: 51.9333, lon: -116.7253, label: 'Icefields Pkwy' },
      { lat: 53.4126, lon: -117.5634, label: 'Hinton' },
    ],
    // Day 5 — Hinton → Columbia Icefield → Athabasca Falls → Jasper
    // Icefield is critically colder (glacier at 2,000 m)
    [
      { lat: 53.4126, lon: -117.5634, label: 'Hinton' },
      { lat: 52.2167, lon: -117.2333, label: 'Columbia Icefield' },
    ],
    // Day 6 — Hinton → Maligne Canyon → Maligne Lake → Jasper → Pyramid Lake
    [
      { lat: 53.4126, lon: -117.5634, label: 'Hinton' },
      { lat: 52.8737, lon: -118.0814, label: 'Jasper' },
    ],
    // Day 7 — Hinton → Icefields Parkway southbound → Calgary
    [
      { lat: 53.4126, lon: -117.5634, label: 'Hinton' },
      { lat: 52.2167, lon: -117.2333, label: 'Columbia Icefield' },
      { lat: 51.0447, lon: -114.0719, label: 'Calgary' },
    ],
  ];

  // ── Date helpers ────────────────────────────────────────────────────────────

  function isoDate(offsetDays = 0) {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().slice(0, 10);
  }

  function shortDateLabel(isoStr) {
    // "Sat Apr 5" — use noon to dodge DST edge cases
    return new Date(isoStr + 'T12:00:00').toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric',
    });
  }

  function hourLabel(h) {
    if (h === 0) return '12am';
    if (h === 12) return '12pm';
    return h < 12 ? `${h}am` : `${h - 12}pm`;
  }

  // ── API ─────────────────────────────────────────────────────────────────────

  async function fetchLoc(lat, lon, start, end) {
    const url = `${FORECAST}?latitude=${lat}&longitude=${lon}` +
      `&daily=${DAILY_VARS}&hourly=${HOURLY_VARS}` +
      `&timezone=America%2FEdmonton&start_date=${start}&end_date=${end}`;
    try {
      const r = await fetch(url);
      if (!r.ok) return null;
      const j = await r.json();
      return (j.daily?.time?.length || j.hourly?.time?.length) ? j : null;
    } catch { return null; }
  }

  // ── Data extractors ─────────────────────────────────────────────────────────

  function daily(j, date) {
    if (!j?.daily?.time) return null;
    const i = j.daily.time.indexOf(date);
    if (i < 0) return null;
    return {
      high: Math.round(j.daily.temperature_2m_max[i]),
      low:  Math.round(j.daily.temperature_2m_min[i]),
      rain: Math.round(j.daily.precipitation_probability_max[i] ?? 0),
      wind: Math.round(j.daily.wind_speed_10m_max[i] ?? 0),
    };
  }

  function hourly(j, date) {
    if (!j?.hourly?.time) return [];
    return SHOW_HOURS.map(h => {
      const ts = `${date}T${String(h).padStart(2, '0')}:00`;
      const i = j.hourly.time.indexOf(ts);
      return i >= 0 ? { h, t: Math.round(j.hourly.temperature_2m[i]) } : null;
    }).filter(Boolean);
  }

  // ── HTML renderers ──────────────────────────────────────────────────────────

  function tripBlock(loc, d, hrs) {
    const hoursHtml = hrs.length
      ? hrs.map(({ h, t }) =>
          `<span class="ws-hour">` +
            `<span class="ws-htime">${hourLabel(h)}</span>` +
            `<span class="ws-htemp">${t}&deg;</span>` +
          `</span>`).join('')
      : `<span class="ws-hour"><span class="ws-htime">Hi</span><span class="ws-htemp ws-hi">${d.high}&deg;</span></span>` +
        `<span class="ws-hour"><span class="ws-htime">Lo</span><span class="ws-htemp ws-lo">${d.low}&deg;</span></span>`;

    return `<div class="ws-block">` +
      `<span class="ws-label">${loc.label}</span>` +
      `<div class="ws-hours">${hoursHtml}</div>` +
      `<span class="ws-meta">&#128167;&thinsp;${d.rain}%</span>` +
      `<span class="ws-meta">&#128168;&thinsp;${d.wind}&thinsp;km/h</span>` +
    `</div>`;
  }

  function planningGrid(locs, cache, planDates) {
    const headCols = planDates
      .map(d => `<span class="wp-col">${shortDateLabel(d)}</span>`)
      .join('');

    const rows = locs.map(loc => {
      const j = cache.get(`${loc.lat},${loc.lon}`);
      const cells = planDates.map(date => {
        const d = daily(j, date);
        if (!d) return `<span class="wp-col"><span class="wp-empty">&mdash;</span></span>`;
        return `<span class="wp-col">` +
          `<span class="wp-temps">` +
            `<span class="wp-hi">${d.high}&deg;</span>` +
            `<span class="wp-slash">/</span>` +
            `<span class="wp-lo">${d.low}&deg;</span>` +
          `</span>` +
          `<small class="wp-rain">&#128167;&thinsp;${d.rain}%</small>` +
        `</span>`;
      }).join('');
      return `<div class="wp-row">` +
        `<span class="wp-rowlabel">&#128205;&ensp;${loc.label}</span>` +
        cells +
      `</div>`;
    }).join('');

    return `<div class="wp-grid">` +
      `<div class="wp-head"><span class="wp-rowlabel">&#128197;&ensp;Next 3 Days</span>${headCols}</div>` +
      rows +
    `</div>`;
  }

  // ── Entry point ─────────────────────────────────────────────────────────────

  return {
    async load() {
      const today     = isoDate(0);
      const rangeEnd  = isoDate(15);            // Open-Meteo max: 15 days ahead
      const planDates = [isoDate(0), isoDate(1), isoDate(2)];

      // Deduplicate locations across all days; fetch in parallel
      const pending = new Map();
      DAY_LOCS.flat().forEach(l => {
        const k = `${l.lat},${l.lon}`;
        if (!pending.has(k)) pending.set(k, fetchLoc(l.lat, l.lon, today, rangeEnd));
      });
      const cache = new Map(
        await Promise.all([...pending].map(async ([k, p]) => [k, await p]))
      );

      DAY_LOCS.forEach((locs, i) => {
        const tripDate = TRIP_DATES[i];

        // Top strip — hourly temps for the trip day (or "not yet available")
        const topEl = document.getElementById(`weather-d${i + 1}`);
        if (topEl) {
          const blocks = locs.flatMap(loc => {
            const j = cache.get(`${loc.lat},${loc.lon}`);
            const d = daily(j, tripDate);
            return d ? [tripBlock(loc, d, hourly(j, tripDate))] : [];
          });
          topEl.innerHTML = blocks.length
            ? blocks.join('<div class="ws-div"></div>')
            : '<span class="ws-na">&#9925;&ensp;Trip day forecast available closer to the trip</span>';
        }

        // Bottom section — always-live next-3-days planning grid
        const botEl = document.getElementById(`planning-d${i + 1}`);
        if (botEl) botEl.innerHTML = planningGrid(locs, cache, planDates);
      });
    },
  };
})();
