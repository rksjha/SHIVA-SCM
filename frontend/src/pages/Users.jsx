import { useState, useEffect, useCallback } from 'react';
import { Plus, RefreshCw, UserCog } from 'lucide-react';
import toast from 'react-hot-toast';
import Layout from '../components/layout/Layout';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import { authAPI } from '../utils/api';
import { formatDate } from '../utils/helpers';

const INITIAL_FORM = { username: '', email: '', password: '', full_name: '', phone: '', role: 'viewer', is_active: true };

export default function Users() {
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
      const res = await authAPI.getUsers();
      setData(res.data.users || res.data || []);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditItem(null); setForm(INITIAL_FORM); setShowModal(true); };
  const openEdit = (row) => { setEditItem(row); setForm({ ...INITIAL_FORM, ...row, password: '' }); setShowModal(true); };
  const openDelete = (row) => { setDeleteItem(row); setShowDelete(true); };
  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editItem) {
        const { password, ...updateData } = form;
        await authAPI.updateUser(editItem.id, password ? form : updateData);
        toast.success('User updated');
      } else {
        await authAPI.register(form);
        toast.success('User created');
      }
      setShowModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleToggle = async (row) => {
    try {
      await authAPI.toggleUserStatus(row.id);
      toast.success(`User ${row.is_active ? 'deactivated' : 'activated'}`);
      load();
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async () => {
    try { await authAPI.deleteUser(deleteItem.id); toast.success('User deleted'); setShowDelete(false); load(); }
    catch { toast.error('Delete failed'); }
  };

  const columns = [
    { key: 'username', label: 'Username', render: (v) => <strong>@{v}</strong> },
    { key: 'full_name', label: 'Full Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', render: (v) => <Badge status={v} label={v} /> },
    { key: 'is_active', label: 'Status', render: (v) => <Badge status={v ? 'active' : 'inactive'} label={v ? 'Active' : 'Inactive'} /> },
    { key: 'last_login', label: 'Last Login', render: (v) => v ? formatDate(v) : '—' },
    { key: 'createdAt', label: 'Created', render: (v) => formatDate(v) },
  ];

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title"><UserCog size={22} /> User Management</h1>
          <p className="page-subtitle">Manage portal users and role-based access control</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={load}><RefreshCw size={15} /></button>
          <button className="btn btn-primary" onClick={openAdd}><Plus size={15} /> Add User</button>
        </div>
      </div>

      <div className="card">
        <DataTable columns={columns} data={data} loading={loading} onEdit={openEdit} onDelete={openDelete}
          actions={true} />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Edit User' : 'Add User'} size="md"
        footer={<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : editItem ? 'Update' : 'Create User'}</button>
        </div>}>
        <form onSubmit={handleSave}>
          <div className="form-grid">
            <div className="form-group"><label className="form-label">Full Name *</label><input className="form-control" required value={form.full_name} onChange={f('full_name')} /></div>
            <div className="form-group"><label className="form-label">Username *</label><input className="form-control" required value={form.username} onChange={f('username')} /></div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Email *</label><input className="form-control" type="email" required value={form.email} onChange={f('email')} /></div>
            {!editItem && <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Password *</label><input className="form-control" type="password" required={!editItem} value={form.password} onChange={f('password')} /></div>}
            {editItem && <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">New Password (leave blank to keep unchanged)</label><input className="form-control" type="password" value={form.password} onChange={f('password')} /></div>}
            <div className="form-group"><label className="form-label">Phone</label><input className="form-control" value={form.phone} onChange={f('phone')} /></div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="form-control" value={form.role} onChange={f('role')}>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={form.is_active} onChange={f('is_active')} />
                Active Account
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
        <p>Delete user <strong>@{deleteItem?.username}</strong>? This cannot be undone.</p>
      </Modal>
    </Layout>
  );
}
