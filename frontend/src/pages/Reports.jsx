import { useState, useEffect } from 'react';
import { TrendingUp, Download, RefreshCw, BarChart2 } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import Layout from '../components/layout/Layout';
import StatsCard from '../components/common/StatsCard';
import { dashboardAPI } from '../utils/api';
import { formatCurrency } from '../utils/helpers';

const TEAL = '#00b4a0';
const COLORS = ['#00b4a0', '#f59e0b', '#3b82f6', '#ef4444', '#10b981', '#8b5cf6', '#ec4899'];

const MOCK_REVENUE = [
  { month: 'Apr', revenue: 4200000 }, { month: 'May', revenue: 5800000 },
  { month: 'Jun', revenue: 4900000 }, { month: 'Jul', revenue: 7200000 },
  { month: 'Aug', revenue: 6500000 }, { month: 'Sep', revenue: 8100000 },
  { month: 'Oct', revenue: 9300000 }, { month: 'Nov', revenue: 7800000 },
  { month: 'Dec', revenue: 11200000 }, { month: 'Jan', revenue: 8900000 },
  { month: 'Feb', revenue: 10500000 }, { month: 'Mar', revenue: 13200000 },
];

const MOCK_STATUS = [
  { name: 'Delivered', value: 142 }, { name: 'In Transit', value: 38 },
  { name: 'Processing', value: 24 }, { name: 'Pending', value: 17 },
  { name: 'Cancelled', value: 9 },
];

const MOCK_PRODUCTS = [
  { name: 'TMT Steel', orders: 312 }, { name: 'OPC Cement', orders: 289 },
  { name: 'River Sand', orders: 245 }, { name: 'AAC Blocks', orders: 198 },
  { name: 'Aggregate', orders: 176 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 14px' }}>
        <p style={{ margin: 0, fontWeight: 600, color: '#1a2332' }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ margin: 0, color: p.color, fontSize: '0.875rem' }}>
            {p.name}: {p.name === 'Revenue' ? formatCurrency(p.value) : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Reports() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState(MOCK_REVENUE);

  const load = async () => {
    setLoading(true);
    try {
      const res = await dashboardAPI.getStats();
      setStats(res.data);
      if (res.data.revenueChart) setRevenueData(res.data.revenueChart);
    } catch { /* use mock data */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const totalRevenue = revenueData.reduce((a, b) => a + b.revenue, 0);
  const avgOrderValue = totalRevenue / 230;

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title"><BarChart2 size={22} /> Reports & Analytics</h1>
          <p className="page-subtitle">Business intelligence and supply chain performance metrics</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={load}><RefreshCw size={15} /></button>
          <button className="btn btn-ghost"><Download size={15} /> Export Report</button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatsCard label="Total Revenue (FY)" value={formatCurrency(totalRevenue)} icon={TrendingUp} color="primary" trend={18} trendLabel="vs last FY" />
        <StatsCard label="Orders This Month" value={stats?.thisMonthOrders || '—'} color="info" trend={12} />
        <StatsCard label="Avg Order Value" value={formatCurrency(avgOrderValue)} color="success" trend={5} />
        <StatsCard label="Pending Orders" value={stats?.pendingOrders || '—'} color="warning" />
      </div>

      {/* Revenue Chart */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header" style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, color: '#1a2332' }}>
          Monthly Revenue — FY 2025–26 (₹)
        </div>
        <div style={{ padding: 20 }}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueData} margin={{ top: 10, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" name="Revenue" fill={TEAL} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Order Status Pie */}
        <div className="card">
          <div className="card-header" style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600 }}>
            Order Status Distribution
          </div>
          <div style={{ padding: 20 }}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={MOCK_STATUS} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {MOCK_STATUS.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="card">
          <div className="card-header" style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600 }}>
            Top Products by Order Volume
          </div>
          <div style={{ padding: 20 }}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={MOCK_PRODUCTS} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={90} />
                <Tooltip />
                <Bar dataKey="orders" name="Orders" fill={TEAL} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Supply Chain Health */}
      <div className="card">
        <div className="card-header" style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600 }}>
          Supply Chain Health Metrics
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Target</th>
                <th>Actual</th>
                <th>Status</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {[
                { metric: 'On-Time Delivery Rate', target: '≥ 95%', actual: '92.4%', status: 'warning', trend: '↑ +2.1%' },
                { metric: 'Supplier Fill Rate', target: '≥ 98%', actual: '98.7%', status: 'success', trend: '↑ +0.5%' },
                { metric: 'Order Cycle Time (days)', target: '≤ 7', actual: '6.2', status: 'success', trend: '↓ -0.8' },
                { metric: 'Inventory Turnover (times/yr)', target: '≥ 8', actual: '9.4', status: 'success', trend: '↑ +1.2' },
                { metric: 'Return Rate', target: '≤ 2%', actual: '3.1%', status: 'danger', trend: '↑ +0.9%' },
                { metric: 'Verified Supplier %', target: '≥ 80%', actual: '74%', status: 'warning', trend: '↑ +8%' },
              ].map((row) => (
                <tr key={row.metric}>
                  <td><strong>{row.metric}</strong></td>
                  <td style={{ color: '#64748b' }}>{row.target}</td>
                  <td><strong>{row.actual}</strong></td>
                  <td>
                    <span className={`badge badge-${row.status}`}>
                      {row.status === 'success' ? '✓ On Track' : row.status === 'warning' ? '⚠ Near Target' : '✗ Off Track'}
                    </span>
                  </td>
                  <td style={{ color: row.trend.startsWith('↑') ? '#10b981' : '#ef4444' }}>{row.trend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
