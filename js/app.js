/**
 * app.js
 * Main app entry point.
 * Detects which page is loaded and initialises the correct module.
 */
import { renderHomepage } from './tripRenderer.js';
import { renderTripPage } from './tripRenderer.js';

const page = document.body.dataset.page;

if (page === 'home') {
  renderHomepage();
} else if (page === 'trip') {
  const params = new URLSearchParams(window.location.search);
  const tripId = params.get('id');
  if (tripId) renderTripPage(tripId);
}
