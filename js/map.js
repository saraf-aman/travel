/**
 * map.js — Interactive trip map
 *
 * Lazy-loads Leaflet when the Map tab is first opened.
 * Renders day-coloured route polylines + emoji markers.
 * Tapping a marker slides up a bottom sheet with stop details
 * and a "Go to Day X →" link that jumps to the itinerary tab.
 *
 * Offline tiles: OSM tiles are cached by the service worker as
 * they load. On first map visit, zoom 8–10 tiles for the whole
 * trip corridor are pre-fetched silently in the background.
 */

const TripMap = (() => {

  // ── State ──────────────────────────────────────────────────────────────────
  let map          = null;
  let initialized  = false;
  let activeDays   = new Set([1,2,3,4,5,6,7]);
  const markersByDay   = new Map(); // day → L.Marker[]
  const polylinesByDay = new Map(); // day → L.Polyline

  // Bounding box with padding for pre-cache (Calgary to Jasper + buffer)
  const BBOX = { south: 50.9, west: -118.5, north: 53.7, east: -113.8 };

  // ── Leaflet lazy-load ──────────────────────────────────────────────────────
  function loadLeaflet(cb) {
    if (window.L) { cb(); return; }
    const base = (function () {
      // Resolve vendor path relative to this script's own location
      const scripts = document.querySelectorAll('script[src]');
      for (const s of scripts) {
        if (s.src.includes('map.js')) return s.src.split('?')[0].replace('map.js', '');
      }
      return '../../js/';
    })();
    const vendorBase = base.replace('/js/', '/');

    const css = document.createElement('link');
    css.rel  = 'stylesheet';
    css.href = vendorBase + 'css/vendor/leaflet.css';
    document.head.appendChild(css);

    const js  = document.createElement('script');
    js.src    = vendorBase + 'js/vendor/leaflet.js';
    js.onload = cb;
    document.body.appendChild(js);
  }

  // ── Marker icon factory ────────────────────────────────────────────────────
  function makeIcon(stop, color) {
    return L.divIcon({
      className: 'map-marker',
      html: `<div class="map-marker-pin" style="background:${color};border-color:${color}">` +
            `<span class="map-marker-emoji">${stop.icon}</span>` +
            `</div>`,
      iconSize:   [30, 36],
      iconAnchor: [15, 36],
    });
  }

  // ── Shared constants ───────────────────────────────────────────────────────
  const TYPE_LABELS = { scenic:'Scenic Stop', food:'Food Stop', special:'Highlight', sleep:'Hotel', drive:'Drive' };

  // ── Mobile bottom sheet ────────────────────────────────────────────────────
  const sheet     = document.getElementById('map-sheet');
  const sheetName = sheet ? sheet.querySelector('.map-sheet-name')  : null;
  const sheetDay  = sheet ? sheet.querySelector('.map-sheet-day')   : null;
  const sheetType = sheet ? sheet.querySelector('.map-sheet-type')  : null;
  const sheetNote = sheet ? sheet.querySelector('.map-sheet-note')  : null;
  const sheetLink = sheet ? sheet.querySelector('.map-sheet-link')  : null;
  const sheetClose= sheet ? sheet.querySelector('.map-sheet-close') : null;

  function openSheet(stop, color) {
    if (!sheet) return;
    const dayObj = TRIP_MAP_DATA.DAYS[stop.day - 1];
    sheetName.textContent = stop.name;
    sheetDay.textContent  = `Day ${stop.day} · ${dayObj.label}`;
    sheetDay.style.background = color + '22';
    sheetDay.style.color      = color;
    sheetDay.style.borderColor= color + '55';
    sheetType.textContent = `${stop.icon}  ${TYPE_LABELS[stop.type] || stop.type}`;
    sheetNote.textContent = stop.note;
    if (sheetLink) {
      sheetLink.textContent = `Go to Day ${stop.day} itinerary →`;
      sheetLink.dataset.day = stop.day;
    }
    sheet.classList.add('open');
  }

  function closeSheet() {
    if (sheet) sheet.classList.remove('open');
  }

  if (sheetClose) sheetClose.addEventListener('click', closeSheet);
  if (sheetLink) {
    sheetLink.addEventListener('click', function(e) {
      e.preventDefault();
      closeSheet();
      const day = this.dataset.day;
      const btn = document.querySelector(`.tab-btn[onclick*="'d${day}'"]`);
      if (btn && window.switchTab) window.switchTab('d' + day, btn);
    });
  }

  // ── Desktop Leaflet popup (anchored to marker, moves with map) ─────────────
  let leafletPopup = null;

  function buildPopupHtml(stop, color) {
    const dayObj = TRIP_MAP_DATA.DAYS[stop.day - 1];
    return `<div class="map-popup-name">${stop.name}</div>` +
           `<div class="map-popup-meta">` +
             `<span class="map-popup-day" style="background:${color}18;color:${color};border-color:${color}44">` +
               `Day ${stop.day} &middot; ${dayObj.label}` +
             `</span>` +
             `<span class="map-popup-type">${stop.icon}&thinsp;${TYPE_LABELS[stop.type] || stop.type}</span>` +
           `</div>` +
           `<div class="map-popup-note">${stop.note}</div>` +
           `<a class="map-popup-link" href="#" data-day="${stop.day}">Go to Day ${stop.day} itinerary →</a>`;
  }

  // Responsive: desktop → Leaflet popup anchored to marker; mobile → bottom sheet
  function openMarkerInfo(stop, color) {
    if (window.innerWidth < 720) {
      openSheet(stop, color);
      return;
    }
    leafletPopup
      .setLatLng([stop.lat, stop.lon])
      .setContent(buildPopupHtml(stop, color))
      .openOn(map);
  }

  function closeAll() {
    closeSheet();
    if (map && leafletPopup) map.closePopup(leafletPopup);
  }

  // ── Day filter logic ───────────────────────────────────────────────────────
  function setFilter(days) {
    activeDays = new Set(days);
    applyFilter();
  }

  function handleDayClick(day) {
    if (activeDays.size === 7) {
      // Isolate to this one day
      activeDays = new Set([day]);
    } else if (activeDays.has(day)) {
      // Toggle off (but keep at least one active)
      if (activeDays.size > 1) activeDays.delete(day);
    } else {
      // Add this day
      activeDays.add(day);
    }
    applyFilter();
  }

  function applyFilter() {
    // Show / hide markers
    markersByDay.forEach((markers, day) => {
      markers.forEach(m => {
        if (activeDays.has(day)) { if (!map.hasLayer(m)) m.addTo(map); }
        else                     { if (map.hasLayer(m))  m.remove(); }
      });
    });

    // Show / hide polylines
    polylinesByDay.forEach((poly, day) => {
      if (activeDays.has(day)) { if (!map.hasLayer(poly)) poly.addTo(map); }
      else                     { if (map.hasLayer(poly))  poly.remove(); }
    });

    updateFilterButtons();
    fitVisible();
    closeAll();
  }

  function fitVisible() {
    const lls = [];
    markersByDay.forEach((markers, day) => {
      if (activeDays.has(day)) markers.forEach(m => lls.push(m.getLatLng()));
    });
    if (lls.length) {
      map.fitBounds(L.latLngBounds(lls), { padding: [30, 30], maxZoom: 13, animate: true });
    }
  }

  function updateFilterButtons() {
    const allActive = activeDays.size === 7;
    const allBtn = document.getElementById('map-filter-all');
    if (allBtn) allBtn.classList.toggle('active', allActive);

    for (let d = 1; d <= 7; d++) {
      const btn = document.getElementById(`map-filter-d${d}`);
      if (!btn) continue;
      const isActive = activeDays.has(d);
      btn.classList.toggle('active', isActive);
      const color = TRIP_MAP_DATA.DAYS[d - 1].color;
      if (isActive) {
        btn.style.background   = color;
        btn.style.borderColor  = color;
        btn.style.color        = '#fff';
      } else {
        btn.style.background  = '';
        btn.style.borderColor = color;
        btn.style.color       = color;
      }
    }
  }

  function wireFilterButtons() {
    const allBtn = document.getElementById('map-filter-all');
    if (allBtn) allBtn.addEventListener('click', () => setFilter([1,2,3,4,5,6,7]));
    for (let d = 1; d <= 7; d++) {
      const btn = document.getElementById(`map-filter-d${d}`);
      if (btn) btn.addEventListener('click', (function(day){ return () => handleDayClick(day); })(d));
    }
  }

  // ── Build map ──────────────────────────────────────────────────────────────
  function buildMap() {
    map = L.map('trip-map', {
      center: [52.2, -116.5],
      zoom: 7,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    // Draw route polylines (below markers)
    TRIP_MAP_DATA.ROUTES.forEach((pts, i) => {
      const day   = i + 1;
      const color = TRIP_MAP_DATA.DAYS[i].color;
      const poly  = L.polyline(pts, {
        color,
        weight: 3.5,
        opacity: 0.75,
        smoothFactor: 1.5,
      }).addTo(map);
      polylinesByDay.set(day, poly);
    });

    // Place markers
    TRIP_MAP_DATA.STOPS.forEach(stop => {
      const color = TRIP_MAP_DATA.DAYS[stop.day - 1].color;
      const marker = L.marker([stop.lat, stop.lon], { icon: makeIcon(stop, color) });
      marker.on('click', function(e) {
        L.DomEvent.stopPropagation(e);
        openMarkerInfo(stop, color);
      });
      marker.addTo(map);
      if (!markersByDay.has(stop.day)) markersByDay.set(stop.day, []);
      markersByDay.get(stop.day).push(marker);
    });

    // Desktop popup — anchored to marker coordinates, moves with the map
    leafletPopup = L.popup({
      closeButton: true,
      offset: L.point(0, -38),
      maxWidth: 280,
      className: 'map-popup',
      autoPan: true,
    });

    // Wire "Go to Day X" link inside the popup after it renders
    map.on('popupopen', function(e) {
      const link = e.popup.getElement() && e.popup.getElement().querySelector('.map-popup-link');
      if (!link) return;
      link.addEventListener('click', function(ev) {
        ev.preventDefault();
        map.closePopup();
        const btn = document.querySelector(`.tab-btn[onclick*="'d${this.dataset.day}'"]`);
        if (btn && window.switchTab) window.switchTab('d' + this.dataset.day, btn);
      });
    });

    // Click on bare map closes everything
    map.on('click', closeAll);

    // Fit to all stops initially
    fitVisible();

    // Wire filter buttons now that map is ready
    wireFilterButtons();
    updateFilterButtons();
  }

  // ── Tile pre-cache ─────────────────────────────────────────────────────────
  function tileXY(lat, lon, zoom) {
    const n  = 1 << zoom;
    const x  = Math.floor((lon + 180) / 360 * n);
    const lr = lat * Math.PI / 180;
    const y  = Math.floor((1 - Math.log(Math.tan(lr) + 1 / Math.cos(lr)) / Math.PI) / 2 * n);
    return [x, y];
  }

  function tilesForZoom(zoom) {
    const [x0, y0] = tileXY(BBOX.north, BBOX.west, zoom);
    const [x1, y1] = tileXY(BBOX.south, BBOX.east, zoom);
    const urls = [];
    for (let x = x0; x <= x1; x++)
      for (let y = y0; y <= y1; y++)
        urls.push(`https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`);
    return urls;
  }

  async function preCacheTiles() {
    const KEY = 'map-tiles-cached-v1';
    if (localStorage.getItem(KEY)) return;

    const statusEl = document.getElementById('map-cache-status');
    function setStatus(txt) { if (statusEl) statusEl.textContent = txt; }

    setStatus('Caching map for offline use…');

    const allUrls = [];
    for (let z = 8; z <= 10; z++) allUrls.push(...tilesForZoom(z));

    let done = 0;
    const batchSize = 2;

    for (let i = 0; i < allUrls.length; i += batchSize) {
      const batch = allUrls.slice(i, i + batchSize);
      await Promise.all(batch.map(url => fetch(url, { mode: 'cors' }).catch(() => {})));
      done += batch.length;
      const pct = Math.round(done / allUrls.length * 100);
      setStatus(`Caching map for offline use… ${pct}%`);
      await new Promise(r => setTimeout(r, 400));
    }

    localStorage.setItem(KEY, '1');
    setStatus('✓ Map ready for offline');
    setTimeout(() => setStatus(''), 3500);
  }

  // ── Init (called once) ─────────────────────────────────────────────────────
  function init() {
    if (initialized) return;
    initialized = true;
    loadLeaflet(() => {
      buildMap();
      // Start pre-cache 3 seconds after map is ready to not compete with tile rendering
      setTimeout(preCacheTiles, 3000);
    });
  }

  // ── Public API ─────────────────────────────────────────────────────────────
  return {
    activate() {
      init();
      // Leaflet needs an explicit resize signal after its container becomes visible
      if (map) setTimeout(() => map.invalidateSize(), 50);
    },
  };
})();

// Expose on window so inline HTML scripts can reference it safely
window.TripMap = TripMap;
