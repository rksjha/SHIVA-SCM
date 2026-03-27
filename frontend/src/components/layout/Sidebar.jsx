import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊', section: 'OVERVIEW' },
    { path: '/manufacturers', label: 'Manufacturers', icon: '🏭', section: 'SUPPLY CHAIN' },
    { path: '/suppliers', label: 'Suppliers', icon: '🤝', section: 'SUPPLY CHAIN' },
    { path: '/wholesalers', label: 'Wholesalers', icon: '📦', section: 'SUPPLY CHAIN' },
    { path: '/retailers', label: 'Retailers', icon: '🛍️', section: 'SUPPLY CHAIN' },
    { path: '/clients', label: 'Clients', icon: '👥', section: 'SUPPLY CHAIN' },
    { path: '/products', label: 'Products', icon: '🛒', section: 'CATALOG' },
    { path: '/categories', label: 'Categories', icon: '📂', section: 'CATALOG' },
    { path: '/orders', label: 'Orders', icon: '📋', section: 'OPERATIONS' },
    { path: '/shipments', label: 'Shipments', icon: '🚚', section: 'OPERATIONS' },
    { path: '/reports', label: 'Reports', icon: '📈', section: 'ANALYTICS' },
    { path: '/users', label: 'Users', icon: '👤', section: 'ADMIN', requireAdmin: true },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>🔗</span>
          <span>SHIVA SCM</span>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            if (item.requireAdmin && user?.role !== 'admin') {
              return null;
            }
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                onClick={onClose}
              >
                <span style={{ marginRight: '0.5rem' }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div style={{ marginTop: 'auto', padding: '1rem', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#00b4a0',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '0.5rem',
              fontWeight: 'bold',
            }}>
              {user?.full_name?.[0] || 'U'}
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user?.full_name || user?.email}</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{user?.role}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '0.5rem',
              background: '#fee2e2',
              color: '#dc2626',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
