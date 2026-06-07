import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Search, BatteryCharging, Menu, MapPin, Zap, Building2, ChevronDown, X, Navigation, ExternalLink, Clock, AlertCircle, CheckCircle, Car, ThumbsUp } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import './ChargingStationMap.css';
import { spkluStations, provinsiList, kabkotaByProvinsi } from '../data/spkluData';

// Fix for default Leaflet icon issue in React
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// 5 SPKLU photos for visual variety
const SPKLU_IMAGES = [
  '/images/spklu/spklu-1.png',
  '/images/spklu/spklu-2.png',
  '/images/spklu/spklu-3.png',
  '/images/spklu/spklu-4.png',
  '/images/spklu/spklu-5.png',
];

// Deterministic image assignment based on station name
function getStationImage(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash |= 0;
  }
  return SPKLU_IMAGES[Math.abs(hash) % SPKLU_IMAGES.length];
}

// Build Google Maps directions URL
function getGoogleMapsUrl(lat, lng, name) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
}

// Build Google Maps place URL
function getGoogleMapsPlaceUrl(lat, lng, name) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

// Haversine distance in km
function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Deterministic but realistic occupancy simulation per station
function generateStationStatus(station) {
  // Seed from station name hash for consistency across renders
  let hash = 0;
  for (let i = 0; i < station.nama.length; i++) {
    hash = ((hash << 5) - hash) + station.nama.charCodeAt(i);
    hash |= 0;
  }
  const totalSlots = station.count || 1;
  const seed = Math.abs(hash) % 100;
  // ~25% chance full, ~45% partially used, ~30% free
  let usedSlots;
  if (seed < 25) usedSlots = totalSlots;          // full
  else if (seed < 70) usedSlots = Math.max(1, Math.floor(totalSlots * 0.5)); // partial
  else usedSlots = 0;                              // available

  const vehicles = [];
  for (let i = 0; i < usedSlots; i++) {
    const vHash = Math.abs((hash + i * 31) % 1000);
    const minutesElapsed = 10 + (vHash % 80);   // 10–90 min elapsed
    const totalMinutes = getChargingDuration(station.chargingType, station.power);
    const remaining = Math.max(1, totalMinutes - minutesElapsed);
    vehicles.push({
      id: i + 1,
      plate: generatePlate(hash + i),
      elapsed: minutesElapsed,
      remaining,
      percent: Math.min(99, Math.round((minutesElapsed / totalMinutes) * 100)),
    });
  }

  return { totalSlots, usedSlots, freeSlots: totalSlots - usedSlots, vehicles };
}

function getChargingDuration(type, power) {
  // Rough estimate: minutes needed for a typical 60 kWh battery (0→80%)
  const kwh = 48; // 60 kWh × 80% = 48 kWh
  const pw = (power > 1000 ? power / 1000 : power) || 7.4; // ensure kW
  const hours = kwh / pw;
  return Math.round(hours * 60);
}

function generatePlate(seed) {
  const prefixes = ['B', 'D', 'F', 'L', 'N', 'AB', 'AD', 'AE', 'AG'];
  const prefix = prefixes[Math.abs(seed) % prefixes.length];
  const numbers = 1000 + (Math.abs(seed * 17) % 8999);
  const suffixes = ['AAA', 'BBB', 'CDE', 'FGH', 'IJK', 'LMN'];
  const suffix = suffixes[Math.abs(seed) % suffixes.length];
  return `${prefix} ${numbers} ${suffix}`;
}

// Find nearest N alternative stations (excluding current)
function getNearestAlternatives(station, count = 3) {
  return spkluStations
    .filter(s => s.nama !== station.nama)
    .map(s => ({ ...s, distKm: getDistanceKm(station.lat, station.lng, s.lat, s.lng) }))
    .sort((a, b) => a.distKm - b.distKm)
    .slice(0, count);
}

// Helper: fly map to a location
function FlyToStation({ lat, lng, zoom }) {
  const map = useMap();
  React.useEffect(() => {
    if (lat && lng) map.flyTo([lat, lng], zoom || 15, { duration: 1.2 });
  }, [lat, lng, zoom, map]);
  return null;
}

