import { useState, useEffect, useCallback } from 'react';
import { Plus, RefreshCw, Navigation, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import Layout from '../components/layout/Layout';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import { shipmentAPI } from '../utils/api';
import { formatDate, formatCurrency, downloadCSV } from '../utils/helpers';

const INITIAL_FORM = {
  order_id: '', carrier_name: '', vehicle_number: '', driver_name: '',
  driver_phone: '', tracking_number: '', dispatch_date: '',
  estimated_arrival: '', origin_address: '', destination_address: '',
  weight_kg: '', shipping_cost: '', status: 'pending', notes: '',
};

export default function Shipments() {
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
      const res = await shipmentAPI.getAll({ page, limit: 10, search, status: statusFilter });
      setData(res.data.shipments || res.data.data || []);
      setTotal(res.data.total || 0);
    } catch { toast.error('Failed to load shipments'); }
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
      editItem ? await shipmentAPI.update(editItem.id, form) : await shipmentAPI.create(form);
      toast.success(editItem ? 'Updated' : 'Shipment created');
      setShowModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await shipmentAPI.delete(deleteItem.id); toast.success('Deleted'); setShowDelete(false); load(); }
    catch { toast.error('Delete failed'); }
  };

  const columns = [
    { key: 'shipment_id', label: 'SHP ID', render: (v) => <span className="entity-id">{v}</span> },
    { key: 'order_id', label: 'Order', render: (v) => v ? <span className="entity-id sm">{String(v).substring(0, 12)}…</span> : '—' },
    { key: 'carrier_name', label: 'Carrier' },
    { key: 'vehicle_number', label: 'Vehicle No' },
    { key: 'driver_name', label: 'Driver' },
    { key: 'dispatch_date', label: 'Dispatched', render: (v) => v ? formatDate(v) : '—' },
    { key: 'estimated_arrival', label: 'ETA', render: (v) => v ? formatDate(v) : '—' },
    { key: 'status', label: 'Status', render: (v) => <Badge status={v} label={v?.replace(/_/g, ' ')} /> },
    { key: 'shipping_cost', label: 'Cost', render: (v) => v ? formatCurrency(v) : '—' },
  ];

  const TIMELINE_ICONS = {
    pending: '📋', in_transit: '🚛', out_for_delivery: '🔔', delivered: '✅', returned: '↩️', lost: '❌',
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title"><Navigation size={22} /> Shipments</h1>
          <p className="page-subtitle">Track and manage all outbound and inbound shipments</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={load}><RefreshCw size={15} /></button>
          <button className="btn btn-primary" onClick={openAdd}><Plus size={15} /> Add Shipment</button>
        </div>
      </div>

      <div className="card">
        <div className="filter-bar">
          <input className="form-control" placeholder="Search shipments…" value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }} style={{ maxWidth: 280 }} />
          <select className="form-control" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ maxWidth: 180 }}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_transit">In Transit</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="returned">Returned</option>
            <option value="lost">Lost</option>
          </select>
          <button className="btn btn-ghost btn-sm" onClick={() => downloadCSV(data, 'shipments.csv')}>Export CSV</button>
        </div>
        <DataTable columns={columns} data={data} loading={loading} onView={openView} onEdit={openEdit} onDelete={openDelete}
          pagination={{ page, limit: 10, total, onPageChange: setPage }} />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Edit Shipment' : 'Add Shipment'} size="lg"
        footer={<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : editItem ? 'Update' : 'Add'}</button>
        </div>}>
        <form onSubmit={handleSave}>
          <div className="form-grid">
            <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Order ID *</label><input className="form-control" required value={form.order_id} onChange={f('order_id')} placeholder="ORD-2025-XXXX" /></div>
            <div className="form-group"><label className="form-label">Carrier Name</label><input className="form-control" value={form.carrier_name} onChange={f('carrier_name')} /></div>
            <div className="form-group"><label className="form-label">Vehicle Number</label><input className="form-control" value={form.vehicle_number} onChange={f('vehicle_number')} placeholder="GJ01XX1234" /></div>
            <div className="form-group"><label className="form-label">Driver Name</label><input className="form-control" value={form.driver_name} onChange={f('driver_name')} /></div>
            <div className="form-group"><label className="form-label">Driver Phone</label><input className="form-control" value={form.driver_phone} onChange={f('driver_phone')} /></div>
            <div className="form-group"><label className="form-label">Tracking Number</label><input className="form-control" value={form.tracking_number} onChange={f('tracking_number')} /></div>
            <div className="form-group"><label className="form-label">Dispatch Date</label><input className="form-control" type="date" value={form.dispatch_date} onChange={f('dispatch_date')} /></div>
            <div className="form-group"><label className="form-label">Estimated Arrival</label><input className="form-control" type="date" value={form.estimated_arrival} onChange={f('estimated_arrival')} /></div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Origin Address</label><input className="form-control" value={form.origin_address} onChange={f('origin_address')} /></div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Destination Address</label><input className="form-control" value={form.destination_address} onChange={f('destination_address')} /></div>
            <div className="form-group"><label className="form-label">Weight (KG)</label><input className="form-control" type="number" value={form.weight_kg} onChange={f('weight_kg')} /></div>
            <div className="form-group"><label className="form-label">Shipping Cost (₹)</label><input className="form-control" type="number" value={form.shipping_cost} onChange={f('shipping_cost')} /></div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-control" value={form.status} onChange={f('status')}>
                <option value="pending">Pending</option>
                <option value="in_transit">In Transit</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="returned">Returned</option>
                <option value="lost">Lost</option>
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Notes</label><textarea className="form-control" rows={2} value={form.notes} onChange={f('notes')} /></div>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showView} onClose={() => setShowView(false)} title="Shipment Tracking" size="lg">
        {viewItem && (
          <div className="detail-grid">
            <div className="detail-header">
              <span className="entity-id large">{viewItem.shipment_id}</span>
              <Badge status={viewItem.status} label={viewItem.status?.replace(/_/g, ' ')} />
            </div>

            {/* Tracking Timeline */}
            <div className="detail-section">
              <h4>Tracking Status</h4>
              <div className="tracking-timeline">
                {['pending', 'in_transit', 'out_for_delivery', 'delivered'].map((s) => {
                  const statuses = ['pending', 'in_transit', 'out_for_delivery', 'delivered', 'returned', 'lost'];
                  const currentIdx = statuses.indexOf(viewItem.status);
                  const thisIdx = statuses.indexOf(s);
                  const isDone = thisIdx <= currentIdx;
                  return (
                    <div key={s} className={`timeline-step ${isDone ? 'done' : ''}`}>
                      <div className="timeline-dot">{TIMELINE_ICONS[s]}</div>
                      <div className="timeline-label">{s.replace(/_/g, ' ')}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="detail-section">
              <h4>Shipment Information</h4>
              <div className="detail-row"><span>Carrier</span><strong>{viewItem.carrier_name || '—'}</strong></div>
              <div className="detail-row"><span>Vehicle</span><strong>{viewItem.vehicle_number || '—'}</strong></div>
              <div className="detail-row"><span>Driver</span><strong>{viewItem.driver_name || '—'}</strong></div>
              <div className="detail-row"><span>Driver Phone</span><strong>{viewItem.driver_phone || '—'}</strong></div>
              <div className="detail-row"><span>Tracking No</span><strong>{viewItem.tracking_number || '—'}</strong></div>
            </div>
            <div className="detail-section">
              <h4>Schedule</h4>
              <div className="detail-row"><span>Dispatch Date</span><strong>{viewItem.dispatch_date ? formatDate(viewItem.dispatch_date) : '—'}</strong></div>
              <div className="detail-row"><span>ETA</span><strong>{viewItem.estimated_arrival ? formatDate(viewItem.estimated_arrival) : '—'}</strong></div>
              {viewItem.actual_arrival && <div className="detail-row"><span>Delivered</span><strong>{formatDate(viewItem.actual_arrival)}</strong></div>}
            </div>
            <div className="detail-section">
              <h4>Route</h4>
              <div className="detail-row"><span><MapPin size={12} /> Origin</span><strong>{viewItem.origin_address || '—'}</strong></div>
              <div className="detail-row"><span><MapPin size={12} /> Destination</span><strong>{viewItem.destination_address || '—'}</strong></div>
              <div className="detail-row"><span>Weight</span><strong>{viewItem.weight_kg ? `${viewItem.weight_kg} KG` : '—'}</strong></div>
              <div className="detail-row"><span>Shipping Cost</span><strong>{viewItem.shipping_cost ? formatCurrency(viewItem.shipping_cost) : '—'}</strong></div>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={showDelete} onClose={() => setShowDelete(false)} title="Confirm Delete" size="sm"
        footer={<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => setShowDelete(false)}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
        </div>}>
        <p>Delete shipment <strong>{deleteItem?.shipment_id}</strong>? This cannot be undone.</p>
      </Modal>
    </Layout>
  );
}
