import React, { useMemo } from 'react';
import { MapPin, Zap, Map, BarChart3, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { spkluStations } from '../data/spkluData';
import './DashboardContent.css';

/* ── Leaflet default icon fix ───────────────────────────── */
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

/* ── Static data ────────────────────────────────────────── */
const roadmapData = [
  { year: '2021', SPKLU: 1865, KBLBB: 190 },
  { year: '2022', SPKLU: 5879, KBLBB: 590 },
  { year: '2023', SPKLU: 13009, KBLBB: 1273 },
  { year: '2024', SPKLU: 23607, KBLBB: 2304 },
  { year: '2025', SPKLU: 39627, KBLBB: 3861 },
  { year: '2026', SPKLU: 64977, KBLBB: 6326 },
];

const populasiData = [
  { name: 'Roda 2', value: 18607 },
  { name: 'Roda 4', value: 2541 },
  { name: 'Roda 3', value: 135 },
  { name: 'Bus', value: 43 },
  { name: 'Mobil Barang', value: 119 },
];

const PIE_COLORS = ['#6366f1', '#06b6d4', '#f59e0b', '#ef4444', '#10b981'];

const statsCards = [
  { label: 'Total SPKLU', value: '1.518', icon: <Zap size={20} /> },
  { label: 'Provinsi', value: '34', icon: <Map size={20} /> },
  { label: 'Tipe Charger', value: '4', icon: <BarChart3 size={20} /> },
  { label: 'Pertumbuhan', value: '+161%', icon: <TrendingUp size={20} /> },
];

/* ── Custom Tooltip ─────────────────────────────────────── */
const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-title">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="chart-tooltip-row">
          <span className="chart-tooltip-dot" style={{ background: entry.color }} />
          {entry.name}: <strong>{entry.value.toLocaleString('id-ID')}</strong>
        </p>
      ))}
    </div>
  );
};

const CustomPieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-row">
        <span className="chart-tooltip-dot" style={{ background: d.payload.fill }} />
        {d.name}: <strong>{d.value.toLocaleString('id-ID')}</strong> unit
      </p>
    </div>
  );
};

const CustomLineTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-title">{label}</p>
      <p className="chart-tooltip-row">
        SPKLU: <strong>{payload[0].value.toLocaleString('id-ID')}</strong>
      </p>
    </div>
  );
};

/* ── Pie center label ───────────────────────────────────── */
const renderCenterLabel = () => (
  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central">
    <tspan x="50%" dy="-0.5em" className="pie-center-value">21.445</tspan>
    <tspan x="50%" dy="1.6em" className="pie-center-label">Total Unit</tspan>
  </text>
);

/* ── Component ──────────────────────────────────────────── */
const DashboardContent = () => {
  const markers = useMemo(
    () => spkluStations.filter((s) => s.lat && s.lng).slice(0, 300),
    [],
  );

  return (
    <div className="dashboard-content-wrapper">
      <div className="container dashboard-inner-container">

        {/* ─── Stats Bar ─────────────────────────────── */}
        <section className="stats-bar">
          {statsCards.map((s, i) => (
            <div className="stat-card" key={i}>
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-info">
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            </div>
          ))}
        </section>

        {/* ─── Peta Wilayah Indonesia ────────────────── */}
        <section className="dashboard-section map-section">
          <div className="section-header">
            <h2>Peta Sebaran SPKLU Indonesia</h2>
            <p>Menampilkan lokasi {markers.length.toLocaleString('id-ID')} stasiun pengisian listrik di seluruh Indonesia</p>
          </div>

          <div className="map-container-box">
            <MapContainer
              center={[-2.5, 118]}
              zoom={5}
              scrollWheelZoom={true}
              className="leaflet-map"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {markers.map((station, idx) => (
                <Marker key={idx} position={[station.lat, station.lng]}>
                  <Popup>
                    <div className="map-popup">
                      <strong>{station.nama}</strong>
                      <span>{station.provinsi}</span>
                      <span>{station.chargingType} · {station.power} kW</span>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </section>

        {/* ─── Roadmap Bar Chart ─────────────────────── */}
        <section className="dashboard-section chart-section">
          <div className="section-header">
            <h2>Roadmap Penyediaan SPKLU & KBLBB</h2>
            <p>Target kumulatif infrastruktur pengisian kendaraan listrik 2021–2026</p>
          </div>

          <div className="chart-card">
            <ResponsiveContainer width="100%" height={380}>
              <BarChart data={roadmapData} barGap={4} barCategoryGap="20%">
                <defs>
                  <linearGradient id="gradSPKLU" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                  <linearGradient id="gradKBLBB" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#67e8f9" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 13, fontWeight: 600, fill: '#64748b' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
                />
                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(79,70,229,0.04)' }} />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ paddingTop: 12, fontSize: 13, fontWeight: 600 }}
                />
                <Bar dataKey="SPKLU" fill="url(#gradSPKLU)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="KBLBB" fill="url(#gradKBLBB)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* ─── Two-column: Populasi + Line Chart ─────── */}
        <section className="dashboard-section dual-section">

          {/* Populasi Pie Chart */}
          <div className="chart-card dual-card">
            <div className="card-header">
              <h3>Populasi Kendaraan Listrik</h3>
              <span className="card-badge">2022</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={populasiData}
                  cx="50%"
                  cy="50%"
                  innerRadius="55%"
                  outerRadius="80%"
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {populasiData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={10}
                  wrapperStyle={{ fontSize: 13, fontWeight: 500 }}
                />
                {renderCenterLabel()}
              </PieChart>
            </ResponsiveContainer>
            <p className="card-footnote">Sumber: Kementerian Perhubungan, 4 Juli 2022</p>
          </div>

          {/* Line Chart */}
          <div className="chart-card dual-card">
            <div className="card-header">
              <h3>Pertumbuhan SPKLU per Tahun</h3>
              <span className="card-badge">Target</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={roadmapData}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 13, fontWeight: 600, fill: '#64748b' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
                />
                <Tooltip content={<CustomLineTooltip />} />
                <Line
                  type="monotone"
                  dataKey="SPKLU"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 7, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

      </div>
    </div>
  );
};

export default DashboardContent;
