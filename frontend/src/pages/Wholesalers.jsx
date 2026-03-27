import { useState, useEffect } from 'react';
import { Warehouse, Plus, Search } from 'lucide-react';
import Layout from '../components/layout/Layout';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { wholesalerAPI } from '../utils/api';
import { formatCurrency, formatDate, downloadCSV, getStatusColor } from '../utils/helpers';
import toast from 'react-hot-toast';

const Wholesalers = () => {
  const [wholesalers, setWholesalers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedWholesaler, setSelectedWholesaler] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    gstin: '',
    pan_number: '',
    storage_capacity: '',
    min_order_quantity: '',
    credit_limit: '',
    payment_terms: '',
    status: 'active',
    notes: '',
  });

  useEffect(() => {
    fetchWholesalers();
  }, [page, search]);

  const fetchWholesalers = async () => {
    setLoading(true);
    try {
      const response = await wholesalerAPI.getAll({ page, limit: 10, search });
      setWholesalers(response.data.data || []);
      setPagination({
        page: response.data.page,
        limit: response.data.limit,
        total: response.data.total,
        onPageChange: setPage,
      });
    } catch (error) {
      toast.error('Failed to fetch wholesalers');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setFormData({
      company_name: '',
      contact_person: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      country: '',
      pincode: '',
      gstin: '',
      pan_number: '',
      storage_capacity: '',
      min_order_quantity: '',
      credit_limit: '',
      payment_terms: '',
      status: 'active',
      notes: '',
    });
    setIsEditing(false);
    setSelectedWholesaler(null);
    setShowModal(true);
  };

  const handleEdit = (wholesaler) => {
    setFormData(wholesaler);
    setSelectedWholesaler(wholesaler);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleView = (wholesaler) => {
    setSelectedWholesaler(wholesaler);
    setShowModal(true);
  };

  const handleDelete = (wholesaler) => {
    setSelectedWholesaler(wholesaler);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await wholesalerAPI.delete(selectedWholesaler.id);
      toast.success('Wholesaler deleted successfully');
      fetchWholesalers();
    } catch (error) {
      toast.error('Failed to delete wholesaler');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && selectedWholesaler) {
        await wholesalerAPI.update(selectedWholesaler.id, formData);
        toast.success('Wholesaler updated successfully');
      } else {
        await wholesalerAPI.create(formData);
        toast.success('Wholesaler created successfully');
      }
      setShowModal(false);
      fetchWholesalers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save wholesaler');
    }
  };

  const handleExportCSV = () => {
    const data = wholesalers.map((w) => ({
      'Wholesaler ID': w.id,
      'Company': w.company_name,
      'Contact Person': w.contact_person,
      'Email': w.email,
      'Phone': w.phone,
      'City': w.city,
      'State': w.state,
      'Storage Capacity': w.storage_capacity,
      'Credit Limit': w.credit_limit,
      'Status': w.status,
    }));
    downloadCSV(data, 'wholesalers.csv');
  };

  const columns = [
    {
      key: 'id',
      label: 'Wholesaler ID',
      render: (value) => <span className="entity-id">{value}</span>,
    },
    {
      key: 'company_name',
      label: 'Company',
    },
    {
      key: 'contact_person',
      label: 'Contact',
    },
    {
      key: 'city',
      label: 'City',
    },
    {
      key: 'storage_capacity',
      label: 'Storage Capacity',
    },
    {
      key: 'credit_limit',
      label: 'Credit Limit (₹)',
      render: (value) => formatCurrency(value || 0),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <Badge variant={getStatusColor(value)}>{value}</Badge>,
    },
  ];

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Warehouse size={28} /> Wholesalers
          </h1>
          <p className="page-subtitle">Manage wholesale suppliers and distribution partners</p>
        </div>
        <button className="btn btn-primary" onClick={handleAddNew}>
          <Plus size={16} /> Add Wholesaler
        </button>
      </div>

      <div className="filter-bar">
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by company name, contact, or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            style={{ paddingLeft: '32px' }}
            className="form-control"
          />
        </div>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={wholesalers}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          pagination={pagination}
          exportCSV={handleExportCSV}
        />
      </div>

      <Modal
        isOpen={showModal && !isEditing && selectedWholesaler}
        onClose={() => setShowModal(false)}
        title="Wholesaler Details"
        size="lg"
      >
        {selectedWholesaler && (
          <div className="detail-grid">
            <div className="detail-header">
              <span className="entity-id large">{selectedWholesaler.id}</span>
              <Badge variant={getStatusColor(selectedWholesaler.status)}>
                {selectedWholesaler.status}
              </Badge>
            </div>

            <div className="detail-section">
              <h4>Basic Information</h4>
              <div className="detail-row">
                <span>Company Name:</span>
                <strong>{selectedWholesaler.company_name}</strong>
              </div>
              <div className="detail-row">
                <span>Contact Person:</span>
                <strong>{selectedWholesaler.contact_person}</strong>
              </div>
              <div className="detail-row">
                <span>Email:</span>
                <strong>{selectedWholesaler.email}</strong>
              </div>
              <div className="detail-row">
                <span>Phone:</span>
                <strong>{selectedWholesaler.phone}</strong>
              </div>
            </div>

            <div className="detail-section">
              <h4>Address</h4>
              <div className="detail-row">
                <span>Address:</span>
                <strong>{selectedWholesaler.address}</strong>
              </div>
              <div className="detail-row">
                <span>City:</span>
                <strong>{selectedWholesaler.city}</strong>
              </div>
              <div className="detail-row">
                <span>State:</span>
                <strong>{selectedWholesaler.state}</strong>
              </div>
              <div className="detail-row">
                <span>Country:</span>
                <strong>{selectedWholesaler.country}</strong>
              </div>
              <div className="detail-row">
                <span>Pincode:</span>
                <strong>{selectedWholesaler.pincode}</strong>
              </div>
            </div>

            <div className="detail-section">
              <h4>Tax & Business Details</h4>
              <div className="detail-row">
                <span>GSTIN:</span>
                <strong>{selectedWholesaler.gstin}</strong>
              </div>
              <div className="detail-row">
                <span>PAN:</span>
                <strong>{selectedWholesaler.pan_number}</strong>
              </div>
            </div>

            <div className="detail-section">
              <h4>Business Information</h4>
              <div className="detail-row">
                <span>Storage Capacity:</span>
                <strong>{selectedWholesaler.storage_capacity}</strong>
              </div>
              <div className="detail-row">
                <span>Min Order Qty:</span>
                <strong>{selectedWholesaler.min_order_quantity}</strong>
              </div>
              <div className="detail-row">
                <span>Credit Limit:</span>
                <strong>{formatCurrency(selectedWholesaler.credit_limit || 0)}</strong>
              </div>
              <div className="detail-row">
                <span>Payment Terms:</span>
                <strong>{selectedWholesaler.payment_terms}</strong>
              </div>
            </div>

            {selectedWholesaler.notes && (
              <div className="detail-section">
                <h4>Notes</h4>
                <p>{selectedWholesaler.notes}</p>
              </div>
            )}
          </div>
        )}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button className="btn btn-ghost" onClick={() => setShowModal(false)}>
            Close
          </button>
          <button className="btn btn-primary" onClick={() => handleEdit(selectedWholesaler)}>
            Edit
          </button>
        </div>
      </Modal>

      <Modal isOpen={showModal && isEditing} onClose={() => setShowModal(false)} title={`${isEditing ? 'Edit' : 'Add'} Wholesaler`} size="lg">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Company Name *</label>
              <input
                type="text"
                required
                className="form-control"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Person *</label>
              <input
                type="text"
                required
                className="form-control"
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                className="form-control"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-control"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">State</label>
              <input
                type="text"
                className="form-control"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Country</label>
              <input
                type="text"
                className="form-control"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Pincode</label>
              <input
                type="text"
                className="form-control"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">GSTIN</label>
              <input
                type="text"
                className="form-control"
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">PAN Number</label>
              <input
                type="text"
                className="form-control"
                value={formData.pan_number}
                onChange={(e) => setFormData({ ...formData, pan_number: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Storage Capacity</label>
              <input
                type="text"
                className="form-control"
                value={formData.storage_capacity}
                onChange={(e) => setFormData({ ...formData, storage_capacity: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Min Order Quantity</label>
              <input
                type="text"
                className="form-control"
                value={formData.min_order_quantity}
                onChange={(e) => setFormData({ ...formData, min_order_quantity: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Credit Limit (₹)</label>
              <input
                type="number"
                className="form-control"
                value={formData.credit_limit}
                onChange={(e) => setFormData({ ...formData, credit_limit: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Payment Terms</label>
              <input
                type="text"
                className="form-control"
                value={formData.payment_terms}
                onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-control"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Notes</label>
              <textarea
                className="form-control"
                rows="3"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Update' : 'Create'} Wholesaler
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Wholesaler"
        message={`Are you sure you want to delete ${selectedWholesaler?.company_name}? This action cannot be undone.`}
        confirmLabel="Delete"
        danger
      />
    </Layout>
  );
};

export default Wholesalers;
