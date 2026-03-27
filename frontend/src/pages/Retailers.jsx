import { useState, useEffect, useCallback } from 'react';
import { Plus, RefreshCw, Store } from 'lucide-react';
import toast from 'react-hot-toast';
import Layout from '../components/layout/Layout';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import { retailerAPI } from '../utils/api';
import { formatDate, formatCurrency, downloadCSV } from '../utils/helpers';

const INITIAL_FORM = {
  company_name: '', contact_person: '', email: '', phone: '',
  address: '', city: '', state: 'Gujarat', pincode: '',
  gstin: '', pan_number: '', store_type: 'physical',
  monthly_volume_approx: '', status: 'active', notes: '',
};

export default function Retailers() {
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
      const res = await retailerAPI.getAll({ page, limit: 10, search, status: statusFilter });
      setData(res.data.retailers || res.data.data || []);
      setTotal(res.data.total || 0);
    } catch { toast.error('Failed to load retailers'); }
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
      editItem ? await retailerAPI.update(editItem.id, form) : await retailerAPI.create(form);
      toast.success(editItem ? 'Retailer updated' : 'Retailer added');
      setShowModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await retailerAPI.delete(deleteItem.id); toast.success('Deleted'); setShowDelete(false); load(); }
    catch { toast.error('Delete failed'); }
  };

  const columns = [
    { key: 'retailer_id', label: 'RTL ID', render: (v) => <span className="entity-id">{v}</span> },
    { key: 'company_name', label: 'Company' },
    { key: 'contact_person', label: 'Contact' },
    { key: 'city', label: 'City' },
    { key: 'store_type', label: 'Store Type', render: (v) => <Badge status={v} label={v} /> },
    { key: 'monthly_volume_approx', label: 'Monthly Volume', render: (v) => v ? formatCurrency(v) : '—' },
    { key: 'status', label: 'Status', render: (v) => <Badge status={v} label={v} /> },
  ];

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title"><Store size={22} /> Retailers</h1>
          <p className="page-subtitle">Manage your retail distribution network</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={load}><RefreshCw size={15} /></button>
          <button className="btn btn-primary" onClick={openAdd}><Plus size={15} /> Add Retailer</button>
        </div>
      </div>

      <div className="card">
        <div className="filter-bar">
          <input className="form-control" placeholder="Search retailers…" value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }} style={{ maxWidth: 280 }} />
          <select className="form-control" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ maxWidth: 160 }}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className="btn btn-ghost btn-sm" onClick={() => downloadCSV(data, 'retailers.csv')}>Export CSV</button>
        </div>
        <DataTable columns={columns} data={data} loading={loading} onView={openView} onEdit={openEdit} onDelete={openDelete}
          pagination={{ page, limit: 10, total, onPageChange: setPage }} />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Edit Retailer' : 'Add Retailer'} size="lg"
        footer={<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : editItem ? 'Update' : 'Add'}</button>
        </div>}>
        <form onSubmit={handleSave}>
          <div className="form-grid">
            <div className="form-group"><label className="form-label">Company Name *</label><input className="form-control" required value={form.company_name} onChange={f('company_name')} /></div>
            <div className="form-group"><label className="form-label">Contact Person *</label><input className="form-control" required value={form.contact_person} onChange={f('contact_person')} /></div>
            <div className="form-group"><label className="form-label">Email *</label><input className="form-control" type="email" required value={form.email} onChange={f('email')} /></div>
            <div className="form-group"><label className="form-label">Phone *</label><input className="form-control" required value={form.phone} onChange={f('phone')} /></div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Address</label><input className="form-control" value={form.address} onChange={f('address')} /></div>
            <div className="form-group"><label className="form-label">City *</label><input className="form-control" required value={form.city} onChange={f('city')} /></div>
            <div className="form-group"><label className="form-label">State</label><input className="form-control" value={form.state} onChange={f('state')} /></div>
            <div className="form-group"><label className="form-label">Pincode</label><input className="form-control" value={form.pincode} onChange={f('pincode')} /></div>
            <div className="form-group"><label className="form-label">GSTIN</label><input className="form-control" value={form.gstin} onChange={f('gstin')} /></div>
            <div className="form-group"><label className="form-label">PAN Number</label><input className="form-control" value={form.pan_number} onChange={f('pan_number')} /></div>
            <div className="form-group">
              <label className="form-label">Store Type</label>
              <select className="form-control" value={form.store_type} onChange={f('store_type')}>
                <option value="physical">Physical</option>
                <option value="online">Online</option>
                <option value="both">Both</option>
              </select>
            </div>
            <div className="form-group"><label className="form-label">Monthly Volume (₹)</label><input className="form-control" type="number" value={form.monthly_volume_approx} onChange={f('monthly_volume_approx')} /></div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-control" value={form.status} onChange={f('status')}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Notes</label><textarea className="form-control" rows={2} value={form.notes} onChange={f('notes')} /></div>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showView} onClose={() => setShowView(false)} title="Retailer Details" size="md">
        {viewItem && (
          <div className="detail-grid">
            <div className="detail-header">
              <span className="entity-id large">{viewItem.retailer_id}</span>
              <Badge status={viewItem.status} label={viewItem.status} />
              <Badge status={viewItem.store_type} label={viewItem.store_type} />
            </div>
            <div className="detail-section">
              <h4>Company Information</h4>
              <div className="detail-row"><span>Company</span><strong>{viewItem.company_name}</strong></div>
              <div className="detail-row"><span>Contact</span><strong>{viewItem.contact_person}</strong></div>
              <div className="detail-row"><span>Email</span><strong>{viewItem.email}</strong></div>
              <div className="detail-row"><span>Phone</span><strong>{viewItem.phone}</strong></div>
              <div className="detail-row"><span>Location</span><strong>{viewItem.city}, {viewItem.state} {viewItem.pincode}</strong></div>
              <div className="detail-row"><span>GSTIN</span><span className="entity-id sm">{viewItem.gstin || '—'}</span></div>
              <div className="detail-row"><span>Monthly Volume</span><strong>{viewItem.monthly_volume_approx ? formatCurrency(viewItem.monthly_volume_approx) : '—'}</strong></div>
              <div className="detail-row"><span>Added On</span><strong>{formatDate(viewItem.createdAt)}</strong></div>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={showDelete} onClose={() => setShowDelete(false)} title="Confirm Delete" size="sm"
        footer={<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => setShowDelete(false)}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
        </div>}>
        <p>Delete <strong>{deleteItem?.company_name}</strong>? This cannot be undone.</p>
      </Modal>
    </Layout>
  );
}
