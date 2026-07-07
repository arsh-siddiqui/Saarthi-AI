const fs = require('fs');
const path = require('path');

// Exact neighborhood coordinates (guaranteed on land)
const locations = [
  // Mumbai
  { name: 'Andheri', lat: 19.1136, lng: 72.8697, prefix: 'm1' },
  { name: 'Bandra', lat: 19.0596, lng: 72.8295, prefix: 'm2' },
  { name: 'Borivali', lat: 19.2307, lng: 72.8567, prefix: 'm3' },
  { name: 'Dadar', lat: 19.0178, lng: 72.8478, prefix: 'm4' },
  { name: 'Goregaon', lat: 19.1550, lng: 72.8499, prefix: 'm5' },
  { name: 'Kurla', lat: 19.0728, lng: 72.8826, prefix: 'm6' },
  { name: 'Malad', lat: 19.1860, lng: 72.8400, prefix: 'm7' },
  { name: 'Mulund', lat: 19.1719, lng: 72.9503, prefix: 'm8' },
  { name: 'Powai', lat: 19.1176, lng: 72.9060, prefix: 'm9' },
  // Pune
  { name: 'Kothrud', lat: 18.5074, lng: 73.8077, prefix: 'p1' },
  { name: 'Hinjawadi', lat: 18.5913, lng: 73.7389, prefix: 'p2' },
  { name: 'Viman Nagar', lat: 18.5665, lng: 73.9122, prefix: 'p3' },
  { name: 'Kalyani Nagar', lat: 18.5476, lng: 73.9033, prefix: 'p4' },
  { name: 'Shivajinagar', lat: 18.5314, lng: 73.8446, prefix: 'p5' },
  { name: 'Magarpatta', lat: 18.5135, lng: 73.9298, prefix: 'p6' },
  // Delhi
  { name: 'Connaught Place', lat: 28.6304, lng: 77.2177, prefix: 'd1' },
  { name: 'Hauz Khas', lat: 28.5494, lng: 77.2001, prefix: 'd2' },
  { name: 'Saket', lat: 28.5246, lng: 77.2066, prefix: 'd3' },
  { name: 'Dwarka', lat: 28.5921, lng: 77.0460, prefix: 'd4' },
  // Bengaluru
  { name: 'Koramangala', lat: 12.9279, lng: 77.6271, prefix: 'b1' },
  { name: 'Indiranagar', lat: 12.9784, lng: 77.6408, prefix: 'b2' },
  { name: 'Jayanagar', lat: 12.9299, lng: 77.5824, prefix: 'b3' },
  { name: 'Whitefield', lat: 12.9698, lng: 77.7499, prefix: 'b4' },
];

const categories = ['hospital', 'police', 'passport', 'municipal', 'school', 'blood-bank', 'post-office', 'fire-station', 'phc'];

function generateTinyOffset() {
  // +/- 0.01 degrees is roughly +/- 1km. Very safe on land.
  return (Math.random() - 0.5) * 0.02;
}

let services = [];
let idCounter = 1;

locations.forEach(loc => {
  categories.forEach(category => {
    // 1-2 locations per category per neighborhood
    const count = Math.floor(Math.random() * 2) + 1; 
    for (let i = 0; i < count; i++) {
      const lat = loc.lat + generateTinyOffset();
      const lng = loc.lng + generateTinyOffset();
      const distanceKm = (Math.random() * 5 + 0.5).toFixed(1);
      const rating = (Math.random() * 1.5 + 3.5).toFixed(1); // 3.5 to 5.0
      
      let name = '';
      if (category === 'hospital') name = `Govt Hospital, ${loc.name}`;
      if (category === 'police') name = `${loc.name} Police Station`;
      if (category === 'passport') name = `Passport Seva Kendra, ${loc.name}`;
      if (category === 'municipal') name = `Ward Office, ${loc.name}`;
      if (category === 'school') name = `Zilla Parishad School, ${loc.name}`;
      if (category === 'blood-bank') name = `Red Cross Blood Bank, ${loc.name}`;
      if (category === 'post-office') name = `${loc.name} Post Office`;
      if (category === 'fire-station') name = `${loc.name} Fire Station`;
      if (category === 'phc') name = `Primary Health Centre, ${loc.name}`;

      services.push({
        id: `${loc.prefix}-${category}-${idCounter++}`,
        name,
        category,
        lat,
        lng,
        address: `Main Road, ${loc.name}`,
        distanceKm: parseFloat(distanceKm),
        openHours: category === 'hospital' || category === 'police' || category === 'fire-station' ? '24 Hours' : '9:00 AM - 5:00 PM',
        phone: `0${Math.floor(Math.random() * 100)}-2${Math.floor(Math.random() * 1000000)}`,
        rating: parseFloat(rating)
      });
    }
  });
});

const fileContent = `import { CivicService } from "@/types";

export const MUMBAI_CENTER: [number, number] = [19.076, 72.8777];

export const CIVIC_SERVICES: CivicService[] = ${JSON.stringify(services, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../data/markers.ts'), fileContent);
console.log('Successfully generated ' + services.length + ' locations.');
