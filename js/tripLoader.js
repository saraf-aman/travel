/**
 * tripLoader.js
 * Fetches trip JSON from data/trips/{id}.json
 * Returns parsed trip object or throws on failure.
 */
export async function loadTrip(tripId) {
  const res = await fetch(`/travel/data/trips/${tripId}.json`);
  if (!res.ok) throw new Error(`Trip not found: ${tripId}`);
  return res.json();
}

export async function loadAllTrips(ids) {
  return Promise.all(ids.map(loadTrip));
}
