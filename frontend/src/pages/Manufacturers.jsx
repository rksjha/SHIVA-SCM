import { useState, useEffect, useCallback } from 'react';
import { Plus, RefreshCw, Factory, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Layout from '../components/layout/Layout';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import { manufacturerAPI } from '../utils/api';
import { formatDate, downloadCSV } from '../utils/helpers';

const INITIAL_FORM = {
  company_name: '', contact_person: '', email: '', phone: '',
  address: '', city: '', state: 'Gujarat', country: 'India', pincode: '',
  gstin: '', pan_number: '', registration_number: '',
  production_capacity: '', quality_certifications: '',
  status: 'active', notes: '',
};

export default function Manufacturers() {
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
      const res = await manufacturerAPI.getAll({ page, limit: 10, search, status: statusFilter });
      setData(res.data.manufacturers || res.data.data || []);
      setTotal(res.data.total || 0);
    } catch {
      toast.error('Failed to load manufacturers');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditItem(null); setForm(INITIAL_FORM); setShowModal(true); };
  const openEdit = (row) => { setEditItem(row); setForm({ ...INITIAL_FORM, ...row }); setShowModal(true); };
  const openView = (row) => { setViewItem(row); setShowView(true); };
  const openDelete = (row) => { setDeleteItem(row); setShowDelete(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editItem) {
        await manufacturerAPI.update(editItem.id, form);
        toast.success('Manufacturer updated');
      } else {
        await manufacturerAPI.create(form);
        toast.success('Manufacturer added');
      }
      setShowModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await manufacturerAPI.delete(deleteItem.id);
      toast.success('Manufacturer deleted');
      setShowDelete(false);
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleVerify = async (row) => {
    try {
      await manufacturerAPI.verify(row.id);
      toast.success('Manufacturer verified');
      load();
    } catch {
      toast.error('Verification failed');
    }
  };

  const columns = [
    { key: 'manufacturer_id', label: 'MFG ID', render: (v) => <span className="entity-id">{v}</span> },
    { key: 'company_name', label: 'Company' },
    { key: 'contact_person', label: 'Contact' },
    { key: 'city', label: 'City' },
    { key: 'phone', label: 'Phone' },
    { key: 'gstin', label: 'GSTIN' },
    {
      key: 'verified', label: 'Verified',
      render: (v, row) => v
        ? <span className="badge badge-success"><CheckCircle size={10} style={{ marginRight: 4 }} />Verified</span>
        : <button className="btn btn-ghost btn-sm" onClick={() => handleVerify(row)}>Verify</button>
    },
    { key: 'status', label: 'Status', render: (v) => <Badge status={v} label={v} /> },
  ];

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title"><Factory size={22} /> Manufacturers</h1>
          <p className="page-subtitle">Manage your verified manufacturer network</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={load}><RefreshCw size={15} /></button>
          <button className="btn btn-primary" onClick={openAdd}><Plus size={15} /> Add Manufacturer</button>
        </div>
      </div>

      <div className="card">
        <div className="filter-bar">
          <input className="form-control" placeholder="Search company, contact, city…" value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }} style={{ maxWidth: 280 }} />
          <select className="form-control" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ maxWidth: 160 }}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
          <button className="btn btn-ghost btn-sm" onClick={() => downloadCSV(data, 'manufacturers.csv')}>Export CSV</button>
        </div>
        <DataTable
          columns={columns} data={data} loading={loading}
          onView={openView} onEdit={openEdit} onDelete={openDelete}
          pagination={{ page, limit: 10, total, onPageChange: setPage }}
        />
      </div>

      {/* Add / Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}
        title={editItem ? 'Edit Manufacturer' : 'Add New Manufacturer'} size="lg"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : editItem ? 'Update' : 'Add Manufacturer'}
            </button>
          </div>
        }>
        <form onSubmit={handleSave}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Company Name *</label>
              <input className="form-control" required value={form.company_name} onChange={f('company_name')} />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Person *</label>
              <input className="form-control" required value={form.contact_person} onChange={f('contact_person')} />
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input className="form-control" type="email" required value={form.email} onChange={f('email')} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone *</label>
              <input className="form-control" required value={form.phone} onChange={f('phone')} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Address</label>
              <input className="form-control" value={form.address} onChange={f('address')} />
            </div>
            <div className="form-group">
              <label className="form-label">City *</label>
              <input className="form-control" required value={form.city} onChange={f('city')} />
            </div>
            <div className="form-group">
              <label className="form-label">State</label>
              <input className="form-control" value={form.state} onChange={f('state')} />
            </div>
            <div className="form-group">
              <label className="form-label">Pincode</label>
              <input className="form-control" value={form.pincode} onChange={f('pincode')} />
            </div>
            <div className="form-group">
              <label className="form-label">GSTIN</label>
              <input className="form-control" placeholder="27AABCS1234H1Z0" value={form.gstin} onChange={f('gstin')} />
            </div>
            <div className="form-group">
              <label className="form-label">PAN Number</label>
              <input className="form-control" placeholder="AABCS1234H" value={form.pan_number} onChange={f('pan_number')} />
            </div>
            <div className="form-group">
              <label className="form-label">Registration Number</label>
              <input className="form-control" value={form.registration_number} onChange={f('registration_number')} />
            </div>
            <div className="form-group">
              <label className="form-label">Production Capacity</label>
              <input className="form-control" placeholder="e.g. 5000 MT/month" value={form.production_capacity} onChange={f('production_capacity')} />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-control" value={form.status} onChange={f('status')}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Notes</label>
              <textarea className="form-control" rows={2} value={form.notes} onChange={f('notes')} />
            </div>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={showView} onClose={() => setShowView(false)} title="Manufacturer Details" size="lg">
        {viewItem && (
          <div className="detail-grid">
            <div className="detail-header">
              <span className="entity-id large">{viewItem.manufacturer_id}</span>
              <Badge status={viewItem.status} label={viewItem.status} />
              {viewItem.verified && <Badge status="verified" label="✓ Verified" />}
            </div>
            <div className="detail-section">
              <h4>Company Information</h4>
              <div className="detail-row"><span>Company</span><strong>{viewItem.company_name}</strong></div>
              <div className="detail-row"><span>Contact Person</span><strong>{viewItem.contact_person}</strong></div>
              <div className="detail-row"><span>Email</span><strong>{viewItem.email}</strong></div>
              <div className="detail-row"><span>Phone</span><strong>{viewItem.phone}</strong></div>
              <div className="detail-row"><span>Address</span><strong>{viewItem.address}, {viewItem.city}, {viewItem.state} - {viewItem.pincode}</strong></div>
            </div>
            <div className="detail-section">
              <h4>Legal & Compliance</h4>
              <div className="detail-row"><span>GSTIN</span><span className="entity-id sm">{viewItem.gstin}</span></div>
              <div className="detail-row"><span>PAN</span><span className="entity-id sm">{viewItem.pan_number}</span></div>
              <div className="detail-row"><span>Reg. Number</span><strong>{viewItem.registration_number || '—'}</strong></div>
            </div>
            <div className="detail-section">
              <h4>Operations</h4>
              <div className="detail-row"><span>Production Capacity</span><strong>{viewItem.production_capacity || '—'}</strong></div>
              <div className="detail-row"><span>Added On</span><strong>{formatDate(viewItem.createdAt)}</strong></div>
              {viewItem.verified_at && <div className="detail-row"><span>Verified On</span><strong>{formatDate(viewItem.verified_at)}</strong></div>}
            </div>
            {viewItem.notes && (
              <div className="detail-section">
                <h4>Notes</h4>
                <p>{viewItem.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={showDelete} onClose={() => setShowDelete(false)} title="Confirm Delete" size="sm"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button className="btn btn-ghost" onClick={() => setShowDelete(false)}>Cancel</button>
            <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
          </div>
        }>
        <p>Are you sure you want to delete <strong>{deleteItem?.company_name}</strong>? This action cannot be undone.</p>
      </Modal>
    </Layout>
  );
}
