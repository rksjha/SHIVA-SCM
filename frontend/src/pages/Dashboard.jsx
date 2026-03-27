import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { dashboardAPI } from '../utils/api';
import { formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [revenueChart, setRevenueChart] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [supplyChain, setSupplyChain] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#00b4a0', '#007d70', '#f59e0b', '#10b981', '#ef4444'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, revenueRes, statusRes, productsRes, scRes] = await Promise.all([
          dashboardAPI.getStats(),
          dashboardAPI.getRevenueChart(),
          dashboardAPI.getOrderStatus(),
          dashboardAPI.getTopProducts(),
          dashboardAPI.getSupplyChainFlow(),
        ]);

        setStats(statsRes.data?.stats || statsRes.data);
        setRevenueChart(revenueRes.data?.data || []);
        setOrderStatus(statusRes.data?.data || []);
        setTopProducts(productsRes.data?.products || []);
        setSupplyChain(scRes.data?.data || []);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" style={{ marginBottom: '2rem' }}>
        <div className="stats-card">
          <div>📦</div>
          <div className="stats-value">{stats?.manufacturerCount || 0}</div>
          <div className="stats-label">Manufacturers</div>
        </div>
        <div className="stats-card">
          <div>🏪</div>
          <div className="stats-value">{stats?.supplierCount || 0}</div>
          <div className="stats-label">Suppliers</div>
        </div>
        <div className="stats-card gold">
          <div>🏬</div>
          <div className="stats-value">{stats?.wholesalerCount || 0}</div>
          <div className="stats-label">Wholesalers</div>
        </div>
        <div className="stats-card green">
          <div>💼</div>
          <div className="stats-value">{stats?.clientCount || 0}</div>
          <div className="stats-label">Clients</div>
        </div>
      </div>

      {/* Revenue and Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <div className="card-header">Revenue (12 months)</div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Line type="monotone" dataKey="revenue" stroke="#00b4a0" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">Order Status Distribution</div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={orderStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="count" label>
                  {orderStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <div className="card-body text-center">
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#00b4a0', marginBottom: '0.5rem' }}>
              {formatCurrency(stats?.totalRevenue || 0)}
            </div>
            <div className="text-muted">Total Revenue</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b', marginBottom: '0.5rem' }}>
              {stats?.pendingOrders || 0}
            </div>
            <div className="text-muted">Pending Orders</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#ef4444', marginBottom: '0.5rem' }}>
              {stats?.lowStockCount || 0}
            </div>
            <div className="text-muted">Low Stock Items</div>
          </div>
        </div>
      </div>

      {/* Supply Chain Flow */}
      <div className="card">
        <div className="card-header">Supply Chain Network</div>
        <div className="card-body">
          <div className="flex justify-between items-center">
            {supplyChain.map((item, idx) => (
              <div key={idx} className="text-center">
                <div style={{
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color: item.color,
                  marginBottom: '0.5rem'
                }}>
                  {item.count}
                </div>
                <div className="text-sm text-muted">{item.stage}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
