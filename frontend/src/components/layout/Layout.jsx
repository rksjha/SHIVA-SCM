import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div style={{ marginLeft: 'var(--sidebar-width)', width: 'calc(100% - var(--sidebar-width))' }}>
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main style={{ marginTop: 'var(--header-height)', padding: '2rem' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
