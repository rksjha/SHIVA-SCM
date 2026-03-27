import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Manufacturers from './pages/Manufacturers';
import Suppliers from './pages/Suppliers';
import Wholesalers from './pages/Wholesalers';
import Retailers from './pages/Retailers';
import Clients from './pages/Clients';
import Products from './pages/Products';
import Categories from './pages/Categories';
import PriceTracker from './pages/PriceTracker';
import Orders from './pages/Orders';
import Shipments from './pages/Shipments';
import Reports from './pages/Reports';
import Users from './pages/Users';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 40, height: 40, border: '3px solid #e2e8f0', borderTopColor: '#00b4a0', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#64748b' }}>Loading SHIVA SCM…</p>
    </div>
  );
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const wrap = (Comp) => <ProtectedRoute><Comp /></ProtectedRoute>;

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={wrap(Dashboard)} />
      <Route path="/manufacturers" element={wrap(Manufacturers)} />
      <Route path="/suppliers" element={wrap(Suppliers)} />
      <Route path="/wholesalers" element={wrap(Wholesalers)} />
      <Route path="/retailers" element={wrap(Retailers)} />
      <Route path="/clients" element={wrap(Clients)} />
      <Route path="/products" element={wrap(Products)} />
      <Route path="/categories" element={wrap(Categories)} />
      <Route path="/price-tracker" element={wrap(PriceTracker)} />
      <Route path="/orders" element={wrap(Orders)} />
      <Route path="/shipments" element={wrap(Shipments)} />
      <Route path="/reports" element={wrap(Reports)} />
      <Route path="/users" element={wrap(Users)} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: { borderRadius: 10, fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' },
            success: { iconTheme: { primary: '#00b4a0', secondary: '#fff' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
