/**
 * tripLoader.js
 * Fetches trip JSON data from data/trips/{id}.json
 * Future: will drive trip.html template rendering
 */
async function loadTrip(tripId) {
  const response = await fetch(`/travel/data/trips/${tripId}.json`);
  if (!response.ok) throw new Error(`Trip not found: ${tripId}`);
  return response.json();
}

export { loadTrip };
