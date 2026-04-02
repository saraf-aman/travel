import { loadAllTrips, loadTripById } from './tripLoader.js';
import { renderTripCards, renderTripDetail, updateStats } from './tripRenderer.js';

// Detect which page we're on
const isHomepage = !document.body.dataset.page;
const isTripPage = document.body.dataset.page === 'trip';

if (isHomepage) {
  // Homepage: Load all trips and render cards
  loadAllTrips()
    .then(trips => {
      renderTripCards(trips);
      updateStats(trips);
    })
    .catch(err => {
      console.error('Failed to load trips:', err);
      document.getElementById('trip-grid').innerHTML = '<p class="error-text">Failed to load trips. Please refresh.</p>';
    });
}

if (isTripPage) {
  // Trip detail page: Get ID from URL and load specific trip
  const params = new URLSearchParams(window.location.search);
  const tripId = params.get('id');

  if (!tripId) {
    document.getElementById('trip-root').innerHTML = '<div class="error-container"><p class="error-text">No trip ID specified. <a href="index.html">Return to homepage</a></p></div>';
  } else {
    loadTripById(tripId)
      .then(trip => {
        renderTripDetail(trip);
        document.title = `${trip.title} — Aman\'s Travel`;
      })
      .catch(err => {
        console.error('Failed to load trip:', err);
        document.getElementById('trip-root').innerHTML = '<div class="error-container"><p class="error-text">Trip not found. <a href="index.html">Return to homepage</a></p></div>';
      });
  }
}