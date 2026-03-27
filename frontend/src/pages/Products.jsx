import { useState, useEffect, useCallback } from 'react';
import { Plus, RefreshCw, Package, AlertTriangle, Grid, List } from 'lucide-react';
import toast from 'react-hot-toast';
import Layout from '../components/layout/Layout';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import { productAPI } from '../utils/api';
import { formatDate, formatCurrency, downloadCSV } from '../utils/helpers';

const INITIAL_FORM = {
  product_name: '', product_code: '', description: '',
  unit_of_measure: 'ton', base_price: '', mrp: '',
  gst_rate: '18', hsn_code: '', min_order_qty: '1',
  lead_time_days: '7', stock_quantity: '0', reorder_level: '10',
  quality_grade: 'A', is_active: true, notes: '',
};

export default function Products() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [viewMode, setViewMode] = useState('table');
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
      const res = await productAPI.getAll({ page, limit: viewMode === 'grid' ? 12 : 10, search, quality_grade: gradeFilter });
      setData(res.data.products || res.data.data || []);
      setTotal(res.data.total || 0);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  }, [page, search, gradeFilter, viewMode]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditItem(null); setForm(INITIAL_FORM); setShowModal(true); };
  const openEdit = (row) => { setEditItem(row); setForm({ ...INITIAL_FORM, ...row }); setShowModal(true); };
  const openView = (row) => { setViewItem(row); setShowView(true); };
  const openDelete = (row) => { setDeleteItem(row); setShowDelete(true); };
  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      editItem ? await productAPI.update(editItem.id, form) : await productAPI.create(form);
      toast.success(editItem ? 'Product updated' : 'Product added');
      setShowModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await productAPI.delete(deleteItem.id); toast.success('Deleted'); setShowDelete(false); load(); }
    catch { toast.error('Delete failed'); }
  };

  const columns = [
    { key: 'product_id', label: 'PRD ID', render: (v) => <span className="entity-id">{v}</span> },
    { key: 'product_name', label: 'Product Name' },
    { key: 'product_code', label: 'Code' },
    { key: 'unit_of_measure', label: 'Unit' },
    { key: 'base_price', label: 'Base Price', render: (v) => formatCurrency(v) },
    { key: 'mrp', label: 'MRP', render: (v) => formatCurrency(v) },
    { key: 'gst_rate', label: 'GST%', render: (v) => `${v}%` },
    { key: 'stock_quantity', label: 'Stock', render: (v, row) => (
      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {v}
        {Number(v) <= Number(row.reorder_level) && <AlertTriangle size={13} color="#f59e0b" title="Low stock" />}
      </span>
    )},
    { key: 'quality_grade', label: 'Grade', render: (v) => <Badge status={v} label={v} /> },
    { key: 'is_active', label: 'Active', render: (v) => <Badge status={v ? 'active' : 'inactive'} label={v ? 'Yes' : 'No'} /> },
  ];

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title"><Package size={22} /> Products</h1>
          <p className="page-subtitle">Manage your product catalog and inventory</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className={`btn btn-ghost btn-sm ${viewMode === 'table' ? 'active' : ''}`} onClick={() => setViewMode('table')}><List size={16} /></button>
          <button className={`btn btn-ghost btn-sm ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}><Grid size={16} /></button>
          <button className="btn btn-ghost" onClick={load}><RefreshCw size={15} /></button>
          <button className="btn btn-primary" onClick={openAdd}><Plus size={15} /> Add Product</button>
        </div>
      </div>

      <div className="card">
        <div className="filter-bar">
          <input className="form-control" placeholder="Search products…" value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }} style={{ maxWidth: 280 }} />
          <select className="form-control" value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)} style={{ maxWidth: 160 }}>
            <option value="">All Grades</option>
            <option value="Premium">Premium</option>
            <option value="A">Grade A</option>
            <option value="B">Grade B</option>
            <option value="C">Grade C</option>
          </select>
          <button className="btn btn-ghost btn-sm" onClick={() => downloadCSV(data, 'products.csv')}>Export CSV</button>
        </div>

        {viewMode === 'grid' ? (
          <div className="product-grid">
            {loading ? <p>Loading…</p> : data.map(p => (
              <div key={p.id} className="product-card" onClick={() => openView(p)}>
                <div className="product-card__icon">📦</div>
                <div className="product-card__id"><span className="entity-id">{p.product_id}</span></div>
                <div className="product-card__name">{p.product_name}</div>
                <div className="product-card__meta">
                  <span>{p.unit_of_measure}</span>
                  <Badge status={p.quality_grade} label={p.quality_grade} />
                </div>
                <div className="product-card__price">
                  <span className="price-base">{formatCurrency(p.base_price)}</span>
                  <span className="price-mrp">MRP: {formatCurrency(p.mrp)}</span>
                </div>
                {Number(p.stock_quantity) <= Number(p.reorder_level) && (
                  <div className="product-card__alert"><AlertTriangle size={12} /> Low Stock: {p.stock_quantity}</div>
                )}
                <div className="product-card__actions" onClick={(e) => e.stopPropagation()}>
                  <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => openDelete(p)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <DataTable columns={columns} data={data} loading={loading} onView={openView} onEdit={openEdit} onDelete={openDelete}
            pagination={{ page, limit: 10, total, onPageChange: setPage }} />
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Edit Product' : 'Add Product'} size="lg"
        footer={<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : editItem ? 'Update' : 'Add Product'}</button>
        </div>}>
        <form onSubmit={handleSave}>
          <div className="form-grid">
            <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Product Name *</label><input className="form-control" required value={form.product_name} onChange={f('product_name')} /></div>
            <div className="form-group"><label className="form-label">Product Code</label><input className="form-control" value={form.product_code} onChange={f('product_code')} /></div>
            <div className="form-group">
              <label className="form-label">Unit of Measure</label>
              <select className="form-control" value={form.unit_of_measure} onChange={f('unit_of_measure')}>
                <option value="ton">Ton</option>
                <option value="bag">Bag</option>
                <option value="CMT">CMT</option>
                <option value="piece">Piece</option>
                <option value="kg">KG</option>
                <option value="liter">Liter</option>
                <option value="meter">Meter</option>
                <option value="set">Set</option>
              </select>
            </div>
            <div className="form-group"><label className="form-label">Base Price (₹) *</label><input className="form-control" type="number" required value={form.base_price} onChange={f('base_price')} /></div>
            <div className="form-group"><label className="form-label">MRP (₹)</label><input className="form-control" type="number" value={form.mrp} onChange={f('mrp')} /></div>
            <div className="form-group">
              <label className="form-label">GST Rate (%)</label>
              <select className="form-control" value={form.gst_rate} onChange={f('gst_rate')}>
                <option value="0">0%</option>
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
                <option value="28">28%</option>
              </select>
            </div>
            <div className="form-group"><label className="form-label">HSN Code</label><input className="form-control" value={form.hsn_code} onChange={f('hsn_code')} /></div>
            <div className="form-group"><label className="form-label">Min. Order Qty</label><input className="form-control" type="number" value={form.min_order_qty} onChange={f('min_order_qty')} /></div>
            <div className="form-group"><label className="form-label">Lead Time (Days)</label><input className="form-control" type="number" value={form.lead_time_days} onChange={f('lead_time_days')} /></div>
            <div className="form-group"><label className="form-label">Stock Quantity</label><input className="form-control" type="number" value={form.stock_quantity} onChange={f('stock_quantity')} /></div>
            <div className="form-group"><label className="form-label">Reorder Level</label><input className="form-control" type="number" value={form.reorder_level} onChange={f('reorder_level')} /></div>
            <div className="form-group">
              <label className="form-label">Quality Grade</label>
              <select className="form-control" value={form.quality_grade} onChange={f('quality_grade')}>
                <option value="Premium">Premium</option>
                <option value="A">Grade A</option>
                <option value="B">Grade B</option>
                <option value="C">Grade C</option>
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Description</label><textarea className="form-control" rows={2} value={form.description} onChange={f('description')} /></div>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showView} onClose={() => setShowView(false)} title="Product Details" size="lg">
        {viewItem && (
          <div className="detail-grid">
            <div className="detail-header">
              <span className="entity-id large">{viewItem.product_id}</span>
              <Badge status={viewItem.quality_grade} label={`Grade ${viewItem.quality_grade}`} />
              <Badge status={viewItem.is_active ? 'active' : 'inactive'} label={viewItem.is_active ? 'Active' : 'Inactive'} />
            </div>
            <div className="detail-section">
              <h4>Product Information</h4>
              <div className="detail-row"><span>Name</span><strong>{viewItem.product_name}</strong></div>
              <div className="detail-row"><span>Code</span><strong>{viewItem.product_code || '—'}</strong></div>
              <div className="detail-row"><span>Unit</span><strong>{viewItem.unit_of_measure}</strong></div>
              <div className="detail-row"><span>HSN Code</span><strong>{viewItem.hsn_code || '—'}</strong></div>
              <div className="detail-row"><span>Lead Time</span><strong>{viewItem.lead_time_days} days</strong></div>
            </div>
            <div className="detail-section">
              <h4>Pricing (excl. GST)</h4>
              <div className="detail-row"><span>Base Price</span><strong>{formatCurrency(viewItem.base_price)}</strong></div>
              <div className="detail-row"><span>MRP</span><strong>{formatCurrency(viewItem.mrp)}</strong></div>
              <div className="detail-row"><span>GST Rate</span><strong>{viewItem.gst_rate}%</strong></div>
              <div className="detail-row"><span>Min. Order Qty</span><strong>{viewItem.min_order_qty}</strong></div>
            </div>
            <div className="detail-section">
              <h4>Inventory</h4>
              <div className="detail-row">
                <span>Stock</span>
                <strong style={{ color: Number(viewItem.stock_quantity) <= Number(viewItem.reorder_level) ? '#ef4444' : '#10b981' }}>
                  {viewItem.stock_quantity} {viewItem.unit_of_measure}
                </strong>
              </div>
              <div className="detail-row"><span>Reorder Level</span><strong>{viewItem.reorder_level}</strong></div>
              <div className="detail-row"><span>Last Updated</span><strong>{formatDate(viewItem.updatedAt)}</strong></div>
            </div>
            {viewItem.description && (
              <div className="detail-section"><h4>Description</h4><p>{viewItem.description}</p></div>
            )}
          </div>
        )}
      </Modal>

      <Modal isOpen={showDelete} onClose={() => setShowDelete(false)} title="Confirm Delete" size="sm"
        footer={<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => setShowDelete(false)}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
        </div>}>
        <p>Delete <strong>{deleteItem?.product_name}</strong>? This cannot be undone.</p>
      </Modal>
    </Layout>
  );
}
