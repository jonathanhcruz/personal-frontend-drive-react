import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar';
import { AppTopbar } from '../../components/AppTopbar';
import { TopbarProvider, useTopbarContext } from './TopbarContext';
import styles from './DashboardLayout.module.scss';

const LayoutShell = (): React.JSX.Element => {
  const { config } = useTopbarContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className={styles['dashboard-layout']}>
      {isSidebarOpen && (
        <div
          className={styles['dashboard-layout__overlay']}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className={styles['dashboard-layout__main']}>
        <AppTopbar
          left={config.left}
          right={config.right}
          onMenuToggle={() => setIsSidebarOpen((prev) => !prev)}
        />
        <Outlet />
      </div>
    </div>
  );
};

export const DashboardLayout = (): React.JSX.Element => (
  <TopbarProvider>
    <LayoutShell />
  </TopbarProvider>
);
