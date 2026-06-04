/**
 * Build script: Downloads SPKLU CSV data from GitHub and converts to a JS data module.
 * Run with: node scripts/build-spklu-data.js
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const LOKASI_URL = 'https://raw.githubusercontent.com/ahmadafienzidan/mapping-spklu-data/main/SPKLU-LOKASI.csv';
const MESIN_URL = 'https://raw.githubusercontent.com/ahmadafienzidan/mapping-spklu-data/main/SPKLU-MESIN.csv';
const OUTPUT_PATH = path.join(__dirname, '..', 'src', 'data', 'spkluData.js');

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// Parse CSV handling quoted fields with commas
function parseCSV(text) {
  const lines = text.split('\n');
  const headers = parseLine(lines[0]);
  const rows = [];
  let i = 1;
  while (i < lines.length) {
    let line = lines[i].trim();
    if (!line) { i++; continue; }
    // Handle multi-line quoted fields
    while (countQuotes(line) % 2 !== 0 && i + 1 < lines.length) {
      i++;
      line += ' ' + lines[i].trim();
    }
    rows.push(parseLine(line));
    i++;
  }
  return { headers, rows };
}

function countQuotes(s) {
  let c = 0;
  for (const ch of s) if (ch === '"') c++;
  return c;
}

function parseLine(line) {
  const fields = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      fields.push(field.trim());
      field = '';
    } else {
      field += ch;
    }
  }
  fields.push(field.trim());
  return fields;
}

function parseCoord(val) {
  if (!val) return NaN;
  // Some entries use commas as decimal separators or have malformed data
  let clean = val.replace(/[^\d.\-eE+]/g, '');
  // Handle European-style with comma decimal: "-6,229576" -> "-6.229576"
  if (val.includes(',') && !val.includes('.')) {
    const parts = val.split(',');
    if (parts.length === 2) {
      clean = parts.join('.');
    }
  }
  const num = parseFloat(clean);
  return num;
}

function classifyCharging(type) {
  if (!type) return 'Medium Charging';
  const t = type.toLowerCase();
  if (t.includes('ultra')) return 'Ultra Fast Charging';
  if (t.includes('fast')) return 'Fast Charging';
  if (t.includes('slow')) return 'Slow Charging';
  return 'Medium Charging';
}

// Provinces that must have NEGATIVE latitude (south of equator)
const SOUTHERN_PROVINCES = [
  'DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Banten',
  'DI Yogyakarta', 'Bali', 'Nusa Tenggara Barat', 'Nusa Tenggara Timur',
  'Kalimantan Selatan', 'Sulawesi Selatan', 'Sulawesi Tenggara',
  'Sulawesi Barat', 'Lampung', 'Bengkulu', 'Sumatera Selatan', 'Jambi',
  'Kepulauan Bangka Belitung', 'Maluku', 'Papua'
];

// Approximate bounding boxes per province [minLat, maxLat, minLng, maxLng]
const PROVINCE_BOUNDS = {
  'Aceh':                       [1.5, 6.0, 94.5, 98.5],
  'Sumatera Utara':             [-1.0, 4.5, 97.0, 100.5],
  'Sumatera Barat':             [-3.5, 1.5, 98.5, 101.5],
  'Riau':                       [-1.5, 3.0, 100.0, 104.0],
  'Kepulauan Riau':             [-1.0, 4.5, 103.0, 108.5],
  'Jambi':                      [-3.0, -0.5, 101.5, 105.0],
  'Sumatera Selatan':           [-5.0, -1.5, 102.5, 106.5],
  'Kepulauan Bangka Belitung':  [-4.0, -1.0, 105.0, 109.0],
  'Bengkulu':                   [-5.5, -2.0, 100.5, 104.5],
  'Lampung':                    [-6.5, -4.0, 103.5, 106.5],
  'Banten':                     [-7.2, -5.5, 105.0, 107.0],
  'DKI Jakarta':                [-6.5, -5.8, 106.5, 107.1],
  'Jawa Barat':                 [-8.0, -5.8, 106.0, 109.0],
  'Jawa Tengah':                [-8.3, -6.0, 108.5, 111.5],
  'DI Yogyakarta':              [-8.2, -7.4, 110.0, 110.8],
  'Jawa Timur':                 [-8.8, -6.5, 110.5, 115.0],
  'Bali':                       [-9.0, -8.0, 114.3, 115.8],
  'Nusa Tenggara Barat':        [-9.5, -7.5, 115.5, 120.0],
  'Nusa Tenggara Timur':        [-11.5, -8.0, 118.0, 125.5],
  'Kalimantan Barat':           [-3.5, 2.5, 108.0, 110.5],
  'Kalimantan Tengah':          [-4.0, 0.5, 111.0, 116.5],
  'Kalimantan Selatan':         [-4.5, -1.5, 114.0, 116.5],
  'Kalimantan Timur':           [-2.5, 2.5, 115.0, 118.5],
  'Kalimantan Utara':           [1.5, 4.5, 115.5, 118.0],
  'Sulawesi Utara':             [-1.0, 2.0, 123.0, 127.0],
  'Gorontalo':                  [-1.0, 1.5, 121.5, 123.5],
  'Sulawesi Tengah':            [-3.5, 1.5, 119.5, 124.5],
  'Sulawesi Selatan':           [-6.0, -2.0, 119.0, 121.5],
  'Sulawesi Barat':             [-3.5, -1.0, 118.5, 119.5],
  'Sulawesi Tenggara':          [-6.5, -3.0, 120.5, 125.0],
  'Maluku':                     [-8.5, -2.5, 124.0, 135.5],
  'Maluku Utara':               [-2.0, 3.0, 124.5, 129.5],
  'Papua':                      [-9.5, 0.0, 130.0, 141.5],
  'Papua Barat':                [-4.5, 0.5, 129.0, 135.5],
};

// Fix and validate coordinates for a given province
function fixCoordinates(lat, lng, provinsi) {
  // Step 1: For southern provinces, latitude MUST be negative
  if (SOUTHERN_PROVINCES.includes(provinsi) && lat > 0) {
    lat = -lat;
  }

  // Step 2: Check against province bounding box
  const bounds = PROVINCE_BOUNDS[provinsi];
  if (bounds) {
    const [minLat, maxLat, minLng, maxLng] = bounds;
    
    // Try with current values
    if (lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng) {
      return { lat, lng, valid: true };
    }
    
    // Try flipping latitude sign
    const flippedLat = -lat;
    if (flippedLat >= minLat && flippedLat <= maxLat && lng >= minLng && lng <= maxLng) {
      return { lat: flippedLat, lng, valid: true };
    }
    
    // Try swapping lat/lng (sometimes data has them swapped)
    if (lng >= minLat && lng <= maxLat && lat >= minLng && lat <= maxLng) {
      return { lat: lng, lng: lat, valid: true };
    }
    
    // Coordinates don't match province at all - skip
    return { lat, lng, valid: false };
  }
  
  // No bounding box defined - basic Indonesia check
  if (lat < -12 || lat > 7 || lng < 94 || lng > 142) {
    return { lat, lng, valid: false };
  }
  
  return { lat, lng, valid: true };
}

async function main() {
  console.log('Downloading SPKLU-LOKASI.csv...');
  const lokasiCSV = await fetch(LOKASI_URL);
  console.log('Downloading SPKLU-MESIN.csv...');
  const mesinCSV = await fetch(MESIN_URL);

  const lokasi = parseCSV(lokasiCSV);
  const mesin = parseCSV(mesinCSV);

  console.log(`Lokasi: ${lokasi.rows.length} rows, Mesin: ${mesin.rows.length} rows`);

  // Build machine lookup by Nomor Identitas
  const machineMap = {};
  for (const row of mesin.rows) {
    const id = row[0];
    if (!id) continue;
    if (!machineMap[id]) machineMap[id] = [];
    machineMap[id].push({
      brand: row[2] || '',
      chargingType: classifyCharging(row[3]),
      status: row[4] || 'Beroperasi',
      power: row[7] || '0',
      nozzle: row[8] || '1',
    });
  }

  // Build stations from lokasi
  const stationsByLocation = {};
  let validCount = 0;
  let fixedCount = 0;
  let droppedCount = 0;

  for (const row of lokasi.rows) {
    const nomorId = row[1];
    const nama = row[3];
    const provinsi = row[5];
    const kabkota = row[6];
    const alamat = row[7];
    let lat = parseCoord(row[8]);
    let lng = parseCoord(row[9]);
    const operator = row[2];
    const skema = row[4];
    const statusIntegrasi = row[12];

    // Skip invalid coordinates
    if (isNaN(lat) || isNaN(lng)) continue;
    if (lat === 0 && lng === 0) continue;
    
    // Basic range check first
    if (Math.abs(lat) > 15 || lng < 90 || lng > 145) continue;

    // Fix and validate coordinates against province
    const fixed = fixCoordinates(lat, lng, provinsi);
    if (!fixed.valid) {
      droppedCount++;
      continue;
    }
    if (fixed.lat !== lat || fixed.lng !== lng) {
      fixedCount++;
    }
    lat = fixed.lat;
    lng = fixed.lng;

    validCount++;

    // Group by unique location (same name + similar coords)
    const locKey = `${nama}_${lat.toFixed(3)}_${lng.toFixed(3)}`;

    if (!stationsByLocation[locKey]) {
      // Get machine info
      const machines = machineMap[nomorId] || [];
      let chargingType = 'Medium Charging';
      let power = 0;
      let brand = '';
      let status = 'Beroperasi';

      if (machines.length > 0) {
        // Pick the most powerful machine
        let bestMachine = machines[0];
        for (const m of machines) {
          const p = parseFloat(m.power) || 0;
          if (p > (parseFloat(bestMachine.power) || 0)) bestMachine = m;
        }
        chargingType = bestMachine.chargingType;
        power = parseFloat(bestMachine.power) || 0;
        brand = bestMachine.brand;
        status = bestMachine.status;
      }

      stationsByLocation[locKey] = {
        nama,
        alamat: alamat.replace(/"/g, ''),
        provinsi,
        kabkota,
        lat,
        lng,
        operator: operator.length > 50 ? operator.substring(0, 50) + '...' : operator,
        skema,
        chargingType,
        power,
        brand,
        status,
        count: 1
      };
    } else {
      stationsByLocation[locKey].count++;
    }
  }

  const stations = Object.values(stationsByLocation);
  console.log(`Valid coordinates: ${validCount}, Unique stations: ${stations.length}`);
  console.log(`Fixed coordinates: ${fixedCount}, Dropped (invalid/ocean): ${droppedCount}`);

  // Collect unique provinsi and kabkota
  const provinsiSet = new Set();
  const kabkotaByProvinsi = {};
  for (const s of stations) {
    provinsiSet.add(s.provinsi);
    if (!kabkotaByProvinsi[s.provinsi]) kabkotaByProvinsi[s.provinsi] = new Set();
    kabkotaByProvinsi[s.provinsi].add(s.kabkota);
  }

  // Convert sets to sorted arrays
  const provinsiList = [...provinsiSet].sort();
  const kabkotaMap = {};
  for (const [prov, cities] of Object.entries(kabkotaByProvinsi)) {
    kabkotaMap[prov] = [...cities].sort();
  }

  // Build output
  const output = `// Auto-generated SPKLU data from GitHub CSV
// Source: https://github.com/ahmadafienzidan/mapping-spklu-data
// Generated: ${new Date().toISOString()}
// Total unique stations: ${stations.length}

export const spkluStations = ${JSON.stringify(stations, null, 0)};

export const provinsiList = ${JSON.stringify(provinsiList)};

export const kabkotaByProvinsi = ${JSON.stringify(kabkotaMap)};
`;

  // Ensure directory exists
  const dir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(OUTPUT_PATH, output, 'utf-8');
  console.log(`Data written to ${OUTPUT_PATH}`);
  console.log(`Provinsi: ${provinsiList.length}, Stations: ${stations.length}`);
}

main().catch(console.error);
