# Trip Data JSON Template

## File Naming Convention
`{destination-slug}-{year}.json`

Examples:
- banff-jasper-2024.json
- barcelona-2025.json
- japan-tokyo-2025.json

## JSON Structure

```json
{
  "id": "banff-jasper-2024",
  "title": "Banff & Jasper National Parks",
  "destination": "Alberta, Canada",
  "dates": {
    "start": "2024-08-15",
    "end": "2024-08-25",
    "display": "Aug 15 - 25, 2024"
  },
  "coverImage": "/images/trips/banff/cover.jpg",
  "status": "completed",
  "summary": "Epic mountain adventure through the Canadian Rockies with stunning lakes, glaciers, and wildlife.",
  
  "days": [
    {
      "day": 1,
      "date": "2024-08-15",
      "location": "Banff",
      "title": "Arrival & Lake Louise",
      "activities": [
        {
          "time": "09:00",
          "title": "Arrive Calgary Airport",
          "description": "Pick up rental car, drive to Banff (1.5 hours)",
          "duration": "1.5h",
          "cost": "$0",
          "type": "transport"
        },
        {
          "time": "14:00",
          "title": "Lake Louise",
          "description": "Iconic turquoise lake with glacier backdrop. Walk the shoreline trail.",
          "duration": "3h",
          "cost": "$0",
          "location": "Lake Louise",
          "tips": "Arrive early or late to avoid crowds. Best light in morning.",
          "type": "sightseeing"
        }
      ],
      "meals": {
        "breakfast": "Coffee at Calgary Airport",
        "lunch": "Lake Louise Station Restaurant",
        "dinner": "The Bison Restaurant, Banff"
      },
      "accommodation": {
        "name": "Banff Aspen Lodge",
        "cost": "$180",
        "booking": "Booking.com"
      }
    }
  ],
  
  "budget": {
    "flights": 650,
    "carRental": 400,
    "accommodation": 1800,
    "food": 600,
    "activities": 200,
    "other": 150,
    "total": 3800,
    "currency": "USD"
  },
  
  "highlights": [
    "Sunrise at Moraine Lake",
    "Hiking to Plain of Six Glaciers",
    "Wildlife spotting (bears, elk, mountain goats)",
    "Athabasca Glacier walk"
  ],
  
  "tips": [
    "Book Lake Louise parking in advance",
    "Bring bear spray for hiking",
    "Download offline maps (spotty cell service)",
    "Gas up in towns (sparse stations in parks)"
  ],
  
  "weather": {
    "apiEnabled": false,
    "averageHigh": "22°C",
    "averageLow": "8°C",
    "conditions": "Sunny with afternoon showers possible"
  }
}
```

## Activity Types
- `transport` - Flights, drives, transfers
- `sightseeing` - Landmarks, viewpoints
- `hiking` - Trails, outdoor activities
- `food` - Restaurants, food tours
- `cultural` - Museums, historical sites
- `relaxation` - Spa, downtime
- `shopping` - Markets, stores
- `wildlife` - Animal encounters

## Future API Integration
The `weather` object will be enhanced to fetch live data:
```json
"weather": {
  "apiEnabled": true,
  "location": "Banff, AB",
  "coordinates": {"lat": 51.1784, "lon": -115.5708}
}
```