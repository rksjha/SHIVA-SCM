import { useState, useEffect, useCallback } from 'react';
import { Plus, RefreshCw, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import Layout from '../components/layout/Layout';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import { categoryAPI } from '../utils/api';

const INITIAL_FORM = { name: '', description: '', icon: '📦', color_hex: '#00b4a0', is_active: true };

export default function Categories() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await categoryAPI.getAll();
      setData(res.data.categories || res.data.data || []);
    } catch { toast.error('Failed to load categories'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditItem(null); setForm(INITIAL_FORM); setShowModal(true); };
  const openEdit = (row) => { setEditItem(row); setForm({ ...INITIAL_FORM, ...row }); setShowModal(true); };
  const openDelete = (row) => { setDeleteItem(row); setShowDelete(true); };
  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      editItem ? await categoryAPI.update(editItem.id, form) : await categoryAPI.create(form);
      toast.success(editItem ? 'Category updated' : 'Category added');
      setShowModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await categoryAPI.delete(deleteItem.id); toast.success('Deleted'); setShowDelete(false); load(); }
    catch { toast.error('Delete failed'); }
  };

  const columns = [
    { key: 'category_code', label: 'CAT Code', render: (v) => <span className="entity-id">{v}</span> },
    { key: 'icon', label: 'Icon', render: (v) => <span style={{ fontSize: 22 }}>{v}</span> },
    { key: 'name', label: 'Category Name' },
    { key: 'description', label: 'Description' },
    { key: 'color_hex', label: 'Color', render: (v) => (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 16, height: 16, borderRadius: 4, background: v, display: 'inline-block', border: '1px solid #e2e8f0' }} />
        {v}
      </span>
    )},
    { key: 'is_active', label: 'Active', render: (v) => <Badge status={v ? 'active' : 'inactive'} label={v ? 'Active' : 'Inactive'} /> },
  ];

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title"><Tag size={22} /> Categories</h1>
          <p className="page-subtitle">Organise products with a hierarchical category system</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={load}><RefreshCw size={15} /></button>
          <button className="btn btn-primary" onClick={openAdd}><Plus size={15} /> Add Category</button>
        </div>
      </div>

      <div className="card">
        <DataTable columns={columns} data={data} loading={loading} onEdit={openEdit} onDelete={openDelete} />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Edit Category' : 'Add Category'} size="md"
        footer={<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : editItem ? 'Update' : 'Add'}</button>
        </div>}>
        <form onSubmit={handleSave}>
          <div className="form-grid">
            <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Category Name *</label><input className="form-control" required value={form.name} onChange={f('name')} /></div>
            <div className="form-group">
              <label className="form-label">Icon (Emoji)</label>
              <input className="form-control" value={form.icon} onChange={f('icon')} style={{ fontSize: 22 }} />
            </div>
            <div className="form-group">
              <label className="form-label">Color</label>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input type="color" value={form.color_hex} onChange={f('color_hex')} style={{ width: 40, height: 38, border: '1px solid #e2e8f0', borderRadius: 6, cursor: 'pointer' }} />
                <input className="form-control" value={form.color_hex} onChange={f('color_hex')} placeholder="#00b4a0" />
              </div>
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Description</label><textarea className="form-control" rows={2} value={form.description} onChange={f('description')} /></div>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={form.is_active} onChange={f('is_active')} />
                Active
              </label>
            </div>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showDelete} onClose={() => setShowDelete(false)} title="Confirm Delete" size="sm"
        footer={<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => setShowDelete(false)}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
        </div>}>
        <p>Delete category <strong>{deleteItem?.name}</strong>? This cannot be undone.</p>
      </Modal>
    </Layout>
  );
}
