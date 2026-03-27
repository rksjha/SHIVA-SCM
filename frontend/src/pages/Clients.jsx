import { useState, useEffect, useCallback } from 'react';
import { Plus, RefreshCw, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import Layout from '../components/layout/Layout';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import { clientAPI } from '../utils/api';
import { formatDate, formatCurrency, downloadCSV } from '../utils/helpers';

const LOYALTY_COLORS = { bronze: '#cd7f32', silver: '#a8a9ad', gold: '#ffd700', platinum: '#7c7c7c' };

const INITIAL_FORM = {
  client_type: 'company', company_name: '', contact_person: '', email: '', phone: '',
  address: '', city: '', state: 'Gujarat', pincode: '',
  gstin: '', pan_number: '', industry_sector: '',
  annual_purchase_value: '', preferred_payment_method: 'Net 30',
  credit_limit: '', credit_period_days: '30',
  loyalty_tier: 'bronze', status: 'active', notes: '',
};

export default function Clients() {
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
      const res = await clientAPI.getAll({ page, limit: 10, search, status: statusFilter });
      setData(res.data.clients || res.data.data || []);
      setTotal(res.data.total || 0);
    } catch { toast.error('Failed to load clients'); }
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
      editItem ? await clientAPI.update(editItem.id, form) : await clientAPI.create(form);
      toast.success(editItem ? 'Client updated' : 'Client added');
      setShowModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await clientAPI.delete(deleteItem.id); toast.success('Deleted'); setShowDelete(false); load(); }
    catch { toast.error('Delete failed'); }
  };

  const LoyaltyBadge = ({ tier }) => (
    <span className="badge" style={{
      background: `${LOYALTY_COLORS[tier]}22`,
      color: LOYALTY_COLORS[tier],
      border: `1px solid ${LOYALTY_COLORS[tier]}55`,
      fontWeight: 700,
      textTransform: 'capitalize',
    }}>{tier || 'bronze'}</span>
  );

  const columns = [
    { key: 'client_id', label: 'CLT ID', render: (v) => <span className="entity-id">{v}</span> },
    { key: 'company_name', label: 'Company / Name' },
    { key: 'client_type', label: 'Type', render: (v) => <Badge status={v} label={v} /> },
    { key: 'city', label: 'City' },
    { key: 'industry_sector', label: 'Industry' },
    { key: 'annual_purchase_value', label: 'Annual Value', render: (v) => v ? formatCurrency(v) : '—' },
    { key: 'loyalty_tier', label: 'Tier', render: (v) => <LoyaltyBadge tier={v} /> },
    { key: 'status', label: 'Status', render: (v) => <Badge status={v} label={v} /> },
  ];

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title"><Users size={22} /> Clients</h1>
          <p className="page-subtitle">Manage your client relationships and loyalty tiers</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={load}><RefreshCw size={15} /></button>
          <button className="btn btn-primary" onClick={openAdd}><Plus size={15} /> Add Client</button>
        </div>
      </div>

      <div className="card">
        <div className="filter-bar">
          <input className="form-control" placeholder="Search clients…" value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }} style={{ maxWidth: 280 }} />
          <select className="form-control" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ maxWidth: 160 }}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className="btn btn-ghost btn-sm" onClick={() => downloadCSV(data, 'clients.csv')}>Export CSV</button>
        </div>
        <DataTable columns={columns} data={data} loading={loading} onView={openView} onEdit={openEdit} onDelete={openDelete}
          pagination={{ page, limit: 10, total, onPageChange: setPage }} />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Edit Client' : 'Add Client'} size="lg"
        footer={<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : editItem ? 'Update' : 'Add Client'}</button>
        </div>}>
        <form onSubmit={handleSave}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Client Type</label>
              <select className="form-control" value={form.client_type} onChange={f('client_type')}>
                <option value="individual">Individual</option>
                <option value="company">Company</option>
                <option value="government">Government</option>
                <option value="institution">Institution</option>
              </select>
            </div>
            <div className="form-group"><label className="form-label">Company / Name *</label><input className="form-control" required value={form.company_name} onChange={f('company_name')} /></div>
            <div className="form-group"><label className="form-label">Contact Person</label><input className="form-control" value={form.contact_person} onChange={f('contact_person')} /></div>
            <div className="form-group"><label className="form-label">Email *</label><input className="form-control" type="email" required value={form.email} onChange={f('email')} /></div>
            <div className="form-group"><label className="form-label">Phone *</label><input className="form-control" required value={form.phone} onChange={f('phone')} /></div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Address</label><input className="form-control" value={form.address} onChange={f('address')} /></div>
            <div className="form-group"><label className="form-label">City *</label><input className="form-control" required value={form.city} onChange={f('city')} /></div>
            <div className="form-group"><label className="form-label">State</label><input className="form-control" value={form.state} onChange={f('state')} /></div>
            <div className="form-group"><label className="form-label">Pincode</label><input className="form-control" value={form.pincode} onChange={f('pincode')} /></div>
            <div className="form-group"><label className="form-label">GSTIN</label><input className="form-control" value={form.gstin} onChange={f('gstin')} /></div>
            <div className="form-group"><label className="form-label">PAN Number</label><input className="form-control" value={form.pan_number} onChange={f('pan_number')} /></div>
            <div className="form-group"><label className="form-label">Industry Sector</label><input className="form-control" placeholder="e.g. Real Estate, Construction" value={form.industry_sector} onChange={f('industry_sector')} /></div>
            <div className="form-group"><label className="form-label">Annual Purchase Value (₹)</label><input className="form-control" type="number" value={form.annual_purchase_value} onChange={f('annual_purchase_value')} /></div>
            <div className="form-group"><label className="form-label">Credit Limit (₹)</label><input className="form-control" type="number" value={form.credit_limit} onChange={f('credit_limit')} /></div>
            <div className="form-group"><label className="form-label">Credit Period (Days)</label><input className="form-control" type="number" value={form.credit_period_days} onChange={f('credit_period_days')} /></div>
            <div className="form-group"><label className="form-label">Payment Method</label><input className="form-control" value={form.preferred_payment_method} onChange={f('preferred_payment_method')} /></div>
            <div className="form-group">
              <label className="form-label">Loyalty Tier</label>
              <select className="form-control" value={form.loyalty_tier} onChange={f('loyalty_tier')}>
                <option value="bronze">Bronze</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="platinum">Platinum</option>
              </select>
            </div>
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

      <Modal isOpen={showView} onClose={() => setShowView(false)} title="Client Details" size="lg">
        {viewItem && (
          <div className="detail-grid">
            <div className="detail-header">
              <span className="entity-id large">{viewItem.client_id}</span>
              <Badge status={viewItem.status} label={viewItem.status} />
              <LoyaltyBadge tier={viewItem.loyalty_tier} />
            </div>
            <div className="detail-section">
              <h4>Client Information</h4>
              <div className="detail-row"><span>Name / Company</span><strong>{viewItem.company_name}</strong></div>
              <div className="detail-row"><span>Type</span><Badge status={viewItem.client_type} label={viewItem.client_type} /></div>
              <div className="detail-row"><span>Contact Person</span><strong>{viewItem.contact_person || '—'}</strong></div>
              <div className="detail-row"><span>Email</span><strong>{viewItem.email}</strong></div>
              <div className="detail-row"><span>Phone</span><strong>{viewItem.phone}</strong></div>
              <div className="detail-row"><span>Location</span><strong>{viewItem.city}, {viewItem.state} {viewItem.pincode}</strong></div>
              <div className="detail-row"><span>Industry</span><strong>{viewItem.industry_sector || '—'}</strong></div>
            </div>
            <div className="detail-section">
              <h4>Financial Profile</h4>
              <div className="detail-row"><span>Annual Purchase Value</span><strong>{viewItem.annual_purchase_value ? formatCurrency(viewItem.annual_purchase_value) : '—'}</strong></div>
              <div className="detail-row"><span>Credit Limit</span><strong>{viewItem.credit_limit ? formatCurrency(viewItem.credit_limit) : '—'}</strong></div>
              <div className="detail-row"><span>Credit Period</span><strong>{viewItem.credit_period_days} days</strong></div>
              <div className="detail-row"><span>Payment Method</span><strong>{viewItem.preferred_payment_method || '—'}</strong></div>
            </div>
            <div className="detail-section">
              <h4>Compliance</h4>
              <div className="detail-row"><span>GSTIN</span><span className="entity-id sm">{viewItem.gstin || '—'}</span></div>
              <div className="detail-row"><span>PAN</span><span className="entity-id sm">{viewItem.pan_number || '—'}</span></div>
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
