import { getTripUrl } from './tripLoader.js';
import { formatDate, formatDateRange } from './utils.js';

/**
 * Render trip cards on homepage
 */
export function renderTripCards(trips) {
  const grid = document.getElementById('trip-grid');
  
  if (!trips || trips.length === 0) {
    grid.innerHTML = '<p class="loading-text">No trips yet!</p>';
    return;
  }

  grid.innerHTML = trips.map(trip => createTripCard(trip)).join('');
}

/**
 * Create a single trip card HTML
 */
function createTripCard(trip) {
  const isUpcoming = trip.status === 'upcoming' || trip.status === 'planning';
  const cardClass = isUpcoming ? 'trip-card coming-soon' : 'trip-card';
  const href = isUpcoming ? '#' : getTripUrl(trip.id);
  
  const tags = [
    `📅 ${trip.dates.display}`,
    trip.travellers ? `👨‍👩‍👦‍👦 ${trip.travellers === 1 ? 'Solo' : `${trip.travellers} people`}` : null,
    trip.tripType || null,
    trip.accessibility ? '♿ Accessible' : null
  ].filter(Boolean);

  const highlights = (trip.highlights || []).slice(0, 5).map(h => `<li>${h}</li>`).join('');

  return `
    <a href="${href}" class="${cardClass}">
      <img class="card-img" src="${trip.coverImage}" alt="${trip.title}" loading="lazy">
      <div class="card-body">
        <div class="card-location">${trip.destination}</div>
        <div class="card-title">${trip.title}</div>
        ${isUpcoming ? `<span class="coming-badge">${trip.status === 'planning' ? 'Planning' : 'Upcoming'} · ${trip.dates.display}</span>` : ''}
        <p class="card-desc">${trip.summary}</p>
        <div class="card-tags">
          ${tags.map(tag => `<span class="card-tag">${tag}</span>`).join('')}
        </div>
        ${highlights ? `<ul class="card-highlights">${highlights}</ul>` : ''}
        ${!isUpcoming ? '<span class="card-cta">View full itinerary →</span>' : ''}
      </div>
    </a>
  `;
}

/**
 * Render full trip detail page
 */
export function renderTripDetail(trip) {
  const root = document.getElementById('trip-root');
  
  // Simple detail view for now - can be enhanced later
  root.innerHTML = `
    <div class="trip-hero">
      <div class="trip-hero-content">
        <div class="trip-eyebrow">${trip.destination}</div>
        <h1 class="trip-title">${trip.title}</h1>
        <p class="trip-dates">${trip.dates.display}</p>
        <p class="trip-summary">${trip.summary}</p>
      </div>
      <img class="trip-hero-img" src="${trip.coverImage}" alt="${trip.title}">
    </div>
    
    <div class="trip-content">
      <div class="trip-highlights-section">
        <h2>Highlights</h2>
        <ul>${(trip.highlights || []).map(h => `<li>${h}</li>`).join('')}</ul>
      </div>
      
      ${trip.bookBeforeYouGo ? `
        <div class="trip-prebooking-section">
          <h2>📋 Book before you go</h2>
          <ul>${trip.bookBeforeYouGo.map(b => `<li>${b}</li>`).join('')}</ul>
        </div>
      ` : ''}
      
      ${trip.accommodation ? `
        <div class="trip-accommodation-section">
          <h2>🏨 Accommodation</h2>
          ${trip.accommodation.map(acc => `
            <div class="accommodation-block">
              <strong>Nights ${acc.nights}:</strong> ${acc.location}
              ${acc.note ? `<br><span class="note">${acc.note}</span>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      <p class="wip-notice">Full day-by-day itinerary coming soon!</p>
    </div>
  `;
}

/**
 * Update homepage stats
 */
export function updateStats(trips) {
  const statsEl = document.getElementById('hero-stats');
  if (!statsEl) return;

  const totalDays = trips.reduce((sum, trip) => {
    if (!trip.dates.start || !trip.dates.end) return sum;
    const start = new Date(trip.dates.start);
    const end = new Date(trip.dates.end);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return sum + days;
  }, 0);

  const countries = new Set(trips.map(t => t.destination.split(',').pop().trim())).size;

  statsEl.innerHTML = `
    <div><div class="stat-val">${trips.length}</div><div class="stat-label">Trips planned</div></div>
    <div><div class="stat-val">${totalDays}</div><div class="stat-label">Days documented</div></div>
    <div><div class="stat-val">${countries}</div><div class="stat-label">Countries</div></div>
  `;
}