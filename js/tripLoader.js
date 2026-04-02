/**
 * Trip Data Loader
 * Fetches trip JSON files from data/trips/ folder
 */

const TRIPS_PATH = 'data/trips';
const BASE_PATH = window.location.hostname === 'saraf-aman.github.io' ? '/travel' : '';

/**
 * Load all trip JSONs
 */
export async function loadAllTrips() {
  // For now, we hardcode the list of trip IDs
  // Future: Could fetch from a trips-index.json file
  const tripIds = ['banff-jasper-2026'];
  
  const trips = await Promise.all(
    tripIds.map(id => loadTripById(id).catch(err => {
      console.warn(`Failed to load trip ${id}:`, err);
      return null;
    }))
  );

  return trips.filter(t => t !== null);
}

/**
 * Load a specific trip by ID
 */
export async function loadTripById(id) {
  const url = `${BASE_PATH}/${TRIPS_PATH}/${id}.json`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to load trip: ${id}`);
  }
  
  return response.json();
}

/**
 * Get trip URL for linking
 */
export function getTripUrl(tripId) {
  return `${BASE_PATH}/trip.html?id=${tripId}`;
}