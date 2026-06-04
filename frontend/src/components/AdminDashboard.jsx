import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Users, CheckCircle2, Clock, AlertTriangle, TrendingUp, Activity, PieChart as PieIcon } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

// Dummy data for charts
const lineData = [
  { month: 'Jan', progress: 20 }, { month: 'Feb', progress: 35 }, { month: 'Mar', progress: 45 },
  { month: 'Apr', progress: 55 }, { month: 'Mei', progress: 70 }, { month: 'Jun', progress: 82 },
  { month: 'Jul', progress: 78 }, { month: 'Agu', progress: 90 }, { month: 'Sep', progress: 88 },
  { month: 'Okt', progress: 95 }, { month: 'Nov', progress: 97 }, { month: 'Des', progress: 100 },
];

const barData = [
  { kategori: 'Frontend', tasks: 24 }, { kategori: 'Backend', tasks: 18 },
  { kategori: 'Design', tasks: 12 }, { kategori: 'Testing', tasks: 15 },
  { kategori: 'DevOps', tasks: 8 }, { kategori: 'Docs', tasks: 6 },
];

const pieData = [
  { name: 'Selesai', value: 45, color: '#10b981' },
  { name: 'Berjalan', value: 30, color: '#3b82f6' },
  { name: 'Pending', value: 15, color: '#f59e0b' },
  { name: 'Overdue', value: 10, color: '#ef4444' },
];

const areaData = [
  { week: 'W1', cpu: 45, memory: 55, storage: 30 },
  { week: 'W2', cpu: 52, memory: 58, storage: 32 },
  { week: 'W3', cpu: 61, memory: 62, storage: 35 },
  { week: 'W4', cpu: 55, memory: 65, storage: 38 },
  { week: 'W5', cpu: 70, memory: 68, storage: 40 },
  { week: 'W6', cpu: 65, memory: 72, storage: 42 },
  { week: 'W7', cpu: 72, memory: 75, storage: 45 },
  { week: 'W8', cpu: 68, memory: 70, storage: 43 },
];

const summaryCards = [
  { title: 'Total Proyek', value: 48, icon: BarChart3, color: '#3b82f6', bg: '#eff6ff', change: '+12%' },
  { title: 'Proyek Selesai', value: 22, icon: CheckCircle2, color: '#10b981', bg: '#ecfdf5', change: '+8%' },
  { title: 'Proyek Berjalan', value: 18, icon: Clock, color: '#f59e0b', bg: '#fffbeb', change: '+3%' },
  { title: 'Proyek Pending', value: 8, icon: AlertTriangle, color: '#ef4444', bg: '#fef2f2', change: '-2%' },
];

const AdminDashboard = () => {
  const { currentUser, users } = useAuth();

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Selamat datang kembali, <strong>{currentUser?.email}</strong></p>
          </div>
          <div className="header-actions">
            <Link to="/admin/users" className="header-btn">
              <Users size={18} /> Kelola User
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="summary-grid">
          {summaryCards.map((card) => (
            <div key={card.title} className="summary-card">
              <div className="summary-icon" style={{ backgroundColor: card.bg }}>
                <card.icon size={24} style={{ color: card.color }} />
              </div>
              <div className="summary-info">
                <span className="summary-label">{card.title}</span>
                <div className="summary-row">
                  <span className="summary-value">{card.value}</span>
                  <span className={`summary-change ${card.change.startsWith('+') ? 'positive' : 'negative'}`}>
                    {card.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="charts-grid">
          {/* Line Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <div className="chart-title"><TrendingUp size={18} /> Progress Proyek</div>
              <span className="chart-subtitle">Perkembangan bulanan (%)</span>
            </div>
            <div className="chart-body">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" fontSize={12} stroke="#94a3b8" />
                  <YAxis fontSize={12} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="progress" stroke="#4f46e5" strokeWidth={3} dot={{ fill: '#4f46e5', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <div className="chart-title"><BarChart3 size={18} /> Task per Kategori</div>
              <span className="chart-subtitle">Distribusi task saat ini</span>
            </div>
            <div className="chart-body">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="kategori" fontSize={12} stroke="#94a3b8" />
                  <YAxis fontSize={12} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="tasks" radius={[6, 6, 0, 0]} fill="url(#barGradient)" />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4f46e5" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <div className="chart-title"><PieIcon size={18} /> Status Proyek</div>
              <span className="chart-subtitle">Breakdown status saat ini</span>
            </div>
            <div className="chart-body chart-body-centered">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} fontSize={12}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Area Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <div className="chart-title"><Activity size={18} /> Resource Usage</div>
              <span className="chart-subtitle">Penggunaan resource mingguan</span>
            </div>
            <div className="chart-body">
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={areaData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="week" fontSize={12} stroke="#94a3b8" />
                  <YAxis fontSize={12} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: '12px' }} />
                  <Area type="monotone" dataKey="cpu" stackId="1" stroke="#4f46e5" fill="rgba(79,70,229,0.2)" strokeWidth={2} name="CPU" />
                  <Area type="monotone" dataKey="memory" stackId="2" stroke="#10b981" fill="rgba(16,185,129,0.2)" strokeWidth={2} name="Memory" />
                  <Area type="monotone" dataKey="storage" stackId="3" stroke="#f59e0b" fill="rgba(245,158,11,0.2)" strokeWidth={2} name="Storage" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="quick-info-bar">
          <div className="info-item">
            <Users size={16} />
            <span>Total User Terdaftar: <strong>{users.length}</strong></span>
          </div>
          <Link to="/admin/users" className="info-link">Lihat Semua User →</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
