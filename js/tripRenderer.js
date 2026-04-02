/**
 * tripRenderer.js
 * Renders trip cards on homepage and full trip detail pages.
 * Currently a stub — wired up once trip.html template is complete.
 */
import { loadTrip } from './tripLoader.js';

export function renderHomepage() {
  // Future: fetch trip index, render .trip-grid cards dynamically
  console.log('Homepage renderer ready');
}

export async function renderTripPage(tripId) {
  // Future: load JSON, populate trip.html template
  const trip = await loadTrip(tripId);
  console.log('Trip loaded:', trip.title);
}