// Helper: force invalidate size on mount and resize
function MapResizeController() {
  const map = useMap();
  React.useEffect(() => {
    // Multiple invalidateSize calls to handle layout settling on mobile
    map.invalidateSize();
    const timer1 = setTimeout(() => map.invalidateSize(), 100);
    const timer2 = setTimeout(() => map.invalidateSize(), 500);
    const timer3 = setTimeout(() => map.invalidateSize(), 1500);
    const handleResize = () => {
      map.invalidateSize();
      // Also re-invalidate after a short delay on resize
      setTimeout(() => map.invalidateSize(), 200);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [map]);
  return null;
}

// Normalize power to kW display
function formatPower(power) {
  if (!power || power === 0) return '–';
  if (power >= 1000) return `${(power / 1000).toFixed(0)} kW`;
  return `${power} kW`;
}

function getTypeLabel(type) {
  switch (type) {
    case 'Ultra Fast Charging': return 'Ultra Fast';
    case 'Fast Charging': return 'Fast';
    case 'Medium Charging': return 'Medium';
    case 'Slow Charging': return 'Slow';
    default: return type;
  }
}

function getTypeBadgeClass(type) {
  switch (type) {
    case 'Ultra Fast Charging': return 'badge-ultrafast';
    case 'Fast Charging': return 'badge-fast';
    case 'Medium Charging': return 'badge-medium';
    case 'Slow Charging': return 'badge-slow';
    default: return '';
  }
}

const ITEMS_PER_PAGE = 30;

// Charging progress bar mini component
const VehicleChargeRow = ({ vehicle }) => (
  <div className="vehicle-charge-row">
    <div className="vehicle-charge-header">
      <span className="vehicle-plate"><Car size={13} /> {vehicle.plate}</span>
      <span className="vehicle-time-remain">
        <Clock size={12} /> Selesai ~{vehicle.remaining} mnt lagi
      </span>
    </div>
    <div className="vehicle-progress-bar">
      <div
        className="vehicle-progress-fill"
        style={{ width: `${vehicle.percent}%` }}
      />
    </div>
    <div className="vehicle-charge-meta">
      <span>{vehicle.percent}% terisi</span>
      <span>Sudah {vehicle.elapsed} mnt</span>
    </div>
  </div>
);

// Station Detail Panel Component
const StationDetailPanel = ({ station, onClose, onSelectStation }) => {
  if (!station) return null;

  const imgSrc = getStationImage(station.nama);
  const mapsUrl = getGoogleMapsUrl(station.lat, station.lng, station.nama);
  const placeUrl = getGoogleMapsPlaceUrl(station.lat, station.lng, station.nama);

  // Compute occupancy status
  const status = useMemo(() => generateStationStatus(station), [station]);
  const isFull = status.freeSlots === 0;
  const alternatives = useMemo(() => getNearestAlternatives(station, 3), [station]);

  return (
    <div className="station-detail-overlay" onClick={onClose}>
      <div className="station-detail-panel" onClick={e => e.stopPropagation()}>
        <button className="detail-close-btn" onClick={onClose} aria-label="Tutup">
          <X size={20} />
        </button>

        <div className="detail-image-wrapper">
          <img src={imgSrc} alt={station.nama} className="detail-image" loading="lazy" />
          <div className="detail-image-overlay">
            <span className={`badge type-badge ${getTypeBadgeClass(station.chargingType)}`}>
              {getTypeLabel(station.chargingType)}
            </span>
          </div>
          {/* Occupancy pill on image */}
          <div className={`detail-occupancy-pill ${isFull ? 'pill-full' : status.usedSlots > 0 ? 'pill-partial' : 'pill-free'}`}>
            {isFull
              ? <><AlertCircle size={13} /> Penuh</>
              : status.usedSlots > 0
                ? <><Zap size={13} /> Sebagian Terpakai</>
                : <><CheckCircle size={13} /> Tersedia</>}
          </div>
        </div>

        <div className="detail-body">
          <h3 className="detail-title">{station.nama}</h3>

          {/* ── OCCUPANCY STATUS CARD ── */}
          <div className={`occupancy-card ${isFull ? 'occ-full' : status.usedSlots > 0 ? 'occ-partial' : 'occ-free'}`}>
            <div className="occ-slots">
              {Array.from({ length: status.totalSlots }).map((_, i) => (
                <div key={i} className={`slot-dot ${i < status.usedSlots ? 'slot-used' : 'slot-free'}`} />
              ))}
            </div>
            <div className="occ-text">
              <span className="occ-main">
                {isFull
                  ? `Semua ${status.totalSlots} slot sedang digunakan`
                  : status.usedSlots === 0
                    ? `${status.totalSlots} slot tersedia · Tidak ada antrian`
                    : `${status.freeSlots} dari ${status.totalSlots} slot tersedia`}
              </span>
              <span className="occ-sub">
                {status.usedSlots > 0
                  ? `${status.usedSlots} kendaraan sedang mengisi daya`
                  : 'Langsung bisa digunakan'}
              </span>
            </div>
          </div>

          {/* ── VEHICLES CURRENTLY CHARGING ── */}
          {status.vehicles.length > 0 && (
            <div className="vehicles-section">
              <div className="vehicles-section-title">
                <Car size={14} /> Kendaraan yang Sedang Mengisi
              </div>
              {status.vehicles.map(v => (
                <VehicleChargeRow key={v.id} vehicle={v} />
              ))}
            </div>
          )}

          {/* ── ALTERNATIVES / RECOMMENDATIONS ── */}
          {alternatives.length > 0 && (
            <div className="alternatives-section">
              <div className="alternatives-title">
                <ThumbsUp size={14} /> {isFull ? 'SPKLU Terdekat yang Tersedia' : 'SPKLU Terdekat Lainnya'}
              </div>
              {alternatives.map((alt, idx) => {
                const altStatus = generateStationStatus(alt);
                return (
                  <div
                    key={idx}
                    className="alt-station-card"
                    onClick={() => { onSelectStation && onSelectStation(alt); }}
                    role="button"
                    tabIndex={0}
                    title="Klik untuk melihat detail"
                  >
                    <img src={getStationImage(alt.nama)} alt={alt.nama} className="alt-thumb" />
                    <div className="alt-info">
                      <span className="alt-name">{alt.nama}</span>
                      <span className="alt-address">{alt.alamat.slice(0, 55)}{alt.alamat.length > 55 ? '…' : ''}</span>
                      <div className="alt-badges">
                        <span className={`badge type-badge ${getTypeBadgeClass(alt.chargingType)}`}>
                          {getTypeLabel(alt.chargingType)}
                        </span>
                        <span className="alt-dist">{alt.distKm.toFixed(1)} km</span>
                        <span className={`alt-avail ${altStatus.freeSlots > 0 ? 'avail-yes' : 'avail-no'}`}>
                          {altStatus.freeSlots > 0 ? `${altStatus.freeSlots} slot bebas` : 'Penuh'}
                        </span>
                      </div>
                    </div>
                    <Navigation size={15} className="alt-nav-icon" />
                  </div>
                );
              })}
            </div>
          )}

          <div className="detail-info-grid">
            <div className="detail-info-item">
              <MapPin size={16} />
              <div>
                <span className="detail-label">Alamat</span>
                <span className="detail-value">{station.alamat}</span>
              </div>
            </div>
            <div className="detail-info-item">
              <MapPin size={16} />
              <div>
                <span className="detail-label">Wilayah</span>
                <span className="detail-value">{station.kabkota}, {station.provinsi}</span>
              </div>
            </div>
            <div className="detail-info-item">
              <Zap size={16} />
              <div>
                <span className="detail-label">Tipe & Daya</span>
                <span className="detail-value">{station.chargingType} • {formatPower(station.power)}</span>
              </div>
            </div>
            {station.brand && station.brand !== 'Merek Dummy' && (
              <div className="detail-info-item">
                <BatteryCharging size={16} />
                <div>
                  <span className="detail-label">Merek Charger</span>
                  <span className="detail-value">{station.brand}</span>
                </div>
              </div>
            )}
            <div className="detail-info-item">
              <Building2 size={16} />
              <div>
                <span className="detail-label">Operator</span>
                <span className="detail-value">{station.operator}</span>
              </div>
            </div>
          </div>

          <div className="detail-coords">
            <span>📍 {station.lat.toFixed(6)}, {station.lng.toFixed(6)}</span>
            <span className="detail-skema">Skema: {station.skema}</span>
          </div>

          <div className="detail-actions">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="detail-btn detail-btn-primary"
            >
              <Navigation size={18} />
              Navigasi ke Lokasi
            </a>
            <a
              href={placeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="detail-btn detail-btn-secondary"
            >
              <ExternalLink size={18} />
              Lihat di Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChargingStationMap = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvinsi, setSelectedProvinsi] = useState('');
  const [selectedKabkota, setSelectedKabkota] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [flyTarget, setFlyTarget] = useState(null);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [selectedStation, setSelectedStation] = useState(null);
  const listRef = useRef(null);

  const centerPosition = [-2.5489, 118.0149];
  const zoomLevel = 5;

  const availableKabkota = useMemo(() => {
    if (!selectedProvinsi) return [];
    return kabkotaByProvinsi[selectedProvinsi] || [];
  }, [selectedProvinsi]);

  const chargingTypes = useMemo(() => {
    const types = new Set(spkluStations.map(s => s.chargingType));
    return [...types].sort();
  }, []);

  const filteredStations = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return spkluStations.filter(station => {
      if (term && !station.nama.toLowerCase().includes(term) && !station.alamat.toLowerCase().includes(term) && !station.kabkota.toLowerCase().includes(term)) return false;
      if (selectedProvinsi && station.provinsi !== selectedProvinsi) return false;
      if (selectedKabkota && station.kabkota !== selectedKabkota) return false;
      if (selectedType && station.chargingType !== selectedType) return false;
      return true;
    });
  }, [searchTerm, selectedProvinsi, selectedKabkota, selectedType]);

  const visibleStations = useMemo(() => filteredStations.slice(0, visibleCount), [filteredStations, visibleCount]);

  const groupedStations = useMemo(() => {
    const groups = {};
    for (const s of visibleStations) {
      if (!groups[s.provinsi]) groups[s.provinsi] = [];
      groups[s.provinsi].push(s);
    }
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [visibleStations]);

  const mapMarkers = useMemo(() => filteredStations.slice(0, 500), [filteredStations]);

  const handleStationClick = (station) => {
    setFlyTarget({ lat: station.lat, lng: station.lng, key: Date.now() });
    setSelectedStation(station);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedProvinsi('');
    setSelectedKabkota('');
    setSelectedType('');
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + ITEMS_PER_PAGE);
  };

  const hasFilters = searchTerm || selectedProvinsi || selectedKabkota || selectedType;

  return (
    <section className="section-padding map-section" id="map-section">
      <div className="container">
        <div className="map-container-wrapper">

          {/* Sidebar */}
          <div className="map-sidebar">
            <div className="sidebar-header">
              <div className="sidebar-title">
                <BatteryCharging size={24} className="title-icon" />
                <h2>Stasiun Pengisian</h2>
              </div>
              <p className="sidebar-subtitle">{spkluStations.length.toLocaleString()} SPKLU di seluruh Indonesia</p>
            </div>

            <div className="sidebar-filters">
              <div className="filter-group">
                <label><Search size={14} /> Cari Stasiun</label>
                <div className="search-input-wrapper">
                  <Search size={18} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Nama, alamat, atau kota..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setVisibleCount(ITEMS_PER_PAGE); }}
                    className="sidebar-input"
                    id="station-search"
                  />
                  {searchTerm && (
                    <button className="clear-search-btn" onClick={() => setSearchTerm('')} aria-label="Clear search">
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="filter-row">
                <div className="filter-group half">
                  <label><MapPin size={14} /> Provinsi</label>
                  <select
                    className="sidebar-select"
                    value={selectedProvinsi}
                    onChange={(e) => { setSelectedProvinsi(e.target.value); setSelectedKabkota(''); setVisibleCount(ITEMS_PER_PAGE); }}
                    id="filter-provinsi"
                  >
                    <option value="">Semua ({provinsiList.length})</option>
                    {provinsiList.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="filter-group half">
                  <label>Kab/Kota</label>
                  <select
                    className="sidebar-select"
                    value={selectedKabkota}
                    onChange={(e) => { setSelectedKabkota(e.target.value); setVisibleCount(ITEMS_PER_PAGE); }}
                    disabled={!selectedProvinsi}
                    id="filter-kabkota"
                  >
                    <option value="">Semua</option>
                    {availableKabkota.map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
              </div>

              <div className="filter-group">
                <label><Zap size={14} /> Tipe Charger</label>
                <select
                  className="sidebar-select"
                  value={selectedType}
                  onChange={(e) => { setSelectedType(e.target.value); setVisibleCount(ITEMS_PER_PAGE); }}
                  id="filter-type"
                >
                  <option value="">Semua Tipe</option>
                  {chargingTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {hasFilters && (
                <button className="clear-filters-btn" onClick={handleClearFilters}>
                  <X size={14} /> Hapus Semua Filter
                </button>
              )}
            </div>

            <div className="sidebar-list-header">
              <Menu size={18} />
              <h3>Daftar Stasiun</h3>
              <span className="result-count">{filteredStations.length.toLocaleString()} hasil</span>
            </div>

            <div className="station-list" ref={listRef}>
              {groupedStations.length === 0 ? (
                <div className="empty-state">
                  <MapPin size={32} />
                  <p>Tidak ada stasiun ditemukan</p>
                  <small>Coba ubah filter pencarian</small>
                </div>
              ) : (
                groupedStations.map(([provinsi, stations]) => (
                  <div key={provinsi}>
                    <div className="list-group-title">
                      <MapPin size={12} /> {provinsi} ({stations.length})
                    </div>
                    {stations.map((station, idx) => (
                      <div
                        key={`${station.nama}-${station.lat}-${idx}`}
                        className="station-card"
                        onClick={() => handleStationClick(station)}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="station-card-with-image">
                          <div className="station-card-thumb">
                            <img
                              src={getStationImage(station.nama)}
                              alt={station.nama}
                              loading="lazy"
                            />
                            <span className={`thumb-badge ${getTypeBadgeClass(station.chargingType)}`}>
                              {getTypeLabel(station.chargingType)}
                            </span>
                          </div>
                          <div className="station-card-info">
                            <h4 className="station-name">{station.nama}</h4>
                            <p className="station-address">{station.alamat}</p>
                            <div className="station-card-footer">
                              <span className="badge power-badge">
                                <Zap size={11} /> {formatPower(station.power)}
                              </span>
                              <span className="station-nav-hint">
                                <Navigation size={11} /> Klik untuk navigasi
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              )}
              {visibleCount < filteredStations.length && (
                <button className="load-more-btn" onClick={handleLoadMore}>
                  <ChevronDown size={16} />
                  Tampilkan {Math.min(ITEMS_PER_PAGE, filteredStations.length - visibleCount)} lagi
                  ({filteredStations.length - visibleCount} tersisa)
                </button>
              )}
            </div>
          </div>

          {/* Map Area */}
          <div className="map-view">
            <MapContainer center={centerPosition} zoom={zoomLevel} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapResizeController />
              {flyTarget && <FlyToStation lat={flyTarget.lat} lng={flyTarget.lng} key={flyTarget.key} />}
              {mapMarkers.map((station, idx) => (
                <Marker key={`${station.lat}-${station.lng}-${idx}`} position={[station.lat, station.lng]}>
                  <Popup>
                    <div className="popup-content">
                      <img
                        src={getStationImage(station.nama)}
                        alt={station.nama}
                        className="popup-image"
                      />
                      <strong>{station.nama}</strong><br />
                      <span className="popup-address">{station.alamat}</span><br />
                      <span className="popup-detail">
                        {getTypeLabel(station.chargingType)} • {formatPower(station.power)}
                      </span><br />
                      <div className="popup-actions">
                        <a
                          href={getGoogleMapsUrl(station.lat, station.lng, station.nama)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="popup-nav-btn"
                        >
                          <Navigation size={14} /> Navigasi
                        </a>
                        <a
                          href={getGoogleMapsPlaceUrl(station.lat, station.lng, station.nama)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="popup-maps-btn"
                        >
                          <ExternalLink size={14} /> Maps
                        </a>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
            {filteredStations.length < spkluStations.length && (
              <div className="map-filter-badge">
                Menampilkan {Math.min(500, filteredStations.length)} dari {filteredStations.length} stasiun
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Station Detail Panel (modal overlay) */}
      {selectedStation && (
        <StationDetailPanel
          station={selectedStation}
          onClose={() => setSelectedStation(null)}
          onSelectStation={(alt) => {
            setSelectedStation(alt);
            setFlyTarget({ lat: alt.lat, lng: alt.lng, key: Date.now() });
          }}
        />
      )}
    </section>
  );
};

export default ChargingStationMap;
