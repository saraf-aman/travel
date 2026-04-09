/**
 * map-data.js — Trip stop data for the interactive map
 *
 * Each stop has:
 *   day    — 1–7
 *   lat/lon — coordinates
 *   name   — display name
 *   type   — 'scenic' | 'food' | 'special' | 'sleep'
 *   icon   — emoji shown in marker
 *   note   — one-line note shown in bottom sheet
 *
 * ROUTES — ordered [lat,lon] waypoints per day (for polylines).
 *   Includes intermediate highway points for a more accurate path.
 */

const TRIP_MAP_DATA = (() => {

  // 7 hues spaced ~50° apart on the colour wheel so adjacent days never clash.
  // Sequence (°): 215 → 30 → 130 → 280 → 355 → 175 → 50
  const DAYS = [
    { day: 1, label: 'Jun 16', color: '#1a7cd8' },  // Blue
    { day: 2, label: 'Jun 17', color: '#f07810' },  // Orange
    { day: 3, label: 'Jun 18', color: '#e8287a' },  // Cerise/Hot Pink
    { day: 4, label: 'Jun 19', color: '#8a35c2' },  // Violet
    { day: 5, label: 'Jun 20', color: '#d91f3a' },  // Crimson
    { day: 6, label: 'Jun 21', color: '#6050dc' },  // Periwinkle/Blue-Violet
    { day: 7, label: 'Jun 22', color: '#c88a08' },  // Gold
  ];

  const STOPS = [
    // ── Day 1: Calgary → Kootenay → Banff → Canmore ─────────────────────────
    { day:1, lat:51.1315, lon:-114.0100, name:'Calgary Airport Hotel (checkout)', type:'sleep', icon:'🏠', note:'Checkout — depart 9:00 AM, trip begins' },
    { day:1, lat:51.0447, lon:-114.0719, name:'Calgary (YYC)',         type:'scenic',  icon:'✈️', note:'Trip start — depart 9:00 AM' },
    { day:1, lat:51.1830, lon:-116.1310, name:'Marble Canyon',         type:'scenic',  icon:'🏔️', note:'600m slot canyon, 7 bridges — knee-friendly' },
    { day:1, lat:51.1560, lon:-116.1080, name:'Paint Pots',            type:'scenic',  icon:'🎨', note:'Iron-rich mineral springs, vivid ochre earth' },
    { day:1, lat:51.1784, lon:-115.5708, name:'Masala Restaurant',     type:'food',    icon:'🍛', note:'Birthday lunch buffet — arrive by 2 PM sharp' },
    { day:1, lat:51.1930, lon:-115.6150, name:'Vermilion Lakes',       type:'scenic',  icon:'🌊', note:'Mount Rundle reflections — best at afternoon light' },
    { day:1, lat:51.1690, lon:-115.5580, name:'Bow Falls',             type:'scenic',  icon:'💧', note:'Bow River cascade with Fairmont backdrop' },
    { day:1, lat:51.1680, lon:-115.5540, name:'Surprise Corner',       type:'scenic',  icon:'🏰', note:'Best Fairmont Banff Springs postcard view' },
    { day:1, lat:51.1650, lon:-115.5540, name:'Banff Gondola',         type:'special', icon:'🚡', note:'Summit of Sulphur Mtn — 360° panorama, must book' },
    { day:1, lat:51.1770, lon:-115.5700, name:'Zyka — Birthday Dinner',type:'food',    icon:'🎂', note:'Elevated Indian, 211 Banff Ave — tandoori chai ★' },
    { day:1, lat:51.0892, lon:-115.3456, name:'Canmore (hotel)',        type:'sleep',   icon:'🏠', note:'Base for 3 nights — Bow Valley Trail area' },

    // ── Day 2: Canmore → Moraine → Lake Louise → Bow Valley → Johnston ──────
    { day:2, lat:51.3214, lon:-116.1860, name:'Moraine Lake',          type:'special', icon:'💎', note:'Valley of the Ten Peaks — electric turquoise in June' },
    { day:2, lat:51.4163, lon:-116.1789, name:'Lake Louise',           type:'special', icon:'⛰️', note:'Victoria Glacier view — paved flat lakeshore' },
    { day:2, lat:51.2780, lon:-116.0190, name:"Morant's Curve",        type:'scenic',  icon:'📷', note:'Legendary railway photography spot on Bow Valley Pkwy' },
    { day:2, lat:51.2540, lon:-115.8290, name:'Johnston Canyon',       type:'scenic',  icon:'💧', note:'Lower Falls — metal catwalk, solid handrails' },
    { day:2, lat:51.0892, lon:-115.3500, name:'Spice Hut (dinner)',    type:'food',    icon:'🍛', note:'Top-rated Indian in Canmore — order Day 3 lunch here' },
    { day:2, lat:51.0892, lon:-115.3456, name:'Canmore (hotel)',        type:'sleep',   icon:'🏠', note:'Night 2 of 3 at Canmore — Bow Valley Trail area' },

    // ── Day 3: Canmore → Yoho NP → Lake Minnewanka → Norquay ───────────────
    { day:3, lat:51.4990, lon:-116.4860, name:'Takakkaw Falls',        type:'special', icon:'🌊', note:"Canada's 2nd highest waterfall at 373m — max power in June" },
    { day:3, lat:51.4360, lon:-116.4880, name:'Spiral Tunnels',        type:'scenic',  icon:'🚂', note:'Figure-8 railway tunnels bored through mountain in 1909' },
    { day:3, lat:51.4040, lon:-116.4910, name:'Natural Bridge',        type:'scenic',  icon:'🌉', note:'Kicking Horse River punched through solid limestone' },
    { day:3, lat:51.4370, lon:-116.5340, name:'Emerald Lake',          type:'special', icon:'🌿', note:'Most vividly coloured lake in the Canadian Rockies' },
    { day:3, lat:51.2280, lon:-115.4830, name:'Lake Minnewanka',       type:'scenic',  icon:'⛰️', note:'Banff\'s largest lake — submerged ghost town below surface' },
    { day:3, lat:51.2000, lon:-115.5870, name:'Mount Norquay Lookout', type:'scenic',  icon:'🏰', note:'Only bird\'s-eye view of Banff townsite on the whole trip' },
    { day:3, lat:51.0892, lon:-115.3456, name:'Canmore (hotel)',        type:'sleep',   icon:'🏠', note:'Night 3 of 3 at Canmore — checkout tomorrow morning' },

    // ── Day 4: Canmore → Icefields Parkway → Hinton ─────────────────────────
    { day:4, lat:51.0892, lon:-115.3456, name:'Canmore (checkout)',      type:'sleep',   icon:'🏠', note:'Checkout — last morning in Canmore, bags in car, never coming back' },
    { day:4, lat:51.0900, lon:-115.3560, name:"Policeman's Creek",     type:'scenic',  icon:'🌿', note:'Flat boardwalk through Canmore — farewell to the town' },
    { day:4, lat:51.6720, lon:-116.4500, name:'Bow Lake',              type:'special', icon:'🌊', note:'Vivid turquoise at foot of Crowfoot Glacier — flat shore' },
    { day:4, lat:51.7160, lon:-116.4850, name:'Peyto Lake',            type:'special', icon:'🐺', note:'Wolf\'s-head shape from above — highest paved road in Canada' },
    { day:4, lat:51.8330, lon:-116.6350, name:'Mistaya Canyon',        type:'scenic',  icon:'🏰', note:'Hidden gem slot canyon — most drivers skip this' },
    { day:4, lat:51.9320, lon:-116.7300, name:'Saskatchewan Crossing', type:'scenic',  icon:'⛽', note:'Only gas for 154 km — fill the tank here, no exceptions' },
    { day:4, lat:52.0590, lon:-116.9550, name:'Weeping Wall',          type:'scenic',  icon:'💧', note:'100m cliff face streaming with waterfalls in June snowmelt' },
    { day:4, lat:53.4126, lon:-117.5634, name:'Hinton (hotel)',        type:'sleep',   icon:'🏠', note:'Base for 3 nights — 50 min east of Jasper, half the price' },

    // ── Day 5: Hinton → Columbia Icefield → Jasper ──────────────────────────
    { day:5, lat:52.2167, lon:-117.2333, name:'Columbia Icefield',     type:'special', icon:'❄️', note:'Ice Explorer onto 10,000-yr-old Athabasca Glacier — must book' },
    { day:5, lat:52.6620, lon:-117.8830, name:'Athabasca Falls',       type:'special', icon:'💧', note:'Most powerful waterfall in the Rockies — narrow 7m gorge' },
    { day:5, lat:52.8737, lon:-118.0814, name:'Jasper Townsite',       type:'scenic',  icon:'🏙️', note:'Rugged mountain town — elk wander the streets in afternoon' },
    { day:5, lat:52.8510, lon:-118.0680, name:'Lac Beauvert',          type:'scenic',  icon:'🌊', note:'Jasper Park Lodge lake — best reflections late afternoon' },
    { day:5, lat:52.8010, lon:-117.9280, name:'Medicine Lake (stars)', type:'special', icon:'⭐', note:"World's largest accessible Dark Sky Preserve — clear nights only" },
    { day:5, lat:53.4126, lon:-117.5634, name:'Hinton (hotel)',         type:'sleep',   icon:'🏠', note:'Night 2 of 3 at Hinton — base for Jasper days' },

    // ── Day 6: Hinton → Maligne Valley → Jasper → Pyramid Lake ─────────────
    { day:6, lat:52.9120, lon:-117.9990, name:'Maligne Canyon',        type:'special', icon:'⛰️', note:'Deepest accessible canyon in the Rockies — 50m walls' },
    { day:6, lat:52.6820, lon:-117.6340, name:'Maligne Lake',          type:'special', icon:'⛵', note:'Spirit Island Cruise — 90 min to the most iconic view in Jasper' },
    { day:6, lat:52.8737, lon:-118.0814, name:'Jasper Townsite',       type:'scenic',  icon:'🏙️', note:'Afternoon wander — Patricia Street, coffee, souvenirs' },
    { day:6, lat:52.9100, lon:-118.1340, name:'Pyramid Lake',          type:'scenic',  icon:'🌊', note:'Pyramid Island bridge — final peaceful stop of the trip' },
    { day:6, lat:53.4126, lon:-117.5634, name:'Hinton (hotel)',         type:'sleep',   icon:'🏠', note:'Night 3 of 3 at Hinton — pack bags tonight for Day 7' },

    // ── Day 7: Hinton → Icefields Parkway Southbound → Calgary ──────────────
    { day:7, lat:53.4126, lon:-117.5634, name:'Hinton (checkout)',       type:'sleep',   icon:'🏠', note:'Checkout Hinton — bags packed last night, heading west' },
    { day:7, lat:52.8737, lon:-118.0814, name:'Jasper (coffee stop)',  type:'food',    icon:'☕', note:'Last mountain coffees — Patricia Street, opens early' },
    { day:7, lat:52.6620, lon:-117.8830, name:'Athabasca Falls (×2)', type:'scenic',  icon:'💧', note:'Morning light hits the gorge from a different angle' },
    { day:7, lat:52.2167, lon:-117.2333, name:'Icefield Viewpoint',   type:'scenic',  icon:'❄️', note:'Roadside view — the glacier you stood on yesterday' },
    { day:7, lat:52.5320, lon:-117.6490, name:'Sunwapta Falls',        type:'scenic',  icon:'🌊', note:'Horseshoe falls just off the Parkway — quieter than Athabasca' },
    { day:7, lat:51.9320, lon:-116.7300, name:'Saskatchewan Crossing', type:'scenic',  icon:'⛽', note:'Mandatory gas + lunch stop — halfway point on the Parkway' },
    { day:7, lat:51.7160, lon:-116.4850, name:'Peyto Lake (×2)',      type:'scenic',  icon:'🐺', note:'Southbound approach shows the wolf-head from a new angle' },
    { day:7, lat:51.6720, lon:-116.4500, name:'Bow Lake (farewell)',   type:'scenic',  icon:'🌊', note:'Last mountain stop — Crowfoot Glacier reflected, total quiet' },
    { day:7, lat:51.0447, lon:-114.0719, name:'Calgary (YYC)',         type:'sleep',   icon:'✈️', note:'Trip end — fly home Jun 23' },
  ];

  // Route waypoints per day — connects stops + highway midpoints for a truer path
  const ROUTES = [
    // Day 1: Calgary → Castle Junction → Kootenay NP → Banff → Canmore
    [
      [51.0447,-114.0719],
      [51.0800,-115.0000],
      [51.2150,-115.9900], // Castle Junction
      [51.1830,-116.1310], // Marble Canyon
      [51.1560,-116.1080], // Paint Pots
      [51.2150,-115.9900], // back to Castle Junction
      [51.1784,-115.5708], // Banff
      [51.1650,-115.5540], // Gondola
      [51.1770,-115.5700], // Zyka
      [51.0892,-115.3456], // Canmore
    ],
    // Day 2: Canmore → P&R → Moraine → Lake Louise → Bow Valley → Johnston → Canmore
    [
      [51.0892,-115.3456],
      [51.2950,-116.1800], // Lake Louise P&R
      [51.3214,-116.1860], // Moraine Lake
      [51.4163,-116.1789], // Lake Louise
      [51.2950,-116.1800], // back to P&R
      [51.2150,-115.9900], // Castle Junction → Bow Valley Pkwy
      [51.2780,-116.0190], // Morant's Curve
      [51.2540,-115.8290], // Johnston Canyon
      [51.0892,-115.3456], // Canmore
    ],
    // Day 3: Canmore → Yoho → Emerald Lake → Banff → Minnewanka → Norquay → Canmore
    [
      [51.0892,-115.3456],
      [51.2950,-116.1800],
      [51.3940,-116.4910], // Field, BC
      [51.4990,-116.4860], // Takakkaw
      [51.4360,-116.4880], // Spiral Tunnels
      [51.4040,-116.4910], // Natural Bridge
      [51.4370,-116.5340], // Emerald Lake
      [51.3940,-116.4910], // back via Field
      [51.2950,-116.1800],
      [51.1784,-115.5708], // Banff (Minnewanka loop)
      [51.2280,-115.4830], // Lake Minnewanka
      [51.2000,-115.5870], // Norquay
      [51.0892,-115.3456],
    ],
    // Day 4: Canmore → Banff → Icefields Parkway north → Jasper → Hinton
    [
      [51.0892,-115.3456],
      [51.1784,-115.5708], // Banff
      [51.2950,-116.1800], // Lake Louise junction
      [51.6720,-116.4500], // Bow Lake
      [51.7160,-116.4850], // Peyto
      [51.8330,-116.6350], // Mistaya Canyon
      [51.9320,-116.7300], // Sask. Crossing
      [52.0590,-116.9550], // Weeping Wall
      [52.2167,-117.2333], // Columbia Icefield
      [52.8737,-118.0814], // Jasper
      [53.4126,-117.5634], // Hinton
    ],
    // Day 5: Hinton → Icefield → Athabasca Falls → Jasper → Lac Beauvert → Hinton → Medicine Lake
    [
      [53.4126,-117.5634],
      [52.8737,-118.0814], // Jasper
      [52.2167,-117.2333], // Columbia Icefield
      [52.6620,-117.8830], // Athabasca Falls
      [52.8737,-118.0814], // Jasper
      [52.8510,-118.0680], // Lac Beauvert
      [53.4126,-117.5634], // Hinton
      [52.8010,-117.9280], // Medicine Lake (stargazing)
    ],
    // Day 6: Hinton → Maligne Canyon → Maligne Lake → Jasper → Pyramid Lake → Hinton
    [
      [53.4126,-117.5634],
      [52.8737,-118.0814], // Jasper
      [52.9120,-117.9990], // Maligne Canyon
      [52.8010,-117.9280], // Medicine Lake (pass through)
      [52.6820,-117.6340], // Maligne Lake
      [52.8010,-117.9280],
      [52.8737,-118.0814], // Jasper
      [52.9100,-118.1340], // Pyramid Lake
      [52.8737,-118.0814],
      [53.4126,-117.5634],
    ],
    // Day 7: Hinton → Jasper → Icefields Parkway south → Calgary
    [
      [53.4126,-117.5634],
      [52.8737,-118.0814], // Jasper
      [52.6620,-117.8830], // Athabasca Falls
      [52.5320,-117.6490], // Sunwapta Falls
      [52.2167,-117.2333], // Icefield
      [51.9320,-116.7300], // Sask. Crossing
      [51.7160,-116.4850], // Peyto
      [51.6720,-116.4500], // Bow Lake
      [51.2950,-116.1800], // Lake Louise
      [51.0447,-114.0719], // Calgary
    ],
  ];

  return { DAYS, STOPS, ROUTES };
})();
