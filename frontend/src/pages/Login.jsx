import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import '../styles/components.css';

const Login = () => {
  const [email, setEmail] = useState('admin@shivascm.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      toast.success('Login successful!');
      navigate('/');
    } else {
      toast.error(result.error || 'Login failed');
    }

    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #00b4a0 0%, #007d70 100%)',
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', margin: '0 1rem' }}>
        <div className="card-body">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔗</div>
            <h1 style={{ marginBottom: '0.5rem', fontSize: '1.5rem', color: '#00b4a0' }}>
              SHIVA SCM
            </h1>
            <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>
              Intelligent Supply Chain Management
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
              style={{ justifyContent: 'center', marginBottom: '1rem' }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div style={{
            background: '#f0f4f8',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '1rem',
            marginTop: '1rem'
          }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Demo Credentials
            </p>
            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
              <strong>Admin:</strong> admin@shivascm.com / admin123<br />
              <strong>Manager:</strong> manager@shivascm.com / manager123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
