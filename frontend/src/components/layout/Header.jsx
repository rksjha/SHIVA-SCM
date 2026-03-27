import { useAuth } from '../../context/AuthContext';

const Header = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={onMenuClick}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#1a2332',
          }}
        >
          ☰
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
            }}
          >
            🔔
          </button>

          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#00b4a0',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
          }}>
            {user?.full_name?.[0] || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
