import { useState, useEffect } from 'react';
import { TrendingUp, RefreshCw, Plus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Layout from '../components/layout/Layout';
import Modal from '../components/common/Modal';
import { productAPI } from '../utils/api';
import { formatDate, formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function PriceTracker() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    base_price: '', mrp: '', effective_date: new Date().toISOString().split('T')[0],
    market_region: 'Ahmedabad', price_change_reason: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    productAPI.getAll({ limit: 100 }).then(res => {
      setProducts(res.data.products || res.data.data || []);
    }).catch(() => {});
  }, []);

  const loadHistory = async (id) => {
    setLoading(true);
    try {
      const res = await productAPI.getPriceHistory(id);
      setPriceHistory(res.data.priceHistory || res.data || []);
    } catch { toast.error('Failed to load price history'); }
    finally { setLoading(false); }
  };

  const handleProductChange = (e) => {
    const id = e.target.value;
    setSelectedProduct(id);
    if (id) loadHistory(id);
    else setPriceHistory([]);
  };

  const handleUpdatePrice = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await productAPI.updatePrice(selectedProduct, updateForm);
      toast.success('Price updated successfully');
      setShowUpdateModal(false);
      loadHistory(selectedProduct);
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
    finally { setSaving(false); }
  };

  const f = (k) => (e) => setUpdateForm(p => ({ ...p, [k]: e.target.value }));

  const chartData = [...priceHistory].reverse().map(p => ({
    date: new Date(p.effective_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    'Base Price': Number(p.base_price),
    'MRP': Number(p.mrp),
  }));

  const selectedProductInfo = products.find(p => p.id === selectedProduct);

  const priceTrend = priceHistory.length >= 2
    ? (((priceHistory[0].base_price - priceHistory[priceHistory.length - 1].base_price) / priceHistory[priceHistory.length - 1].base_price) * 100).toFixed(1)
    : null;

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title"><TrendingUp size={22} /> Price Tracker</h1>
          <p className="page-subtitle">Monitor product pricing history and market trends</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => selectedProduct && loadHistory(selectedProduct)}><RefreshCw size={15} /></button>
          {selectedProduct && <button className="btn btn-primary" onClick={() => setShowUpdateModal(true)}><Plus size={15} /> Update Price</button>}
        </div>
      </div>

      {/* Product Selector */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ padding: '20px 20px 16px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px' }}>
            <label className="form-label">Select Product to Track</label>
            <select className="form-control" value={selectedProduct} onChange={handleProductChange}>
              <option value="">— Choose a product —</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.product_name} ({p.product_id})</option>
              ))}
            </select>
          </div>
          {selectedProductInfo && (
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ padding: '8px 16px', background: '#f0f4f8', borderRadius: 8 }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Current Base Price</div>
                <div style={{ fontWeight: 700, color: '#00b4a0', fontSize: '1.2rem' }}>{formatCurrency(selectedProductInfo.base_price)}</div>
              </div>
              <div style={{ padding: '8px 16px', background: '#f0f4f8', borderRadius: 8 }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>MRP</div>
                <div style={{ fontWeight: 700, color: '#1a2332', fontSize: '1.2rem' }}>{formatCurrency(selectedProductInfo.mrp)}</div>
              </div>
              {priceTrend !== null && (
                <div style={{ padding: '8px 16px', background: Number(priceTrend) >= 0 ? '#ecfdf5' : '#fef2f2', borderRadius: 8 }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Price Trend</div>
                  <div style={{ fontWeight: 700, color: Number(priceTrend) >= 0 ? '#10b981' : '#ef4444', fontSize: '1.1rem' }}>
                    {Number(priceTrend) >= 0 ? '↑' : '↓'} {Math.abs(priceTrend)}%
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedProduct && (
        <>
          {/* Price Chart */}
          {chartData.length > 0 && (
            <div className="card" style={{ marginBottom: 20 }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600 }}>
                Price History Chart
              </div>
              <div style={{ padding: 20 }}>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={chartData} margin={{ top: 10, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tickFormatter={(v) => `₹${v.toLocaleString('en-IN')}`} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => formatCurrency(v)} />
                    <Legend />
                    <Line type="monotone" dataKey="Base Price" stroke="#00b4a0" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="MRP" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Price History Table */}
          <div className="card">
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600 }}>
              Price History Records
            </div>
            {loading ? <div style={{ padding: 20 }}>Loading…</div> : (
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Effective Date</th>
                      <th>Base Price</th>
                      <th>MRP</th>
                      <th>Region</th>
                      <th>Reason</th>
                      <th>Recorded By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {priceHistory.length > 0 ? priceHistory.map((ph, i) => (
                      <tr key={ph.id || i}>
                        <td>{formatDate(ph.effective_date)}</td>
                        <td><strong style={{ color: '#00b4a0' }}>{formatCurrency(ph.base_price)}</strong></td>
                        <td>{formatCurrency(ph.mrp)}</td>
                        <td>{ph.market_region || '—'}</td>
                        <td>{ph.price_change_reason || '—'}</td>
                        <td>{ph.recorded_by || 'System'}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan={6} style={{ textAlign: 'center', padding: 24, color: '#94a3b8' }}>No price history found. Update the price to start tracking.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {!selectedProduct && (
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <h3>Select a Product</h3>
          <p>Choose a product from the dropdown above to view its price history and trends.</p>
        </div>
      )}

      {/* Update Price Modal */}
      <Modal isOpen={showUpdateModal} onClose={() => setShowUpdateModal(false)} title="Update Product Price" size="md"
        footer={<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => setShowUpdateModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleUpdatePrice} disabled={saving}>{saving ? 'Saving…' : 'Update Price'}</button>
        </div>}>
        <form onSubmit={handleUpdatePrice}>
          <div className="form-grid">
            <div className="form-group"><label className="form-label">New Base Price (₹) *</label><input className="form-control" type="number" required value={updateForm.base_price} onChange={f('base_price')} /></div>
            <div className="form-group"><label className="form-label">New MRP (₹)</label><input className="form-control" type="number" value={updateForm.mrp} onChange={f('mrp')} /></div>
            <div className="form-group"><label className="form-label">Effective Date *</label><input className="form-control" type="date" required value={updateForm.effective_date} onChange={f('effective_date')} /></div>
            <div className="form-group"><label className="form-label">Market Region</label><input className="form-control" value={updateForm.market_region} onChange={f('market_region')} /></div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Reason for Price Change</label><textarea className="form-control" rows={2} value={updateForm.price_change_reason} onChange={f('price_change_reason')} placeholder="e.g. Raw material cost increase, seasonal demand…" /></div>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
