import { useState, useEffect, useCallback } from 'react';
import { Plus, RefreshCw, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import Layout from '../components/layout/Layout';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import { orderAPI } from '../utils/api';
import { formatDate, formatCurrency, downloadCSV } from '../utils/helpers';

const STATUSES = ['draft', 'confirmed', 'processing', 'dispatched', 'in_transit', 'delivered', 'cancelled'];

const INITIAL_FORM = {
  order_type: 'sales', buyer_type: 'client', buyer_id: '',
  seller_type: 'manufacturer', seller_id: '',
  expected_delivery_date: '', payment_method: 'NEFT',
  payment_terms: 'Net 30', notes: '', subtotal: '', tax_amount: '', total_amount: '',
};

export default function Orders() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await orderAPI.getAll({ page, limit: 10, search, status: statusFilter });
      setData(res.data.orders || res.data.data || []);
      setTotal(res.data.total || 0);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  }, [page, search, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditItem(null); setForm(INITIAL_FORM); setShowModal(true); };
  const openEdit = (row) => { setEditItem(row); setForm({ ...INITIAL_FORM, ...row }); setShowModal(true); };
  const openView = (row) => { setViewItem(row); setShowView(true); };
  const openDelete = (row) => { setDeleteItem(row); setShowDelete(true); };
  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      editItem ? await orderAPI.update(editItem.id, form) : await orderAPI.create(form);
      toast.success(editItem ? 'Order updated' : 'Order created');
      setShowModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      setViewItem(prev => ({ ...prev, status: newStatus }));
      load();
    } catch { toast.error('Status update failed'); }
  };

  const handleDelete = async () => {
    try { await orderAPI.delete(deleteItem.id); toast.success('Deleted'); setShowDelete(false); load(); }
    catch { toast.error('Delete failed'); }
  };

  const columns = [
    { key: 'order_id', label: 'ORD ID', render: (v) => <span className="entity-id">{v}</span> },
    { key: 'order_type', label: 'Type', render: (v) => <Badge status={v} label={v} /> },
    { key: 'buyer_type', label: 'Buyer Type' },
    { key: 'seller_type', label: 'Seller Type' },
    { key: 'order_date', label: 'Order Date', render: (v) => formatDate(v || new Date()) },
    { key: 'expected_delivery_date', label: 'ETA', render: (v) => v ? formatDate(v) : '—' },
    { key: 'total_amount', label: 'Total', render: (v) => v ? formatCurrency(v) : '—' },
    { key: 'payment_status', label: 'Payment', render: (v) => <Badge status={v || 'pending'} label={v || 'pending'} /> },
    { key: 'status', label: 'Status', render: (v) => <Badge status={v} label={v} /> },
  ];

  const nextStatus = (current) => {
    const idx = STATUSES.indexOf(current);
    return idx >= 0 && idx < STATUSES.length - 2 ? STATUSES[idx + 1] : null;
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title"><ShoppingCart size={22} /> Orders</h1>
          <p className="page-subtitle">Manage purchase, sales and transfer orders</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={load}><RefreshCw size={15} /></button>
          <button className="btn btn-primary" onClick={openAdd}><Plus size={15} /> Create Order</button>
        </div>
      </div>

      {/* Status summary chips */}
      <div className="filter-bar" style={{ marginBottom: 12 }}>
        {STATUSES.map(s => (
          <button key={s} className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => { setStatusFilter(s === statusFilter ? '' : s); setPage(1); }}>
            {s.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="filter-bar">
          <input className="form-control" placeholder="Search orders…" value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }} style={{ maxWidth: 280 }} />
          <button className="btn btn-ghost btn-sm" onClick={() => downloadCSV(data, 'orders.csv')}>Export CSV</button>
        </div>
        <DataTable columns={columns} data={data} loading={loading} onView={openView} onEdit={openEdit} onDelete={openDelete}
          pagination={{ page, limit: 10, total, onPageChange: setPage }} />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Edit Order' : 'Create Order'} size="lg"
        footer={<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : editItem ? 'Update' : 'Create'}</button>
        </div>}>
        <form onSubmit={handleSave}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Order Type</label>
              <select className="form-control" value={form.order_type} onChange={f('order_type')}>
                <option value="purchase">Purchase</option>
                <option value="sales">Sales</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Buyer Type</label>
              <select className="form-control" value={form.buyer_type} onChange={f('buyer_type')}>
                <option value="client">Client</option>
                <option value="retailer">Retailer</option>
                <option value="wholesaler">Wholesaler</option>
              </select>
            </div>
            <div className="form-group"><label className="form-label">Buyer ID / Name</label><input className="form-control" value={form.buyer_id} onChange={f('buyer_id')} placeholder="Enter CLT-/RTL-/WSL- ID" /></div>
            <div className="form-group">
              <label className="form-label">Seller Type</label>
              <select className="form-control" value={form.seller_type} onChange={f('seller_type')}>
                <option value="manufacturer">Manufacturer</option>
                <option value="supplier">Supplier</option>
                <option value="wholesaler">Wholesaler</option>
                <option value="retailer">Retailer</option>
              </select>
            </div>
            <div className="form-group"><label className="form-label">Seller ID / Name</label><input className="form-control" value={form.seller_id} onChange={f('seller_id')} placeholder="Enter MFG-/SUP-/WSL- ID" /></div>
            <div className="form-group"><label className="form-label">Expected Delivery</label><input className="form-control" type="date" value={form.expected_delivery_date} onChange={f('expected_delivery_date')} /></div>
            <div className="form-group"><label className="form-label">Payment Method</label><input className="form-control" value={form.payment_method} onChange={f('payment_method')} /></div>
            <div className="form-group"><label className="form-label">Payment Terms</label><input className="form-control" value={form.payment_terms} onChange={f('payment_terms')} /></div>
            <div className="form-group"><label className="form-label">Subtotal (₹)</label><input className="form-control" type="number" value={form.subtotal} onChange={f('subtotal')} /></div>
            <div className="form-group"><label className="form-label">Tax Amount (₹)</label><input className="form-control" type="number" value={form.tax_amount} onChange={f('tax_amount')} /></div>
            <div className="form-group"><label className="form-label">Total Amount (₹)</label><input className="form-control" type="number" value={form.total_amount} onChange={f('total_amount')} /></div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Notes</label><textarea className="form-control" rows={2} value={form.notes} onChange={f('notes')} /></div>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showView} onClose={() => setShowView(false)} title="Order Details" size="lg">
        {viewItem && (
          <div className="detail-grid">
            <div className="detail-header">
              <span className="entity-id large">{viewItem.order_id}</span>
              <Badge status={viewItem.order_type} label={viewItem.order_type} />
              <Badge status={viewItem.status} label={viewItem.status} />
              <Badge status={viewItem.payment_status || 'pending'} label={viewItem.payment_status || 'pending'} />
            </div>

            {nextStatus(viewItem.status) && (
              <div style={{ margin: '12px 0', padding: 12, background: '#f0f4f8', borderRadius: 8 }}>
                <p style={{ margin: 0, marginBottom: 8, fontSize: '0.85rem', color: '#64748b' }}>Status Workflow</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {STATUSES.slice(0, -1).map((s, i) => (
                    <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <button
                        className={`btn btn-sm ${viewItem.status === s ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => handleStatusUpdate(viewItem.id, s)}
                        disabled={viewItem.status === s}
                      >{s}</button>
                      {i < STATUSES.length - 2 && <span style={{ color: '#94a3b8' }}>→</span>}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="detail-section">
              <h4>Order Information</h4>
              <div className="detail-row"><span>Order Date</span><strong>{formatDate(viewItem.order_date || viewItem.createdAt)}</strong></div>
              <div className="detail-row"><span>Expected Delivery</span><strong>{viewItem.expected_delivery_date ? formatDate(viewItem.expected_delivery_date) : '—'}</strong></div>
              <div className="detail-row"><span>Buyer Type</span><strong>{viewItem.buyer_type}</strong></div>
              <div className="detail-row"><span>Seller Type</span><strong>{viewItem.seller_type}</strong></div>
              <div className="detail-row"><span>Payment Method</span><strong>{viewItem.payment_method}</strong></div>
              <div className="detail-row"><span>Payment Terms</span><strong>{viewItem.payment_terms}</strong></div>
            </div>
            <div className="detail-section">
              <h4>Financials</h4>
              <div className="detail-row"><span>Subtotal</span><strong>{formatCurrency(viewItem.subtotal || 0)}</strong></div>
              <div className="detail-row"><span>Tax</span><strong>{formatCurrency(viewItem.tax_amount || 0)}</strong></div>
              <div className="detail-row"><span>Discount</span><strong>{formatCurrency(viewItem.discount_amount || 0)}</strong></div>
              <div className="detail-row"><span>Shipping</span><strong>{formatCurrency(viewItem.shipping_charges || 0)}</strong></div>
              <div className="detail-row" style={{ fontWeight: 700, fontSize: '1.05rem' }}><span>Total</span><strong style={{ color: '#00b4a0' }}>{formatCurrency(viewItem.total_amount || 0)}</strong></div>
            </div>
            {viewItem.notes && <div className="detail-section"><h4>Notes</h4><p>{viewItem.notes}</p></div>}
          </div>
        )}
      </Modal>

      <Modal isOpen={showDelete} onClose={() => setShowDelete(false)} title="Confirm Delete" size="sm"
        footer={<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => setShowDelete(false)}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
        </div>}>
        <p>Delete order <strong>{deleteItem?.order_id}</strong>? This cannot be undone.</p>
      </Modal>
    </Layout>
  );
}
